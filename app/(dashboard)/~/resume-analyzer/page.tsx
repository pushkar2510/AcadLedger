import { ResumeAnalyzerClient } from "./ResumeAnalyzerClient"

export const metadata = {
  title: "Resume Analyzer | PlaceTrix",
  description: "AI-powered ATS resume analysis with keyword matching, skill gap identification, and actionable improvements.",
}

export default function ResumeAnalyzerPage() {
  return <ResumeAnalyzerClient />
}
