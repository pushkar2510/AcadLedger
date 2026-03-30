import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getUserProfile } from "@/lib/supabase/profile"
import { RecruiterPostingsClient } from "./RecruiterPostingsClient"
import type { Opportunity, OpportunityStatus } from "./_types"

export const metadata = {
  title: "Job Postings",
  description: "Manage Job Postings and Opportunities",
}

async function fetchRecruiterPostings(userId: string): Promise<Opportunity[]> {
  const supabase = await createClient()

  const { data: rawOpportunities } = await supabase
    .from("opportunities")
    .select(`
      *,
      applications (id)
    `)
    .eq("recruiter_id", userId)
    .order("created_at", { ascending: false })

  return (rawOpportunities ?? []).map((o): Opportunity => ({
    id: o.id,
    recruiter_id: o.recruiter_id,
    title: o.title,
    description: o.description,
    required_skills: (o.required_skills as string[]) ?? [],
    associated_test_id: o.associated_test_id ?? undefined,
    stipend: o.stipend ?? undefined,
    duration: o.duration ?? undefined,
    location: o.location ?? undefined,
    is_remote: o.is_remote ?? false,
    application_deadline: o.application_deadline ?? undefined,
    max_applications: o.max_applications ?? undefined,
    status: (o.status as OpportunityStatus) ?? "draft",
    created_at: o.created_at,
    updated_at: o.updated_at || o.created_at,
    application_count: o.applications?.length ?? 0
  }))
}

export default async function PostingsPage() {
  const profile = await getUserProfile()
  if (!profile) return null

  if (profile.account_type === "recruiter") {
    const postings = await fetchRecruiterPostings(profile.id)
    return <RecruiterPostingsClient postings={postings} />
  }

  // Add functionality for admin later, or candidate routing
  if (profile.account_type === "candidate") {
     // Usually candidates will go to /jobs
     return <div>Candidate view not implemented here yet. Go to /jobs</div>
  }

  redirect("/~/home")
}
