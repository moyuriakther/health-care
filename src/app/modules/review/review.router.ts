import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { reviewController } from "./review.controller";
import validateRequest from "../../middlewares/validateRequest";
import { reviewValidation } from "./review.validation";

const router = Router();

router.get("/", reviewController.getAllFromDB),
  router.post(
    "/",
    auth(UserRole.patient),
    validateRequest(reviewValidation.createReviewValidation),
    reviewController.insertReviewIntoDB
  );
export const ReviewRouter = router;
