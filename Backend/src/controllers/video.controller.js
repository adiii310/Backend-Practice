import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // TODO: get video, upload to cloudinary, create video
  if ([title, description].some((item) => item.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }
  const videoLocalFile = req.files?.videoFile[0]?.path;
  const thumbnailLocalFile = req.files?.thumbnail[0].path;

  if (!videoLocalFile || !thumbnailLocalFile) {
    throw new ApiError(400, "videos and thumbnail not found");
  }

  const videoFileOnCloudinary = await uploadOnCloudinary(
    videoLocalFile,
    "test-folder/videos",
    "video"
  );
  const thumbnailFileOnCloudinary = await uploadOnCloudinary(
    thumbnailLocalFile,
    "test-folder/videos/thumbnail",
    "image"
  );

  if (!videoFileOnCloudinary || !thumbnailFileOnCloudinary) {
    throw new ApiError("500", "video or thumbnail not uploaded  properly");
  }

  const video = await Video.create({
    videoFile: videoFileOnCloudinary?.url,
    thumbnail: thumbnailFileOnCloudinary?.url,
    title,
    description,
    duration: videoFileOnCloudinary.duration,
    owner: req.user._id,
  });

  const createdVideo = await Video.findById(video._id);

  if (!createdVideo) throw new ApiError("500", "video schema not created");

  return res.status(200).json(new ApiResponse("200", createdVideo));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
