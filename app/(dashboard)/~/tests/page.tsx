// app/~/tests/page.tsx

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getUserProfile } from "@/lib/supabase/profile"
import { CandidateTestsClient } from "./CandidateTestsClient"
import { RecruiterTestsClient } from "./RecruiterTestsClient"
import {
  deriveStatus,
  type CandidateTest,
  type CandidateTestAttempt,
  type RecruiterTest,
} from "./_types"

export const metadata = {
  title: "Tests",
  description: "Mock Tests",
}

// ─── Candidate data ───────────────────────────────────────────────────────────

async function fetchCandidateTests(userId: string): Promise<CandidateTest[]> {
  const supabase = await createClient()

  // 1. Resolve the candidate's recruiter
  const { data: candidateProfile } = await supabase
    .from("candidate_profiles")
    .select("recruiter_id")
    .eq("profile_id", userId)
    .maybeSingle()

  if (!candidateProfile?.recruiter_id) {
    return []
  }

  // 2. Fetch published tests
  const testsQuery = supabase
    .from("tests")
    .select(
      "id, title, description, time_limit_seconds, available_from, available_until, results_available"
    )
    .eq("status", "published")
    .eq("recruiter_id", candidateProfile.recruiter_id)
    .order("available_from", { ascending: false })

  const { data: rawTests } = await testsQuery
  if (!rawTests?.length) return []

  const testIds = rawTests.map((t) => t.id)

  // 5. Fetch candidate's latest attempts per test
  const { data: rawAttempts } = await supabase
    .from("test_attempts")
    .select("test_id, status, submitted_at, score, total_marks, percentage")
    .eq("student_id", userId)
    .in("test_id", testIds)
    .order("created_at", { ascending: false })

  // 4. Build a raw attempt map
  const rawAttemptMap: Record<string, {
    status: "in_progress" | "submitted"
    submitted_at?: string
    score?: number
    total_marks?: number
    percentage?: number
  }> = {}
  for (const a of rawAttempts ?? []) {
    if (rawAttemptMap[a.test_id]) continue
    rawAttemptMap[a.test_id] = {
      status: a.status as "in_progress" | "submitted",
      submitted_at: a.submitted_at ?? undefined,
      score: a.score ?? undefined,
      total_marks: a.total_marks ?? undefined,
      percentage: a.percentage ?? undefined,
    }
  }

  // 6. Shape into CandidateTest[]
  return rawTests.map((t): CandidateTest => {
    const raw = rawAttemptMap[t.id]

    let attempt: CandidateTestAttempt | undefined
    if (raw) {
      attempt = {
        status: raw.status,
        submitted_at: raw.submitted_at,
        score: raw.score,
        total_marks: raw.total_marks,
        percentage: raw.percentage,
      }
    }

    return {
      id: t.id,
      title: t.title,
      description: t.description ?? undefined,
      time_limit_seconds: t.time_limit_seconds ?? undefined,   // ← undefined = no limit
      available_from: t.available_from ?? undefined,
      available_until: t.available_until ?? undefined,         // ← included
      derived_status: deriveStatus(
        "published",
        t.available_from,
        t.available_until
      ) as CandidateTest["derived_status"],
      results_available: t.results_available,
      attempt,
    }
  })
}

// ─── Recruiter data ───────────────────────────────────────────────────────────

async function fetchRecruiterTests(userId: string): Promise<RecruiterTest[]> {
  const supabase = await createClient()

  const { data: rawTests } = await supabase
    .from("view_test_summary")
    .select("*")
    .eq("recruiter_id", userId)
    .order("id", { ascending: false }) // Fallback order if created_at not in view (it is not, let me check)

  // Note: I should add created_at to view_test_summary if I want to maintain the same order.
  // Actually, I'll update the view definition to include created_at.

  return (rawTests ?? []).map((t): RecruiterTest => ({
    id: t.id ?? "",
    title: t.title ?? "Untitled",
    description: (t as any).description ?? undefined,
    time_limit_seconds: t.time_limit_seconds ?? undefined,
    available_from: t.available_from ?? undefined,
    available_until: t.available_until ?? undefined,
    derived_status: deriveStatus(t.status ?? "draft", t.available_from ?? null, t.available_until ?? null),
    status: (t.status as "draft" | "published") ?? "draft",
    results_available: (t as any).results_available ?? false,
    question_count: t.question_count ?? 0,
    attempt_count: t.attempt_count ?? 0,
  }))
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function TestsPage() {
  const profile = await getUserProfile()
  if (!profile) return null

  if (profile.account_type === "candidate") {
    const tests = await fetchCandidateTests(profile.id)
    return <CandidateTestsClient tests={tests} />
  }

  if (profile.account_type === "recruiter") {
    const tests = await fetchRecruiterTests(profile.id)
    return <RecruiterTestsClient tests={tests} />
  }

  redirect("/~/tests")
}
