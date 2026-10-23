import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const SENDGRID_API_KEY =
  "SG.0QZFU-LPSeiopWySU...";

const SENDER_EMAIL = "example@mail.com";

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
      from: SENDER_EMAIL, // sender address
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
        pass: SENDGRID_API_KEY,
      },
    });

    const info = await transporter.sendMail(emailDetails);
    console.log("Email sent: %s", info.messageId);
  } catch (err) {
    console.error("Error while sending mail:", err);
  }
}
