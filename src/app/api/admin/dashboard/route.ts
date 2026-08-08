import { withAdmin } from "@/lib/admin-api";
import BlogPost from "@/models/BlogPost";
import FAQ from "@/models/FAQ";
import Lead from "@/models/Lead";
import Page from "@/models/Page";
import Service from "@/models/Service";
import { toPlain } from "@/lib/utils";

export async function GET() {
  return withAdmin(async () => {
    const [
      pages,
      publishedServices,
      publishedArticles,
      draftArticles,
      faqs,
      newLeads,
      contactedLeads,
      recentLeads,
      recentServices,
      recentPosts,
      recentPages,
    ] = await Promise.all([
      Page.countDocuments(),
      Service.countDocuments({ status: "published" }),
      BlogPost.countDocuments({ status: "published" }),
      BlogPost.countDocuments({ status: "draft" }),
      FAQ.countDocuments(),
      Lead.countDocuments({ status: "New" }),
      Lead.countDocuments({ status: "Contacted" }),
      Lead.find().sort({ createdAt: -1 }).limit(8).lean(),
      Service.find().sort({ updatedAt: -1 }).limit(5).select("name slug status updatedAt").lean(),
      BlogPost.find().sort({ updatedAt: -1 }).limit(5).select("title slug status updatedAt").lean(),
      Page.find().sort({ updatedAt: -1 }).limit(5).select("name slug status updatedAt").lean(),
    ]);

    const leadStatuses = await Lead.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    return {
      stats: {
        pages,
        publishedServices,
        publishedArticles,
        draftArticles,
        faqs,
        newLeads,
        contactedLeads,
      },
      leadStatuses: leadStatuses.map((row) => ({
        status: row._id,
        count: row.count,
      })),
      recentLeads: toPlain(recentLeads),
      recentContent: {
        services: toPlain(recentServices),
        posts: toPlain(recentPosts),
        pages: toPlain(recentPages),
      },
    };
  });
}
