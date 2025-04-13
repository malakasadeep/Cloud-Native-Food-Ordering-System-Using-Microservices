// OTP Manager - In-memory OTP storage and verification

// Create an in-memory Map to store OTPs
const otpStore = new Map();
const OTP_EXPIRY = 10 * 60;

/**
 * Generates a 6-digit OTP
 * @returns {string} 6-digit OTP
 */
export const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

/**
 * Stores an OTP with expiration time
 * @param {string} key - Unique key (usually contains identifier like email/phone)
 * @param {string} otp - The OTP to store
 */
export const storeOTP = (key, otp) => {
  otpStore.set(key, {
    value: otp,
    expiresAt: Date.now() + OTP_EXPIRY * 1000
  });
};

/**
 * Retrieves an OTP if it exists and is not expired
 * @param {string} key - The key used to store the OTP
 * @returns {string|null} - The OTP if valid, null otherwise
 */
export const getOTP = (key) => {
  const otpData = otpStore.get(key);
  if (!otpData) return null;
  
  if (Date.now() > otpData.expiresAt) {
    otpStore.delete(key);
    return null;
  }
  
  return otpData.value;
};

/**
 * Deletes an OTP from the store
 * @param {string} key - The key used to store the OTP
 */
export const deleteOTP = (key) => {
  otpStore.delete(key);
};
