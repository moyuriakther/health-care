import { NextFunction, Request, Response, Router } from "express";
import { userControllers } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { fileUploader } from "../../../helpers/fileUploader";
import { userValidation } from "./user.validation";
import validateRequest from "../../middlewares/validateRequest";

const router = Router();

router.get(
  "/",
  auth(UserRole.super_admin, UserRole.admin),
  userControllers.allUsers
);
router.get(
  "/me",
  auth(UserRole.admin, UserRole.doctor, UserRole.patient, UserRole.super_admin),
  userControllers.getMyProfile
);
router.post(
  "/create-admin",
  auth(UserRole.admin, UserRole.super_admin),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.createAdmin.parse(JSON.parse(req.body.data));
    return userControllers.createAdmin(req, res, next);
  }
);
router.post(
  "/create-doctor",
  // auth(UserRole.admin, UserRole.super_admin),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.createDoctor.parse(JSON.parse(req.body.data));
    return userControllers.createDoctor(req, res, next);
  }
);
router.post(
  "/create-patient",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.createPatient.parse(JSON.parse(req.body.data));
    return userControllers.createPatient(req, res, next);
  }
);
router.patch(
  "/:id/status",
  auth(UserRole.admin, UserRole.super_admin),
  validateRequest(userValidation.updateUserStatus),
  userControllers.changeProfileStatus
);
router.patch(
  "/update-my-profile",
  fileUploader.upload.single("file"),
  auth(UserRole.admin, UserRole.super_admin, UserRole.doctor, UserRole.patient),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    return userControllers.updateMyProfile(req, res, next);
  }
);

export const userRouter = router;
