import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken
} from "../controllers/user.controller.js";
import { verifyjwt } from "../middlewares/user.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
  );
  router.route("/login").post(loginUser);

  // secured Routes
  router.route("/logout").post(verifyjwt,logoutUser)
  router.route("/refresh-token").post(refreshAccessToken)

export default router;
