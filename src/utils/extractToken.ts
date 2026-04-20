export function extractToken(cookieString?: string) {
  const cookies =
    cookieString || (typeof document !== "undefined" ? document.cookie : "");

  const parsedCookies = Object.fromEntries(
    cookies
      .split("; ")
      .filter(Boolean)
      .map((c) => c.split("=")),
  );

  let admin = false;
  if (parsedCookies.isAdmin === "true") admin = true;

  return {
    token: parsedCookies.token || "0",
    dateValue: parsedCookies.validUntil || "0",
    admin: admin,
  };
}
