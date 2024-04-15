import { Router } from "express";
import { ScheduleControllers } from "./schedule.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.post(
  "/",
  auth(UserRole.admin, UserRole.super_admin),
  ScheduleControllers.createSchedule
);
router.get("/", auth(UserRole.doctor), ScheduleControllers.getAllFromDB);
router.get("/:id", auth(UserRole.doctor), ScheduleControllers.getScheduleById);
router.delete(
  "/:id",
  auth(UserRole.admin, UserRole.super_admin),
  ScheduleControllers.deleteSchedule
);

export const ScheduleRouter = router;
