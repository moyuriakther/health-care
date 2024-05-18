import { UserStatus } from "@prisma/client";
import { z } from "zod";

const createAdmin = z.object({
  password: z.string({
    required_error: "Password is required",
  }),
  admin: z.object({
    name: z.string({
      required_error: "Name is required!",
    }),
    email: z.string({
      required_error: "Email is required!",
    }),
    contactNumber: z.string({
      required_error: "Contact Number is required!",
    }),
  }),
});

const createDoctor = z.object({
  password: z.string({
    required_error: "Password is required",
  }),
  doctor: z.object({
    name: z.string({
      required_error: "Name is required!",
    }),
    email: z.string({
      required_error: "Email is required!",
    }),
    address: z
      .string({
        required_error: "Address is required!",
      })
      .optional(),
    experience: z
      .number({
        required_error: "Experience is required!",
      })
      .optional(),
    contactNumber: z.string({
      required_error: "Contact Number is required!",
    }),
    registrationNumber: z.string({
      required_error: "RegistrationNumber is required",
    }),
    gender: z.string({
      required_error: "Gender is required",
    }),
    appointmentFee: z.number({
      required_error: "Appointment Fee is required",
    }),
    qualification: z.string({
      required_error: "Qualification is required",
    }),
    currentWorkingPlace: z.string({
      required_error: "Current Working Place is required",
    }),
    designation: z.string({
      required_error: "Designation is required",
    }),
  }),
});
const createPatient = z.object({
  password: z.string({
    required_error: "Password is required",
  }),
  patient: z.object({
    name: z.string({
      required_error: "Name is required!",
    }),
    email: z.string({
      required_error: "Email is required!",
    }),
    contactNumber: z.string().optional(),
    address: z.string().optional(),
  }),
});

const updateUserStatus = z.object({
  body: z.object({
    status: z.enum([UserStatus.active, UserStatus.blocked, UserStatus.deleted]),
  }),
});

export const userValidation = {
  createAdmin,
  createDoctor,
  createPatient,
  updateUserStatus,
};
