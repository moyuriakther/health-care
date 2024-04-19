import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { AppointmentServices } from "./appointment.service";
import { TUser } from "../../types/user";
import pick from "../../../shared/pick";

const createAppointment = catchAsync(
  async (req: Request & { user?: TUser }, res: Response) => {
    const user = req.user as TUser;
    const result = await AppointmentServices.createAppointmentIntoDB(
      user,
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Appointment Created Successfully",
      data: result,
    });
  }
);
const getMyAppointments = catchAsync(
  async (req: Request & { user?: TUser }, res: Response) => {
    const user = req.user as TUser;
    const filters = pick(req.query, ["paymentStatus", "status"]);
    const options = pick(req.query, ["page", "limit", "sortOrder", "sortBy"]);
    const result = await AppointmentServices.getMyAppointments(
      user,
      filters,
      options
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "My Appointment Data Retrieved Successfully",
      data: result,
    });
  }
);
const getAllFromDB = catchAsync(
  async (req: Request & { user?: TUser }, res: Response) => {
    const user = req.user as TUser;
    const filters = pick(req.query, ["status", "paymentStatus"]);
    const options = pick(req.query, ["page", "limit", "sortOrder", "sortBy"]);
    const result = await AppointmentServices.getAllFromDB(filters, options);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Appointment Data Retrieved Successfully",
      data: result,
    });
  }
);
const updateAppointmentStatus = catchAsync(
  async (req: Request & { user?: TUser }, res: Response) => {
    const { appointmentId } = req.params;
    const { status } = req.body;
    const user = req.user as TUser;
    const result = await AppointmentServices.updateAppointmentStatus(
      appointmentId,
      status,
      user
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Appointment Status Updated Successfully",
      data: result,
    });
  }
);

export const AppointmentController = {
  createAppointment,
  getAllFromDB,
  getMyAppointments,
  updateAppointmentStatus,
};
