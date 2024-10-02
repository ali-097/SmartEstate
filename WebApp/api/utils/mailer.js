import nodemailer from "nodemailer";
import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";

import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GoogleEmail,
    pass: process.env.GooglePassword,
  },
  debug: true,
});

export const sendBidEmail = async (userEmail, bidDetails, emailSeller) => {
  if (emailSeller) {
    const { name, email, phone, offer, occupants, message, listingRef } =
      bidDetails;

    const listing = await Listing.findOne({ _id: listingRef });

    const messageText = `<li><strong>Message:</strong> ${message}</li>`;
    const occupantsText = `<li><strong>Occupants:</strong> ${occupants}</li>`;

    const mailOptions = {
      from: process.env.GoogleEmail,
      to: userEmail,
      subject: "New Bid Received for Your Property",
      html: `
        <html>
          <body>
            <h2>New Bid Received</h2>
            <p>Dear Seller,</p>
           <p>You have received a new bid for your property <strong>${
             listing.name
           }</strong> located at <strong>${
        listing.address
      }</strong>. Here are the details:</p>
            <h3>Bid Details:</h3>
            <ul>
              <li><strong>Name:</strong> ${name}</li>
              <li><strong>Email:</strong> ${email}</li>
              <li><strong>Phone:</strong> ${phone}</li>
              <li><strong>Offer Amount:</strong> $${offer}</li>
              ${occupants === -1 ? "" : occupantsText}
              ${message === "Not specified" ? "" : messageText}
            </ul>
            <p>Thank you for considering this bid. If you have any questions or need further assistance, please feel free to reach out.</p>
            <p>Best regards,</p>
            <p>The Team</p>
          </body>
        </html>
      `,
    };
    return transporter.sendMail(mailOptions);
  } else {
    const { name, offer, listingRef } = bidDetails;
    const listing = await Listing.findOne({ _id: listingRef });
    const seller = await User.findOne({ _id: listing.userRef });

    const mailOptions = {
      from: process.env.GoogleEmail,
      to: userEmail,
      subject: "Congratulations! Your Bid Has Been Accepted",
      html: `
        <html>
          <body>
            <h2>Congratulations!</h2>
            <p>Dear ${name},</p>
            <p>We are pleased to inform you that your bid of Rs${offer} for the property <strong>${listing.name}</strong> located at <strong>${listing.address}</strong> has been accepted!</p>
            <p>You can contact the seller directly at <strong>${seller.email}</strong> or wait to be contacted regarding the next steps.</p>
            <p>If you have any other questions or need further assistance, please feel free to reach out.</p>
            <p>Best regards,</p>
            <p>The Team</p>
          </body>
        </html>
      `,
    };

    return transporter.sendMail(mailOptions);
  }
};
