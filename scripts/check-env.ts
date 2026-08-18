/**
 * Validates required environment variables before production start.
 * Run: npm run check:env
 */
const required = ["MONGODB_URI", "AUTH_SECRET"] as const;

const warnings: string[] = [];
const errors: string[] = [];

for (const key of required) {
  const value = process.env[key]?.trim();
  if (!value) {
    errors.push(`${key} is missing`);
  }
}

if (!process.env.NEXT_PUBLIC_SITE_URL?.trim()) {
  warnings.push(
    "NEXT_PUBLIC_SITE_URL is not set — sitemap, canonical URLs, and Open Graph links will default to http://localhost:3000",
  );
}

if (process.env.AUTH_SECRET && process.env.AUTH_SECRET.length < 32) {
  warnings.push("AUTH_SECRET should be at least 32 characters for production");
}

if (process.env.NODE_ENV === "production" && !process.env.ADMIN_PASSWORD) {
  warnings.push(
    "ADMIN_PASSWORD is not set — run npm run seed with a strong password before going live",
  );
}

for (const warning of warnings) {
  console.warn(`⚠ ${warning}`);
}

if (errors.length > 0) {
  console.error("Environment check failed:");
  for (const error of errors) {
    console.error(`  ✗ ${error}`);
  }
  process.exit(1);
}

console.log("✓ Environment check passed");
