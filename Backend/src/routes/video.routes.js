import { addVideo } from "../controllers/video.controller.js";
import { Router } from "express";
import { verifyjwt } from "../middlewares/user.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";


const Videorouter = Router();

Videorouter.route("/upload-video").post(verifyjwt,upload.single("videoToUpload"),addVideo)

export default Videorouter