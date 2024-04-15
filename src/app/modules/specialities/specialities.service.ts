import { Request } from "express";
import { fileUploader } from "../../../helpers/fileUploader";
import prisma from "../../../shared/prisma";
import { TFile } from "../../types/file";

const createSpecialties = async (req: Request) => {
  console.log(req);
  const file = req.file as TFile;
  const data = req.body;
  console.log(data);
  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.icon = uploadToCloudinary?.secure_url;
  }
  const result = await prisma.specialties.create({ data });
  return result;
};

const getAllSpecialtiesFromDB = async () => {
  const result = await prisma.specialties.findMany();
  return result;
};
const deleteSpecialtiesFromDB = async (id: string) => {
  const result = await prisma.specialties.delete({
    where: {
      id,
    },
  });
  return result;
};
export const specialtiesService = {
  createSpecialties,
  getAllSpecialtiesFromDB,
  deleteSpecialtiesFromDB,
};
