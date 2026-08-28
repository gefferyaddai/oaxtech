/**
 * Company data — who OAX Tech is, how we work, and the story video.
 *
 * This file replaced `team.ts`. The per-person roster that used to live here
 * (five profile cards with monogram placeholders standing in for photographs
 * nobody had supplied) is gone: the company story is told in Geffery's recorded
 * video instead, which is both truer and does not depend on artwork that never
 * arrived.
 *
 * CONTENT RULE: everything here is taken verbatim from the approved copy. No
 * history, founding dates, headcount or achievements are invented — anything
 * not supplied is left as a marked placeholder rather than filled in.
 */

/* -------------------------------------------------------------------------- */
/* Story video                                                                */
/* -------------------------------------------------------------------------- */

export interface StoryVideo {
  /**
   * Path under /public, e.g. "/video/oax-story.mp4".
   *
   * null until the video is recorded. `StoryVideoPlate` renders a marked
   * "footage pending" field while this is null — it never ships a broken
   * player or a fake thumbnail.
   */
  src: string | null;
  /** Poster frame under /public. null = the drawn placeholder is used. */
  poster: string | null;
  /**
   * WebVTT captions under /public, e.g. "/video/oax-story.en.vtt".
   *
   * Required before the video goes live: an uncaptioned video is unusable for
   * deaf and hard-of-hearing visitors, and a spoken-word company story is
   * exactly the case where that matters most.
   */
  captions: string | null;
  /** Human-readable runtime, e.g. "6:20". null until known. */
  duration: string | null;
  title: string;
  description: string;
  /**
   * What the video walks through. Written text, not derived from the footage —
   * it is what a visitor who cannot or will not play video still gets, and it
   * is the only part of this section a search engine can read.
   */
  covers: { label: string; description: string }[];
}

export const storyVideo: StoryVideo = {
  // ▼ Drop the recording in /public/video/ and set these three paths.
  src: null,
  poster: null,
  captions: null,
  duration: null,
  title: "The OAX Tech Story",
  description:
    "Geffery walks through where OAX Tech came from, what we build, and how we work with the businesses and organizations that come to us.",
  covers: [
    {
      label: "Where OAX Tech started",
      description: "How the company began and the gap in the market it was built to close.",
    },
    {
      label: "What we actually do",
      description: "Websites, custom software, AI and automation, marketing and SEO — under one roof.",
    },
    {
      label: "How we work",
      description: "The process a project runs through, and what you can expect at each stage.",
    },
    {
      label: "Who we build for",
      description: "The businesses, organizations and community groups we work with, and why.",
    },
  ],
};

/* -------------------------------------------------------------------------- */
/* What we bring                                                              */
/* -------------------------------------------------------------------------- */

/** Value pillars shown under the Learn More hero. */
export const companyStrengths = [
  { label: "Technical Expertise", icon: "Code2", description: "Engineers and developers who build reliable, scalable and future-ready solutions." },
  { label: "Business Perspective", icon: "BarChart3", description: "Strategists and analysts who align technology with real business outcomes." },
  { label: "Collaborative Process", icon: "Users", description: "We share insights, challenge ideas and co-create the best path forward." },
  { label: "Client-Focused", icon: "UserRound", description: "Everything we do is centered around delivering meaningful results for our clients." },
];

export const technicalExpertise = [
  "Websites and Web Applications",
  "Custom Software Development",
  "Mobile-Responsive Experiences",
  "AI Integrations and Automation",
];

export const businessExpertise = [
  "Marketing Strategy and Branding",
  "SEO and Digital Visibility",
  "Client Strategy and Positioning",
  "Outreach and Growth Planning",
];

export const collaborationPrinciples = [
  { label: "Clear Communication", icon: "MessageSquare", description: "We communicate openly and proactively so everyone stays informed and aligned." },
  { label: "Shared Ownership", icon: "Users", description: "We take responsibility together and treat every project as our own." },
  { label: "Thoughtful Execution", icon: "Settings", description: "We focus on quality, accuracy and delivering work we're proud of." },
  { label: "Continuous Improvement", icon: "RefreshCw", description: "We reflect, learn and evolve so each project is better than the last." },
];

export const growWithUs = [
  {
    label: "Career & Internship Opportunities",
    icon: "GraduationCap",
    description: "Gain real-world experience, build your skills and learn from a collaborative team that supports your growth.",
    ctaLabel: "View Opportunities",
    ctaHref: "/contact?subject=Partnership+or+community+project",
  },
  {
    label: "Project Collaboration",
    icon: "HeartHandshake",
    description: "Partner with us on projects that create impact and help your business move forward.",
    ctaLabel: "Introduce Yourself",
    ctaHref: "/contact",
  },
];

/** Community work described on the about page. */
export const communityWork = [
  {
    label: "Community Projects",
    icon: "HeartHandshake",
    description: "We build free or discounted websites and digital tools for community organizations and student groups.",
  },
  {
    label: "Student & Local-Business Support",
    icon: "GraduationCap",
    description: "We support students and local businesses with practical resources, guidance and digital solutions.",
  },
];

export const missionVision = {
  mission: {
    heading: "Help businesses use technology and marketing more effectively.",
    body: "We provide clear strategies, custom solutions and ongoing support so our clients can streamline operations, reach the right audience and achieve sustainable growth.",
  },
  vision: {
    heading: "Become a trusted digital partner for growing organizations.",
    body: "We aim to be the go-to partner for businesses and organizations seeking practical technology, meaningful marketing and lasting digital success.",
  },
} as const;