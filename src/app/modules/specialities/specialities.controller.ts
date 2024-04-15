import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { specialtiesService } from "./specialities.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

const createSpecialties = catchAsync(async (req: Request, res: Response) => {
  const result = await specialtiesService.createSpecialties(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Specialties Created Successfully",
    data: result,
  });
});
const getAllSpecialties = catchAsync(async (req: Request, res: Response) => {
  const result = await specialtiesService.getAllSpecialtiesFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Specialties Data Retrieved Successfully",
    data: result,
  });
});
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await specialtiesService.deleteSpecialtiesFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Specialties Data Deleted Successfully",
    data: result,
  });
});

export const specialtiesController = {
  createSpecialties,
  getAllSpecialties,
  deleteFromDB,
};
