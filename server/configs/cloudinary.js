import { v2 as cloudinary } from "cloudinary";

const connectCloudinary = async () => {
  cloudinary.config(true);
};

export default connectCloudinary;