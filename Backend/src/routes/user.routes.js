import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  changeAvatar,
  getAllUsers,
  changeCoverImage,
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
router.route("/logout").post(verifyjwt, logoutUser);
router.route("/change-password").patch(verifyjwt, changeCurrentPassword);
router
  .route("/update-avatar")
  .patch(verifyjwt, upload.single("avatar"), changeAvatar);
router
  .route("/update-coverImage")
  .patch(verifyjwt, upload.single("coverImage"), changeCoverImage);
router.route("/current-user").get(verifyjwt, getCurrentUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/get-all-users").get(getAllUsers);

export default router;
