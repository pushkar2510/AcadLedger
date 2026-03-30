import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getUserProfile } from "@/lib/supabase/profile"
import { RecruiterCandidatesClient } from "./RecruiterCandidatesClient"

export const metadata = {
  title: "Talent Pool",
  description: "Browse and discover top candidates",
}

export interface CandidateCardInfo {
  profile_id: string;
  full_name: string;
  email: string;
  avatar_path?: string;
  course_name?: string;
  passout_year?: number;
  cgpa?: number;
  skills: string[];
  linkedin_url?: string;
  has_taken_test: boolean;
}

async function fetchCandidates(recruiterId: string): Promise<CandidateCardInfo[]> {
  const supabase = await createClient()

  // We fetch candidates with complete profiles.
  // We'll also check if they have taken any tests created by this recruiter.
  
  // 1. Fetch Candidates
  const { data: candidates } = await supabase
    .from("candidate_profiles")
    .select(`
      profile_id, full_name, profile_image_path, course_name, passout_year, cgpa, skills, linkedin_url, profile_complete,
      profiles (email)
    `)
    .eq("profile_complete", true)
    
  if (!candidates || candidates.length === 0) return []
  
  // 2. Which candidate took this recruiter's tests?
  const { data: tests } = await supabase.from("tests").select("id").eq("recruiter_id", recruiterId)
  let candidateTestMap = new Set<string>()
  
  if (tests && tests.length > 0) {
    const testIds = tests.map(t => t.id)
    const { data: attempts } = await supabase
      .from("test_attempts")
      .select("student_id")
      .in("test_id", testIds)
      
    if (attempts) {
      attempts.forEach(a => candidateTestMap.add(a.student_id))
    }
  }

  // 3. Map to UI structure
  return candidates.map((c: any) => ({
    profile_id: c.profile_id,
    full_name: c.full_name || "Unknown Candidate",
    email: c.profiles?.email || "No Email",
    avatar_path: c.profile_image_path,
    course_name: c.course_name,
    passout_year: c.passout_year,
    cgpa: c.cgpa,
    skills: c.skills || [],
    linkedin_url: c.linkedin_url,
    has_taken_test: candidateTestMap.has(c.profile_id)
  }))
}

export default async function CandidatesPage() {
  const profile = await getUserProfile()
  if (!profile) return null

  if (profile.account_type === "recruiter") {
    const candidates = await fetchCandidates(profile.id)
    return <RecruiterCandidatesClient candidates={candidates} />
  }

  redirect("/~/home")
}
