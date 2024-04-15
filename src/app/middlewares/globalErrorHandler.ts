import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import AppError from "../error/AppError";

const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let message = error?.name || "Something Went Wrong";
  let statusCode: number | string = httpStatus.INTERNAL_SERVER_ERROR;

  if (error instanceof AppError) {
    message = error.message;
    statusCode = error.statusCode;
  }

  res.status(statusCode).json({
    success: false,
    message,
    error,
  });
};
export default globalErrorHandler;
