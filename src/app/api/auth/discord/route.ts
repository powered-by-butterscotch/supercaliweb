import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "No authorization code provided" }, { status: 400 });
  }

  const clientId = process.env.DISCORD_CLIENT_ID || "";
  const clientSecret = process.env.DISCORD_CLIENT_SECRET || "";
  
  // Use Vercel host dynamic URL fallback
  const host = request.headers.get("host") || "supercaliweb.vercel.app";
  const protocol = host.includes("localhost") ? "http" : "https";
  const redirectUri = `${protocol}://${host}/api/auth/discord`;

  try {
    // Exchange Authorization Code for Access Token
    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return NextResponse.json({ error: tokenData.error_description || "Token exchange failed" }, { status: 400 });
    }

    // Fetch user profile info from Discord
    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userData = await userResponse.json();
    const username = userData.username || "warga_sipil";

    // Determine target portal flow using state params
    const state = searchParams.get("state") || "warga";
    
    if (state === "admin") {
      return NextResponse.redirect(`${protocol}://${host}/dashboard?login_success=true&role=admin&user=${username}`);
    } else if (state === "staff") {
      return NextResponse.redirect(`${protocol}://${host}/dashboard?login_success=true&role=dinas&user=${username}`);
    } else {
      return NextResponse.redirect(`${protocol}://${host}/dashboard/apply?role=warga&user=${username}`);
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal auth failure" }, { status: 500 });
  }
}
