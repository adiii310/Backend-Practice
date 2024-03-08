import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const addVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const videoToUploadLocalPath = req.file.path;

  if (!title) throw new ApiError(500, "title is required");

  if (!description) throw new ApiError(500, "description is reqiried");

  if(!videoToUploadLocalPath) throw new ApiError(400, "video is requuired")

   const videoToUpload =  await uploadOnCloudinary(videoToUploadLocalPath)

  const video = await Video.create({
    title,
    description,
    videoToUpload:videoToUpload.url
  });

  const user = await User.findById(req.user._id);

  user.watchHistory.push(video._id);
  await user.save();

  return res.status(200).json(new ApiResponse(200, video, "video is created"));
});
