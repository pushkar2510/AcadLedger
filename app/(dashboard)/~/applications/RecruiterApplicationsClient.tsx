"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import type { ATSApplication, ApplicationStatus } from "./page"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, FileText, Download, Target, Briefcase, Mail, CheckCircle2 } from "lucide-react"
import Link from "next/link"

const STATUS_COLUMNS: { id: ApplicationStatus; label: string }[] = [
  { id: "pending", label: "New" },
  { id: "reviewed", label: "In Review" },
  { id: "shortlisted", label: "Shortlisted" },
  { id: "hired", label: "Hired" },
  { id: "rejected", label: "Rejected" },
]

export function RecruiterApplicationsClient({ initialApplications }: { initialApplications: ATSApplication[] }) {
  const supabase = createClient()
  const [applications, setApplications] = useState<ATSApplication[]>(initialApplications)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleStatusChange = async (appId: string, newStatus: ApplicationStatus) => {
    setLoadingId(appId)
    
    // Optimistic UI update
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a))
    
    const { error } = await supabase
      .from("applications")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", appId)

    setLoadingId(null)
    
    if (error) {
      toast.error("Failed to update status")
      // Revert optimism
      setApplications(initialApplications)
    } else {
      toast.success(`Application moved to ${newStatus}`)
    }
  }

  // Basic list view
  return (
    <div className="w-full h-full min-h-screen">
      <div className="px-4 pt-8 pb-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-0.5">
            <h1 className="text-xl font-semibold tracking-tight">Applicant Tracking</h1>
            <p className="text-sm text-muted-foreground">
              Review and manage your pipeline
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8 pb-12">
        <div className="overflow-x-auto">
          <div className="flex gap-4 min-w-[1000px] h-[calc(100vh-160px)]">
            {STATUS_COLUMNS.map(col => {
              const colApps = applications.filter(a => a.status === col.id)
              
              return (
                <div key={col.id} className="flex-1 min-w-[300px] flex flex-col bg-muted/50 rounded-xl border p-3">
                  <div className="flex items-center justify-between mb-4 px-1">
                    <h3 className="font-semibold text-sm">{col.label}</h3>
                    <Badge variant="secondary" className="px-2 py-0 text-xs tabular-nums">
                      {colApps.length}
                    </Badge>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto space-y-3 pb-2 pr-1 custom-scrollbar">
                    {colApps.map(app => (
                      <Card key={app.id} className="cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors">
                        <CardContent className="p-4 space-y-4">
                          <div className="flex gap-3">
                            <Avatar className="h-10 w-10 border rounded-md">
                              <AvatarImage src={app.candidate_image} />
                              <AvatarFallback className="rounded-md bg-primary/10 text-primary">
                                {app.candidate_name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold truncate leading-tight">
                                {app.candidate_name}
                              </p>
                              <p className="text-xs text-muted-foreground truncate flex items-center gap-1 mt-0.5">
                                <Briefcase className="h-3 w-3 shrink-0" />
                                {app.opportunity_title}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                             <Button size="sm" variant="outline" className="h-8 text-xs font-normal" disabled={loadingId === app.id}>
                               <Link href={`/~/candidates/${app.candidate_id}`} className="w-full h-full flex items-center justify-center gap-1.5">
                                 <Target className="h-3.5 w-3.5" />
                                 Profile
                               </Link>
                             </Button>
                             {app.resume_path && (
                               <Button size="sm" variant="secondary" className="h-8 text-xs font-normal" asChild>
                                 <a href={app.resume_path} target="_blank" rel="noopener noreferrer">
                                   <FileText className="h-3.5 w-3.5 mr-1.5" />
                                   Resume
                                 </a>
                               </Button>
                             )}
                          </div>
                          
                          {/* Quick Actions for Status */}
                          <div className="pt-2 border-t mt-2 flex flex-wrap gap-1.5">
                            {STATUS_COLUMNS.filter(c => c.id !== app.status).map(statusCol => (
                              <button
                                key={statusCol.id}
                                onClick={() => handleStatusChange(app.id, statusCol.id)}
                                disabled={loadingId === app.id}
                                className="text-[10px] px-2 py-1 rounded bg-muted hover:bg-muted-foreground/20 transition-colors border text-muted-foreground"
                              >
                                {statusCol.label}
                              </button>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {colApps.length === 0 && (
                      <div className="h-24 border-2 border-dashed border-muted-foreground/20 rounded-lg flex items-center justify-center">
                        <p className="text-xs text-muted-foreground font-medium">Drop candidates here</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
