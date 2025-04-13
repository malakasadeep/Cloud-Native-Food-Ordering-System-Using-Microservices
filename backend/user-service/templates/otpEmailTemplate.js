export const getOtpEmailTemplate = (otpCode) => {
  return `
 <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FoodHub - Your OTP Code</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      color: #4A4A4A;
      background-color: #F2F0EA;
      margin: 0;
      padding: 20px;
      line-height: 1.6;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #FFFFFF;
      border-radius: 8px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
      overflow: hidden;
    }
    .header {
      background-color: #FF7043;
      padding: 25px 30px;
      text-align: center;
      border-bottom: 1px solid #E8E6E0;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #FFFFFF;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    .logo-img {
      max-height: 60px;
      margin-bottom: 10px;
    }
    .content {
      padding: 40px 30px;
    }
    .greeting {
      font-size: 22px;
      margin-bottom: 20px;
      color: #3A3A3A;
      font-weight: 600;
    }
    .message {
      margin-bottom: 25px;
      font-size: 16px;
      color: #555555;
    }
    .otp-container {
      text-align: center;
      margin: 35px 0;
    }
    .otp-code {
      display: inline-block;
      padding: 15px 30px;
      background-color: #F2F0EA;
      color: #3A3A3A;
      font-size: 28px;
      font-weight: bold;
      letter-spacing: 5px;
      border-radius: 6px;
      border: 1px dashed #E8E6E0;
    }
    .expiry-note {
      text-align: center;
      font-size: 14px;
      color: #8A8A8A;
      margin-top: 20px;
    }
    .divider {
      height: 1px;
      background-color: #E8E6E0;
      margin: 30px 0;
    }
    .help-text {
      font-size: 14px;
      color: #6B6B6B;
      margin-bottom: 15px;
    }
    .note {
      font-style: italic;
      margin-top: 30px;
      font-size: 14px;
      color: #8A8A8A;
    }
    .signature {
      margin-top: 30px;
    }
    .footer {
      background-color: #F2F0EA;
      padding: 25px 30px;
      text-align: center;
      font-size: 14px;
      color: #6B6B6B;
      border-top: 1px solid #E8E6E0;
    }
    .social-links {
      margin-top: 15px;
      margin-bottom: 15px;
    }
    .social-link {
      display: inline-block;
      margin: 0 8px;
      color: #3A3A3A;
      text-decoration: none;
    }
    @media only screen and (max-width: 600px) {
      .container {
        width: 100%;
      }
      .content, .header, .footer {
        padding: 20px 15px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <!-- Optional: Add your logo image here -->
      <!-- <img src="your-logo-url.png" alt="FoodHub" class="logo-img"> -->
      <div class="logo">FoodHub</div>
    </div>
    <div class="content">
      <div class="greeting">Your One-Time Password (OTP)</div>
      <div class="message">
        Thank you for using FoodHub! To complete your verification process, please use the following OTP code:
      </div>
      <div class="otp-container">
        <div class="otp-code">${otpCode}</div>
        <div class="expiry-note">This OTP code will expire in 10 minutes</div>
      </div>
      <div class="divider"></div>
      <div class="help-text">Enter this code in the verification form to complete the process.</div>
      <div class="note">
        If you didn't request this OTP, you can safely ignore this email. Someone might have entered your email address by mistake.
      </div>
      <div class="signature">
        Enjoy your meal!<br>
        <strong>The FoodHub Team</strong>
      </div>
    </div>
    <div class="footer">
      <div class="social-links">
        <!-- Social media links - replace # with your actual social media URLs -->
        <a href="#" class="social-link">Instagram</a> •
        <a href="#" class="social-link">Facebook</a> •
        <a href="#" class="social-link">Twitter</a>
      </div>
      <div>
        Questions? Contact us at <a href="mailto:support@foodhub.com" style="color: #3A3A3A;">support@foodhub.com</a>
      </div>
      <div style="margin-top: 15px;">
        &copy; 2023 FoodHub. All rights reserved.
      </div>
    </div>
  </div>
</body>
</html>
    `;
};
