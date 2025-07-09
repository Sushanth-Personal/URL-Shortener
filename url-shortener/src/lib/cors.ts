import { NextRequest, NextResponse } from "next/server";

// Define the handler function type
type Handler = (request: NextRequest) => Promise<NextResponse>;

export function withCors(handler: Handler) {
  return async (request: NextRequest) => {
    const response = await handler(request);
    response.headers.set(
      "Access-Control-Allow-Origin",
      process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000"
    );
    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,DELETE,OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type,Authorization"
    );
    return response;
  };
}