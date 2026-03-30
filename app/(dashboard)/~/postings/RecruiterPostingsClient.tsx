"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  LayoutList,
  Plus,
  Clock,
  Briefcase,
  Users,
  CheckCircle2,
  CalendarClock,
  PlayCircle,
  PenLine,
  MapPin,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Opportunity, OpportunityStatus } from "./_types"

type Tab = "all" | "published" | "draft" | "closed"

interface TabConfig {
  value: Tab
  label: string
  icon: React.ReactNode
  count: number
}

function formatDateTime(dt?: string): string {
  if (!dt) return "—"
  return new Date(dt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })
}

function StatusBadge({ status }: { status: OpportunityStatus }) {
  switch (status) {
    case "published":
      return (
        <Badge className="gap-1.5 bg-emerald-500 hover:bg-emerald-500 text-white border-0 text-[11px] px-2 py-0.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
          </span>
          Live
        </Badge>
      )
    case "archived":
    case "closed":
      return (
        <Badge variant="outline" className="gap-1 text-[11px] px-2 py-0.5 text-muted-foreground">
          <CheckCircle2 className="h-3 w-3" />
          Closed
        </Badge>
      )
    case "draft":
      return (
        <Badge variant="outline" className="gap-1 text-[11px] px-2 py-0.5 text-muted-foreground border-dashed">
          <PenLine className="h-3 w-3" />
          Draft
        </Badge>
      )
  }
}

function StatPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="flex items-center gap-1 text-xs text-muted-foreground">
      {icon}
      {label}
    </span>
  )
}

function EmptyState({ isFiltered, onCreate }: { isFiltered: boolean; onCreate: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
      <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center">
        <Briefcase className="h-5 w-5 text-muted-foreground/60" />
      </div>
      <div className="space-y-0.5">
        <p className="text-sm font-medium">
          {isFiltered ? "No jobs in this category" : "No job postings yet"}
        </p>
        <p className="text-xs text-muted-foreground">
          {isFiltered ? "Try switching tabs to view others" : "Create your first posting to start hiring"}
        </p>
      </div>
      {!isFiltered && (
        <Button size="sm" onClick={onCreate} className="gap-1.5 mt-1">
          <Plus className="h-3.5 w-3.5" />
          Post Job
        </Button>
      )}
    </div>
  )
}

function PostingCard({ posting }: { posting: Opportunity }) {
  return (
    <Card className="border">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <CardTitle className="text-base leading-snug">{posting.title}</CardTitle>
            <CardDescription
              className={cn(
                "text-xs",
                posting.description
                  ? "line-clamp-2"
                  : "italic text-muted-foreground/60"
              )}
            >
              {posting.description ?? "No description provided"}
            </CardDescription>
          </div>
          <StatusBadge status={posting.status} />
        </div>
      </CardHeader>

      <CardContent className="flex flex-col flex-1 gap-4">
        {/* Meta */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
          <StatPill
            icon={<MapPin className="h-3.5 w-3.5" />}
            label={posting.is_remote ? "Remote" : posting.location || "Location not set"}
          />
          <StatPill
            icon={<Users className="h-3.5 w-3.5" />}
            label={`${posting.application_count || 0} application${posting.application_count !== 1 ? "s" : ""}`}
          />
        </div>

        {/* Schedule window */}
        {posting.application_deadline ? (
          <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
            <CalendarClock className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <span>Deadline: {formatDateTime(posting.application_deadline)}</span>
          </div>
        ) : (
          posting.status !== "draft" && (
            <div className="flex items-start gap-1.5 text-xs italic text-muted-foreground/60">
              <CalendarClock className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              <span>No closing deadline set</span>
            </div>
          )
        )}

        {/* Draft note */}
        {posting.status === "draft" && (
          <p className="text-xs text-muted-foreground italic">
            Not published — finish editing to go live
          </p>
        )}

        {/* Actions */}
        <div className="mt-auto">
          <Button asChild variant="outline" size="sm">
            <Link href={`postings/${posting.id}`}>Manage Posting</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

interface Props {
  postings: Opportunity[]
}

export function RecruiterPostingsClient({ postings }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("all")
  const router = useRouter()

  const live = postings.filter((t) => t.status === "published")
  const drafts = postings.filter((t) => t.status === "draft")
  const closed = postings.filter((t) => t.status === "closed" || t.status === "archived")

  const tabConfig: TabConfig[] = [
    { value: "all", label: "All", icon: <LayoutList className="h-3.5 w-3.5" />, count: postings.length },
    { value: "published", label: "Live", icon: <PlayCircle className="h-3.5 w-3.5" />, count: live.length },
    { value: "draft", label: "Drafts", icon: <PenLine className="h-3.5 w-3.5" />, count: drafts.length },
    { value: "closed", label: "Closed", icon: <CheckCircle2 className="h-3.5 w-3.5" />, count: closed.length },
  ]

  const tabTests: Record<Tab, Opportunity[]> = { all: postings, published: live, draft: drafts, closed }

  const handleCreate = () => router.push("postings/new/edit")

  return (
    <div className="min-h-screen w-full">
      {/* Page Header */}
      <div className="px-4 pt-8 pb-0 md:px-8">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h1 className="text-xl font-semibold tracking-tight">Job Postings</h1>
            <p className="text-sm text-muted-foreground">
              {postings.length} posting{postings.length !== 1 ? "s" : ""} total
              {live.length > 0 && (
                <span className="ml-2 inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {live.length} live
                </span>
              )}
            </p>
          </div>
          <Button size="sm" onClick={handleCreate} className="gap-1.5 shrink-0">
            <Plus className="h-3.5 w-3.5" />
            Post Job
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as Tab)}>
        {/* Tab Bar */}
        <div className="overflow-x-auto px-4 pt-5 md:px-8">
          <TabsList className="inline-flex h-9 gap-0.5 rounded-lg bg-muted p-1">
            {tabConfig.map(({ value, label, count }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="gap-1.5 rounded-md px-3 text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                {label}
                {count > 0 && (
                  <span className={cn(
                    "inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold tabular-nums",
                    activeTab === value
                      ? "bg-foreground text-background"
                      : "bg-muted-foreground/20 text-muted-foreground"
                  )}>
                    {count}
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Tab Contents */}
        <div className="px-4 py-6 md:px-8">
          {tabConfig.map(({ value }) => (
            <TabsContent key={value} value={value} className="mt-0 outline-none">
              {tabTests[value].length === 0 ? (
                <EmptyState isFiltered={value !== "all"} onCreate={handleCreate} />
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {tabTests[value].map((t) => <PostingCard key={t.id} posting={t} />)}
                </div>
              )}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  )
}
