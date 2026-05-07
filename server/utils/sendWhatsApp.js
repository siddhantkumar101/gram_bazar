const getWhatsAppClient = require("../config/whatsapp");

/**
 * Sends a WhatsApp message through Twilio API.
 * @param {string} to - Recipient phone number in E.164 format.
 * @param {string} body - Message body.
 * @returns {Promise<boolean>}
 */
const sendWhatsApp = async (to, body) => {
  const client = getWhatsAppClient();
  if (!client) {
    console.log("[WHATSAPP] Twilio not configured, skipping message");
    return false;
  }

  await client.messages.create({
    from: process.env.TWILIO_WHATSAPP_NUMBER,
    to: `whatsapp:${to}`,
    body
  });
  return true;
};

module.exports = sendWhatsApp;
