/**
 * Rename "Buyer Insights" / "Blog" labels to "Buyer Insights and Seller Profiles"
 * in existing CMS content without wiping other data.
 * Run: npm run update:buyer-insights-label
 */
import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/bc_winery_buyer";

const NEW_LABEL = "Buyer Insights and Seller Profiles";
const OLD_LABELS = ["Buyer Insights", "Blog", "Insights"];

const PageSchema = new mongoose.Schema({}, { strict: false });
const BlogPostSchema = new mongoose.Schema({}, { strict: false });

async function main() {
  console.log("Connecting to", MONGODB_URI);
  await mongoose.connect(MONGODB_URI);

  const Page =
    mongoose.models.Page || mongoose.model("Page", PageSchema);
  const BlogPost =
    mongoose.models.BlogPost || mongoose.model("BlogPost", BlogPostSchema);

  const blogPage = await Page.findOne({ slug: "blog" });
  if (blogPage) {
    blogPage.set("name", NEW_LABEL);
    if (blogPage.hero?.eyebrow && OLD_LABELS.includes(blogPage.hero.eyebrow)) {
      blogPage.set("hero.eyebrow", NEW_LABEL);
    }
    if (blogPage.seo?.title?.includes("Buyer Insights")) {
      blogPage.set(
        "seo.title",
        blogPage.seo.title.replace(/Buyer Insights/g, NEW_LABEL),
      );
    }
    await blogPage.save();
    console.log("Updated blog page");
  } else {
    console.log("No blog page found — skipped");
  }

  const homePage = await Page.findOne({ slug: "home" });
  if (homePage?.sections?.length) {
    let homeUpdated = false;
    for (const section of homePage.sections) {
      if (
        section.key === "insights-preview" &&
        section.eyebrow &&
        OLD_LABELS.includes(section.eyebrow)
      ) {
        section.eyebrow = NEW_LABEL;
        homeUpdated = true;
      }
    }
    if (homeUpdated) {
      homePage.markModified("sections");
      await homePage.save();
      console.log("Updated home insights-preview section");
    }
  }

  const posts = await BlogPost.find({
    "seo.title": { $regex: "Buyer Insights", $options: "i" },
  });
  for (const post of posts) {
    if (post.seo?.title) {
      post.set(
        "seo.title",
        post.seo.title.replace(/Buyer Insights/g, NEW_LABEL),
      );
      await post.save();
    }
  }
  if (posts.length > 0) {
    console.log(`Updated ${posts.length} article SEO title(s)`);
  }

  await mongoose.disconnect();
  console.log("Done.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
