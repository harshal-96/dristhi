"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Search,
  MessageSquare,
  FileText,
  Users,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Globe,
  Twitter,
  BarChart3,
  Eye,
  Zap,
  Brain,
} from "lucide-react"
import { useState } from "react"

interface AgentActivity {
  id: string
  name: string
  type: "web_search" | "social_media" | "analysis" | "coordination"
  status: "active" | "completed" | "pending" | "error"
  icon: any
  color: string
  description: string
  lastActivity: string
  details: {
    tasksCompleted: number
    totalTasks: number
    keyFindings: string[]
    searchQueries?: string[]
    socialPosts?: any[]
    analysisResults?: any
    processingTime?: string
    confidence?: string
  }
}

export function AgentSidebar() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)

  const agents: AgentActivity[] = [
    {
      id: "web-search",
      name: "Web Search Agent",
      type: "web_search",
      status: "completed",
      icon: Search,
      color: "text-blue-600 bg-blue-100",
      description: "Searches web for incident-related information",
      lastActivity: "2 minutes ago",
      details: {
        tasksCompleted: 5,
        totalTasks: 5,
        keyFindings: [
          "Found 25 relevant safety alerts for the area",
          "Located emergency response protocols",
          "Identified similar incidents in past 6 months",
          "Retrieved local emergency contact information",
        ],
        searchQueries: [
          "Main Stage Area emergency safety alert",
          "crowd stampede prevention protocols",
          "local emergency services contact",
          "similar incidents crowd management",
        ],
        processingTime: "45 seconds",
        confidence: "92%",
      },
    },
    {
      id: "social-media",
      name: "Social Media Agent",
      type: "social_media",
      status: "active",
      icon: MessageSquare,
      color: "text-purple-600 bg-purple-100",
      description: "Monitors social media for real-time updates",
      lastActivity: "30 seconds ago",
      details: {
        tasksCompleted: 3,
        totalTasks: 4,
        keyFindings: [
          "15 posts found related to the incident",
          "Sentiment analysis shows high concern",
          "3 verified accounts reporting",
          "8 media attachments collected",
        ],
        socialPosts: [
          {
            platform: "Twitter",
            text: "Large crowd gathering at Main Stage, seems chaotic",
            verified: false,
            engagement: 45,
            timestamp: "2 mins ago",
          },
          {
            platform: "Twitter",
            text: "Emergency services heading to Main Stage area",
            verified: true,
            engagement: 120,
            timestamp: "3 mins ago",
          },
        ],
        processingTime: "1m 20s",
        confidence: "75%",
      },
    },
    {
      id: "summarizer",
      name: "Analysis Agent",
      type: "analysis",
      status: "active",
      icon: BarChart3,
      color: "text-emerald-600 bg-emerald-100",
      description: "Analyzes and summarizes collected information",
      lastActivity: "1 minute ago",
      details: {
        tasksCompleted: 2,
        totalTasks: 3,
        keyFindings: [
          "Incident classified as 'Critical' severity",
          "Estimated 2,500 people affected",
          "Medical emergency response required",
          "Crowd control measures recommended",
        ],
        analysisResults: {
          incident_type: "Medical Emergency",
          severity: "Critical",
          affected_areas: ["Main Stage Area - Section A"],
          estimated_people_affected: "2,500",
          immediate_actions: [
            "Deploy medical response team",
            "Implement crowd control measures",
            "Clear emergency access routes",
          ],
        },
        processingTime: "2m 15s",
        confidence: "89%",
      },
    },
    {
      id: "coordinator",
      name: "Incident Coordinator",
      type: "coordination",
      status: "pending",
      icon: Users,
      color: "text-orange-600 bg-orange-100",
      description: "Coordinates multi-agent incident analysis",
      lastActivity: "5 minutes ago",
      details: {
        tasksCompleted: 1,
        totalTasks: 4,
        keyFindings: [
          "Coordinating response between all agents",
          "Prioritizing critical incidents",
          "Managing workflow sequence",
        ],
        processingTime: "Ongoing",
        confidence: "95%",
      },
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-emerald-600" />
      case "active":
        return <Zap className="h-4 w-4 text-blue-600 animate-pulse" />
      case "pending":
        return <Clock className="h-4 w-4 text-orange-600" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Eye className="h-4 w-4 text-slate-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 text-emerald-800"
      case "active":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-orange-100 text-orange-800"
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  return (
    <div className="w-96 bg-white border-l border-slate-200 flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Brain className="h-6 w-6 text-emerald-600" />
          AI Agents
        </h2>
        <p className="text-sm text-slate-600 mt-1">Multi-agent incident analysis system</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {/* Agent List */}
          {agents.map((agent) => (
            <Card
              key={agent.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedAgent === agent.id ? "ring-2 ring-emerald-500 bg-emerald-50" : ""
              }`}
              onClick={() => setSelectedAgent(selectedAgent === agent.id ? null : agent.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${agent.color}`}>
                      <agent.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-sm font-medium">{agent.name}</CardTitle>
                      <CardDescription className="text-xs">{agent.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(agent.status)}
                    <ChevronRight
                      className={`h-4 w-4 text-slate-400 transition-transform ${
                        selectedAgent === agent.id ? "rotate-90" : ""
                      }`}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <Badge className={getStatusColor(agent.status)} size="sm">
                    {agent.status}
                  </Badge>
                  <span className="text-xs text-slate-500">{agent.lastActivity}</span>
                </div>
              </CardHeader>

              {/* Expanded Details */}
              {selectedAgent === agent.id && (
                <CardContent className="pt-0">
                  <Separator className="mb-4" />

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">Progress</span>
                      <span>
                        {agent.details.tasksCompleted}/{agent.details.totalTasks} tasks
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-emerald-500 h-2 rounded-full transition-all"
                        style={{ width: `${(agent.details.tasksCompleted / agent.details.totalTasks) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Key Findings */}
                  <div className="mb-4">
                    <h4 className="font-medium text-sm mb-2">Key Findings</h4>
                    <ul className="space-y-1">
                      {agent.details.keyFindings.map((finding, index) => (
                        <li key={index} className="text-xs text-slate-600 flex items-start gap-2">
                          <div className="w-1 h-1 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                          {finding}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Agent-specific details */}
                  {agent.type === "web_search" && agent.details.searchQueries && (
                    <div className="mb-4">
                      <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        Search Queries
                      </h4>
                      <div className="space-y-1">
                        {agent.details.searchQueries.map((query, index) => (
                          <div key={index} className="text-xs bg-slate-100 rounded px-2 py-1">
                            "{query}"
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {agent.type === "social_media" && agent.details.socialPosts && (
                    <div className="mb-4">
                      <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                        <Twitter className="h-3 w-3" />
                        Recent Posts
                      </h4>
                      <div className="space-y-2">
                        {agent.details.socialPosts.map((post, index) => (
                          <div key={index} className="text-xs bg-slate-50 rounded p-2 border">
                            <div className="flex items-center justify-between mb-1">
                              <Badge variant="outline" size="sm">
                                {post.platform}
                              </Badge>
                              {post.verified && (
                                <Badge className="bg-blue-100 text-blue-800" size="sm">
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <p className="text-slate-700 mb-1">"{post.text}"</p>
                            <div className="flex justify-between text-slate-500">
                              <span>{post.engagement} interactions</span>
                              <span>{post.timestamp}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {agent.type === "analysis" && agent.details.analysisResults && (
                    <div className="mb-4">
                      <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        Analysis Results
                      </h4>
                      <div className="text-xs space-y-1">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Type:</span>
                          <span className="font-medium">{agent.details.analysisResults.incident_type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Severity:</span>
                          <Badge className="bg-red-100 text-red-800" size="sm">
                            {agent.details.analysisResults.severity}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Affected:</span>
                          <span className="font-medium">{agent.details.analysisResults.estimated_people_affected}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-50 rounded p-2">
                      <div className="text-slate-600">Processing Time</div>
                      <div className="font-medium">{agent.details.processingTime}</div>
                    </div>
                    <div className="bg-slate-50 rounded p-2">
                      <div className="text-slate-600">Confidence</div>
                      <div className="font-medium">{agent.details.confidence}</div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center justify-between text-xs text-slate-600">
          <span>System Status</span>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span>Active</span>
          </div>
        </div>
      </div>
    </div>
  )
}
