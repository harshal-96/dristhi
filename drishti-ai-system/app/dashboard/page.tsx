import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Eye, AlertTriangle, Shield, Users, Activity, MapPin, Clock, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const stats = [
    {
      title: "Active Cameras",
      value: "247",
      change: "+12%",
      icon: Eye,
      color: "text-blue-600",
    },
    {
      title: "Current Crowd Size",
      value: "15,432",
      change: "+5.2%",
      icon: Users,
      color: "text-emerald-600",
    },
    {
      title: "Active Incidents",
      value: "3",
      change: "-2",
      icon: AlertTriangle,
      color: "text-orange-600",
    },
    {
      title: "Response Teams",
      value: "18",
      change: "Ready",
      icon: Shield,
      color: "text-purple-600",
    },
  ]

  const recentIncidents = [
    {
      id: "INC-001",
      type: "Crowd Density",
      location: "Main Stage Area",
      severity: "Medium",
      status: "Resolved",
      time: "2 mins ago",
    },
    {
      id: "INC-002",
      type: "Medical Emergency",
      location: "Food Court",
      severity: "High",
      status: "Active",
      time: "5 mins ago",
    },
    {
      id: "INC-003",
      type: "Suspicious Activity",
      location: "Entrance Gate 3",
      severity: "Low",
      status: "Monitoring",
      time: "12 mins ago",
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">DRISHTI AI Dashboard</h1>
          <p className="text-slate-600">Real-time overview of crowd safety monitoring system</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">{stat.title}</CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                <p className="text-xs text-slate-600 mt-1">
                  <span className="text-emerald-600">{stat.change}</span> from last hour
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* System Status */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-emerald-600" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">AI Processing</span>
                  <Badge className="bg-emerald-100 text-emerald-800">Optimal</Badge>
                </div>
                <Progress value={95} className="h-2" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Network Connectivity</span>
                  <Badge className="bg-emerald-100 text-emerald-800">Excellent</Badge>
                </div>
                <Progress value={98} className="h-2" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Camera Coverage</span>
                  <Badge className="bg-yellow-100 text-yellow-800">Good</Badge>
                </div>
                <Progress value={87} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full justify-start bg-transparent" variant="outline">
                <Link href="/live-monitoring">
                  <Eye className="mr-2 h-4 w-4" />
                  Live Monitoring
                </Link>
              </Button>
              <Button asChild className="w-full justify-start bg-transparent" variant="outline">
                <Link href="/drone-surveillance">
                  <Activity className="mr-2 h-4 w-4" />
                  Drone Surveillance
                </Link>
              </Button>
              <Button asChild className="w-full justify-start bg-transparent" variant="outline">
                <Link href="/incident-management">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Incident Management
                </Link>
              </Button>
              <Button asChild className="w-full justify-start bg-transparent" variant="outline">
                <Link href="/preventive-measures">
                  <Shield className="mr-2 h-4 w-4" />
                  Preventive Measures
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Incidents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-slate-600" />
              Recent Incidents
            </CardTitle>
            <CardDescription>Latest security and safety events detected by the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentIncidents.map((incident) => (
                <div
                  key={incident.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {incident.status === "Resolved" ? (
                        <CheckCircle className="h-5 w-5 text-emerald-600" />
                      ) : incident.status === "Active" ? (
                        <XCircle className="h-5 w-5 text-red-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-yellow-600" />
                      )}
                      <span className="font-medium text-slate-900">{incident.id}</span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{incident.type}</p>
                      <p className="text-sm text-slate-600 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {incident.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge
                      variant={
                        incident.severity === "High"
                          ? "destructive"
                          : incident.severity === "Medium"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {incident.severity}
                    </Badge>
                    <Badge
                      variant={
                        incident.status === "Resolved"
                          ? "default"
                          : incident.status === "Active"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {incident.status}
                    </Badge>
                    <span className="text-sm text-slate-500">{incident.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
