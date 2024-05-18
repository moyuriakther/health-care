import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { doctorScheduleServices } from "./doctorSchedule.service";
import { TUser } from "../../types/user";
import pick from "../../../shared/pick";

const createDoctorSchedule = catchAsync(
  async (req: Request & { user?: TUser }, res: Response) => {
    const result = await doctorScheduleServices.createDoctorSchedule(
      req.user,
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Doctor Schedule Created Successfully",
      data: result,
    });
  }
);
const getMySchedules = catchAsync(
  async (req: Request & { user?: TUser }, res: Response) => {
    const user = req.user as TUser;
    const options = pick(req.query, ["page", "limit", "sortOrder", "sortBy"]);
    const filters = pick(req.query, ["startDate", "endDate", "isBooked"]);
    const result = await doctorScheduleServices.getMySchedules(
      user,
      options,
      filters
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Schedules Retrieved Successfully",
      data: result,
    });
  }
);
const deleteFromDb = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;
    const id = req.params.id;
    const result = await doctorScheduleServices.deleteScheduleFromDB(id, user);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Doctor Schedule Deleted Successfully",
      data: result,
    });
  }
);
const getAllFromDB = catchAsync(
  async (req: Request & { user?: TUser }, res: Response) => {
    const options = pick(req.query, ["page", "limit", "sortOrder", "sortBy"]);
    const filters = pick(req.query, ["startDate", "endDate", "isBooked"]);
    const result = await doctorScheduleServices.getAllFromDB(options, filters);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Doctor Schedule Data Retrieved Successfully",
      data: result.result,
      meta: result.meta,
    });
  }
);
export const doctorScheduleController = {
  createDoctorSchedule,
  getMySchedules,
  deleteFromDb,
  getAllFromDB,
};
