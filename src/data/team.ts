/**
 * Team data.
 *
 * CONTENT RULE: names, roles, descriptions and skill tags are taken verbatim
 * from the approved mockups. No education, employment history, certifications
 * or achievements are added.
 *
 * PHOTOS: no real photographs were supplied. `photo` is null for everyone, and
 * `TeamMemberCard` renders a neutral monogram placeholder. Drop approved
 * artwork into /public/team/ and set the `photo` path to use it. Do not
 * substitute AI-generated portraits for real photographs.
 */

export interface TeamMember {
  slug: string;
  name: string;
  role: string;
  /** Description as shown in the team mockup. */
  bio: string;
  /** Skill tags shown on the team page. */
  tags: string[];
  /** Path under /public. null = use the monogram placeholder. */
  photo: string | null;
  /** PLACEHOLDER: no LinkedIn URLs were supplied. */
  linkedIn: string | null;
}

export const team: TeamMember[] = [
  {
    slug: "geffery-addai",
    name: "Geffery Addai",
    role: "Co-Founder & Full-Stack Developer",
    bio: "Computer Science student and full-stack developer focused on React, FastAPI, AI integrations and workflow automation.",
    tags: ["React", "FastAPI", "AI Integration", "Full-Stack Development"],
    photo: null,
    linkedIn: null,
  },
  {
    slug: "morgan-lee",
    name: "Morgan Lee",
    role: "Backend Developer",
    bio: "Computer Science student focused on backend systems, reliable application logic and scalable technical foundations.",
    tags: ["Backend Development", "APIs", "Databases", "System Design"],
    photo: null,
    linkedIn: null,
  },
  {
    slug: "chijioke-obi",
    name: "Chijioke Obi",
    role: "Co-Founder",
    bio: "Works across machine learning, product direction and the practical application of AI to real-world problems.",
    tags: ["Machine Learning", "AI Strategy", "Product Direction", "Innovation"],
    photo: null,
    linkedIn: null,
  },
  {
    slug: "lorenzo-vargas",
    name: "Lorenzo Vargas",
    role: "Business Outreach Specialist",
    bio: "Builds relationships, identifies opportunities and connects organizations with practical digital solutions.",
    tags: ["Business Development", "Client Relations", "Partnerships", "Outreach"],
    photo: null,
    linkedIn: null,
  },
  {
    slug: "nazeeh-hammad",
    name: "Nazeeh Hammad",
    role: "Development Analyst",
    bio: "Supports planning, analysis and development decisions that keep projects aligned with business goals.",
    tags: ["Analysis", "Project Planning", "Research", "Development Support"],
    photo: null,
    linkedIn: null,
  },
];

/** Team page value pillars. */
export const teamStrengths = [
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
