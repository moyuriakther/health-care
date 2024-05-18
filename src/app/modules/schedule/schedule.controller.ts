import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ScheduleServices } from "./schedule.service";
import { Request, Response } from "express";
import pick from "../../../shared/pick";
import { scheduleFilterableFields } from "./schedule.constant";
import { TUser } from "../../types/user";

const createSchedule = catchAsync(async (req: Request, res: Response) => {
  const result = await ScheduleServices.insertScheduleIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Insert Schedule Into DB Successfully",
    data: result,
  });
});
const getAllFromDB = catchAsync(
  async (req: Request & { user?: TUser }, res: Response) => {
    const user = req.user as TUser;
    const finalQuery = pick(req.query, scheduleFilterableFields);
    const options = pick(req.query, ["page", "limit", "sortOrder", "sortBy"]);
    const result = await ScheduleServices.getAllFromDB(
      finalQuery,
      options,
      user
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Retrieved Schedules Data Successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);
const getScheduleById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await ScheduleServices.getScheduleById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Schedule Data Retrieved Successfully",
    data: result,
  });
});
const deleteSchedule = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ScheduleServices.deleteSchedule(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Schedule Deleted Successfully",
    data: result,
  });
});

export const ScheduleControllers = {
  createSchedule,
  getAllFromDB,
  getScheduleById,
  deleteSchedule,
};
