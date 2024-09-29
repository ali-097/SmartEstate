// utils/mailer.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "alec.oberbrunner@ethereal.email",
    pass: "Ha3SB5gZsMbV4Kf1cx",
  },
  debug: true,
});

export const sendBidEmail = async (userEmail, bidDetails) => {
  const { name, email, phone, offer, occupants, message } = bidDetails;

  const messageText = `<li><strong>Message:</strong> ${message}</li>`;
  const occupantsText = `<li><strong>Occupants:</strong> ${occupants}</li>`;

  const mailOptions = {
    from: "alec.oberbrunner@ethereal.email",
    to: userEmail,
    subject: "New Bid Received for Your Property",
    html: `
        <html>
          <body>
            <h2>New Bid Received</h2>
            <p>Dear Seller,</p>
            <p>You have received a new bid for your property. Here are the details:</p>
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
};
