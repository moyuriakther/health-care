import { NextFunction, Request, Response, Router } from "express";
import { DoctorController } from "./doctor.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.get("/", DoctorController.getAllDoctors);
router.get("/:id", DoctorController.getDoctorById);
router.patch(
  "/:id",
  auth(UserRole.admin, UserRole.super_admin),
  //   fileUploader.upload.single("file"),
  DoctorController.updateDoctor
);
router.delete(
  "/:id",
  auth(UserRole.admin, UserRole.super_admin),
  DoctorController.deleteDoctor
);
router.delete(
  "/soft/:id",
  auth(UserRole.admin, UserRole.super_admin),
  DoctorController.softDeleteDoctor
);

export const DoctorRouter = router;
