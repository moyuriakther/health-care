import { Router } from "express";
import { MetaControllers } from "./meta.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.get(
  "/",
  auth(UserRole.super_admin, UserRole.admin, UserRole.doctor, UserRole.patient),
  MetaControllers.fetchDashboardMetaData
);

export const MetaRouter = router;
