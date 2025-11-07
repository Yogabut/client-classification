import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.78.0";
import { Resend } from "npm:resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  clientId: string;
  clientName: string;
  clientEmail: string;
  interactionType: string;
  interactionNote: string;
  userName: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      clientName,
      clientEmail,
      interactionType,
      interactionNote,
      userName,
    }: NotificationRequest = await req.json();

    console.log("Sending notification for:", { clientName, clientEmail, interactionType });

    const emailResponse = await resend.emails.send({
      from: "CRM System <onboarding@resend.dev>",
      to: [clientEmail],
      subject: `New ${interactionType} logged in your CRM`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Interaction Logged</h2>
          <p><strong>Client:</strong> ${clientName}</p>
          <p><strong>Type:</strong> ${interactionType}</p>
          <p><strong>Details:</strong></p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
            ${interactionNote}
          </div>
          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            Logged by: ${userName}
          </p>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending notification:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
