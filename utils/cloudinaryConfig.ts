import { config } from "dotenv"
config()
import {v2 as cloudinary} from "cloudinary"

cloudinary.config({
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
})

export {cloudinary}