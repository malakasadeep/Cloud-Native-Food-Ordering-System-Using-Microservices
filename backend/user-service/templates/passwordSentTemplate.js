/**
 * Email template for sending auto-generated password when user account is approved
 */
export function getPasswordEmailTemplate(userName, password) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Account Approved</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .container {
          border: 1px solid #ddd;
          border-radius: 5px;
          padding: 20px;
        }
        .header {
          background-color: #4CAF50;
          color: white;
          padding: 10px;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }
        .footer {
          font-size: 12px;
          text-align: center;
          margin-top: 20px;
          color: #777;
        }
        .password-box {
          background-color: #f8f8f8;
          border: 1px dashed #ccc;
          border-radius: 4px;
          padding: 10px;
          margin: 15px 0;
          text-align: center;
          font-family: monospace;
          font-size: 18px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Account Approved</h2>
        </div>
        
        <p>Dear ${userName},</p>
        
        <p>Congratulations! Your account has been approved for our Food Delivery System.</p>
        
        <p>We have generated a temporary password for your account. Please use this password to log in:</p>
        
        <div class="password-box">
          <strong>${password}</strong>
        </div>
        
        <p><strong>Important:</strong> For security reasons, we recommend changing your password after your first login.</p>
        
        <p>If you have any questions or need assistance, please contact our support team.</p>
        
        <p>Thank you for choosing our service!</p>
        
        <p>Best regards,<br>
        Food Delivery System Team</p>
      </div>
      
      <div class="footer">
        <p>This is an automated message. Please do not reply to this email.</p>
      </div>
    </body>
    </html>
  `;
}
