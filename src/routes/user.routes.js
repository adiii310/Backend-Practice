import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  registerUser,
  loginUser,
} from "../controllers/user.controller.js";

const router = Router();
router.route("/login").post(loginUser);

router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);

export default router;
