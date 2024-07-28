import nodemailer from "nodemailer"

let transporter=nodemailer.createTransport({
    host: "smtp.zoho.in",
    secure: true,
    port: 465,
    auth: {
        user: process.env.ZOHO_USER,
        pass: process.env.ZOHO_PASS,
    }
})


export const sendEmail=async (mailOptions: {from: string, to: string, subject: string, text: string})=>{
    const mail= await transporter.sendMail(mailOptions)
    return mail;
}