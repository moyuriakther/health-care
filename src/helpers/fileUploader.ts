import multer from "multer";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import { TCloudinaryResponse, TFile } from "../app/types/file";
import config from "../app/config";

// cloudinary.config({
//   cloud_name: "dgjb6pjns",
//   api_key: "874796688215515",
//   api_secret: "QTPtfCjiw7SHpyXup4c46Bhr-1c",
// });
cloudinary.config({
  cloud_name: config.cloud.cloudName,
  api_key: config.cloud.apiKey,
  api_secret: config.cloud.apiSecret,
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const uploadToCloudinary = async (
  file: TFile
): Promise<TCloudinaryResponse | undefined> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file.path,
      (error: Error, result: TCloudinaryResponse) => {
        fs.unlinkSync(file.path);
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};

export const fileUploader = {
  upload,
  uploadToCloudinary,
};
