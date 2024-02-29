import { v2 as Cloudinary } from "cloudinary";
import fs from "fs";

Cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    //upload the file on cloudinary
    const response = await Cloudinary.uploader.upload(localFilePath, {
      folder: "test-folder",
      resource_type: "auto",
    });
    // file has been uploaded successfull
    console.log("file is uploaded on cloudinary ", response.url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
    return null;
  }
};

function extractPublicId(url) {
  const regex =/v\d+\/(.+?)\./;
  const match = url.match(regex);
  console.log(match, "thisis mathc aldf")
  return match ? match[1] : null;
}
const deleteFromCloudinary = async (url) => {
  const publicId = extractPublicId(url);
  console.log(publicId + " this is public id")
  if (!publicId) {
     console.error('Failed to extract public ID from URL');
     return;
  }
  try {
    const result = await Cloudinary.uploader.destroy(publicId);
    console.log("Image deleted:", result);
  } catch (error) {
    console.error("Failed to delete image:", error);
  }
};

export { uploadOnCloudinary ,deleteFromCloudinary };

/*
cloudinary.uploader.upload(
  "https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
  { public_id: "olympic_flag" },
  function (error, result) {
    console.log(result);
  }
);
*/
