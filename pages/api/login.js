import dbConnect from "../../lib/dbConnect";
import Login from "../../models/Login";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    await dbConnect();

    const hashedPassword = await bcrypt.hash(password, 12);

    await Login.create({
      email,
      password: hashedPassword,
      createdAt: new Date()
    });

    return res.status(200).json({ message: "Saved" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
}