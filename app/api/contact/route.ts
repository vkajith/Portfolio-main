import nodemailer from "nodemailer";

interface RequestBody {
    name: string;
    email: string;
    message: string;
}

interface MailOptions {
    from: string;
    to: string | undefined;
    subject: string;
    text: string;
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body: RequestBody = await request.json();
    const { name, email, message } = body;

    // Basic payload validation
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: name, email, message" }),
        { status: 400 }
      );
    }

    // Env validation
    const EMAIL_USER = process.env.EMAIL_USER;
    const EMAIL_PASS = process.env.EMAIL_PASS;
    const EMAIL_TO = process.env.EMAIL_TO || EMAIL_USER;
    const EMAIL_FROM = process.env.EMAIL_FROM || EMAIL_USER;

    if (!EMAIL_USER || !EMAIL_PASS || !EMAIL_TO) {
      return new Response(
        JSON.stringify({ error: "Email configuration is missing. Set EMAIL_USER, EMAIL_PASS, EMAIL_TO." }),
        { status: 500 }
      );
    }

    // Nodemailer configuration (Gmail requires App Password or OAuth2)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    // Verify transport early for clearer errors
    await transporter.verify();

    // Safer headers: send from authenticated user, set reply-to to visitor
    const mailOptions: MailOptions & { replyTo?: string; html?: string } = {
      from: EMAIL_FROM as string,
      to: EMAIL_TO,
      subject: `New message from ${name}`,
      text: `Message: ${message}\n\nFrom: ${name} <${email}>`,
      html: `<p><strong>From:</strong> ${name} &lt;${email}&gt;</p><p><strong>Message:</strong></p><p>${message.replace(
        /\n/g,
        "<br/>"
      )}</p>`,
      replyTo: email,
    };

    await transporter.sendMail(mailOptions);

    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully" }),
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error sending email:", message);
    return new Response(
      JSON.stringify({ error: message || "Failed to send email" }),
      { status: 500 }
    );
  }
}