import dotenv from 'dotenv';
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

function replaceContent(content, userDetails) {
  let allKeys = Object.keys(userDetails);

  for (let i = 0; i < allKeys.length; i++) {
    let key = allKeys[i];
    content = content.replace(`#{${key}}`, userDetails[key]);
  }
  return content;
}

export async function EmailHelper(templateName, receiverEmail, userDetails) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const templatePath = path.join(__dirname, "email_templates", templateName);
  const content = fs.readFileSync(templatePath, "utf-8");

  try {
    const emailDetails = {
      from: process.env.SENDER_EMAIL, // sender address
      to: receiverEmail, // list of recipients
      subject: "Mail from BookMyShow", // subject line
      text: `Hi ${userDetails.name} this is your reset password OTP ${userDetails.otp}`,
      html: replaceContent(content, userDetails),
    };

    // Create a transporter using SMTP
    const transporter = nodemailer.createTransport({
      host: "smtp.sendgrid.net",
      port: 587,
      secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
      auth: {
        user: "apikey",
        pass: process.env.SENDGRID_API_KEY,
      },
    });

    const info = await transporter.sendMail(emailDetails);
    console.log("Email sent: %s", info.messageId);
  } catch (err) {
    console.error("Error while sending mail:", err);
  }
}
