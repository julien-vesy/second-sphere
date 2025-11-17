import nodemailer from "nodemailer";

export const handler = async (event) => {
  try {
    const formData = event.body;

    // Netlify stocke les fichiers dans event.files
    const files = event.files || [];

    const transporter = nodemailer.createTransport({
      host: "smtp.example.com",
      port: 465,
      secure: true,
      auth: { user: "xxx", pass: "xxx" }
    });

    await transporter.sendMail({
      from: "contact@example.com",
      to: "julien.vesy@protonmail.com",
      subject: "Nouveau devis",
      text: "Un nouveau message.",
      attachments: files.map((f) => ({
        filename: f.filename,
        content: Buffer.from(f.content, "base64")
      }))
    });

    return {
      statusCode: 200,
      body: "OK"
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: err.toString()
    };
  }
};