import {
  Admin,
  Doctor,
  Patient,
  Prisma,
  UserRole,
  UserStatus,
} from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../../shared/prisma";
import { TFile } from "../../types/file";
import { fileUploader } from "../../../helpers/fileUploader";
import { Request } from "express";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { userSearchableFields } from "./user.constant";
import { TUser } from "../../types/user";

const createAdmin = async (req: Request): Promise<Admin> => {
  const file = req?.file as TFile;
  if (file) {
    const uploadToCoudinary = await fileUploader.uploadToCloudinary(file);
    req.body.admin.profilePhoto = uploadToCoudinary?.secure_url;
  }

  const hashedPassword: string = await bcrypt.hash(req?.body?.password, 12);

  const userData = {
    email: req.body.admin.email,
    password: hashedPassword,
    role: UserRole.admin,
  };
  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });
    const createdAdmin = await transactionClient.admin.create({
      data: req.body.admin,
    });
    return createdAdmin;
  });
  return result;
};
const createDoctor = async (req: Request): Promise<Doctor> => {
  const file = req.file;
  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    console.log({ uploadToCloudinary });
    req.body.doctor.profilePhoto = uploadToCloudinary?.secure_url;
  }
  const hashedPassword: string = await bcrypt.hash(req.body.password, 12);
  const userData = {
    email: req.body.doctor.email,
    password: hashedPassword,
    role: UserRole.doctor,
  };
  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });
    const createDoctor = await transactionClient.doctor.create({
      data: req.body.doctor,
    });
    return createDoctor;
  });
  return result;
};
const createPatient = async (req: Request): Promise<Patient> => {
  const file = req.file;

  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.patient.profilePhoto = uploadToCloudinary?.secure_url;
  }
  const hashedPassword: string = await bcrypt.hash(req.body.password, 12);
  const userData = {
    email: req.body.patient.email,
    password: hashedPassword,
    role: UserRole.patient,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });
    const createPatient = await transactionClient.patient.create({
      data: req.body.patient,
    });

    return createPatient;
  });
  return result;
};

const allUsersFromDB = async (query: any, options: any) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...exactFilterData } = query;

  const andConditions: Prisma.UserWhereInput[] = [];

  if (query.searchTerm) {
    andConditions.push({
      OR: userSearchableFields?.map((field) => ({
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
          equals: exactFilterData[key],
        },
      })),
    });
  }

  //   console.dir(andConditions, { depth: "infinity" });

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};
  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      role: true,
      needPasswordChange: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      admin: true,
      doctor: true,
      patient: true,
    },
    // include: {
    //   admin: true,
    //   doctor: true,
    //   patient: true,
    // },
  });
  const total = await prisma.user.count({
    where: whereConditions,
  });
  return { meta: { page, limit, total }, result };
};

const updateUserStatus = async (id: string, status: UserRole) => {
  await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });
  const result = await prisma.user.update({
    where: {
      id,
    },
    data: status,
  });
  return result;
};

const getMyProfile = async (user: TUser) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email,
      status: UserStatus.active,
    },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      needPasswordChange: true,
    },
  });

  let profileInfo;

  if (
    userInfo.role == UserRole.super_admin ||
    userInfo.role == UserRole.admin
  ) {
    profileInfo = await prisma.admin.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo.role === UserRole.doctor) {
    profileInfo = await prisma.doctor.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo.role === UserRole.patient) {
    profileInfo = await prisma.patient.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  }
  return {
    ...userInfo,
    ...profileInfo,
  };
};

const updateMyProfile = async (user: TUser, req: Request) => {
  const payload = req.body;
  const file = req.file as TFile;
  const role = user?.role;
  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    if (user && user.role) {
      payload.profilePhoto = uploadToCloudinary?.secure_url;
    }
  }

  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email,
      status: UserStatus.active,
    },
  });

  let profileInfo;

  if (
    userInfo.role == UserRole.super_admin ||
    userInfo.role == UserRole.admin
  ) {
    profileInfo = await prisma.admin.update({
      where: {
        email: userInfo.email,
      },
      data: payload,
    });
  } else if (userInfo.role === UserRole.doctor) {
    profileInfo = await prisma.doctor.update({
      where: {
        email: userInfo.email,
      },
      data: payload,
    });
  } else if (userInfo.role === UserRole.patient) {
    profileInfo = await prisma.patient.update({
      where: {
        email: userInfo.email,
      },
      data: payload,
    });
  }
  return {
    ...userInfo,
    ...profileInfo,
  };
};
export const userServices = {
  createAdmin,
  createDoctor,
  createPatient,
  allUsersFromDB,
  updateUserStatus,
  getMyProfile,
  updateMyProfile,
};
