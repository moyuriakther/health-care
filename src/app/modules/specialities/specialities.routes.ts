import { NextFunction, Request, Response, Router } from "express";
import { specialtiesController } from "./specialities.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { fileUploader } from "../../../helpers/fileUploader";
import { specialtiesValidation } from "./specialities.validation";

const router = Router();

router.post(
  "/",
  auth(UserRole.admin, UserRole.super_admin),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = specialtiesValidation.create.parse(JSON.parse(req.body.data));
    return specialtiesController.createSpecialties(req, res, next);
  }
);
router.get(
  "/",
  // auth(UserRole.admin, UserRole.super_admin),
  specialtiesController.getAllSpecialties
);
router.delete(
  "/:id",
  auth(UserRole.admin, UserRole.super_admin),
  specialtiesController.deleteFromDB
);

export const SpecialtiesRouter = router;
