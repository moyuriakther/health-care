import { Router } from "express";
import { userRouter } from "../modules/user/user.router";
import { adminRouter } from "../modules/admin/admin.router";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { SpecialtiesRouter } from "../modules/specialities/specialities.routes";
import { DoctorRouter } from "../modules/doctor/doctor.routes";
import { PatientRouter } from "../modules/patient/patient.router";
import { ScheduleRouter } from "../modules/schedule/schedule.router";
import { DoctorScheduleRouter } from "../modules/doctorSchedule/doctorSchedule.router";
import { AppointmentRouter } from "../modules/appointment/appointment.router";
import { PaymentRoutes } from "../modules/payment/payment.router";

const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRouter,
  },
  {
    path: "/admin",
    route: adminRouter,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/specialties",
    route: SpecialtiesRouter,
  },
  {
    path: "/doctor",
    route: DoctorRouter,
  },
  {
    path: "/patient",
    route: PatientRouter,
  },
  {
    path: "/schedule",
    route: ScheduleRouter,
  },
  {
    path: "/doctor-schedule",
    route: DoctorScheduleRouter,
  },
  {
    path: "/appointment",
    route: AppointmentRouter,
  },
  {
    path: "/payment",
    route: PaymentRoutes,
  },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
