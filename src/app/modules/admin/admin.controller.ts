import { NextFunction, Request, Response } from "express";
import { adminServices } from "./admin.service";
import pick from "../../../shared/pick";
import { adminFilterableFields } from "./admin.constant";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

const getAllAdminFromDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const finalQuery = pick(req.query, adminFilterableFields);
  const options = pick(req.query, ["page", "limit", "sortOrder", "sortBy"]);
  console.log("hmm", options, "options");
  try {
    const result = await adminServices.getAllAdmins(finalQuery, options);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admin Data Retrieved Successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};
const getAdminById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req.params.id);
  const id = req.params.id;
  try {
    const result = await adminServices.getAdminById(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin Data Retrieved By Id Successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};
const updateAdmin = async (req: Request, res: Response, next: NextFunction) => {
  // console.log(req.params.id, req.body);
  const id = req.params.id;
  try {
    const result = await adminServices.updateAdminIntoDB(id, req.body);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admin Data Retrieved By Id Successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};
const deleteAdmin = async (req: Request, res: Response, next: NextFunction) => {
  // console.log(req.params.id, req.body);
  const id = req.params.id;
  try {
    const result = await adminServices.deleteFromDB(id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admin Data Deleted Successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};
const softDeleteAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // console.log(req.params.id, req.body);
  const id = req.params.id;
  try {
    const result = await adminServices.softDeleteFromDB(id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admin Data Softly Deleted Successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};
export const adminControllers = {
  getAllAdminFromDB,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  softDeleteAdmin,
};
