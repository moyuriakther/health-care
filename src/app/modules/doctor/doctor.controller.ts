import httpStatus from "http-status";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";
import { DoctorServices } from "./doctor.service";
import { Request, Response } from "express";
import pick from "../../../shared/pick";
import { doctorFilterableFields } from "./dortor.constant";

const getAllDoctors = catchAsync(async (req: Request, res: Response) => {
  const finalQuery = pick(req.query, doctorFilterableFields);
  const options = pick(req.query, ["page", "limit", "sortOrder", "sortBy"]);
  console.log("hmm", options, "options");
  const result = await DoctorServices.getAllDoctorsFromDB(finalQuery, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctors Data Retrieved Successfully",
    data: result.data,
    meta: result.meta,
  });
});
const getDoctorById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await DoctorServices.getDoctorById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor Data Retrieved Successfully",
    data: result,
  });
});
const updateDoctor = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await DoctorServices.updateDoctorIntoDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Update Doctor Successfully",
    data: result,
  });
});
const deleteDoctor = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await DoctorServices.deleteDoctorFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor Data Deleted Successfully",
    data: result,
  });
});
const softDeleteDoctor = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await DoctorServices.softDeleteDoctor(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Soft Delete Doctor Successfully",
    data: result,
  });
});

export const DoctorController = {
  updateDoctor,
  getAllDoctors,
  getDoctorById,
  deleteDoctor,
  softDeleteDoctor,
};
