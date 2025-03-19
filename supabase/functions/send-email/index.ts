
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resendApiKey = Deno.env.get("RESEND_API_KEY");
if (!resendApiKey) {
  throw new Error("RESEND_API_KEY is not set");
}

const resend = new Resend(resendApiKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: string;
  email: string;
  metadata?: any;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, email, metadata = {} }: EmailRequest = await req.json();
    console.log(`Processing ${type} email for ${email}`);

    let emailResponse;
    let subject = "";
    let html = "";

    const baseUrl = "https://everpayinc.com"; // Replace with your actual domain
    const username = metadata.username || email.split("@")[0];

    switch (type) {
      case "confirmation":
        subject = "Welcome to Everpay - Please confirm your email";
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #1AA47B;">Welcome to Everpay!</h1>
            <p>Hello ${username},</p>
            <p>Thank you for signing up for Everpay! We're excited to have you on board.</p>
            <p>Click the link below to confirm your email address:</p>
            <a href="${metadata.url || `${baseUrl}/confirm-email`}" style="display: inline-block; background-color: #1AA47B; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0;">Confirm your email</a>
            <p>If you didn't sign up for an Everpay account, you can safely ignore this email.</p>
            <p>Best regards,<br>The Everpay Team</p>
          </div>
        `;
        break;

      case "magic_link":
        subject = "Your magic link to sign in to Everpay";
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #1AA47B;">Sign in to Everpay</h1>
            <p>Hello ${username},</p>
            <p>Click the link below to sign in to your Everpay account:</p>
            <a href="${metadata.url || `${baseUrl}/magic-link?token=${metadata.token}`}" style="display: inline-block; background-color: #1AA47B; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0;">Sign in to Everpay</a>
            <p>If you didn't request this email, you can safely ignore it.</p>
            <p>Best regards,<br>The Everpay Team</p>
          </div>
        `;
        break;

      case "reset_password":
        subject = "Reset your Everpay password";
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #1AA47B;">Reset your password</h1>
            <p>Hello ${username},</p>
            <p>We received a request to reset your Everpay account password. Click the link below to set a new password:</p>
            <a href="${metadata.url || `${baseUrl}/reset-password?token=${metadata.token}`}" style="display: inline-block; background-color: #1AA47B; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0;">Reset password</a>
            <p>If you didn't request a password reset, you can safely ignore this email.</p>
            <p>Best regards,<br>The Everpay Team</p>
          </div>
        `;
        break;

      case "transaction_receipt":
        subject = "Your Everpay Transaction Receipt";
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #1AA47B;">Transaction Receipt</h1>
            <p>Hello ${username},</p>
            <p>Your transaction has been completed successfully.</p>
            <div style="border: 1px solid #ddd; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <p><strong>Transaction ID:</strong> ${metadata.transactionId || 'N/A'}</p>
              <p><strong>Amount:</strong> ${metadata.amount ? `$${metadata.amount.toFixed(2)}` : 'N/A'}</p>
              <p><strong>Date:</strong> ${metadata.date || new Date().toLocaleDateString()}</p>
              <p><strong>Description:</strong> ${metadata.description || 'Payment'}</p>
            </div>
            <p>Thank you for using Everpay!</p>
            <p>Best regards,<br>The Everpay Team</p>
          </div>
        `;
        break;

      default:
        return new Response(
          JSON.stringify({ error: `Email type '${type}' not supported` }),
          {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
    }

    emailResponse = await resend.emails.send({
      from: "Everpay <notifications@everpayinc.com>",
      to: [email],
      subject: subject,
      html: html,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, data: emailResponse }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
