import { createClient } from "@/lib/supabase/server";
import { getUserProfile } from "@/lib/supabase/profile";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BookOpen,
  PlayCircle,
  CalendarClock,
  CheckCircle2,
  Users,
  ListCheck,
  PenLine,
  Briefcase,
  FileText,
} from "lucide-react";


// ─── Types ───────────────────────────────────────────────────────────────────

interface CandidateStatsResponse {
  profile: any;
  stats: {
    total_tests: number;
    live_tests: number;
    upcoming_tests: number;
    completed_tests: number;
  };
}

interface RecruiterStatsResponse {
  profile: any;
  stats: {
    total_tests: number;
    live_tests: number;
    upcoming_tests: number;
    past_tests: number;
    draft_tests: number;
    total_attempts: number;
  };
}


// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  accent?: "green" | "amber" | "blue" | "muted";
}) {
  const accentClass =
    accent === "green"
      ? "text-emerald-600 dark:text-emerald-400"
      : accent === "amber"
      ? "text-amber-600 dark:text-amber-400"
      : accent === "blue"
      ? "text-blue-600 dark:text-blue-400"
      : "text-foreground";

  return (
    <div className="rounded-lg border bg-card p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <span className="text-muted-foreground/50">{icon}</span>
      </div>
      <p className={`text-2xl font-bold tabular-nums tracking-tight ${accentClass}`}>
        {value}
      </p>
    </div>
  );
}


// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </p>
      <Link
        href={href}
        className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
      >
        View all
        <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  );
}


// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const profile = await getUserProfile();
  if (!profile) return null;

  const supabase = await createClient();

  // ── Candidate ──────────────────────────────────────────────────────────────
  if (profile.account_type === "candidate") {
    const { data } = await supabase.rpc("get_candidate_home_stats", {
      p_profile_id: profile.id,
    });

    const candidateData = data as unknown as CandidateStatsResponse;
    const cp = candidateData?.profile;
    const stats = candidateData?.stats;

    const isComplete = cp?.profile_complete === true;
    const hasBeenSaved = cp?.profile_updated === true;
    const profileReady = isComplete && hasBeenSaved;

    const profileSubtitle = !cp
      ? "You haven't set up your profile yet. Fill in your details to access all features."
      : !hasBeenSaved
      ? "Your profile has been started but not saved yet."
      : "A few required fields are still missing.";

    return (
      <div className="min-h-screen w-full">
        <div className="px-4 pt-8 pb-0 md:px-8">
          <div className="space-y-0.5">
            <h1 className="text-xl font-semibold tracking-tight">Home</h1>
            <p className="text-sm text-muted-foreground">
              Welcome back{profile.username ? `, @${profile.username}` : ""}
            </p>
          </div>
        </div>

        <div className="px-4 py-6 md:px-8 md:py-8 space-y-6">
          {/* ── Profile banner ───────────────────────────────────────────── */}
          {!profileReady && (
            <div className="rounded-lg border bg-card p-4 flex items-start justify-between gap-4">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Your profile isn't complete yet</p>
                <p className="text-xs text-muted-foreground">{profileSubtitle}</p>
              </div>
              <Link href="/~/settings" className="shrink-0">
                <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs">
                  Complete Profile
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          )}

          {/* ── Test Stats ───────────────────────────────────────────────── */}
          {cp?.recruiter_id && stats && (
            <div className="space-y-3">
              <SectionHeader title="Tests Overview" href="/~/tests" />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatCard
                  icon={<BookOpen className="h-4 w-4" />}
                  label="Assigned"
                  value={stats.total_tests}
                />
                <StatCard
                  icon={<PlayCircle className="h-4 w-4" />}
                  label="Live Now"
                  value={stats.live_tests}
                  accent={stats.live_tests > 0 ? "green" : "muted"}
                />
                <StatCard
                  icon={<CalendarClock className="h-4 w-4" />}
                  label="Upcoming"
                  value={stats.upcoming_tests}
                  accent={stats.upcoming_tests > 0 ? "amber" : "muted"}
                />
                <StatCard
                  icon={<CheckCircle2 className="h-4 w-4" />}
                  label="Completed"
                  value={stats.completed_tests}
                  accent={stats.completed_tests > 0 ? "blue" : "muted"}
                />
              </div>
            </div>
          )}

          {/* ── View Tests CTA (when profile ready but no recruiter) ─────── */}
          {profileReady && !cp?.recruiter_id && (
            <div className="rounded-lg border bg-card p-4 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Looking for tests?</p>
                <p className="text-xs text-muted-foreground">
                  Browse available assessments assigned to you.
                </p>
              </div>
              <Link href="/~/tests" className="shrink-0">
                <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs">
                  View Tests
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Recruiter ──────────────────────────────────────────────────────────────
  if (profile.account_type === "recruiter") {
    const { data } = await supabase.rpc("get_recruiter_home_stats", {
      p_profile_id: profile.id,
    });

    const [{ count: opportunitiesCount }, { count: applicationsCount }] = await Promise.all([
      supabase.from("opportunities").select("*", { count: "exact", head: true }).eq("recruiter_id", profile.id),
      supabase.from("applications").select(`*, opportunities!inner(*)`, { count: "exact", head: true }).eq("opportunities.recruiter_id", profile.id)
    ]);

    const recruiterData = data as unknown as RecruiterStatsResponse;
    const ip = recruiterData?.profile;
    const stats = recruiterData?.stats;

    const isComplete = ip?.profile_complete === true;
    const hasBeenSaved = ip?.profile_updated === true;
    const profileReady = isComplete && hasBeenSaved;

    const profileSubtitle = !ip
      ? "You haven't set up your company profile yet. Add your details to get started."
      : !hasBeenSaved
      ? "Your profile has been started but not saved yet."
      : "A few required fields are still missing.";

    return (
      <div className="min-h-screen w-full">
        <div className="px-4 pt-8 pb-0 md:px-8">
          <div className="space-y-0.5">
            <h1 className="text-xl font-semibold tracking-tight">Home</h1>
            <p className="text-sm text-muted-foreground">
              Welcome back{profile.username ? `, @${profile.username}` : ""}
            </p>
          </div>
        </div>

        <div className="px-4 py-6 md:px-8 md:py-8 space-y-6">
          {/* ── Profile banner ───────────────────────────────────────────── */}
          {!profileReady && (
            <div className="rounded-lg border bg-card p-4 flex items-start justify-between gap-4">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Your company profile isn't complete yet</p>
                <p className="text-xs text-muted-foreground">{profileSubtitle}</p>
              </div>
              <Link href="/~/settings" className="shrink-0">
                <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs">
                  Complete Profile
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          )}
          
          {/* ── Hiring Pipeline Stats ───────────────────────────────────────────────── */}
          <div className="space-y-3">
            <SectionHeader title="Hiring Pipeline" href="/~/postings" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard
                icon={<Briefcase className="h-4 w-4" />}
                label="Job Postings"
                value={opportunitiesCount || 0}
              />
              <StatCard
                icon={<FileText className="h-4 w-4" />}
                label="Applications Total"
                value={applicationsCount || 0}
                accent={(applicationsCount && applicationsCount > 0) ? "green" : "muted"}
              />
              <StatCard
                icon={<Users className="h-4 w-4" />}
                label="Test Attempts"
                value={stats?.total_attempts || 0}
                accent={(stats?.total_attempts && stats.total_attempts > 0) ? "blue" : "muted"}
              />
            </div>
          </div>

          {/* ── Test Stats ───────────────────────────────────────────────── */}
          {stats && (
            <div className="space-y-3">
              <SectionHeader title="Assessments Overview" href="/~/tests" />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                <StatCard
                  icon={<ListCheck className="h-4 w-4" />}
                  label="Total Tests"
                  value={stats.total_tests}
                />
                <StatCard
                  icon={<PlayCircle className="h-4 w-4" />}
                  label="Live"
                  value={stats.live_tests}
                  accent={stats.live_tests > 0 ? "green" : "muted"}
                />
                <StatCard
                  icon={<CalendarClock className="h-4 w-4" />}
                  label="Upcoming"
                  value={stats.upcoming_tests}
                  accent={stats.upcoming_tests > 0 ? "amber" : "muted"}
                />
                <StatCard
                  icon={<CheckCircle2 className="h-4 w-4" />}
                  label="Past"
                  value={stats.past_tests}
                />
                <StatCard
                  icon={<PenLine className="h-4 w-4" />}
                  label="Drafts"
                  value={stats.draft_tests}
                />
                <StatCard
                  icon={<Users className="h-4 w-4" />}
                  label="Attempts"
                  value={stats.total_attempts}
                  accent={stats.total_attempts > 0 ? "blue" : "muted"}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  redirect("/~/home");
}