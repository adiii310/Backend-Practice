import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { options } from "../constants.js";

const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAcesToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      error?.message ||
        "something went Wrong while generating access and refresh token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation - not empty
  // check if user already exists: username, email
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res

  const { userName, email, password, fullName } = req.body;
  if ([userName, email, password, fullName].some((item) => item === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({
    $or: [{ userName, email }],
  });

  if (existingUser) {
    throw new ApiError(400, "User already Exits");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;A

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar file not present");
  }
  const coverImage = await uploadOnCloudinary(
    coverImageLocalPath,
    "test-folder/images",
    "image"
  );

  const avatar = await uploadOnCloudinary(
    avatarLocalPath,
    "test-folder/images",
    "image"
  );
  if (!avatar) {
    throw new ApiError(400, "avatar file not present");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    password,
    email,
    userName: userName.toLowerCase(),
  });
  const createdUser = await User.findById(user._id).select(
    " -password -refreshToken "
  );
  if (!createdUser) throw new ApiError(400, "User Not Created");
  return res
    .status(200)
    .json(new ApiResponse(200, createdUser, "User Register Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { userName, email, password, fullName } = req.body;
  if (!userName && !email)
    throw new ApiError(400, "UserName or Email id is required");

  const user = await User.findOne({ $or: [{ userName }, { email }] });

  if (!user) throw new ApiError(404, "User doesn't exist");

  const isValidPassword = await user.isPasswordCorrect(password);

  if (!isValidPassword) throw new ApiError(404, "Incorrect Password");

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken "
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User loggedIn successFully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    { new: true }
  );

  const user = User.findById(req.user._id);

  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "user logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh token not found");
  }

  const decodedInformation = jwt.verify(
    incomingRefreshToken,
    process.env.SECRET_REFRESH_TOKEN
  );

  if (!decodedInformation) {
    throw new ApiError(401, "token verification failed");
  }

  const user = await User.findById(decodedInformation._id);

  if (!user) {
    throw new ApiError(401, "User doesn't exist");
  }

  if (incomingRefreshToken !== user?.refreshToken) {
    throw new ApiError(401, "refresh token mismatch or expired");
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, { user, accessToken, refreshToken }));
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, "Password changed successfully"));
});

const changeAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar File not present");
  }
  const currentUser = await User.findById(req.user._id);
  const avatar = await uploadOnCloudinary(
    avatarLocalPath,
    "test-folder/images",
    "image"
  );
  if (!avatar) {
    throw new ApiError(500, "File doesn't upload on Cloudinary");
  }
  await deleteFromCloudinary(currentUser.avatar);
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        avatar: avatar?.url,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "avatar updated successfully"));
});

const changeCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file.path;

  if (!coverImageLocalPath) {
    throw new ApiError(400, "avatar File not present");
  }
  const currentUser = await User.findById(req.user._id);
  const coverImage = await uploadOnCloudinary(
    avatarLocalPath,
    "test-folder/images",
    "image"
  );
  if (!coverImage) {
    throw new ApiError(500, "File doesn't upload on Cloudinary");
  }
  await deleteFromCloudinary(currentUser.coverImage);
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        coverImage: coverImage?.url,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "avatar updated successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select(
    "-password -refreshToken"
  );
  const userName = user.userName;

  return res.status(200).json(new ApiResponse(200, { user }, "success"));
});

const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({}, "-password -refreshToken");

    return res.status(200).json(new ApiResponse(200, users, "all user"));
  } catch (error) {
    throw new ApiError(500, "An error occurred while retrieving users");
  }
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { userName } = req.params;

  if (!userName?.trim()) {
    throw new ApiError(400, "Username is missing");
  }

  const channel = await User.aggregate([
    {
      $match: {
        userName: userName?.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribed_to",
      },
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        subscribedTo: {
          $size: "$subscribed_to",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullName: 1,
        userName: 1,
        avatar: 1,
        coverImage: 1,
        email: 1,
        subscribersCount: 1,
        subscribedTo: 1,
        isSubscribed: 1,
      },
    },
  ]);

  console.log(channel);

  if (!channel?.length) {
    throw new ApiError(400, "channel doesn't exist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, channel[0], "userChannel fetched successfully"));
});
export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  changeAvatar,
  changeCoverImage,
  getAllUsers,
  getUserChannelProfile,
};
