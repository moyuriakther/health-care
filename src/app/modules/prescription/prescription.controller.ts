import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { TUser } from "../../types/user";
import { prescriptionServices } from "./prescription.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import pick from "../../../shared/pick";
import { prescriptionFilterableFields } from "./prescription.constant";

const createPrescription = catchAsync(
  async (req: Request & { user?: TUser }, res: Response) => {
    const user = req.user as TUser;
    const result = await prescriptionServices.createPrescription(
      user,
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Prescription Created Successfully",
      data: result,
    });
  }
);
const patientPrescription = catchAsync(
  async (req: Request & { user?: TUser }, res: Response) => {
    const user = req.user as TUser;
    const options = pick(req.query, ["page", "limit", "sortOrder", "sortBy"]);
    const result = await prescriptionServices.patientPrescription(
      user,
      options
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Prescription Retrieved Successfully",
      data: result.result,
      meta: result.meta,
    });
  }
);
const getAllPrescriptions = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, prescriptionFilterableFields);
  const options = pick(req.query, ["page", "limit", "sortOrder", "sortBy"]);
  console.log("hmm", filters);
  const result = await prescriptionServices.getAllPrescriptions(
    filters,
    options
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Prescription Data Retrieved Successfully",
    data: result.data,
    meta: result.meta,
  });
});

export const prescriptionController = {
  createPrescription,
  patientPrescription,
  getAllPrescriptions,
};
