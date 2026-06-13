/**
 * Verifies a Google reCAPTCHA v2 token.
 * 
 * @param {string} token - The token received from the client.
 * @returns {Promise<boolean>} - True if valid, false otherwise.
 */
export async function verifyRecaptcha(token) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  
  if (!secretKey) {
    console.warn('RECAPTCHA_SECRET_KEY is not defined in .env. Skipping CAPTCHA verification.');
    return true; // If no key is configured, let it pass (useful for dev/testing before keys are ready)
  }

  if (!token) return false;

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
      }),
    });

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error('Error verifying reCAPTCHA:', error.message);
    return false;
  }
}
