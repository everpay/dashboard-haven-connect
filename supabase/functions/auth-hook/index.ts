
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// Initialize the Supabase client
const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

serve(async (req) => {
  const authEvent = await req.json();
  
  console.log("Auth webhook event:", JSON.stringify(authEvent, null, 2));

  try {
    switch (authEvent.type) {
      case "SIGNED_UP":
        // Handle user sign up
        await handleSignUp(authEvent.user);
        break;
        
      case "SIGNED_IN":
        // Handle user sign in
        await handleSignIn(authEvent.user);
        break;
        
      case "PASSWORD_RECOVERY":
        // Send password recovery email
        await sendPasswordRecoveryEmail(authEvent.user);
        break;
        
      default:
        console.log(`No handler for event type: ${authEvent.type}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing auth webhook:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

// Handler functions
async function handleSignUp(user) {
  console.log("Processing new user signup:", user.id);
  
  // You can add additional logic here like:
  // - Creating a welcome email
  // - Setting up default data for the user
  // - Adding the user to a default role
  
  try {
    // Call the send-email function to send a welcome email
    const result = await supabaseAdmin.functions.invoke("send-email", {
      body: {
        type: "confirmation",
        email: user.email,
        metadata: {
          username: getUserDisplayName(user),
          url: "https://everpayinc.com/welcome", // Replace with your actual welcome URL
        },
      },
    });
    
    console.log("Welcome email result:", result);
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
}

async function handleSignIn(user) {
  console.log("User signed in:", user.id);
  
  // You can add additional logic for sign-ins:
  // - Update last login timestamp
  // - Track sign-in activity
  // - Check for suspicious activity
}

async function sendPasswordRecoveryEmail(user) {
  console.log("Password recovery for user:", user.id);
  
  // The actual password reset email is handled by Supabase Auth
  // But you can log or add additional logic here
}

// Helper to get user display name from user object
function getUserDisplayName(user) {
  if (user.user_metadata?.full_name) {
    return user.user_metadata.full_name;
  } else if (user.user_metadata?.first_name) {
    return user.user_metadata.first_name;
  } else {
    return user.email.split('@')[0]; // Fallback to username from email
  }
}
