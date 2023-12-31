import { NextResponse } from "next/server";
// supabase
import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";
// types
import type { NextRequest } from "next/server";

export const middleware = async (req: NextRequest) => {
  const res = NextResponse.next();
  const supabase = createMiddlewareSupabaseClient({ req, res });
  const redirectUrl = req.nextUrl.clone();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    return res;
  }

  if (!session) {
    redirectUrl.pathname = "/login";
    return NextResponse.redirect(redirectUrl);
  }

  return res;
};

export const config = {
  matcher: ["/", "/dashboard"],
};
