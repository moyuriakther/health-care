import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { patientController } from "./patient.controller";

const router = Router();

router.get("/", patientController.getAllPatients);
router.get("/:id", patientController.getPatientById);
router.patch(
  "/:id",
  auth(UserRole.admin, UserRole.super_admin),
  // fileUploader.upload.single("file"),
  patientController.updatePatient
);
router.delete(
  "/:id",
  auth(UserRole.admin, UserRole.super_admin),
  patientController.deletePatient
);
router.delete(
  "/soft/:id",
  auth(UserRole.admin, UserRole.super_admin),
  patientController.softDeletePatient
);

export const PatientRouter = router;
