import { generateToken, verifyToken } from '../utils/jwt.js';
import smsSender from '../utils/smsSender.js';
import mailer from '../utils/mailer.js';
import Customer from '../models/customerModel.js';
import { generateOTP, storeOTP, getOTP, deleteOTP } from '../utils/otpManager.js';

export async function loginWithMobile(mobile) {
  try {
    const otp = generateOTP();
    await smsSender.sendSMS(mobile, `Your OTP is ${otp}`);
    storeOTP(`otp:mobile:${mobile}`, otp);
    return otp;
  } catch (error) {
    console.error('Error in loginWithMobile service:', error);
    throw new Error('Failed to send OTP via SMS');
  }
}

export async function verifyMobileOTP(mobile, otp, res) {
  try {
    const storedOTP = getOTP(`otp:mobile:${mobile}`);
    if (!storedOTP || storedOTP !== otp) {
      throw new Error('Invalid OTP');
    }
    
    // Clear OTP after successful verification
    deleteOTP(`otp:mobile:${mobile}`);
    
    let user = await Customer.findOne({ mobile });
    if (!user) {
      user = await Customer.create({ mobile });
    }
    const token = generateToken({ id: user._id, role: user.role });
    const { password, ...rest } = user._doc;
    
    if (res) {
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json({ success: true, token, user: rest });
    }
    
    return { token, user: rest };
  } catch (error) {
    console.error('Error in verifyMobileOTP service:', error);
    if (error.message === 'Invalid OTP') {
      throw error;
    }
    throw new Error('Failed to verify OTP');
  }
}

export async function loginWithEmail(email) {
  try {
    const otp = generateOTP();
    await mailer.sendEmail(email, 'Your OTP', `Your OTP is ${otp}`);
    // Store OTP in Map with expiration
    storeOTP(`otp:email:${email}`, otp);
    return otp;
  } catch (error) {
    console.error('Error in loginWithEmail service:', error);
    throw new Error('Failed to send OTP via email');
  }
}

export async function verifyEmailOTP(email, otp) {
  try {
    // Validate OTP from Map
    const storedOTP = getOTP(`otp:email:${email}`);
    if (!storedOTP || storedOTP !== otp) {
      throw new Error('Invalid OTP');
    }
    
    // Clear OTP after successful verification
    deleteOTP(`otp:email:${email}`);
    
    let user = await Customer.findOne({ email });
    if (!user) {
      user = await Customer.create({ email });
    }

    const token = generateToken({ id: user._id, role: user.role });
    return { token, user };
  } catch (error) {
    console.error('Error in verifyEmailOTP service:', error);
    if (error.message === 'Invalid OTP') {
      throw error;
    }
    throw new Error('Failed to verify email OTP');
  }
}

export async function completeProfile(userId, profileData) {
  try {
    const user = await Customer.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    Object.assign(user, profileData);
    if (user.name && user.mobile && user.email && user.postalCode && user.location?.lat && user.location?.lng) {
      user.isProfileCompleted = true;
    }
    await user.save();
    return user;
  } catch (error) {
    console.error('Error in completeProfile service:', error);
    throw new Error('Failed to update profile');
  }
}
