export interface FAQ {
  question: string;
  answer: string;
}

/**
 * CONTENT RULE: no response-time guarantees, ranking guarantees or payment
 * terms are stated. Answers describe how we work, and defer specifics to the
 * written proposal or a conversation.
 */

export const homeFaqs: FAQ[] = [
  {
    question: "How long does a website project take?",
    answer:
      "It depends on scope. A one-page site is typically the fastest, while multi-page and custom builds take longer. We confirm a timeline with you in writing before work starts, and you can see indicative ranges on our pricing page.",
  },
  {
    question: "Can you build custom software for our business?",
    answer:
      "Yes. We build web applications, internal tools, dashboards, client portals, API integrations and workflow automation. Custom software is always quoted after a discovery conversation, because the scope drives the cost.",
  },
  {
    question: "Do you offer ongoing support?",
    answer:
      "Yes. Ongoing maintenance and support are optional and can be added after launch. We'll talk through what level of support makes sense for your situation rather than pushing a fixed retainer.",
  },
  {
    question: "What's included in your SEO services?",
    answer:
      "Depending on the package: technical and on-page audits, keyword research, local SEO and Google Business Profile optimization, content guidance and performance reporting. We don't guarantee specific rankings — no one credibly can.",
  },
  {
    question: "Will my website be SEO-friendly?",
    answer:
      "Every site we build includes SEO fundamentals: clean semantic structure, fast load times, mobile responsiveness, proper metadata and analytics. Deeper SEO work is available as a separate service.",
  },
  {
    question: "How do we get started?",
    answer:
      "Book a free 30-minute consultation or send a quote request. We'll talk through your goals, recommend an approach, and follow up with a written proposal covering scope, timeline and cost.",
  },
];

export const pricingFaqs: FAQ[] = [
  {
    question: "Are these prices final?",
    answer:
      "The one-page website is a fixed starting price. The business and advanced packages are starting prices — final cost depends on page count, features, integrations and timeline. You'll receive a written proposal with the exact figure before any work begins.",
  },
  {
    question: "Are domain and hosting included?",
    answer:
      "Domain registration and hosting are billed separately by the provider you choose. We'll recommend options, help you set them up, and pass through any third-party costs at cost with your approval.",
  },
  {
    question: "Is a deposit required?",
    answer:
      "Yes, a deposit is required to secure your project and begin work. The exact amount and schedule are confirmed in your proposal.",
  },
  {
    question: "Do you offer payment plans?",
    answer:
      "Projects are billed against the milestone schedule agreed in your proposal. If you need a different arrangement, raise it during the consultation and we'll tell you what's possible.",
  },
  {
    question: "What could increase the project cost?",
    answer:
      "Additional pages, custom features, third-party integrations, e-commerce, content creation, and scope added after the proposal is signed. We flag cost implications before doing the work, not after.",
  },
  {
    question: "Is maintenance included after launch?",
    answer:
      "Maintenance is optional rather than bundled. You can add it after launch based on what your site actually needs.",
  },
];

export const bookingFaqs: FAQ[] = [
  {
    question: "Is the consultation really free?",
    answer:
      "Yes. The consultation is a free 30-minute conversation with no obligation. It's a chance to talk through your goals and get a recommendation — not a sales call with a hidden fee.",
  },
  {
    question: "What should I prepare?",
    answer:
      "Nothing formal. It helps to have a rough sense of your goals, your timeline, any examples you like, and whether you have an existing website. If you don't have those yet, that's exactly what the call is for.",
  },
  {
    question: "Can I reschedule?",
    answer:
      "Yes. Reply to the email confirming your booking and we'll find another time. Once our calendar integration is live you'll be able to reschedule directly from your confirmation.",
  },
  {
    question: "Will I receive a reminder?",
    answer:
      "Once calendar and email integrations are connected, you'll receive a calendar invitation and a reminder before the call. Until then, we confirm every booking by email manually.",
  },
];

export const quoteFaqs: FAQ[] = [
  {
    question: "How quickly will I receive a response?",
    answer:
      "We review each request individually and reply as soon as we've had a proper look at it. If your timeline is tight, say so in your description and we'll prioritise accordingly.",
  },
  {
    question: "Is this quote final?",
    answer:
      "No. A quote request starts a conversation. We'll review your requirements, ask clarifying questions if needed, and send a written proposal with a firm scope and price.",
  },
  {
    question: "Do I need to know my exact requirements?",
    answer:
      "No. Select “Not Sure Yet” for anything you haven't decided. Part of our job is helping you work out what you actually need.",
  },
  {
    question: "Can I update my request later?",
    answer:
      "Yes. Reply to your request or send a new message and we'll update it. Nothing is locked in until a proposal is signed.",
  },
];

export const marketingFaqs: FAQ[] = [
  {
    question: "How long does SEO take?",
    answer:
      "SEO is a long-term investment. Technical fixes can show results relatively quickly, while content and authority-building take considerably longer. Anyone promising fast, guaranteed results is overselling.",
  },
  {
    question: "Do you work with existing websites?",
    answer:
      "Yes. We audit and improve existing sites regularly. If a rebuild would serve you better than patching, we'll tell you and explain why.",
  },
  {
    question: "Can you guarantee first-page rankings?",
    answer:
      "No, and we won't claim otherwise. Search rankings are controlled by search engines and shift constantly. What we can do is apply sound, proven practices and report honestly on what changes.",
  },
  {
    question: "Is content creation included?",
    answer:
      "Content strategy and guidance are part of our marketing and SEO work. Full content production is scoped separately depending on volume and format.",
  },
  {
    question: "What is included in a marketing strategy?",
    answer:
      "Audience and market analysis, positioning, channel recommendations, campaign planning and a practical roadmap you can act on.",
  },
  {
    question: "How is performance reported?",
    answer:
      "With clear reports covering visibility trends, keyword movement, traffic sources and recommended next steps — written to be understood, not to impress.",
  },
];

export const contactFaqs: FAQ[] = [
  {
    question: "What services does OAX Tech offer?",
    answer:
      "Website design and development, custom software, marketing consulting, SEO, and AI and workflow automation. You can see the full breakdown on our services page.",
  },
  {
    question: "How quickly will I receive a response?",
    answer:
      "We read every message and reply once we've had a proper look. If something is urgent, mention it in your message.",
  },
  {
    question: "Do you work with businesses outside Calgary?",
    answer:
      "Yes. We're based in Calgary, Alberta and work with clients across Alberta and Canada. Most of our work happens remotely.",
  },
  {
    question: "Can I book a free consultation?",
    answer:
      "Yes. Book a free 30-minute consultation with no obligation — pick a service and a time that suits you.",
  },
  {
    question: "What information should I include?",
    answer:
      "Your goals, rough timeline, whether you have an existing site, and anything you've already tried. The more context, the more useful our first reply will be.",
  },
  {
    question: "Do you offer ongoing support?",
    answer:
      "Yes. Ongoing maintenance and support can be arranged after launch based on what your project needs.",
  },
];
