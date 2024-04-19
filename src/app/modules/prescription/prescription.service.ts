import { AppointmentStatus, PaymentStatus, Prisma } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { TUser } from "../../types/user";
import AppError from "../../error/AppError";
import httpStatus from "http-status";
import { paginationHelper } from "../../../helpers/paginationHelper";

const createPrescription = async (user: TUser, payload: any) => {
  console.log(user, payload);
  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: payload.appointmentId,
      status: AppointmentStatus.COMPLETED,
      paymentStatus: PaymentStatus.PAID,
    },
    include: {
      doctor: true,
    },
  });
  if (!(user?.email === appointmentData.doctor.email)) {
    throw new AppError(httpStatus.BAD_REQUEST, "This is not your Appointment");
  }
  const result = await prisma.prescription.create({
    data: {
      appointmentId: payload.appointmentId,
      doctorId: appointmentData.doctorId,
      patientId: appointmentData.patientId,
      instructions: payload.instructions,
      followUpDate: payload.followUpDate,
    },
  });
  return result;
};
const patientPrescription = async (user: TUser, options: any) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const result = await prisma.prescription.findMany({
    where: {
      patient: {
        email: user?.email,
      },
    },
    skip: skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: "desc" },
    include: {
      doctor: true,
      patient: true,
      appointment: true,
    },
  });
  const total = await prisma.prescription.count({
    where: {
      patient: {
        email: user?.email,
      },
    },
  });
  return { meta: { page, limit, total }, result };
};
const getAllPrescriptions = async (filters: any, options: any) => {
  console.log(filters, options, "dsfajso");
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { patientEmail, doctorEmail } = filters;
  console.log(filters);
  const andConditions: Prisma.PrescriptionWhereInput[] = [];

  if (patientEmail) {
    andConditions.push({
      doctor: {
        email: patientEmail,
      },
    });
  }
  if (doctorEmail) {
    andConditions.push({
      doctor: {
        email: doctorEmail,
      },
    });
  }

  const whereConditions: Prisma.PrescriptionWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.prescription.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" },
  });
  const total = await prisma.prescription.count({
    where: whereConditions,
  });
  return { meta: { page, limit, total }, data: result };
};

export const prescriptionServices = {
  createPrescription,
  patientPrescription,
  getAllPrescriptions,
};
