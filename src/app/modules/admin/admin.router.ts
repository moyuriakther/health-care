import { Router } from "express";
import { adminControllers } from "./admin.controller";

const router = Router();

router.get("/", adminControllers.getAllAdminFromDB);
router.get("/:id", adminControllers.getAdminById);
router.patch("/:id", adminControllers.updateAdmin);
router.delete("/:id", adminControllers.deleteAdmin);
router.delete("/soft/:id", adminControllers.softDeleteAdmin);

export const adminRouter = router;
