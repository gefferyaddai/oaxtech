/**
 * Marketing & SEO page data.
 *
 * CONTENT RULE: no ranking guarantees, no client results, no performance
 * figures. The sample report is explicitly labelled illustrative and contains
 * NO numbers that could be read as a real client outcome.
 */

export const marketingPillars = [
  { label: "Strategy-Led", icon: "Compass", description: "Clear plans aligned with your business goals." },
  { label: "Search-Focused", icon: "Search", description: "SEO and content built to improve visibility." },
  { label: "Data-Informed", icon: "BarChart3", description: "Decisions based on accurate data and real insights." },
  { label: "Built for Growth", icon: "Rocket", description: "Scalable solutions that support long-term success." },
];

export const problemsSolved = [
  { label: "Low Website Visibility", icon: "Eye", description: "Hard to get found by the right people online." },
  { label: "Unclear Marketing Direction", icon: "HelpCircle", description: "No clear plan or consistent marketing strategy." },
  { label: "Inconsistent Lead Generation", icon: "Filter", description: "Traffic isn't turning into quality leads." },
  { label: "Weak Local Search Presence", icon: "MapPin", description: "Not showing up in local search results." },
  { label: "Content That Doesn't Convert", icon: "PenSquare", description: "Content lacks clarity, value or alignment." },
  { label: "Limited Performance Insight", icon: "PieChart", description: "Not enough visibility into what's working." },
];

export const localSeoServices = [
  { label: "Google Business Profile Optimization", icon: "Store", description: "Optimize your profile to improve visibility and engagement." },
  { label: "Local Keyword Strategy", icon: "SearchCheck", description: "Target location-based keywords your customers actually search." },
  { label: "Business Listing Consistency", icon: "ShieldCheck", description: "Ensure accurate, consistent information across key directories." },
  { label: "Local Performance Tracking", icon: "LineChart", description: "Monitor local rankings, interactions and website traffic over time." },
];

export const reportingFeatures = [
  { label: "Visibility Trends", icon: "TrendingUp", description: "Track how your visibility changes over time." },
  { label: "Keyword Movement", icon: "ArrowUpDown", description: "See how your keywords rank and evolve." },
  { label: "Traffic Insights", icon: "Users", description: "Understand where your traffic comes from." },
  { label: "Actionable Recommendations", icon: "ListChecks", description: "Get clear next steps to drive better results." },
];

/**
 * Sample report structure.
 *
 * IMPORTANT: this describes the SHAPE of a report only. Every value is an
 * em-dash placeholder so nothing can be mistaken for a real measurement, and
 * the UI labels the whole block "Illustrative".
 */
export const SAMPLE_REPORT_DISCLAIMER =
  "Illustrative only. This shows the structure of the reports we provide — it does not represent any client's results.";

export const sampleReportSections = [
  {
    title: "Search visibility",
    caption: "Trend over time",
    rows: [
      { label: "Impressions", value: "—" },
      { label: "Clicks", value: "—" },
      { label: "Average position", value: "—" },
      { label: "Click-through rate", value: "—" },
    ],
  },
  {
    title: "Traffic sources",
    caption: "Top channels",
    rows: [
      { label: "Organic search", value: "—" },
      { label: "Direct", value: "—" },
      { label: "Referral", value: "—" },
      { label: "Social", value: "—" },
    ],
  },
  {
    title: "Campaign activity",
    caption: "Recent campaigns",
    rows: [
      { label: "Example campaign", value: "Status" },
      { label: "Example campaign", value: "Status" },
      { label: "Example campaign", value: "Status" },
    ],
  },
  {
    title: "Recommended actions",
    caption: "What to focus on next",
    rows: [
      { label: "Improve low-performing pages", value: "—" },
      { label: "Expand content around key topics", value: "—" },
      { label: "Build quality backlinks", value: "—" },
      { label: "Optimize page speed", value: "—" },
    ],
  },
];

export const marketingServices = [
  "Marketing Strategy",
  "Content Strategy",
  "Campaign Planning",
  "Social Media Planning",
  "Brand Positioning",
  "Conversion Optimization",
];

export const seoServiceList = [
  "SEO Audits",
  "Technical SEO",
  "Keyword Research",
  "Content Optimization",
  "On-Page SEO",
  "Performance Reporting",
];
