import {
  AppointmentStatus,
  PaymentStatus,
  Prisma,
  UserRole,
} from "@prisma/client";
import { paginationHelper } from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";
import { TUser } from "../../types/user";
import { v4 as uuidv4 } from "uuid";
import { appointmentSearchableFields } from "./appointment.constant";
import AppError from "../../error/AppError";
import httpStatus from "http-status";

const createAppointmentIntoDB = async (user: TUser, payload: any) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: payload.doctorId,
    },
  });

  const doctorScheduleData = await prisma.doctorSchedules.findFirstOrThrow({
    where: {
      doctorId: payload.id,
      scheduleId: payload.scheduleId,
      isBooked: false,
    },
  });
  const videoCallingId: string = uuidv4();
  const result = await prisma.$transaction(async (tx) => {
    const appointment = await tx.appointment.create({
      data: {
        patientId: patientData.id,
        doctorId: doctorData.id,
        scheduleId: payload.scheduleId,
        videoCallingId: videoCallingId,
      },
    });
    await tx.doctorSchedules.update({
      where: {
        doctorId_scheduleId: {
          doctorId: doctorData.id,
          scheduleId: payload.scheduleId,
        },
      },
      data: {
        isBooked: true,
        appointmentId: appointment.id,
      },
    });
    const today = new Date();
    const transactionId =
      "health-care-server-" +
      today.getFullYear() +
      "-" +
      today.getMonth() +
      "-" +
      today.getDay() +
      "-" +
      today.getHours() +
      "-" +
      today.getMinutes() +
      "-" +
      today.getSeconds();
    await tx.payment.create({
      data: {
        appointmentId: appointment.id,
        amount: doctorData.appointmentFee,
        transactionId,
      },
    });
    return appointment;
  });
  return result;
};
const getMyAppointments = async (user: TUser, filters: any, options: any) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { ...exactFilterData } = filters;

  const andConditions: Prisma.AppointmentWhereInput[] = [];

  if (user?.role === UserRole.doctor) {
    andConditions.push({
      doctor: {
        email: user.email,
      },
    });
  }
  if (user?.role === UserRole.patient) {
    andConditions.push({
      patient: {
        email: user.email,
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

  const whereConditions: Prisma.AppointmentWhereInput = {
    AND: andConditions,
  };
  const result = await prisma.appointment.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" },
    include:
      user?.role === UserRole.patient
        ? {
            doctor: true,
            schedule: true,
          }
        : {
            schedule: true,
            patient: {
              include: { medicalReport: true, patientHealthData: true },
            },
          },
  });
  const total = await prisma.appointment.count({
    where: whereConditions,
  });
  return { meta: { page, limit, total }, result };
};
const getAllFromDB = async (query: any, options: any) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { ...exactFilterData } = query;

  const andConditions: Prisma.AppointmentWhereInput[] = [];

  if (Object.keys(exactFilterData).length > 0) {
    andConditions.push({
      AND: Object.keys(exactFilterData).map((key) => ({
        [key]: {
          equals: exactFilterData[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.AppointmentWhereInput = {
    AND: andConditions,
  };
  const result = await prisma.appointment.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" },
    include: {
      doctor: true,
      patient: true,
    },
  });
  const total = await prisma.appointment.count({
    where: whereConditions,
  });
  return { meta: { page, limit, total }, result };
};
const updateAppointmentStatus = async (
  appointmentId: string,
  status: AppointmentStatus,
  user: TUser
) => {
  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: appointmentId,
    },
    include: {
      doctor: true,
    },
  });
  if (user?.role === UserRole.doctor) {
    if (!(user.email === appointmentData.doctor.email)) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized");
    }
  }
  const result = await prisma.appointment.update({
    where: {
      id: appointmentId,
    },
    data: {
      status,
    },
  });
  console.log(result);
  return result;
};

const cancelUnpaidAppointments = async () => {
  const thirtyMinAgo = new Date(Date.now() - 9 * 60 * 1000);
  const unPaidAppointments = await prisma.appointment.findMany({
    where: {
      createdAt: {
        lte: thirtyMinAgo,
      },
      paymentStatus: PaymentStatus.UNPAID,
    },
  });
  const unPaidAppointmentIds = unPaidAppointments?.map(
    (appointment) => appointment.id
  );
  prisma.$transaction(async (tx) => {
    await tx.payment.deleteMany({
      where: {
        appointmentId: {
          in: unPaidAppointmentIds,
        },
      },
    });
    await tx.appointment.deleteMany({
      where: {
        id: {
          in: unPaidAppointmentIds,
        },
      },
    });
    for (const unPaidAppointment of unPaidAppointments) {
      await tx.doctorSchedules.updateMany({
        where: {
          doctorId: unPaidAppointment.doctorId,
          scheduleId: unPaidAppointment.scheduleId,
        },
        data: {
          isBooked: false,
        },
      });
    }
  });
};

export const AppointmentServices = {
  createAppointmentIntoDB,
  getMyAppointments,
  getAllFromDB,
  updateAppointmentStatus,
  cancelUnpaidAppointments,
};
