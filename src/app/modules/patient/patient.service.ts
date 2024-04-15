import { Patient, Prisma, UserStatus } from "@prisma/client";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { IPatientFilterRequest, IPatientUpdate } from "./patient.interface";
import { patientSearchableFields } from "./patient.constant";
import prisma from "../../../shared/prisma";

const getAllPatientsFromDB = async (
  query: IPatientFilterRequest,
  options: any
) => {
  console.log(query);
  console.log(options);
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...exactFilterData } = query;

  const andConditions: Prisma.PatientWhereInput[] = [];
  console.log(searchTerm, "searchTerm");
  if (query.searchTerm) {
    andConditions.push({
      OR: patientSearchableFields?.map((field) => ({
        [field]: {
          contains: query.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(exactFilterData).length > 0) {
    andConditions.push({
      AND: Object.keys(exactFilterData).map((key) => ({
        [key]: {
          equals: (exactFilterData as any)[key],
        },
      })),
    });
  }
  andConditions.push({
    isDeleted: false,
  });
  //   console.dir(andConditions, { depth: "infinity" });

  const whereConditions: Prisma.PatientWhereInput = { AND: andConditions };
  const result = await prisma.patient.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" },
    include: {
      patientHealthData: true,
      medicalReport: true,
    },
  });
  const total = await prisma.patient.count({
    where: whereConditions,
  });
  return { meta: { page, limit, total }, result };
};
const getPatientById = async (id: string) => {
  const result = await prisma.patient.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      medicalReport: true,
      patientHealthData: true,
    },
  });
  return result;
};
const updatePatient = async (
  id: string,
  payload: Partial<IPatientUpdate>
): Promise<Patient | null> => {
  const { patientHealthData, medicalReport, ...patientData } = payload;
  console.log(patientHealthData);
  const patient = await prisma.patient.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  await prisma.$transaction(async (transactionClient) => {
    // update patient data
    const patientInfo = await transactionClient.patient.update({
      where: {
        id,
      },
      data: patientData,
      include: {
        patientHealthData: true,
        medicalReport: true,
      },
    });
    if (patientHealthData) {
      await transactionClient.patientHealthData.upsert({
        where: {
          patientId: patientInfo.id,
        },
        create: { ...patientHealthData, patientId: patientInfo.id },
        update: patientHealthData,
      });
    }
    if (medicalReport) {
      await transactionClient.medicalReport.create({
        data: { ...medicalReport, patientId: patientInfo.id },
      });
    }
  });

  const result = await prisma.patient.findUnique({
    where: {
      id,
    },
    include: {
      patientHealthData: true,
      medicalReport: true,
    },
  });
  console.log(result, "res");
  return result;
};
const deletePatient = async (id: string) => {
  await prisma.patient.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.medicalReport.deleteMany({
      where: {
        patientId: id,
      },
    });
    await transactionClient.patientHealthData.delete({
      where: {
        patientId: id,
      },
    });
    const deletedPatient = await transactionClient.patient.delete({
      where: {
        id,
      },
    });
    await transactionClient.user.delete({
      where: {
        email: deletedPatient.email,
      },
    });
    return deletePatient;
  });
  return result;
};
const softDeletePatient = async (id: string) => {
  await prisma.patient.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  const result = prisma.$transaction(async (transactionClient) => {
    const deletedPatient = await prisma.patient.update({
      where: {
        id,
      },
      data: { isDeleted: true },
    });
    await transactionClient.user.update({
      where: {
        email: deletedPatient.email,
      },
      data: { status: UserStatus.deleted },
    });
    return deletedPatient;
  });
  return result;
};

export const patientServices = {
  getAllPatientsFromDB,
  getPatientById,
  updatePatient,
  deletePatient,
  softDeletePatient,
};
