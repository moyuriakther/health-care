import { Router } from "express";
import { prescriptionController } from "./prescription.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.get(
  "/all-prescriptions",
  auth(UserRole.admin, UserRole.super_admin),
  prescriptionController.getAllPrescriptions
);
router.get(
  "/my-prescription",
  auth(UserRole.patient),
  prescriptionController.patientPrescription
);
router.post(
  "/",
  auth(UserRole.doctor),
  prescriptionController.createPrescription
);

export const PrescriptionRouter = router;
