import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { reviewServices } from "./review.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { TUser } from "../../types/user";
import pick from "../../../shared/pick";

const insertReviewIntoDB = catchAsync(
  async (req: Request & { user?: TUser }, res: Response) => {
    const user = req.user as TUser;
    const result = await reviewServices.insertReviewIntoDB(user, req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Review Created Successfully",
      data: result,
    });
  }
);
const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ["patientEmail", "doctorEmail"]);
  const options = pick(req.query, ["page", "limit", "sortOrder", "sortBy"]);
  const result = await reviewServices.getAllFromDB(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review Data Retrieved Successfully",
    data: result.data,
    meta: result.meta,
  });
});

export const reviewController = {
  insertReviewIntoDB,
  getAllFromDB,
};
