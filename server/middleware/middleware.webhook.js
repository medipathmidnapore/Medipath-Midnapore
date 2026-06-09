/**
 * Webhook secret validation middleware.
 * The hospital LIS must send the shared secret as x-webhook-secret header.
 */
const validateWebhookSecret = (req, res, next) => {
  const secret = req.headers['x-webhook-secret'];

  if (!secret || secret !== process.env.WEBHOOK_SECRET) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid or missing webhook secret.',
    });
  }

  next();
};

export default validateWebhookSecret;
