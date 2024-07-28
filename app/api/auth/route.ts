// import Router from "express"
// import {users} from "@/database/schema/user.ts"
// import passport from "passport"
// import cloudinary from "cloudinary"
// import Multer, { memoryStorage } from "multer"
// import dotenv from "dotenv"

// import helper from "@/utils/helper.ts"
// import config from "../config.ts"

// dotenv.config();
// const router = Router();
// cloudinary.v2.config({
//   cloud_name: config.cloudinary.cloud_name,
//   api_key: config.cloudinary.key,
//   api_secret: config.cloudinary.secret,
// })
// async function handleUpload(file: any) {
//   const res = await cloudinary.v2.uploader.upload(file, {
//     "resource_type": "image",
//   });
//   return res;
// }

// const storage = Multer.memoryStorage()
// const upload = Multer({
//   storage,
// })

// router.post("/login", passport.authenticate('local'), (req: any, res: any) => {
//   console.log(typeof req, typeof res)
//   console.log("loggin successful");
//   res.send(200)
// })

// router.post("/register", upload.single("image"), async (req: any, res: any) => {
//   console.log(req.file)
//   const { password, email, firstName, lastName, usersName }: { password: string, email: string, firstName: string, lastName: string, usersName: string } = req.body;
//   console.log(req.body)
//   if (password && email && firstName && lastName && usersName) {

//     // let media = req.files.media
//     // const result=await cloudinary.v2.uploader.upload(media.tempFilePath, {
//     //   folder: "userss"
//     // })
//     const usersDb = await users.findOne({ email });
//     if (usersDb) {
//       res.status(400).send("users already registered");
//     }
//     else {
//       let result;
//       if (req.file){
//         try {
//           const b64 = Buffer.from(req.file.buffer).toString("base64");
//           let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
//           const cldRes = await cloudinary.v2.uploader.upload(dataURI, { folder: "userss", use_filename: true });
//           result = cldRes;
//           console.log("success",typeof cldRes.secure_url)
//         }
//         catch (err) {
//           console.log('error is:', err);
//           res.send(err)
//         }
//       }
//       const hashedPassword = helper.hashPassword(password);
//       const newusers = await users.create({ password: hashedPassword, email, firstName, lastName, image: result?.secure_url, usersName });
//       console.log(newusers)
//       res.send(newusers);
//     }
//   }
//   else {
//     res.send(400)
//   }
// })

// router.get('/google',
//   passport.authenticate('google', { scope: ['profile'] }));

// router.get('/google/callback', 
//   passport.authenticate('google', { failureRedirect: '/login' }),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     res.redirect('/');
//   });

// export default router
// // module.exports = router