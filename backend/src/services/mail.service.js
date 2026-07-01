const nodemailer = require("nodemailer");

const getTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("Email service is not configured");
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const buildOtpTemplate = ({ otp, purpose, expiryMinutes }) => {
  const title = purpose === "reset" ? "Reset your password" : "Verify your email";
  const intro = purpose === "reset"
    ? "Use this one-time password to continue resetting your JobSearch account password."
    : "Use this one-time password to verify your email and finish creating your JobSearch account.";

  return `
    <div style="margin:0;padding:32px;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;color:#172033;">
      <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e6ebf2;">
        <div style="padding:26px 30px;background:#0f172a;color:#ffffff;">
          <div style="font-size:13px;letter-spacing:0.16em;text-transform:uppercase;opacity:0.75;">JobSearch</div>
          <h1 style="margin:10px 0 0;font-size:24px;line-height:1.25;">${title}</h1>
        </div>
        <div style="padding:30px;">
          <div style="width:58px;height:58px;border-radius:16px;background:#eef8f2;color:#15803d;display:flex;align-items:center;justify-content:center;font-weight:800;margin-bottom:18px;">LOGO</div>
          <p style="font-size:16px;line-height:1.6;margin:0 0 18px;">${intro}</p>
          <div style="letter-spacing:0.42em;font-size:34px;font-weight:800;text-align:center;background:#f8fafc;border:1px dashed #cbd5e1;border-radius:14px;padding:20px 12px;margin:24px 0;color:#0f172a;">${otp}</div>
          <p style="font-size:14px;line-height:1.6;margin:0 0 12px;color:#475569;">This OTP expires in <strong>${expiryMinutes} minutes</strong>.</p>
          <p style="font-size:13px;line-height:1.6;margin:0;color:#64748b;">For your security, never share this code with anyone. JobSearch will never ask for your OTP outside the verification screen.</p>
        </div>
      </div>
    </div>
  `;
};

exports.sendOtpEmail = async ({ email, otp, purpose, expiryMinutes }) => {
  const transporter = getTransporter();
  const subject = purpose === "reset" ? "JobSearch password reset OTP" : "JobSearch email verification OTP";

  await transporter.sendMail({
    from: `"JobSearch" <${process.env.EMAIL_USER}>`,
    to: email,
    subject,
    html: buildOtpTemplate({ otp, purpose, expiryMinutes }),
  });
};
