import { v2 as Cloudinary } from "cloudinary";
import fs from "fs";

Cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (
  localFilePath,
  path = "test-folder",
  res = "auto"
) => {
  try {
    if (!localFilePath) return null;
    const response = await Cloudinary.uploader.upload(localFilePath, {
      folder: path,
      resource_type: res,
      media_metadata: true,
    });
    console.log("file is uploaded on cloudinary ", response.url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return null;
  }
};

function extractPublicId(url) {
  const regex = /v\d+\/(.+?)\./;
  const match = url.match(regex);
  console.log(match, "this is match regex");
  return match ? match[1] : null;
}

const deleteFromCloudinary = async (url) => {
  const publicId = extractPublicId(url);
  if (!publicId) {
    console.error("Failed to extract public ID from URL");
    return;
  }
  try {
    const result = await Cloudinary.uploader.destroy(publicId);
    console.log("Image deleted:", result);
  } catch (error) {
    console.error("Failed to delete image:", error);
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };

/*
cloudinary.uploader.upload(
  "https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
  { public_id: "olympic_flag" },
  function (error, result) {
    console.log(result);
  }
);
*/
