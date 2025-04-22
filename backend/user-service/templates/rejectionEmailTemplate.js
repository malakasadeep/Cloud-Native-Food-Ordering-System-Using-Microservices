export const getRejectionEmailTemplate = (name, reason = 'Your application does not meet our current requirements.') => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
      <h2 style="color: #d32f2f; text-align: center;">Account Registration Status</h2>
      <p>Dear ${name},</p>
      <p>We regret to inform you that your account registration for the Food Delivery System has been rejected.</p>
      <p><strong>Reason:</strong> ${reason}</p>
      <p>If you believe this was done in error or have questions regarding this decision, please contact our support team.</p>
      <div style="text-align: center; margin-top: 30px; color: #777; font-size: 12px;">
        <p>Food Delivery System</p>
        <p>This is an automated email. Please do not reply to this message.</p>
      </div>
    </div>
  `;
};
