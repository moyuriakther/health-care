import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import httpStatus from "http-status";
import sendResponse from "../../../shared/sendResponse";
import { patientServices } from "./patient.service";
import { patientFilterableFields } from "./patient.constant";

const getAllPatients = catchAsync(async (req: Request, res: Response) => {
  const finalQuery = pick(req.query, patientFilterableFields);
  const options = pick(req.query, ["page", "limit", "sortOrder", "sortBy"]);
  //   console.log("hmm", finalQuery, "options");
  const result = await patientServices.getAllPatientsFromDB(
    finalQuery,
    options
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patients Data Retrieved Successfully",
    data: result,
  });
});
const getPatientById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await patientServices.getPatientById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient Data Retrieved Successfully",
    data: result,
  });
});
const updatePatient = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await patientServices.updatePatient(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Update Patient Successfully",
    data: result,
  });
});
const deletePatient = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await patientServices.deletePatient(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient Data Deleted Successfully",
    data: result,
  });
});
const softDeletePatient = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await patientServices.softDeletePatient(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Soft Delete Patient Successfully",
    data: result,
  });
});

export const patientController = {
  updatePatient,
  getAllPatients,
  getPatientById,
  deletePatient,
  softDeletePatient,
};
