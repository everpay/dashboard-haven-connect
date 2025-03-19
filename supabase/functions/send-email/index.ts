
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { renderToString } from "https://esm.sh/react-dom@18.2.0/server";
import { createElement } from "https://esm.sh/react@18.2.0";
import { Resend } from "https://esm.sh/resend@1.0.0";

// Import email templates from relative paths
import { AuthMagicLinkEmail } from "../../../src/emails/auth-magic-link.tsx";
import { AuthConfirmationEmail } from "../../../src/emails/auth-confirmation.tsx";
import { AuthResetPasswordEmail } from "../../../src/emails/auth-reset-password.tsx";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: "magiclink" | "confirmation" | "resetpassword";
  email: string;
  metadata: {
    username?: string;
    url: string;
    token?: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, email, metadata } = await req.json() as EmailRequest;
    
    console.log(`Processing email request of type: ${type} for: ${email}`);

    let subject = "";
    let emailHtml = "";

    // Render the appropriate email template based on the type
    switch (type) {
      case "magiclink":
        subject = "Your Magic Link for Everpay";
        emailHtml = renderToString(
          createElement(AuthMagicLinkEmail, {
            loginUrl: metadata.url,
            username: metadata.username,
            token: metadata.token,
          })
        );
        break;
        
      case "confirmation":
        subject = "Confirm Your Everpay Account";
        emailHtml = renderToString(
          createElement(AuthConfirmationEmail, {
            confirmationUrl: metadata.url,
            username: metadata.username,
          })
        );
        break;
        
      case "resetpassword":
        subject = "Reset Your Everpay Password";
        emailHtml = renderToString(
          createElement(AuthResetPasswordEmail, {
            resetUrl: metadata.url,
            username: metadata.username,
          })
        );
        break;
        
      default:
        throw new Error(`Unsupported email type: ${type}`);
    }

    // Send the email via Resend
    const { data, error } = await resend.emails.send({
      from: "Everpay <no-reply@everpayinc.com>",
      to: [email],
      subject: subject,
      html: emailHtml,
    });

    if (error) {
      console.error("Error sending email:", error);
      throw error;
    }

    console.log("Email sent successfully:", data);
    
    return new Response(
      JSON.stringify({
        success: true,
        data,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error("Error in send-email function:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
});
