/**
 * Seed script: creates settings, admin, pages, services, FAQs, and blog posts.
 * Run: npm run seed
 */
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { STOCK } from "../src/lib/images";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/bc_winery_buyer";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@bcwinerybuyer.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin123!Secure";

const AdminUserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    passwordHash: String,
    role: { type: String, default: "admin" },
    lastLogin: Date,
  },
  { timestamps: true }
);

const PageSchema = new mongoose.Schema(
  {
    name: String,
    slug: { type: String, unique: true },
    hero: mongoose.Schema.Types.Mixed,
    sections: [mongoose.Schema.Types.Mixed],
    seo: mongoose.Schema.Types.Mixed,
    status: { type: String, default: "published" },
  },
  { timestamps: true }
);

const ServiceSchema = new mongoose.Schema(
  {
    name: String,
    slug: { type: String, unique: true },
    shortDescription: String,
    listingImage: String,
    listingImageAlt: String,
    featured: Boolean,
    order: Number,
    status: { type: String, default: "published" },
    detailPage: mongoose.Schema.Types.Mixed,
    seo: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

const BlogPostSchema = new mongoose.Schema(
  {
    title: String,
    slug: { type: String, unique: true },
    excerpt: String,
    contentSections: [mongoose.Schema.Types.Mixed],
    coverImage: String,
    coverImageAlt: String,
    author: String,
    category: String,
    tags: [String],
    publishedAt: Date,
    readingTime: Number,
    featured: Boolean,
    status: { type: String, default: "published" },
    seo: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

const FAQSchema = new mongoose.Schema(
  {
    question: String,
    answer: String,
    category: String,
    order: Number,
    status: { type: String, default: "published" },
  },
  { timestamps: true }
);

const SiteSettingsSchema = new mongoose.Schema(
  {
    websiteName: String,
    legalBusinessName: String,
    logo: String,
    logoLight: String,
    favicon: String,
    companyDescription: String,
    email: String,
    phone: String,
    phoneTel: String,
    socialHandle: String,
    socialPlatform: String,
    socialUrl: String,
    serviceArea: String,
    businessHours: String,
    headerCtaLabel: String,
    headerCtaHref: String,
    footerCtaLabel: String,
    footerCtaHref: String,
    complimentaryConsultationText: String,
    defaultSeoTitle: String,
    defaultSeoDescription: String,
    defaultSeoKeywords: String,
    legalDisclaimer: String,
    copyright: String,
    googleMapsUrl: String,
    tagline: String,
  },
  { timestamps: true }
);

function section(
  key: string,
  data: Record<string, unknown>,
  order: number,
  visible = true
) {
  return { key, order, visible, ...data };
}

async function main() {
  console.log("Connecting to", MONGODB_URI);
  await mongoose.connect(MONGODB_URI);

  const AdminUser =
    mongoose.models.AdminUser ||
    mongoose.model("AdminUser", AdminUserSchema);
  const Page = mongoose.models.Page || mongoose.model("Page", PageSchema);
  const Service =
    mongoose.models.Service || mongoose.model("Service", ServiceSchema);
  const BlogPost =
    mongoose.models.BlogPost || mongoose.model("BlogPost", BlogPostSchema);
  const FAQ = mongoose.models.FAQ || mongoose.model("FAQ", FAQSchema);
  const SiteSettings =
    mongoose.models.SiteSettings ||
    mongoose.model("SiteSettings", SiteSettingsSchema);

  await Promise.all([
    AdminUser.deleteMany({}),
    Page.deleteMany({}),
    Service.deleteMany({}),
    BlogPost.deleteMany({}),
    FAQ.deleteMany({}),
    SiteSettings.deleteMany({}),
  ]);

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await AdminUser.create({
    name: "Site Administrator",
    email: ADMIN_EMAIL.toLowerCase(),
    passwordHash,
    role: "admin",
  });

  await SiteSettings.create({
    singletonKey: "default",
    websiteName: "BC Winery Buyer Advisory",
    legalBusinessName: "",
    logo: "/brand/logo-symbol.svg",
    logoLight: "/brand/logo-symbol-light.svg",
    favicon: "/brand/favicon.svg",
    logoUrl: "/brand/logo-symbol.svg",
    logoLightUrl: "/brand/logo-symbol-light.svg",
    faviconUrl: "/brand/favicon.svg",
    companyDescription:
      "An information resource and professional consulting service for buyers considering the acquisition of wineries, vineyards, winery estates, and related wine-industry businesses in British Columbia.",
    email: "paulmgraydon@gmail.com",
    phone: "+1 (250) 809-2342",
    phoneTel: "+12508092342",
    phoneHref: "tel:+12508092342",
    socialHandle: "faithwilson",
    socialPlatform: "",
    socialUrl: "",
    serviceArea: "British Columbia, Canada",
    businessHours: "By appointment",
    headerCtaLabel: "Book a Complimentary Call",
    headerCtaHref: "/contact",
    footerCtaLabel: "Schedule Your Initial Call",
    footerCtaHref: "/contact",
    complimentaryConsultationText:
      "The initial consultation call is complimentary and provides an opportunity to discuss your acquisition goals, preferred type of winery or vineyard, and expected timeframe.",
    defaultSeoTitle:
      "BC Winery Buyer Advisory | Guidance for Prospective Winery Buyers",
    defaultSeoDescription:
      "Buyer-focused information and professional consulting support for winery, vineyard, and wine-country acquisitions across British Columbia. BC wineries for sale, Okanagan vineyards, and confidential buyer guidance.",
    defaultSeoKeywords:
      "BC wineries for sale, BC vineyards for sale, Okanagan wineries for sale, buying a winery, Kelowna wineries, Penticton wineries, Naramata wineries, Oliver wineries, Keremeos wineries",
    legalDisclaimer:
      "Information on this website is provided for general informational and consulting purposes. It is not legal, tax, accounting, financial, appraisal, inspection, licensing, or brokerage advice. Buyers should consult appropriately qualified professionals before making acquisition decisions.",
    copyright: `© ${new Date().getFullYear()} BC Winery Buyer Advisory. All rights reserved.`,
    copyrightText: `© ${new Date().getFullYear()} BC Winery Buyer Advisory. All rights reserved.`,
    googleMapsUrl: "",
    tagline: "Guidance for BC Winery Buyers",
  });

  await Page.create({
    name: "Home",
    slug: "home",
    status: "published",
    hero: {
      eyebrow: "Welcome",
      heading: "BC Winery & Vineyard Buyer Advisory",
      subheading:
        "This platform is dedicated to the discerning BC winery and vineyard buyer — curated resources for investors and acquirers seeking opportunities across British Columbia, with the Okanagan Valley as the province's key wine region.",
      primaryCtaLabel: "Book a Complimentary Consultation",
      primaryCtaHref: "/contact",
      secondaryCtaLabel: "Explore Buyer Resources",
      secondaryCtaHref: "#professional-resources",
      backgroundImage: STOCK.heroVineyard,
      backgroundImageAlt:
        "Sunset over a British Columbia vineyard and winery estate — illustrative atmosphere, not a listed property",
      floatingLabel: "Okanagan Valley · British Columbia",
    },
    seo: {
      title: "BC Wineries & Vineyards for Sale | Buyer Advisory",
      description:
        "Confidential guidance for buyers seeking BC wineries and vineyards for sale. Okanagan Valley expertise — Kelowna, Penticton, Naramata, Oliver & Keremeos.",
      keywords:
        "BC wineries for sale, BC vineyards for sale, Okanagan wineries for sale, buying a winery, Kelowna wineries, Penticton wineries, Naramata wineries, Oliver wineries, Keremeos wineries",
    },
    sections: [
      section(
        "introduction",
        {
          eyebrow: "Welcome",
          heading: "A Platform for the Discerning BC Winery Buyer",
          body: "We have curated a collection of resources built to engage with interested parties seeking to invest in or acquire a winery or vineyard in British Columbia. This guide offers specialized guidance covering confidentiality, consultancy, real estate, legal matters, budgetary considerations, valuation, seller profiles, sales and marketing, technical advice, finance, entry and exit planning, viticulture, licensing and ALR restrictions, inventory, equipment, and winery administration.\n\nAcquiring such an asset is a complex, multi-faceted venture. Wineries in BC usually comprise a vineyard varying in size, a production facility, an operating business, and perhaps a house or multiple dwellings on site — making acquisition a complex transaction with many components, not just real estate.",
          primaryImage: STOCK.vineyardRows,
          primaryImageAlt: "Vineyard landscape with orderly rows",
          secondaryImage: STOCK.production,
          secondaryImageAlt: "Winery production facility interior",
          cards: [
            {
              title: "Barrel Cellar",
              image: STOCK.barrelCellar,
              imageAlt: "Wine barrel cellar atmosphere",
            },
            {
              title: "Hospitality Space",
              image: STOCK.tastingRoom,
              imageAlt: "Tasting room and hospitality setting",
            },
          ],
        },
        1
      ),
      section(
        "okanagan-spotlight",
        {
          eyebrow: "Key Wine Region",
          heading: "The Okanagan Valley — BC's Premier Winery Area",
          subheading:
            "Located in south-central British Columbia, western Canada, the Okanagan Valley is the province's primary wine region — home to over 200 wineries and the focus of much buyer interest. See the map for international context.",
          items: [
            "Kelowna",
            "Penticton",
            "Naramata",
            "Oliver",
            "Osoyoos",
            "Keremeos",
            "Vernon",
          ],
        },
        2
      ),
      section(
        "acquisition-categories",
        {
          eyebrow: "Buyer Interests",
          heading: "What Are You Looking to Acquire?",
          subheading:
            "These categories help clarify your focus. They are not active property listings.",
          cards: [
            {
              title: "Operating Winery",
              description:
                "A functioning wine business with production, brand, and operational considerations.",
              value: "operating-winery",
            },
            {
              title: "Vineyard",
              description:
                "Agricultural land and vines where grape growing is the primary focus.",
              value: "vineyard",
            },
            {
              title: "Winery and Vineyard Estate",
              description:
                "Combined production, vineyard, and estate character in one opportunity.",
              value: "winery-vineyard-estate",
            },
            {
              title: "Tasting Room or Hospitality Property",
              description:
                "Visitor-facing spaces where hospitality experience is central.",
              value: "tasting-hospitality",
            },
            {
              title: "Development Opportunity",
              description:
                "Sites or projects where future development potential is part of the thesis.",
              value: "development",
            },
            {
              title: "Lifestyle Wine-Country Property",
              description:
                "Properties where lifestyle, residence, and wine-country setting matter deeply.",
              value: "lifestyle",
            },
          ],
        },
        3
      ),
      section(
        "buyer-services",
        {
          eyebrow: "Buyer Services",
          heading: "Guidance Tailored to Your Acquisition Stage",
          subheading:
            "Services are tailored to the buyer, the opportunity, and the stage of acquisition.",
          ctaLabel: "View All Services",
          ctaHref: "/services",
        },
        4
      ),
      section(
        "professional-resources",
        {
          eyebrow: "Professional Advice & Resources",
          heading: "Specialist Guidance for Every Stage of Acquisition",
          subheading:
            "Confidential support across the disciplines that matter most when evaluating a BC winery or vineyard opportunity.",
          ctaLabel: "Start a Confidential Conversation",
          ctaHref: "/contact",
          cards: [
            {
              key: "initial",
              title: "Initial Conversation",
              description:
                "For an initial conversation, complete the contact form and we will arrange a discussion of your specific needs in utmost confidentiality.",
            },
            {
              key: "viticulture",
              title: "Viticulture",
              description:
                "Engage a viticultural consultant who can evaluate the condition of a vineyard for your purposes, and manage vineyard operations for buyers not able or willing to take on farming aspects.",
            },
            {
              key: "valuation",
              title: "Valuation Services",
              description:
                "Our valuation team performs detailed business valuations including all aspects of a winery enterprise.",
            },
            {
              key: "real-estate",
              title: "Real Estate",
              description:
                "Our real estate associates engage with the various parties to coordinate an acquisition strategy on behalf of a buyer.",
            },
            {
              key: "legal",
              title: "Legal",
              description:
                "Our legal partners navigate the contractual and legal complexities of a winery or vineyard acquisition.",
            },
            {
              key: "seller-profiles",
              title: "Seller Profiles",
              description:
                "We maintain a confidential list of owners looking for a buyer, depending on budget and size. Most winery owners are reluctant to advertise their plans to sell — we can refer you to a trusted brokerage for further confidential information available after signing a Non-Disclosure Agreement (NDA).",
            },
            {
              key: "technical",
              title: "Technical Advice",
              description:
                "We assist and refer to partners when appropriate to advise on best practices, winery operations, staffing, and winemaking.",
            },
            {
              key: "sales-marketing",
              title: "Sales & Marketing",
              description:
                "Our resources include expertise in the marketing and distribution of wine in local and national liquor markets.",
            },
            {
              key: "finance",
              title: "Finance",
              description:
                "We can put you in touch with investor groups and lenders ready to engage with buyers.",
            },
            {
              key: "entry-exit",
              title: "Entry / Exit Planning",
              description:
                "Often overlooked, this is a vital resource for any winery owner embarking on a venture — and for existing owners looking to divest.",
            },
            {
              key: "licensing",
              title: "Licensing & ALR Restrictions",
              description:
                "Learn what is and is not possible with an inward acquisition. Many restrictions are imposed depending on the status of the enterprise — some will not allow developments or diversification of business and income streams on a winery site.",
            },
            {
              key: "inventory",
              title: "Inventory",
              description:
                "A component often left until the last moment deliberately, as inventory can change daily. Evaluation according to seller instructions can lead to inaccurate valuation of inventory quality and costly mistakes.",
            },
            {
              key: "equipment",
              title: "Equipment",
              description:
                "The resale value of used equipment is often set by the seller rather than objective means. Market value, insured value, accountant's value, and tax value can all differ significantly.",
            },
            {
              key: "operations",
              title: "Operating Resources & Winery Administration",
              description:
                "We introduce resources through our network of specialists — winemakers, viticulturists, management, and administrative staff — to assist with running a winery operation.",
            },
          ],
        },
        5
      ),
      section(
        "buyer-guidelines",
        {
          eyebrow: "Buyer Guidelines",
          heading: "Production Capacity & Vineyard Acreage Guidelines",
          subheading:
            "Most winery owners are reluctant to advertise their plans to sell. We can refer you to a trusted brokerage for confidential information available after signing an NDA. These production guidelines assume well cared-for mature vineyards with limited pre-harvest fruit dropping. Purchased grapes are excluded.",
          ctaLabel: "Contact Us to Learn More",
          ctaHref: "/contact",
          cards: [
            { title: "1,000 – 2,000 cases", description: "10 acres" },
            { title: "2,000 – 4,000 cases", description: "20 acres" },
            { title: "4,000 – 6,000 cases", description: "30 acres" },
            { title: "6,000 – 8,000 cases", description: "40 acres" },
            { title: "8,000 – 10,000 cases", description: "50 acres" },
            { title: "20,000 cases", description: "100 acres" },
          ],
        },
        6
      ),
      section(
        "acquisition-journey",
        {
          eyebrow: "The Path Forward",
          heading: "From First Interest to Informed Decision",
          cards: [
            {
              title: "Define Your Acquisition Goals",
              description:
                "Clarify what you want to own, why it matters, and which characteristics are non-negotiable.",
            },
            {
              title: "Understand the BC Winery Landscape",
              description:
                "Build context around regions, opportunity types, and the practical realities of ownership.",
            },
            {
              title: "Identify Suitable Opportunities",
              description:
                "Organise search criteria and approach available information with a clearer framework.",
            },
            {
              title: "Evaluate the Business and Property",
              description:
                "Separate property questions from operational, brand, and financial considerations.",
            },
            {
              title: "Coordinate Professional Due Diligence",
              description:
                "Assemble the right specialists and organise the questions that matter most.",
            },
            {
              title: "Plan the Transaction and Transition",
              description:
                "Think ahead to closing logistics, continuity, staffing, and early ownership priorities.",
            },
          ],
        },
        7
      ),
      section(
        "due-diligence",
        {
          eyebrow: "Vital Components",
          heading: "Specialized Guidance Across Key Acquisition Themes",
          subheading:
            "This guide seeks to offer specialized guidance covering the vital components every discerning buyer should understand before committing to a BC winery or vineyard acquisition.",
          items: [
            "Confidentiality",
            "Consultancy",
            "Real Estate",
            "Legal",
            "Budgetary considerations",
            "Valuation services",
            "Seller profiles",
            "Sales and marketing",
            "Technical advice",
            "Finance",
            "Entry / exit planning",
            "Viticulture",
            "Licensing and ALR restrictions",
            "Inventory",
            "Equipment",
            "Operating resources and winery administration",
          ],
          primaryImage: STOCK.documents,
          primaryImageAlt: "Professional document review at a desk",
        },
        8
      ),
      section(
        "regions",
        {
          eyebrow: "British Columbia",
          heading: "Regions Buyers May Explore",
          subheading:
            "The Okanagan Valley is the key winery area in the province. British Columbia's wine country also includes established and emerging areas beyond the Okanagan.",
          cards: [
            {
              title: "Okanagan Valley",
              description:
                "Canada's unexpected Mediterranean — over 200 wineries, stunning lakes, and a semi-arid climate from Vernon to Osoyoos. Kelowna, Penticton, Naramata, Oliver, and Keremeos are among its renowned communities.",
              image: STOCK.duskVineyard,
              imageAlt: "Okanagan-style vineyard landscape at dusk",
            },
            {
              title: "Similkameen Valley",
              description:
                "A neighbouring valley known for distinctive growing conditions and rural vineyard settings.",
              image: STOCK.hillside,
              imageAlt: "Hillside vineyard landscape",
            },
            {
              title: "Fraser Valley",
              description:
                "A closer-to-metro region where agricultural and hospitality opportunities may intersect.",
              image: STOCK.goldenHour,
              imageAlt: "Golden-hour agricultural landscape",
            },
            {
              title: "Vancouver Island",
              description:
                "Coastal wine-country settings with a distinct island climate and visitor appeal.",
              image: STOCK.lakeMountains,
              imageAlt: "Coastal mountain and water landscape",
            },
            {
              title: "Gulf Islands",
              description:
                "Smaller-scale and lifestyle-oriented wine-country contexts among island communities.",
              image: STOCK.architecture,
              imageAlt: "Estate architecture in a rural setting",
            },
            {
              title: "Other Emerging BC Regions",
              description:
                "Buyers may also explore additional British Columbia areas as the wine landscape evolves.",
              image: STOCK.vineyardRows,
              imageAlt: "Emerging vineyard rows in soft light",
            },
          ],
        },
        9
      ),
      section(
        "consultation-cta",
        {
          heading: "Start with a Complimentary Conversation",
          body: "Share what you are looking for, your approximate timeframe, and the type of winery or vineyard opportunity you want to explore.",
          ctaLabel: "Schedule Your Initial Call",
          ctaHref: "/contact",
          backgroundImage: STOCK.estateWinery,
          backgroundImageAlt:
            "Winery estate surrounded by vines — illustrative imagery",
        },
        10
      ),
      section(
        "insights-preview",
        {
          eyebrow: "Buyer Insights",
          heading: "Latest Thinking for Prospective Buyers",
          ctaLabel: "Explore All Insights",
          ctaHref: "/blog",
        },
        11
      ),
      section(
        "faq-preview",
        {
          eyebrow: "Common Questions",
          heading: "Answers Before the First Call",
          ctaLabel: "View All FAQs",
          ctaHref: "/faq",
        },
        12
      ),
      section(
        "final-cta",
        {
          heading: "Your BC Winery Search Starts with the Right Questions",
          primaryCtaLabel: "Book a Complimentary Call",
          primaryCtaHref: "/contact",
          secondaryCtaLabel: "Contact Us",
          secondaryCtaHref: "/contact",
        },
        13
      ),
    ],
  });

  await Page.create({
    name: "Services",
    slug: "services",
    status: "published",
    hero: {
      eyebrow: "Buyer Services",
      heading: "Professional Guidance for Prospective Winery Buyers",
      subheading:
        "Buyer-focused consulting and information designed to support clearer planning, stronger questions, and better coordination throughout a potential winery or vineyard acquisition.",
      backgroundImage: STOCK.vineyardRows,
      backgroundImageAlt: "Vineyard rows stretching toward the horizon",
    },
    seo: {
      title: "Buyer Services | BC Winery Buyer Advisory",
      description:
        "Tailored consulting services for prospective BC winery and vineyard buyers. Contact for a custom proposal.",
    },
    sections: [
      section(
        "introduction",
        {
          heading: "Services Shaped Around the Buyer",
          body: "Services are tailored to the buyer, the opportunity, and the stage of acquisition. There are no fixed public prices — contact the service to discuss a custom proposal.",
        },
        1
      ),
      section(
        "journey",
        {
          heading: "Buyer Acquisition Journey",
          body: "From clarifying goals to coordinating specialists and thinking through transition, each engagement can adapt to where you are in the process.",
        },
        2
      ),
      section(
        "coordination",
        {
          heading: "Professional Team Coordination",
          body: "Acquisitions often involve lawyers, accountants, commercial real-estate professionals, appraisers, agricultural specialists, vineyard consultants, environmental consultants, building inspectors, licensing specialists, and lenders. Consulting support can help organise information and questions — it does not replace licensed specialists.",
          primaryImage: STOCK.meeting,
          primaryImageAlt: "Professional advisory meeting",
        },
        3
      ),
      section(
        "due-diligence-visual",
        {
          heading: "Winery Due Diligence, Organised",
          body: "A structured view of property, vineyard, operations, hospitality, and financial themes helps buyers ask better questions before deeper specialist review.",
          primaryImage: STOCK.documents,
          primaryImageAlt: "Organised acquisition documents",
        },
        4
      ),
      section(
        "gallery",
        {
          heading: "The Atmosphere of Wine-Country Ownership",
          images: [
            {
              src: STOCK.aerialVineyard,
              alt: "Aerial vineyard rows",
            },
            { src: STOCK.barrelCellar, alt: "Barrel cellar" },
            { src: STOCK.production, alt: "Production area" },
            { src: STOCK.tastingRoom, alt: "Tasting space" },
            { src: STOCK.estateWinery, alt: "Estate architecture" },
          ],
        },
        5
      ),
      section(
        "custom-proposal",
        {
          heading: "A Custom Proposal, Not a Price List",
          body: "Every buyer’s needs, timeline, and opportunity differ. After an initial complimentary conversation, a tailored scope can be discussed.",
          ctaLabel: "Request a Conversation",
          ctaHref: "/contact",
        },
        6
      ),
      section(
        "consultation-cta",
        {
          heading: "Begin with a Complimentary Consultation",
          body: "Share your goals and timeframe. The initial consultation call is complimentary.",
          ctaLabel: "Book a Complimentary Call",
          ctaHref: "/contact",
          backgroundImage: STOCK.duskVineyard,
          backgroundImageAlt: "Vineyard at dusk",
        },
        7
      ),
    ],
  });

  await Page.create({
    name: "Contact",
    slug: "contact",
    status: "published",
    hero: {
      eyebrow: "Complimentary Initial Consultation",
      heading: "Tell Us What You Want to Acquire",
      subheading:
        "Share your goals and expected timeframe. Your initial consultation call is complimentary.",
      backgroundImage: STOCK.meeting,
      backgroundImageAlt: "Buyer and advisor discussion setting",
    },
    seo: {
      title: "Contact | BC Winery Buyer Advisory",
      description:
        "Contact BC Winery Buyer Advisory to discuss a complimentary consultation about winery or vineyard acquisition in British Columbia.",
    },
    sections: [
      section(
        "contact-details",
        {
          heading: "British Columbia Winery Buyer Guidance",
          body: "Complimentary initial consultation. Services are tailored to the buyer and opportunity.",
        },
        1
      ),
    ],
  });

  await Page.create({
    name: "FAQ",
    slug: "faq",
    status: "published",
    hero: {
      eyebrow: "Questions & Clarity",
      heading: "Frequently Asked Questions",
      subheading:
        "Practical answers for prospective buyers beginning to explore winery and vineyard acquisitions in British Columbia.",
      backgroundImage: STOCK.documents,
      backgroundImageAlt: "Thoughtful review of acquisition materials",
    },
    seo: {
      title: "FAQ | BC Winery Buyer Advisory",
      description:
        "Answers about complimentary consultations, pricing approach, due diligence, and preparing for a winery acquisition conversation.",
    },
    sections: [
      section(
        "introduction",
        {
          heading: "Clarity Before Commitment",
          body: "These questions address common early concerns. Explore the map and Okanagan guide below for regional context. Specific advice for your situation should come from qualified professionals.",
        },
        1
      ),
      section(
        "location",
        {
          heading: "Where Are We?",
          body: "BC Winery Buyer Advisory serves discerning buyers exploring winery and vineyard acquisitions across British Columbia. The Okanagan Valley — in south-central BC, western Canada — is the province's primary wine region.",
        },
        2
      ),
      section(
        "buyer-readiness",
        {
          heading: "Buyer Readiness",
          body: "Buyers who prepare thoughts on region, acquisition type, timeframe, involvement level, and hospitality interests often make better use of an initial call.",
          primaryImage: STOCK.vineyardRows,
          primaryImageAlt: "Quiet vineyard rows",
        },
        2
      ),
      section(
        "advisors",
        {
          heading: "Working with Professional Advisors",
          body: "Legal, tax, accounting, appraisal, agricultural, environmental, licensing, and brokerage advice should come from appropriately qualified professionals. This service can help organise questions and coordinate communication.",
          primaryImage: STOCK.meeting,
          primaryImageAlt: "Professional advisors in discussion",
        },
        3
      ),
      section(
        "gallery",
        {
          images: [
            { src: STOCK.aerialVineyard, alt: "Aerial vineyard" },
            { src: STOCK.barrelCellar, alt: "Cellar" },
            { src: STOCK.estateWinery, alt: "Estate" },
            { src: STOCK.production, alt: "Production" },
            { src: STOCK.hospitality, alt: "Hospitality setting" },
          ],
        },
        4
      ),
      section(
        "consultation-cta",
        {
          heading: "Still Have Questions?",
          body: "Book a complimentary call to discuss your goals in more detail.",
          ctaLabel: "Book a Complimentary Call",
          ctaHref: "/contact",
        },
        5
      ),
    ],
  });

  await Page.create({
    name: "Blog",
    slug: "blog",
    status: "published",
    hero: {
      eyebrow: "Buyer Insights",
      heading: "Insights for Prospective Winery Buyers",
      subheading:
        "Educational articles to help you ask better questions about winery, vineyard, and wine-country acquisitions in British Columbia.",
      backgroundImage: STOCK.goldenHour,
      backgroundImageAlt: "Golden-hour vineyard landscape",
    },
    seo: {
      title: "Buyer Insights | BC Winery Buyer Advisory",
      description:
        "Educational insights on buying a BC winery, vineyard due diligence, operations, financing themes, and ownership transition.",
    },
    sections: [
      section(
        "newsletter",
        {
          heading: "Stay Close to Buyer Thinking",
          body: "If email updates are configured in the future, you will be able to request insights here. For now, explore the articles below or book a complimentary consultation.",
          ctaLabel: "Book a Complimentary Call",
          ctaHref: "/contact",
        },
        1
      ),
    ],
  });

  const services = [
    {
      name: "Buyer Strategy and Acquisition Planning",
      slug: "buyer-strategy-and-acquisition-planning",
      shortDescription:
        "Clarify what you want to acquire, why it fits your goals, and which opportunity characteristics matter most before beginning a search.",
      listingImage: STOCK.meeting,
      listingImageAlt: "Strategic planning discussion",
      order: 1,
      topics: [
        "Acquisition goals",
        "Preferred BC regions",
        "Winery type",
        "Vineyard requirements",
        "Production objectives",
        "Hospitality interests",
        "Budget considerations",
        "Timeframe",
        "Owner involvement",
        "Transition preferences",
      ],
      audience:
        "Prospective buyers at the earliest stage of exploring winery or vineyard ownership, including investors, entrepreneurs, operators, and advisors supporting acquisition clients.",
    },
    {
      name: "Opportunity Search and Market Navigation",
      slug: "opportunity-search-and-market-navigation",
      shortDescription:
        "Help buyers organise their search criteria, review available information, and approach potential opportunities with a clearer framework.",
      listingImage: STOCK.aerialVineyard,
      listingImageAlt: "Aerial perspective over vineyard country",
      order: 2,
      topics: [
        "Search criteria organisation",
        "Opportunity type filtering",
        "Regional focus",
        "Information review frameworks",
        "Buyer readiness questions",
      ],
      audience:
        "Buyers who are ready to organise a search and want a clearer way to evaluate what they encounter — without promises of exclusive or off-market inventory unless later confirmed.",
      disclaimerNote:
        "This service does not claim access to exclusive or off-market properties unless later confirmed by the business.",
    },
    {
      name: "Preliminary Opportunity Review",
      slug: "preliminary-opportunity-review",
      shortDescription:
        "A structured initial review of available property, operational, and business information to help identify important questions before deeper professional due diligence.",
      listingImage: STOCK.documents,
      listingImageAlt: "Structured review of opportunity materials",
      order: 3,
      topics: [
        "Available information organisation",
        "Property themes",
        "Operational themes",
        "Open questions list",
        "Next-step specialist referrals framing",
      ],
      audience:
        "Buyers who have identified a possible opportunity and want a structured first pass before commissioning deeper specialist work.",
      disclaimerNote:
        "This is not an appraisal, inspection, legal opinion, or financial audit.",
    },
    {
      name: "Due-Diligence Coordination",
      slug: "due-diligence-coordination",
      shortDescription:
        "Help buyers identify the areas requiring professional review and coordinate questions for legal, accounting, agricultural, environmental, property, licensing, and operational specialists.",
      listingImage: STOCK.production,
      listingImageAlt: "Winery production considerations",
      order: 4,
      topics: [
        "Due-diligence theme mapping",
        "Specialist question lists",
        "Information tracking",
        "Coordination support",
      ],
      audience:
        "Buyers preparing for or already in a due-diligence phase who need organisational support across multiple professional disciplines.",
      disclaimerNote:
        "This service does not replace licensed specialists.",
    },
    {
      name: "Transaction-Team Coordination",
      slug: "transaction-team-coordination",
      shortDescription:
        "Support communication and information organisation among the buyer and their selected professional advisors.",
      listingImage: STOCK.architecture,
      listingImageAlt: "Estate and transaction context",
      order: 5,
      topics: [
        "Lawyer",
        "Accountant",
        "Commercial real-estate professional",
        "Appraiser",
        "Agricultural specialist",
        "Vineyard consultant",
        "Environmental consultant",
        "Building inspector",
        "Licensing specialist",
        "Lender",
      ],
      audience:
        "Buyers who have assembled — or are assembling — a professional team and want clearer communication and information organisation.",
    },
    {
      name: "Transition and Ownership Planning",
      slug: "transition-and-ownership-planning",
      shortDescription:
        "Help buyers think through operational transition, management responsibilities, staffing, production continuity, hospitality operations, and early ownership priorities.",
      listingImage: STOCK.tastingRoom,
      listingImageAlt: "Hospitality and ownership transition context",
      order: 6,
      topics: [
        "Operational transition",
        "Management responsibilities",
        "Staffing continuity",
        "Production continuity",
        "Hospitality operations",
        "Early ownership priorities",
      ],
      audience:
        "Buyers approaching closing or early ownership who want a structured way to think through transition realities.",
    },
  ];

  for (const s of services) {
    await Service.create({
      name: s.name,
      slug: s.slug,
      shortDescription: s.shortDescription,
      listingImage: s.listingImage,
      listingImageAlt: s.listingImageAlt,
      featured: s.order <= 3,
      order: s.order,
      status: "published",
      seo: {
        title: `${s.name} | BC Winery Buyer Advisory`,
        description: s.shortDescription,
      },
      detailPage: {
        hero: {
          eyebrow: "Buyer Service",
          heading: s.name,
          subheading: s.shortDescription,
          backgroundImage: s.listingImage,
          backgroundImageAlt: s.listingImageAlt,
        },
        overview: s.shortDescription,
        audience: s.audience,
        keyQuestions: [
          "What type of opportunity fits your goals?",
          "Which British Columbia regions are you considering?",
          "What level of operational involvement do you want?",
          "What timeframe are you working within?",
          "Which professional advisors will you need beside you?",
        ],
        includedItems: s.topics,
        processSteps: [
          {
            title: "Complimentary conversation",
            description:
              "Discuss goals, timeframe, and whether this service is the right fit.",
          },
          {
            title: "Custom proposal",
            description:
              "If appropriate, outline a tailored scope based on your stage and needs.",
          },
          {
            title: "Structured engagement",
            description:
              "Work through the agreed questions, organisation, and coordination steps.",
          },
          {
            title: "Clear next steps",
            description:
              "Leave with sharper priorities and a practical path for specialist follow-through.",
          },
        ],
        professionalDisclaimer:
          s.disclaimerNote ||
          "Consulting support helps organise information and questions. It is not legal, tax, accounting, appraisal, inspection, licensing, or brokerage advice. Engage appropriately qualified professionals.",
        galleryImages: [
          {
            src: STOCK.vineyardRows,
            alt: "Vineyard rows",
          },
          { src: STOCK.barrelCellar, alt: "Barrel cellar" },
          { src: STOCK.production, alt: "Production" },
          { src: STOCK.documents, alt: "Documents" },
          { src: STOCK.estateWinery, alt: "Estate setting" },
        ],
        cta: {
          heading: "Discuss This Service",
          body: "The initial consultation call is complimentary. Services are tailored — contact for a custom proposal.",
          label: "Book a Complimentary Call",
          href: "/contact",
        },
      },
    });
  }

  const faqs = [
    {
      q: "Where are we located?",
      a: "We serve buyers exploring winery and vineyard acquisitions across British Columbia, Canada. The Okanagan Valley — in south-central BC, western Canada — is the province's key wine region. See the map on our FAQ page for geographic context, including Kelowna, Penticton, Naramata, Oliver, Osoyoos, and Keremeos.",
      c: "Getting Started",
    },
    {
      q: "What is the Okanagan Valley?",
      a: "The Okanagan Valley is Canada's unexpected Mediterranean — a desert oasis in south-central British Columbia. Famous as the Napa Valley of the North, it features stunning lakes, over 200 wineries, and a semi-arid climate with summer temperatures exceeding 30°C. The valley stretches roughly 250 km from Vernon in the greener north to Osoyoos near the US border in the south. See our full Okanagan guide on the FAQ page for more detail.",
      c: "Getting Started",
    },
    {
      q: "What are the buyer guidelines for production capacity?",
      a: "Guidelines for mature vineyards (owned or leased, purchased grapes excluded): 1,000–2,000 cases / 10 acres; 2,000–4,000 cases / 20 acres; 4,000–6,000 cases / 30 acres; 6,000–8,000 cases / 40 acres; 8,000–10,000 cases / 50 acres; 20,000 cases / 100 acres. These assume well cared-for mature vineyards with limited pre-harvest fruit dropping. Recent yield records and inspection by a qualified viticulturist are essential. Contact us to learn more about expected yields and production techniques.",
      c: "Process & Timeline",
    },
    {
      q: "Is the initial consultation complimentary?",
      a: "Yes. The initial consultation call is complimentary and provides an opportunity to discuss your acquisition goals, preferred type of winery or vineyard, and expected timeframe.",
      c: "Getting Started",
    },
    {
      q: "Who is this service for?",
      a: "The service is designed for prospective buyers researching or actively considering winery, vineyard, winery estate, or related wine-country acquisitions in British Columbia.",
      c: "Getting Started",
    },
    {
      q: "Do you publish fixed consulting prices?",
      a: "No. The scope depends on the buyer’s needs, the acquisition stage, and the opportunity being evaluated. Contact the service to discuss a custom proposal.",
      c: "Services & Pricing",
    },
    {
      q: "Do you provide legal, tax or accounting advice?",
      a: "No. Buyers should obtain legal, tax, accounting, financial, appraisal, licensing, agricultural, environmental, and property advice from appropriately qualified professionals. Consulting support can help organise information and coordinate questions.",
      c: "Professional Advice",
    },
    {
      q: "Can you help me find a winery for sale?",
      a: "Most winery owners are reluctant to advertise their plans to sell. We can refer you to a trusted brokerage for further confidential information available after signing a Non-Disclosure Agreement (NDA). We maintain a confidential list of owners looking for a buyer depending on budget and size. We help buyers define criteria and navigate available information — exclusive or off-market access is not promised unless later confirmed.",
      c: "Search & Opportunities",
    },
    {
      q: "What information should I prepare for the initial call?",
      a: "Consider your preferred region, acquisition type, approximate budget, target timeframe, operational experience, desired level of involvement, production goals, and whether hospitality or residential components are important.",
      c: "Getting Started",
    },
    {
      q: "How long does acquiring a winery take?",
      a: "There is no standard timeframe. Timing can depend on opportunity availability, financing, negotiations, due diligence, regulatory matters, property conditions, and transaction complexity.",
      c: "Process & Timeline",
    },
    {
      q: "Do I need wine-industry experience?",
      a: "Experience can be helpful, but every buyer’s situation is different. Buyers should carefully consider management, production, staffing, professional-advisor, and transition requirements.",
      c: "Ownership",
    },
  ];

  for (const [i, f] of faqs.entries()) {
    await FAQ.create({
      question: f.q,
      answer: f.a,
      category: f.c,
      order: i + 1,
      status: "published",
    });
  }

  const posts = [
    {
      title: "What to Consider Before Buying a BC Winery",
      slug: "what-to-consider-before-buying-a-bc-winery",
      category: "Buying a BC Winery",
      excerpt:
        "A practical framework for clarifying goals, opportunity type, involvement level, and professional support before you begin a serious search.",
      cover: STOCK.aerialVineyard,
      featured: true,
      sections: [
        {
          heading: "Start with goals, not listings",
          body: "Before comparing properties, clarify why you want to own a winery or vineyard. Lifestyle, investment, brand-building, hospitality, and operational entrepreneurship each lead to different opportunity profiles.",
        },
        {
          heading: "Separate property from business",
          body: "A winery purchase can involve land, buildings, equipment, inventory, brand, licences, people, and guest experiences. Treat property and business evaluation as related but distinct workstreams.",
        },
        {
          heading: "Build your professional circle early",
          body: "Legal, accounting, agricultural, and other specialists often become essential. Early conversations help you understand which questions you should not answer alone.",
        },
      ],
    },
    {
      title: "Winery, Vineyard or Estate: Defining What You Want to Acquire",
      slug: "winery-vineyard-or-estate",
      category: "Buying a BC Winery",
      excerpt:
        "Language matters. Understanding the difference between operating wineries, vineyards, and estates helps you communicate clearly with advisors and sellers.",
      cover: STOCK.estateWinery,
      featured: false,
      sections: [
        {
          heading: "Operating winery",
          body: "Typically implies production, brand, and ongoing business operations in addition to physical assets.",
        },
        {
          heading: "Vineyard focus",
          body: "Centres on agricultural land and vine performance, with or without a full hospitality or bottling story.",
        },
        {
          heading: "Estate character",
          body: "Often combines production, vineyard, and residential or hospitality elements — increasing both opportunity and complexity.",
        },
      ],
    },
    {
      title: "Building the Right Professional Team for a Winery Acquisition",
      slug: "building-the-right-professional-team",
      category: "Transaction Preparation",
      excerpt:
        "Acquisitions rarely succeed on enthusiasm alone. Here’s how to think about the specialists buyers commonly need beside them.",
      cover: STOCK.meeting,
      featured: true,
      sections: [
        {
          heading: "Core advisors",
          body: "Lawyers and accountants are frequently central. Commercial real-estate professionals and appraisers may also play key roles depending on the opportunity.",
        },
        {
          heading: "Wine-country specialists",
          body: "Agricultural specialists, vineyard consultants, environmental consultants, building inspectors, and licensing specialists can illuminate risks that generalists may miss.",
        },
        {
          heading: "Coordination as a discipline",
          body: "Information multiplies quickly. A clear process for questions, documents, and decisions protects time and attention.",
        },
      ],
    },
    {
      title: "Questions Buyers Should Ask About Winery Operations",
      slug: "questions-about-winery-operations",
      category: "Winery Operations",
      excerpt:
        "Operations questions help you understand continuity, staffing, production rhythm, and hospitality realities beyond the postcard view.",
      cover: STOCK.production,
      featured: false,
      sections: [
        {
          heading: "People and process",
          body: "Who runs day-to-day operations today? What knowledge sits with key individuals? What would a transition require?",
        },
        {
          heading: "Production and inventory",
          body: "Ask how production decisions are made, how inventory is managed, and what seasonal pressures shape the year.",
        },
        {
          heading: "Hospitality load",
          body: "If tasting rooms or events matter, understand staffing, visitor patterns, and how hospitality interacts with production.",
        },
      ],
    },
    {
      title:
        "Understanding the Difference Between Property and Business Due Diligence",
      slug: "property-vs-business-due-diligence",
      category: "Vineyard Due Diligence",
      excerpt:
        "Property condition and business health answer different questions. Strong buyers keep both lenses in view.",
      cover: STOCK.documents,
      featured: false,
      sections: [
        {
          heading: "Property lens",
          body: "Land, vines, water-related considerations, buildings, equipment, and infrastructure each deserve specialist attention where relevant.",
        },
        {
          heading: "Business lens",
          body: "Operations, brand, customers, hospitality performance, and financial information tell a different story than physical assets alone.",
        },
        {
          heading: "Bring the lenses together",
          body: "The most useful picture emerges when property findings and business findings are read side by side — with qualified professionals guiding interpretation.",
        },
      ],
    },
    {
      title: "Planning for the First Year of Winery Ownership",
      slug: "first-year-of-winery-ownership",
      category: "Ownership and Transition",
      excerpt:
        "Closing is a milestone, not the finish line. Early ownership rewards clear priorities around people, production, and guests.",
      cover: STOCK.tastingRoom,
      featured: false,
      sections: [
        {
          heading: "Protect continuity",
          body: "Staffing, seasonal workflows, and supplier relationships often matter immediately. Sudden change can be costly.",
        },
        {
          heading: "Sequence your ambitions",
          body: "Not every improvement belongs in month one. Distinguish stabilising actions from longer-term creative projects.",
        },
        {
          heading: "Keep advisors close",
          body: "The first year still benefits from legal, accounting, and operational counsel as real conditions replace assumptions.",
        },
      ],
    },
  ];

  for (const [i, p] of posts.entries()) {
    const text = p.sections.map((s) => `${s.heading} ${s.body}`).join(" ");
    const words = text.split(/\s+/).length;
    await BlogPost.create({
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      coverImage: p.cover,
      coverImageAlt: `Cover image for ${p.title}`,
      author: "BC Winery Buyer Advisory",
      category: p.category,
      tags: [p.category, "British Columbia", "Winery Buyers"],
      publishedAt: new Date(Date.now() - i * 86400000 * 3),
      readingTime: Math.max(1, Math.ceil(words / 200)),
      featured: p.featured,
      status: "published",
      seo: {
        title: `${p.title} | Buyer Insights`,
        description: p.excerpt,
      },
      contentSections: p.sections.map((s, idx) => ({
        key: `section-${idx + 1}`,
        heading: s.heading,
        body: s.body,
        image: idx === 0 ? p.cover : undefined,
        imageAlt: idx === 0 ? `Illustration for ${p.title}` : undefined,
      })),
    });
  }

  console.log("Seed complete.");
  console.log(`Admin: ${ADMIN_EMAIL}`);
  console.log("Password: (from ADMIN_PASSWORD env)");
  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect();
  process.exit(1);
});
