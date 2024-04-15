import { z } from "zod";

const create = z.object({
  title: z.string({ required_error: "Title is Required" }),
});

export const specialtiesValidation = {
  create,
};
