/**
 * Update the public contact email in SiteSettings without wiping other data.
 * Run: npm run update:email
 */
import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/bc_winery_buyer";

const EMAIL =
  process.env.SITE_CONTACT_EMAIL?.trim() || "bcwinerisforsale@gmail.com";

const SiteSettingsSchema = new mongoose.Schema(
  {
    singletonKey: String,
    email: String,
  },
  { strict: false },
);

async function main() {
  console.log("Connecting to", MONGODB_URI);
  await mongoose.connect(MONGODB_URI);

  const SiteSettings =
    mongoose.models.SiteSettings ||
    mongoose.model("SiteSettings", SiteSettingsSchema);

  const result = await SiteSettings.updateMany(
    {},
    { $set: { email: EMAIL } },
  );

  console.log(`Updated email to ${EMAIL}`);
  console.log(`Matched: ${result.matchedCount}, modified: ${result.modifiedCount}`);

  await mongoose.disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
