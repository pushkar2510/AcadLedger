// app/privacy-policy/page.tsx
// NO "use client" — this is a Server Component.
// Interactive sidebar & mobile TOC are split into their own client components below.

import { cn } from "@/lib/utils";
import { FullWidthDivider } from "@/components/ui/landing/full-width-divider";
import { GridPattern } from "@/components/ui/landing/grid-pattern";
import { HeaderWrapper } from "@/components/header-wrapper";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { PrivacyScrollNav } from "@/components/legal/scroll-nav"; // client component

// ─── Data ─────────────────────────────────────────────────────────────────────

const EFFECTIVE_DATE = "March 31, 2026";

export const sectionsMeta = [
  { id: "introduction", short: "Introduction" },
  { id: "what-we-collect", short: "What We Collect" },
  { id: "how-we-use", short: "How We Use It" },
  { id: "sharing", short: "Sharing" },
  { id: "security", short: "Security" },
  { id: "retention", short: "Retention" },
  { id: "your-rights", short: "Your Rights" },
  { id: "ai-features", short: "Future Features" },
  { id: "changes", short: "Policy Changes" },
  { id: "contact", short: "Contact" },
];

// ─── Section content ──────────────────────────────────────────────────────────

function Introduction() {
  return (
    <>
      <p>
        Welcome to <strong>SkillBridge</strong>. This Privacy Policy explains how we
        ("SkillBridge," "we," "us," or "our") collect, use, share, and protect
        information in relation to our platform and services (collectively,
        the "Service"). This policy applies to all users — Students, Job Seekers,
        Employers, and Recruiters.
      </p>
      <p>
        By using our Service to discover opportunities, manage verified credentials,
        and connect with employers, you agree to the practices described in this policy.
      </p>
    </>
  );
}

function WhatWeCollect() {
  return (
    <>
      <h3>From You Directly</h3>
      <p>
        When you use the Service, you may provide: your name, email address,
        mobile number, educational background, skills, interests, resume or CV uploads,
        and application history.
      </p>
      <h3>From Institutional Partners & Blockchain</h3>
      <p>
        If applicable, verified academic credentials and achievements may be securely linked
        to your profile via institutional partners or decentralized ledger technology to validate
        your qualifications.
      </p>
      <h3>Automatically Collected</h3>
      <p>
        We automatically collect usage metrics, application statistics, interaction data
        with our AI recommendation engine, and device information to optimize your experience.
      </p>
    </>
  );
}

function HowWeUse() {
  return (
    <>
      <p>We use the information we collect strictly to provide and improve the Service. This includes:</p>
      <ul>
        <li>Managing your account and personalizing your dashboard.</li>
        <li>Providing AI-driven job and internship recommendations based on your profile.</li>
        <li>Facilitating verified credential sharing and employer connections.</li>
        <li>Processing your applications to jobs and internships.</li>
        <li>Sending transactional notifications and relevant opportunity alerts.</li>
      </ul>
      <p>We do not sell your personal information or use it for advertising outside the scope of career facilitation.</p>
    </>
  );
}

function Sharing() {
  return (
    <>
      <p>We share your information only in the following limited circumstances:</p>
      <ul>
        <li><strong>Potential Employers & Recruiters</strong> — When you explicitly apply for an opportunity or opt-in to be discoverable, your profile, verified credentials, and resume are shared with employers.</li>
        <li><strong>Service Providers</strong> — Cloud hosting and AI infrastructure providers process data on our behalf under strict data processing agreements.</li>
        <li><strong>Legal Obligations</strong> — We may disclose information when required by law, court order, or governmental authority.</li>
      </ul>
    </>
  );
}

function Security() {
  return (
    <>
      <p>
        We store your data on secure cloud infrastructure, which provides
        encryption in transit (TLS) and at rest. Access to personal data is restricted
        to authorized personnel with a legitimate need.
      </p>
      <p>
        While we implement industry-standard safeguards, no digital system can guarantee
        absolute security. We encourage you to use strong passwords and log out when
        using shared devices.
      </p>
    </>
  );
}

function Retention() {
  return (
    <p>
      Your data is retained for as long as you maintain an active account on SkillBridge.
      If you choose to delete your account, your personal data will be securely erased,
      though certain anonymized or blockchain-anchored records may remain immutable by their nature.
    </p>
  );
}

function YourRights() {
  return (
    <>
      <p>You have the following rights with respect to your personal data:</p>
      <ul>
        <li><strong>Access & Correction</strong> — View and edit your profile information, skills, and preferences directly in the app.</li>
        <li><strong>Resume Management</strong> — Upload, replace, or remove your resume at any time.</li>
        <li><strong>Account Deletion</strong> — Request deletion of your account and personal data through the platform settings.</li>
      </ul>
      <p>
        Where required by applicable law, you may also have rights to data portability and the right to withdraw
        consent for specific data uses.
      </p>
    </>
  );
}

function AiFeatures() {
  return (
    <p>
      SkillBridge uses AI to provide intelligent internship and job recommendations.
      Our recommendation engine processes your profile data (skills, interests, experience)
      against available opportunities to calculate match scores. Your data is not used to train
      third-party foundational models without your explicit consent.
    </p>
  );
}

function Changes() {
  return (
    <p>
      We may update this Privacy Policy from time to time to reflect changes in our
      practices or applicable law. Material changes will update the "Effective Date" above
      and be notified via the platform. Continued use after changes constitutes your acceptance.
    </p>
  );
}

function Contact() {
  return (
    <>
      <p>
        For questions about your personal data or technical inquiries, please reach out to our team.
      </p>
      <p>
        Email us at:{" "}
        <a href="mailto:support@SkillBridge.com">
          support@SkillBridge.com
        </a>
      </p>
    </>
  );
}

