import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessTokenAndRefershToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAcessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      error?.message ||
        "something went Wrong while generating access and refesh token"
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
    throw new ApiError(400, "User alerady Exits");
  }
  console.log(req.file)
  console.log("-------------------------------")
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
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) {
    throw new ApiError(400, "avater file not present");
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
    .json(new ApiResponse(200, createdUser, "User Registerd Sucessfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { userName, email, password, fullName } = req.body;
  if (!userName && !email)
    throw new ApiError(400, "UserName or Email id is required");

  const user = await User.findOne({ $or: [{ userName }, { email }] });

  if (!user) throw new ApiError(404, "User Doesnot exsist");

  const isValidPassword = await user.isPasswordCorrect(password);

  if (!isValidPassword) throw new ApiError(404, "Incorrect Password");

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefershToken(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken "
  );

  const options = {
    httpOnly: true, // Prevents access from client-side scripts
    secure: false, // Not needed for localhost
    sameSite: "Lax", // Allows cookies to be sent with top-level navigations
    path: "/", // Available for all paths
    domain: "localhost", // Set to localhost for development
  };

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
        "User loggedIn sucessFully"
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
  const options = {
    httpOnly: true,
    secure: true,
  };
  const user = User.findById(req.user._id);
  console.log(user);
  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "user logged out sucessfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh token not found");
  }

  const decodedInformatin = jwt.verify(
    incomingRefreshToken,
    process.env.SECRET_REFRESH_TOKEN
  );

  if (!decodedInformatin) {
    throw new ApiError(401, "token verification failed");
  }

  const user = await User.findById(decodedInformatin._id);

  if (!user) {
    throw new ApiError(401, "User doesnot exsist");
  }

  if (incomingRefreshToken !== user?.refreshToken) {
    throw new ApiError(401, "refresh token mismatch or expired");
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefershToken(user._id);

  console.log(accessToken);

  const options = {
    httpOnly: true,
    secure: true,
  };

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
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Password changed successfully"));
});

const changeAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar File not present");
  }
  const avatarurl = await User.findById(req.user._id);
  console.log(avatarurl.avatar + "--------------------------");
  await deleteFromCloudinary(avatarurl.avatar);
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) {
    throw new ApiError(500, "File doesnot upload on Cloudinary");
  }
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
    .json(new ApiResponse(200, { user }, "avatar updated sucessfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select(
    "-password -refreshToken"
  );
  const userName = user.userName;

  return res.status(200).json(new ApiResponse(200, { user }, "sucess"));
});

const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({},"-password -refreshToken");

    return res
      .status(200)
      .json(new ApiResponse(200,users,"all user"));
  } catch (error) {
    throw new ApiError(500, "An error occurred while retrieving users");
  }
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  changeAvatar,
  getAllUsers,
};
