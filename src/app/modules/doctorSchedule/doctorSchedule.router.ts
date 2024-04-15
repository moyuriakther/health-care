import { Router } from "express";
import { doctorScheduleController } from "./doctorSchedule.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { DoctorScheduleValidation } from "./doctorSchedule.validation";

const router = Router();

router.get(
  "/",
  auth(UserRole.admin, UserRole.super_admin, UserRole.doctor, UserRole.patient),
  doctorScheduleController.getAllFromDB
);
router.get(
  "/my-schedule",
  auth(UserRole.doctor),
  doctorScheduleController.getMySchedules
);
router.post(
  "/",
  auth(UserRole.doctor),
  validateRequest(DoctorScheduleValidation.create),
  doctorScheduleController.createDoctorSchedule
);
router.delete(
  "/:id",
  auth(UserRole.doctor),
  doctorScheduleController.deleteFromDb
);

export const DoctorScheduleRouter = router;