const sectionContent: Record<string, React.ReactNode> = {
  introduction: <Introduction />,
  "what-we-collect": <WhatWeCollect />,
  "how-we-use": <HowWeUse />,
  sharing: <Sharing />,
  security: <Security />,
  retention: <Retention />,
  "your-rights": <YourRights />,
  "ai-features": <AiFeatures />,
  changes: <Changes />,
  contact: <Contact />,
};

const sectionTitles: Record<string, string> = {
  introduction: "Introduction",
  "what-we-collect": "Information We Collect",
  "how-we-use": "How We Use Your Information",
  sharing: "How We Share Your Information",
  security: "Data Storage & Security",
  retention: "Data Retention",
  "your-rights": "Your Rights & Choices",
  "ai-features": "Future AI-Powered Features",
  changes: "Changes to This Policy",
  contact: "Contact Us",
};

// ─── Section Block ────────────────────────────────────────────────────────────

const proseClasses = cn(
  "text-sm leading-[1.8] text-muted-foreground",
  "[&_p]:mb-3 [&_p:last-child]:mb-0",
  "[&_ul]:mb-3 [&_ul]:space-y-1.5 [&_ul]:pl-4",
  "[&_li]:relative [&_li]:pl-3",
  "[&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[0.6em]",
  "[&_li]:before:size-1 [&_li]:before:rounded-full [&_li]:before:bg-border",
  "[&_h3]:mt-5 [&_h3]:mb-2 [&_h3]:text-[10px] [&_h3]:font-medium",
  "[&_h3]:text-foreground/60 [&_h3]:uppercase [&_h3]:tracking-[0.12em] [&_h3]:font-mono",
  "[&_strong]:font-medium [&_strong]:text-foreground/80",
  "[&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4",
  "[&_a]:hover:text-foreground/70 [&_a]:transition-colors"
);

function SectionBlock({ id, index }: { id: string; index: number }) {
  return (
    <article id={id} className="relative scroll-mt-24 py-10 first:pt-0">
      <div className="mb-6 flex items-center gap-3">
        <span className="font-mono text-[11px] text-muted-foreground/50 shrink-0">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>
      <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
        {sectionTitles[id]}
      </h2>
      <div className={proseClasses}>{sectionContent[id]}</div>
    </article>
  );
}

// ─── Page (Server Component) ──────────────────────────────────────────────────

export default function PrivacyPolicyPage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden supports-[overflow:clip]:overflow-clip">
      <HeaderWrapper />

      <main
        className={cn(
          "relative mx-auto w-full max-w-4xl grow",
          "sm:before:absolute sm:before:-inset-y-14 sm:before:-left-px sm:before:w-px sm:before:bg-border",
          "sm:after:absolute sm:after:-inset-y-14 sm:after:-right-px sm:after:w-px sm:after:bg-border"
        )}
      >
        {/* ── Editorial Hero ─────────────────────────────────────── */}
        <section className="relative overflow-hidden border-b px-4 pb-10 pt-14 sm:px-8 sm:pt-16 md:px-10">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 opacity-25">
            <GridPattern className="size-full stroke-border" height={32} width={32} x={0} y={0} />
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_60%_at_50%_0%,theme(--color-foreground/.07),transparent)]"
          />

          <div className="fade-in slide-in-from-bottom-6 animate-in fill-mode-backwards delay-100 duration-500 ease-out flex items-center gap-2 mb-5">
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60 border rounded-sm px-2 py-0.5">
              Legal
            </span>
            <span className="text-muted-foreground/40 text-xs">·</span>
            <span className="font-mono text-[10px] text-muted-foreground/60">
              Effective {EFFECTIVE_DATE}
            </span>
          </div>

          <h1 className="fade-in slide-in-from-bottom-6 animate-in fill-mode-backwards delay-200 duration-500 ease-out text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl max-w-2xl">
            Privacy
            <br />
            <span className="text-muted-foreground/40">Policy</span>
          </h1>

          <p className="fade-in slide-in-from-bottom-6 animate-in fill-mode-backwards delay-300 duration-500 ease-out mt-5 max-w-lg text-sm text-muted-foreground leading-relaxed sm:text-base">
            How SkillBridge collects, uses, and protects your data — explained plainly.
            Our priority is your privacy, security, and career success.
          </p>

          <div className="fade-in slide-in-from-bottom-6 animate-in fill-mode-backwards delay-400 duration-500 ease-out mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t pt-5 text-[11px] font-mono text-muted-foreground/50">
            <span>Last updated: {EFFECTIVE_DATE}</span>
            <span className="hidden sm:inline">·</span>
            <span>{sectionsMeta.length} sections</span>
            <span className="hidden sm:inline">·</span>
            <Link
              href="/terms-of-service"
              className="text-foreground/60 hover:text-foreground transition-colors underline underline-offset-2"
            >
              Terms of Service →
            </Link>
          </div>
        </section>

        {/* ── Body: client ScrollNav + static content ────────────── */}
        <div className="flex gap-0 lg:gap-10 px-4 sm:px-8 md:px-10 py-10">
          {/*
            PrivacyScrollNav is "use client" — handles:
              - sticky sidebar with active-section highlight
              - collapsible mobile TOC
            It receives the section metadata as a plain serialisable prop.
          */}
          <PrivacyScrollNav sections={sectionsMeta} />

          <div className="min-w-0 flex-1 divide-y divide-border/50">
            {sectionsMeta.map((s, i) => (
              <SectionBlock key={s.id} id={s.id} index={i} />
            ))}
          </div>
        </div>


        <Footer />
      </main>
    </div>
  );
}