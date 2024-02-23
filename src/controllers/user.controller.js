import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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
  if (
    [userName, email, password, fullName].some((item) => item === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
 console.log(req.body)
  const existingUser = await User.findOne({
    $or: [{ userName, email }],
  });

  if (existingUser) {
    throw new ApiError(400, "User alerady Exits");
  }
  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    coverImageLocalPath = req.files.coverImage[0].path
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

export { registerUser };
