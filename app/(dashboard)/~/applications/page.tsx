import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getUserProfile } from "@/lib/supabase/profile"
import { RecruiterApplicationsClient } from "./RecruiterApplicationsClient"

export const metadata = {
  title: "Applications (ATS)",
  description: "Manage candidate applications and hiring pipeline",
}

export type ApplicationStatus = "pending" | "reviewed" | "shortlisted" | "rejected" | "hired";

export interface ATSApplication {
  id: string;
  opportunity_id: string;
  candidate_id: string;
  status: ApplicationStatus;
  resume_path?: string;
  cover_letter?: string;
  applied_at: string;
  
  candidate_name: string;
  candidate_email: string;
  candidate_image?: string;
  
  opportunity_title: string;
}

async function fetchApplications(recruiterId: string): Promise<ATSApplication[]> {
  const supabase = await createClient()

  // We need to fetch applications for opportunities owned by this recruiter
  const { data: rawApps } = await supabase
    .from("applications")
    .select(`
      id, opportunity_id, candidate_id, status, resume_path, cover_letter, applied_at,
      opportunities!inner(title, recruiter_id),
      profiles!applications_candidate_id_fkey(email, display_name, avatar_path),
      candidate_profiles!applications_candidate_id_fkey(full_name, profile_image_path)
    `)
    .eq("opportunities.recruiter_id", recruiterId)
    .order("applied_at", { ascending: false })

  return (rawApps || []).map((app: any) => ({
    id: app.id,
    opportunity_id: app.opportunity_id,
    candidate_id: app.candidate_id,
    status: app.status as ApplicationStatus,
    resume_path: app.resume_path,
    cover_letter: app.cover_letter,
    applied_at: app.applied_at,
    
    // Fallback logic for candidate details
    candidate_name: app.candidate_profiles?.full_name || app.profiles?.display_name || "Unknown Candidate",
    candidate_email: app.profiles?.email || "",
    candidate_image: app.candidate_profiles?.profile_image_path || app.profiles?.avatar_path || undefined,
    
    opportunity_title: app.opportunities?.title || "Unknown Opportunity",
  }))
}

export default async function ApplicationsPage() {
  const profile = await getUserProfile()
  if (!profile) return null

  if (profile.account_type === "recruiter") {
    const apps = await fetchApplications(profile.id)
    return <RecruiterApplicationsClient initialApplications={apps} />
  }

  redirect("/~/home")
}
