import { z } from "zod";

const createAppointment = z.object({
  body: z.object({
    doctorId: z.string(),
    scheduleId: z.string(),
  }),
});

export const appointmentValidations = {
  createAppointment,
};
