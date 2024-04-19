import httpStatus from "http-status";
import prisma from "../../../shared/prisma";
import AppError from "../../error/AppError";
import { TUser } from "./../../types/user";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { Prisma } from "@prisma/client";

const insertReviewIntoDB = async (user: TUser, payload: any) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });
  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: payload.appointmentId,
    },
  });
  if (!(patientData.id === appointmentData.patientId)) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized");
  }

  await prisma.$transaction(async (tx) => {
    const result = await tx.review.create({
      data: {
        patientId: patientData.id,
        doctorId: appointmentData.doctorId,
        appointmentId: appointmentData.id,
        rating: payload.rating,
        comment: payload.comment,
      },
    });
    const averageRating = await tx.review.aggregate({
      _avg: {
        rating: true,
      },
    });
    await tx.doctor.update({
      where: {
        id: appointmentData.doctorId,
      },
      data: { averageRating: averageRating._avg.rating as number },
    });
    return result;
  });
};

const getAllFromDB = async (filters: any, options: any) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  console.log(filters);
  const { patientEmail, doctorEmail } = filters;

  const andConditions: Prisma.ReviewWhereInput[] = [];

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

  const whereConditions: Prisma.ReviewWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.review.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" },
    include: {
      doctor: true,
      patient: true,
      appointment: true,
    },
  });
  const total = await prisma.review.count({
    where: whereConditions,
  });
  return { meta: { page, limit, total }, data: result };
};

export const reviewServices = {
  insertReviewIntoDB,
  getAllFromDB,
};
