import express, { Application, Request, Response } from "express";
import cors from "cors";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import cookieParser from "cookie-parser";
import { AppointmentServices } from "./app/modules/appointment/appointment.service";
import cron from "node-cron";

const app: Application = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use("/api/v1", router);

app.use(globalErrorHandler);

// cron.schedule("* * * * *", () => {
//   try {
//     AppointmentServices.cancelUnpaidAppointments();
//   } catch (error) {
//     console.log("Get an error", error);
//   }
// });

app.use(notFound);

export default app;
