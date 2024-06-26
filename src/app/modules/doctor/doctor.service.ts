import { Doctor, Prisma } from "@prisma/client";
import { paginationHelper } from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";
import { doctorSearchableFields } from "./dortor.constant";
import { asyncForEach } from "../../../shared/utils";
import AppError from "../../error/AppError";
import httpStatus from "http-status";

const getAllDoctorsFromDB = async (query: any, options: any) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, specialties, ...exactFilterData } = query;
  console.log(specialties);
  const andConditions: Prisma.DoctorWhereInput[] = [];

  if (query.searchTerm) {
    andConditions.push({
      OR: doctorSearchableFields?.map((field) => ({
        [field]: {
          contains: query.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }
  // doctor => doctorSpecialties => specialties

  if (specialties && specialties.length > 0) {
    andConditions.push({
      doctorSpecialities: {
        some: {
          specialities: {
            title: {
              contains: specialties,
              mode: "insensitive",
            },
          },
        },
      },
    });
  }

  if (Object.keys(exactFilterData).length > 0) {
    andConditions.push({
      AND: Object.keys(exactFilterData).map((key) => ({
        [key]: {
          equals: exactFilterData[key],
        },
      })),
    });
  }
  andConditions.push({
    isDeleted: false,
  });
  //   console.dir(andConditions, { depth: "infinity" });

  const whereConditions: Prisma.DoctorWhereInput = { AND: andConditions };
  const data = await prisma.doctor.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder ? { [sortBy]: sortOrder } : { averageRating: "desc" },
    include: {
      doctorSpecialities: {
        include: {
          specialities: true,
        },
      },
    },
  });
  const total = await prisma.doctor.count({
    where: whereConditions,
  });
  return { meta: { page, limit, total }, data };
};
const getDoctorById = async (id: string) => {
  const result = await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      doctorSpecialities: {
        include: {
          specialities: true,
        },
      },
      doctorSchedules: true,
      review: true,
    },
  });
  return result;
};

const updateDoctorIntoDB = async (
  id: string,
  payload: Partial<any>
): Promise<Doctor | null> => {
  const { specialties, ...doctorData } = payload;
  await prisma.$transaction(async (transactionClient) => {
    const result = await transactionClient.doctor.update({
      where: {
        id,
      },
      data: doctorData,
    });

    if (!result) {
      throw new AppError(httpStatus.BAD_REQUEST, "Unable to update Doctor");
    }
    if (specialties && specialties.length > 0) {
      const deleteSpecialties = specialties.filter(
        (specialty: any) => specialty.specialtiesId && specialty.isDeleted
      );

      const newSpecialties = specialties.filter(
        (specialty: any) => specialty.specialtiesId && !specialty.isDeleted
      );

      await asyncForEach(
        deleteSpecialties,
        async (deleteDoctorSpeciality: any) => {
          await transactionClient.doctorSpecialities.deleteMany({
            where: {
              AND: [
                {
                  doctorId: id,
                },
                {
                  specialitiesId: deleteDoctorSpeciality.specialtiesId,
                },
              ],
            },
          });
        }
      );
      await asyncForEach(newSpecialties, async (insertDoctorSpecialty: any) => {
        //@ needed for already added specialties
        const existingSpecialties = await prisma.doctorSpecialities.findFirst({
          where: {
            specialitiesId: insertDoctorSpecialty.specialtiesId,
            doctorId: id,
          },
        });

        if (!existingSpecialties) {
          await transactionClient.doctorSpecialities.create({
            data: {
              doctorId: id,
              specialitiesId: insertDoctorSpecialty.specialtiesId,
            },
          });
        }
      });
    }

    return result;
  });

  const responseData = await prisma.doctor.findUnique({
    where: {
      id,
    },
    include: {
      doctorSpecialities: {
        include: {
          specialities: true,
        },
      },
    },
  });
  return responseData;
};
const deleteDoctorFromDB = async (id: string): Promise<Doctor> => {
  return await prisma.$transaction(async (transactionClient) => {
    const deleteDoctor = await transactionClient.doctor.delete({
      where: {
        id,
      },
    });

    await transactionClient.user.delete({
      where: {
        email: deleteDoctor.email,
      },
    });

    return deleteDoctor;
  });
};
const softDeleteDoctor = async (id: string) => {
  await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  const result = await prisma.doctor.update({
    where: {
      id,
    },
    data: { isDeleted: true },
  });
  return result;
};

export const DoctorServices = {
  updateDoctorIntoDB,
  getAllDoctorsFromDB,
  getDoctorById,
  deleteDoctorFromDB,
  softDeleteDoctor,
};
