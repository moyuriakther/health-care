import httpStatus from "http-status";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";
import { TUser } from "../../types/user";
import { Request, Response } from "express";
import { MetaServices } from "./meta.service";

const fetchDashboardMetaData = catchAsync(
  async (req: Request & { user?: TUser }, res: Response) => {
    const user = req.user as TUser;
    const result = await MetaServices.fetchDashboardMetaData(user);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Get Meta Data Successfully",
      data: result,
    });
  }
);

export const MetaControllers = { fetchDashboardMetaData };
