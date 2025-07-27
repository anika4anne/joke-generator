import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

interface FeatureRequest {
  name: string;
  email: string;
  featureTitle: string;
  featureDescription: string;
  category: string;
  priority: string;
  additionalInfo: string;
}

export async function POST(request: NextRequest) {
  try {
    const data = (await request.json()) as FeatureRequest;

    if (
      !process.env.SMTP_HOST ||
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASS
    ) {
      console.error("Missing SMTP environment variables");
      return NextResponse.json(
        { success: false, message: "Email configuration missing" },
        { status: 500 },
      );
    }

    console.log("SMTP Configuration:", {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS ? "***" : "NOT SET",
    });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT ?? "465"),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    try {
      await transporter.verify();
      console.log("SMTP connection verified successfully");
    } catch (verifyError) {
      console.error("SMTP verification failed:", verifyError);

      console.log("Trying alternative SMTP configuration (port 587)...");
      const altTransporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      try {
        await altTransporter.verify();
        console.log("Alternative SMTP connection verified successfully");

        Object.assign(transporter, altTransporter);
      } catch (altVerifyError) {
        console.error(
          "Alternative SMTP verification also failed:",
          altVerifyError,
        );
        return NextResponse.json(
          {
            success: false,
            message:
              "Email server connection failed. Please check your Gmail App Password and ensure 2-Step Verification is enabled.",
          },
          { status: 500 },
        );
      }
    }

    const emailContent = `
🎯 New Feature Request from Joke Generator

👤 Contact Information:
   Name: ${data.name}
   Email: ${data.email}

📝 Feature Details:
   Title: ${data.featureTitle}
   Category: ${data.category ?? "Not specified"}
   Priority: ${data.priority}

📄 Description:
${data.featureDescription}

💡 Additional Information:
${data.additionalInfo ?? "None provided"}

---
⏰ Submitted at: ${new Date().toLocaleString()}
🌐 From: Joke Generator Feature Request Form
    `;

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER, // Send to yourself
      subject: `🎯 New Feature Request: ${data.featureTitle}`,
      text: emailContent,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #06b6d4;">🎯 New Feature Request from Joke Generator</h2>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">👤 Contact Information</h3>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">📝 Feature Details</h3>
            <p><strong>Title:</strong> ${data.featureTitle}</p>
            <p><strong>Category:</strong> ${data.category ?? "Not specified"}</p>
            <p><strong>Priority:</strong> ${data.priority}</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">📄 Description</h3>
            <p style="white-space: pre-wrap;">${data.featureDescription}</p>
          </div>
          
          ${
            data.additionalInfo
              ? `
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">💡 Additional Information</h3>
            <p style="white-space: pre-wrap;">${data.additionalInfo}</p>
          </div>
          `
              : ""
          }
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          <p style="color: #6b7280; font-size: 14px;">
            ⏰ Submitted at: ${new Date().toLocaleString()}<br>
            🌐 From: Joke Generator Feature Request Form
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log(
      "Feature request email sent successfully to:",
      process.env.SMTP_USER,
    );

    return NextResponse.json({
      success: true,
      message: "Feature request submitted successfully",
    });
  } catch (error) {
    console.error("Error sending feature request email:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit feature request" },
      { status: 500 },
    );
  }
}
