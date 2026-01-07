import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  
  // Clear all Supabase and auth-related cookies
  allCookies.forEach(cookie => {
    if (
      cookie.name.startsWith('sb-') || 
      cookie.name.includes('supabase') || 
      cookie.name.includes('auth-token') ||
      cookie.name.includes('session')
    ) {
      cookieStore.delete(cookie.name);
    }
  });

  return NextResponse.json({ 
    success: true, 
    message: "Cookies cleared successfully" 
  });
}

