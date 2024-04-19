import { Router } from "express";
import { AppointmentController } from "./appointment.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { appointmentValidations } from "./appointment.validation";

const router = Router();

router.get(
  "/",
  auth(UserRole.admin, UserRole.super_admin),
  AppointmentController.getAllFromDB
);
router.get(
  "/my-appointment",
  auth(UserRole.patient, UserRole.doctor),
  AppointmentController.getMyAppointments
);
router.post(
  "/",
  auth(UserRole.patient),
  validateRequest(appointmentValidations.createAppointment),
  AppointmentController.createAppointment
);
router.patch(
  "/status/:appointmentId",
  auth(UserRole.doctor, UserRole.admin, UserRole.super_admin),
  AppointmentController.updateAppointmentStatus
);

export const AppointmentRouter = router;
