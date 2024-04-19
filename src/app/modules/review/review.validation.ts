import { z } from "zod";

const createReviewValidation = z.object({
  body: z.object({
    appointmentId: z.string({
      required_error: "Appointment id is required",
    }),
    rating: z.number({
      required_error: "Rating is Required",
    }),
    comment: z.string({
      required_error: "Comment is Required",
    }),
  }),
});

export const reviewValidation = {
  createReviewValidation,
};
