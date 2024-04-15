import { NextFunction, Request, Response } from "express";
import { userServices } from "./user.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import { userFilterableFields } from "./user.constant";
import { TUser } from "../../types/user";

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.createAdmin(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin Created Successfully",
    data: result,
  });
});

const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.createDoctor(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor Created Successfully",
    data: result,
  });
});
const createPatient = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.createPatient(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient Created Successfully",
    data: result,
  });
});
const allUsers = catchAsync(async (req: Request, res: Response) => {
  const finalQuery = pick(req.query, userFilterableFields);
  const options = pick(req.query, ["page", "limit", "sortOrder", "sortBy"]);

  const result = await userServices.allUsersFromDB(finalQuery, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Retrieved User Data Successfully",
    data: result,
  });
});
const changeProfileStatus = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  console.log(id, req.body);
  const result = await userServices.updateUserStatus(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Update User Status Successfully",
    data: result,
  });
});

const getMyProfile = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;
    const result = await userServices.getMyProfile(user);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Retrieved My Profile Data successfully",
      data: result,
    });
  }
);
const updateMyProfile = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const user: TUser = req.user;
    const result = await userServices.updateMyProfile(user, req);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "My Profile Data Updated Successfully",
      data: result,
    });
  }
);

export const userControllers = {
  createAdmin,
  createDoctor,
  createPatient,
  allUsers,
  changeProfileStatus,
  getMyProfile,
  updateMyProfile,
};
