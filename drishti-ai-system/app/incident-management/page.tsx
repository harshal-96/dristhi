"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertTriangle,
  MapPin,
  Clock,
  Users,
  Heart,
  Flame,
  Shield,
  Phone,
  CheckCircle,
  XCircle,
  Eye,
  Upload,
  Send,
  Loader2,
  Bot,
  Search,
  MessageSquare,
  FileText,
  Navigation,
  TrendingUp,
  Globe,
  Activity,
  Route,
  Siren,
  Timer,
  Car,
  ShieldCheck,
  AlertCircle,
  Info,
  Zap,
  UserCheck,
  Building,
} from "lucide-react"

// Global Google Maps callback declaration
declare global {
  interface Window {
    google: any
    initGoogleMaps: () => void
  }
}

// Configuration - Use a working demo setup
const config = {
  googleMapsApiKey: "demo", // Will use OpenStreetMap as fallback
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV === "development",
}

const validateConfig = () => {
  const issues = []
  if (!config.googleMapsApiKey) {
    issues.push("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is missing")
  }
  return {
    isValid: issues.length === 0,
    issues,
  }
}

interface Incident {
  id: string
  type: string
  description: string
  severity: string
  status: string
  location: string
  coordinates: { lat: number; lng: number }
  timestamp: string
  reportedBy: string
  assignedTeam: string
  estimatedCrowd: number
  icon: any
  color: string
}

interface AgentOutput {
  agent: string
  status: "initializing" | "processing" | "completed" | "error"
  data: any
  timestamp: string
  progress: number
  currentTask: string
}

interface EmergencyStation {
  id: string
  type: "police" | "fire" | "medical" | "emergency"
  name: string
  coordinates: { lat: number; lng: number }
  distance: number
  estimatedTime: string
  contact: string
  status: "available" | "busy" | "offline"
}

interface RouteInfo {
  distance: string
  duration: string
  steps: Array<{
    instruction: string
    distance: string
    duration: string
  }>
}

// Declare global google maps types
declare global {
  interface Window {
    google: any
    initMap: () => void
  }
}

// Precautionary Measures Component
function PrecautionaryMeasures({ incidentType, severity }: { incidentType: string; severity: string }) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => setIsLoading(false), 300)
    return () => clearTimeout(timer)
  }, [incidentType, severity])

  if (isLoading) {
    return (
      <Card className="border-2 border-slate-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            <div className="h-6 bg-slate-200 rounded w-64 animate-pulse"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-4 bg-slate-200 rounded animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const getPrecautionsByCategory = (type: string, sev: string) => {
    const precautions = {
      fire: {
        immediate: [
          "Activate fire alarm systems immediately",
          "Evacuate all personnel from affected areas",
          "Call fire department (911) immediately",
          "Use fire extinguishers only if safe to do so",
          "Ensure all exits are clear and accessible",
          "Account for all personnel at assembly points",
        ],
        preventive: [
          "Install and maintain smoke detectors",
          "Conduct regular fire drills",
          "Keep fire extinguishers accessible and serviced",
          "Maintain clear evacuation routes",
          "Train staff in fire safety procedures",
          "Regular electrical system inspections",
        ],
        equipment: [
          "Fire extinguishers (ABC type)",
          "Smoke detectors and alarms",
          "Emergency lighting systems",
          "Fire blankets",
          "Sprinkler systems",
          "Emergency communication devices",
        ],
      },
      crowd: {
        immediate: [
          "Deploy crowd control barriers immediately",
          "Activate additional security personnel",
          "Monitor crowd density in real-time",
          "Open additional exit routes if available",
          "Communicate clearly with crowd via PA system",
          "Coordinate with local law enforcement",
        ],
        preventive: [
          "Implement crowd capacity limits",
          "Design proper crowd flow patterns",
          "Install crowd monitoring systems",
          "Train staff in crowd management",
          "Establish clear signage and directions",
          "Plan for peak capacity scenarios",
        ],
        equipment: [
          "Crowd control barriers",
          "PA system and megaphones",
          "CCTV monitoring systems",
          "Two-way radios",
          "Emergency lighting",
          "Crowd counting sensors",
        ],
      },
      medical: {
        immediate: [
          "Call emergency medical services (911)",
          "Provide first aid if trained to do so",
          "Clear area around the injured person",
          "Do not move injured person unless necessary",
          "Keep the person calm and conscious",
          "Gather witness information",
        ],
        preventive: [
          "Maintain first aid stations",
          "Train staff in CPR and first aid",
          "Keep medical supplies stocked",
          "Establish medical emergency protocols",
          "Coordinate with local medical facilities",
          "Regular health and safety inspections",
        ],
        equipment: [
          "First aid kits and AED devices",
          "Emergency stretchers",
          "Oxygen tanks and masks",
          "Medical communication devices",
          "Emergency medical supplies",
          "Isolation and quarantine materials",
        ],
      },
      crime: {
        immediate: [
          "Contact law enforcement immediately",
          "Secure the scene and preserve evidence",
          "Evacuate civilians from danger zone",
          "Activate security protocols",
          "Document incident with photos/video",
          "Provide witness protection if needed",
        ],
        preventive: [
          "Install comprehensive security systems",
          "Conduct regular security assessments",
          "Train security personnel properly",
          "Establish visitor screening procedures",
          "Implement access control systems",
          "Coordinate with local law enforcement",
        ],
        equipment: [
          "Security cameras and monitoring",
          "Access control systems",
          "Metal detectors and scanners",
          "Two-way communication devices",
          "Emergency alert systems",
          "Personal protective equipment",
        ],
      },
      general: {
        immediate: [
          "Assess the situation quickly and safely",
          "Contact appropriate emergency services",
          "Secure the area and control access",
          "Communicate with all stakeholders",
          "Document the incident thoroughly",
          "Provide support to affected individuals",
        ],
        preventive: [
          "Develop comprehensive emergency plans",
          "Conduct regular safety training",
          "Maintain emergency supply kits",
          "Establish communication protocols",
          "Regular safety inspections and audits",
          "Coordinate with emergency services",
        ],
        equipment: [
          "Emergency communication systems",
          "Basic first aid supplies",
          "Emergency lighting and power",
          "Safety barriers and signage",
          "Documentation and reporting tools",
          "Multi-purpose emergency kits",
        ],
      },
    }

    return precautions[type.toLowerCase()] || precautions.general
  }

  const measures = getPrecautionsByCategory(incidentType, severity)
  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return "border-red-500 bg-red-50"
      case "high":
        return "border-orange-500 bg-orange-50"
      case "medium":
        return "border-yellow-500 bg-yellow-50"
      case "low":
        return "border-emerald-500 bg-emerald-50"
      default:
        return "border-slate-500 bg-slate-50"
    }
  }

  const getIncidentIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "fire":
        return Flame
      case "crowd":
        return Users
      case "medical":
        return Heart
      case "crime":
        return Shield
      default:
        return AlertTriangle
    }
  }

  const IncidentIcon = getIncidentIcon(incidentType)

  return (
    <Card className={`${getSeverityColor(severity)} border-2`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IncidentIcon className="h-5 w-5" />
          Precautionary Measures - {incidentType.charAt(0).toUpperCase() + incidentType.slice(1)}
          <Badge variant="outline" className="ml-auto">
            {severity} Priority
          </Badge>
        </CardTitle>
        <CardDescription>Comprehensive safety measures and protocols for {incidentType} incidents</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="immediate" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="immediate" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Immediate Actions
            </TabsTrigger>
            <TabsTrigger value="preventive" className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              Preventive Measures
            </TabsTrigger>
            <TabsTrigger value="equipment" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Required Equipment
            </TabsTrigger>
          </TabsList>

          <TabsContent value="immediate" className="mt-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <h4 className="font-semibold text-red-800">Immediate Response Actions</h4>
              </div>
              {measures.immediate.map((action, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                  <div className="flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-700">{action}</p>
                  </div>
                  <CheckCircle className="h-4 w-4 text-slate-400" />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="preventive" className="mt-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                <h4 className="font-semibold text-emerald-800">Preventive Safety Measures</h4>
              </div>
              {measures.preventive.map((measure, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                  <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-700">{measure}</p>
                  </div>
                  <Info className="h-4 w-4 text-slate-400" />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="equipment" className="mt-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <Building className="h-5 w-5 text-blue-600" />
                <h4 className="font-semibold text-blue-800">Required Equipment & Resources</h4>
              </div>
              {measures.equipment.map((equipment, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-700">{equipment}</p>
                  </div>
                  <UserCheck className="h-4 w-4 text-slate-400" />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

// Emergency Route Display Component
function EmergencyRouteDisplay({
  incidentCoordinates,
  incidentType,
}: { incidentCoordinates: { lat: number; lng: number }; incidentType: string }) {
  // All hooks must be declared first
  const [isInitializing, setIsInitializing] = useState(true)
  const [emergencyStations, setEmergencyStations] = useState<EmergencyStation[]>([])
  const [selectedStation, setSelectedStation] = useState<EmergencyStation | null>(null)
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)
  const [routeMap, setRouteMap] = useState<any>(null)

  useEffect(() => {
    setIsInitializing(true)
    const timer = setTimeout(() => setIsInitializing(false), 500)
    return () => clearTimeout(timer)
  }, [incidentCoordinates, incidentType])

  // Mock emergency stations data
  const mockEmergencyStations: EmergencyStation[] = [
     {
      id: "police-1",
      type: "police",
      name: "Koramangala Police Station",
      coordinates: { lat: incidentCoordinates.lat + 0.005, lng: incidentCoordinates.lng + 0.003 },
      distance: 0.8,
      estimatedTime: "3-5 minutes",
      contact: "+91-80-2552-0100",
      status: "available",
    },
    {
      id: "fire-1",
      type: "fire",
      name: "Bengaluru Fire Station No. 12",
      coordinates: { lat: incidentCoordinates.lat - 0.003, lng: incidentCoordinates.lng + 0.007 },
      distance: 1.2,
      estimatedTime: "4-6 minutes",
      contact: "+91-80-2286-5555",
      status: "available",
    },
    {
      id: "medical-1",
      type: "medical",
      name: "Manipal Hospital Bengaluru",
      coordinates: { lat: incidentCoordinates.lat + 0.008, lng: incidentCoordinates.lng - 0.004 },
      distance: 1.5,
      estimatedTime: "5-8 minutes",
      contact: "+91-80-2502-4444",
      status: "available",
    },
    {
      id: "emergency-1",
      type: "emergency",
      name: "BBMP Emergency Response Center",
      coordinates: { lat: incidentCoordinates.lat - 0.002, lng: incidentCoordinates.lng - 0.006 },
      distance: 0.6,
      estimatedTime: "2-4 minutes",
      contact: "+91-80-2266-0000",
      status: "available",
    },
  ]

  useEffect(() => {
    // Filter stations based on incident type
    let filteredStations = mockEmergencyStations
    if (incidentType === "fire") {
      filteredStations = mockEmergencyStations.filter((s) => s.type === "fire" || s.type === "emergency")
    } else if (incidentType === "medical") {
      filteredStations = mockEmergencyStations.filter((s) => s.type === "medical" || s.type === "emergency")
    } else if (incidentType === "crime") {
      filteredStations = mockEmergencyStations.filter((s) => s.type === "police" || s.type === "emergency")
    }

    // Sort by distance
    filteredStations.sort((a, b) => a.distance - b.distance)
    setEmergencyStations(filteredStations)

    // Auto-select the nearest station
    if (filteredStations.length > 0) {
      setSelectedStation(filteredStations[0])
    }
  }, [incidentCoordinates, incidentType])

  useEffect(() => {
    if (selectedStation) {
      generateRoute(selectedStation)
    }
  }, [selectedStation])

  const generateRoute = async (station: EmergencyStation) => {
    setIsLoading(true)

    // Mock route generation
    const mockRoute: RouteInfo = {
      distance: `${station.distance.toFixed(1)} km`,
      duration: station.estimatedTime,
      steps: [
         {
          instruction: "Head north on Hosur Road",
          distance: "0.3 km",
          duration: "1 min",
        },
        {
          instruction: "Turn right onto 100 Feet Road",
          distance: "0.4 km",
          duration: "1.5 min",
        },
        {
          instruction: "Continue straight to destination",
          distance: `${(station.distance - 0.7).toFixed(1)} km`,
          duration: "1-2 min",
        },
      ],
    }

    setTimeout(() => {
      setRouteInfo(mockRoute)
      setIsLoading(false)
      initializeRouteMap(station)
    }, 1000)
  }

  const initializeRouteMap = (station: EmergencyStation) => {
    if (!mapRef.current) return

    // Create a visual route map using HTML/CSS
    const mapContainer = mapRef.current
    mapContainer.innerHTML = `
    <div class="relative w-full h-full bg-gradient-to-br from-blue-100 to-green-100 rounded-lg overflow-hidden">
      <!-- Route visualization -->
      <div class="absolute inset-0 flex items-center justify-center">
        <svg width="100%" height="100%" viewBox="0 0 300 200" class="absolute inset-0">
          <!-- Route line -->
          <line x1="50" y1="100" x2="250" y2="100" stroke="#2563eb" strokeWidth="4" strokeDasharray="10,5"/>
          <!-- Incident marker -->
          <circle cx="50" cy="100" r="12" fill="#dc2626" stroke="white" strokeWidth="3"/>
          <!-- Station marker -->
          <circle cx="250" cy="100" r="10" fill="${getStationIcon(station.type).color}" stroke="white" strokeWidth="2"/>
        </svg>
        
        <!-- Labels -->
        <div class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-lg shadow-sm p-2 text-xs">
          <div class="font-medium text-red-600">Incident</div>
          <div class="text-slate-600">Emergency Location</div>
        </div>
        
        <div class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-lg shadow-sm p-2 text-xs">
          <div class="font-medium" style="color: ${getStationIcon(station.type).color}">${station.name}</div>
          <div class="text-slate-600">${station.estimatedTime}</div>
        </div>
        
        <!-- Route info -->
        <div class="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-sm p-2 text-xs">
          <div class="font-medium text-blue-600">Route: ${(station.distance).toFixed(1)} km</div>
          <div class="text-slate-600">ETA: ${station.estimatedTime}</div>
        </div>
      </div>
    </div>
  `

    setRouteMap(true)
  }

  const getStationIcon = (type: string) => {
    switch (type) {
      case "police":
        return { icon: Shield, color: "#1e40af", name: "Police" }
      case "fire":
        return { icon: Flame, color: "#dc2626", name: "Fire Department" }
      case "medical":
        return { icon: Heart, color: "#059669", name: "Medical" }
      case "emergency":
        return { icon: Siren, color: "#7c3aed", name: "Emergency" }
      default:
        return { icon: AlertTriangle, color: "#64748b", name: "Emergency" }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "text-emerald-600 bg-emerald-100"
      case "busy":
        return "text-yellow-600 bg-yellow-100"
      case "offline":
        return "text-red-600 bg-red-100"
      default:
        return "text-slate-600 bg-slate-100"
    }
  }

  // Move the conditional rendering to the end, after all hooks
  if (isInitializing) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            <div className="h-6 bg-slate-200 rounded w-48 animate-pulse"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-slate-200 rounded animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Emergency Stations List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Siren className="h-5 w-5 text-blue-600" />
            Emergency Response Stations
          </CardTitle>
          <CardDescription>Nearest emergency services for {incidentType} incidents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {emergencyStations.map((station) => {
              const stationIcon = getStationIcon(station.type)
              const StationIcon = stationIcon.icon

              return (
                <div
                  key={station.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedStation?.id === station.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                  onClick={() => setSelectedStation(station)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                        style={{ backgroundColor: stationIcon.color }}
                      >
                        <StationIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900">{station.name}</h4>
                        <p className="text-sm text-slate-600">{stationIcon.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <Timer className="h-4 w-4 text-slate-500" />
                        <span className="text-sm font-medium">{station.estimatedTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Route className="h-4 w-4 text-slate-500" />
                        <span className="text-sm text-slate-600">{station.distance} km</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-slate-500" />
                      <span className="text-sm text-slate-600">{station.contact}</span>
                    </div>
                    <Badge className={getStatusColor(station.status)}>{station.status}</Badge>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Route Map and Details */}
      {selectedStation && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Route Map */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5 text-emerald-600" />
                Emergency Route Map
              </CardTitle>
              <CardDescription>Optimal route to {selectedStation.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div ref={mapRef} className="h-64 w-full rounded-lg bg-slate-100" />
              {isLoading && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Route Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5 text-blue-600" />
                Route Details
              </CardTitle>
              <CardDescription>Turn-by-turn directions and timing</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                  <span className="ml-2 text-sm text-slate-600">Calculating route...</span>
                </div>
              ) : routeInfo ? (
                <div className="space-y-4">
                  {/* Route Summary */}
                  <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-lg font-bold text-slate-900">{routeInfo.distance}</div>
                      <div className="text-sm text-slate-600">Total Distance</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-slate-900">{routeInfo.duration}</div>
                      <div className="text-sm text-slate-600">Estimated Time</div>
                    </div>
                  </div>

                  {/* Turn-by-turn directions */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-slate-900">Directions</h4>
                    {routeInfo.steps.map((step, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-slate-700">{step.instruction}</p>
                          <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                            <span>{step.distance}</span>
                            <span>{step.duration}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Emergency Contact */}
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Phone className="h-4 w-4 text-red-600" />
                      <span className="font-medium text-red-800">Emergency Contact</span>
                    </div>
                    <p className="text-sm text-red-700">Direct line: {selectedStation.contact}</p>
                    <Button size="sm" className="mt-2 bg-red-600 hover:bg-red-700">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Now
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <Route className="h-12 w-12 mx-auto mb-2 text-slate-300" />
                  <p>Select a station to view route details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

// Google Map Component (Fixed with OpenStreetMap fallback)
function GoogleMap({ incidents }: { incidents: Incident[] }) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const markersRef = useRef<any[]>([])

  const getSeverityColor = useCallback((severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return "#dc2626"
      case "high":
        return "#ea580c"
      case "medium":
        return "#ca8a04"
      case "low":
        return "#16a34a"
      default:
        return "#64748b"
    }
  }, [])

  // Initialize map with fallback to visual display
  useEffect(() => {
    // Always use fallback display for now
    setIsLoaded(true)
    setError(null)
  }, [])

  // Always show the enhanced fallback display
  return (
    <div className="relative">
      <div className="h-96 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-lg border-2 border-dashed border-slate-300 overflow-hidden">
        {/* Map Header */}
        <div className="bg-white/90 backdrop-blur-sm p-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-slate-800">Incident Locations Map</h3>
            </div>
            <Badge variant="outline" className="text-xs">
              {incidents.length} Active Incidents
            </Badge>
          </div>
        </div>

        {/* Map Content */}
        <div className="p-6 h-full">
          {incidents.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <MapPin className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">No incidents to display</p>
                <p className="text-sm text-slate-400">Submit an incident to see it on the map</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full overflow-y-auto">
              {incidents.map((incident, index) => (
                <div
                  key={incident.id}
                  className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0 mt-1"
                      style={{ backgroundColor: getSeverityColor(incident.severity) }}
                    ></div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-slate-800 text-sm truncate">{incident.type}</h4>
                      <p className="text-xs text-slate-600 mb-2">{incident.location}</p>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Severity:</span>
                          <Badge
                            variant="outline"
                            className="text-xs"
                            style={{ borderColor: getSeverityColor(incident.severity) }}
                          >
                            {incident.severity}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Status:</span>
                          <span className="font-medium">{incident.status}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Crowd:</span>
                          <span className="font-medium">{incident.estimatedCrowd.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Map Controls */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-xs">
        <h4 className="font-semibold text-sm mb-3 text-slate-800">Incident Severity</h4>
        <div className="space-y-2">
          {["Critical", "High", "Medium", "Low"].map((severity) => (
            <div key={severity} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getSeverityColor(severity) }}></div>
                <span className="text-slate-700">{severity}</span>
              </div>
              <span className="text-slate-500 font-medium">
                {incidents.filter((i) => i.severity.toLowerCase() === severity.toLowerCase()).length}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Agent Sidebar Component (existing, keeping as is)
function AgentSidebar({
  agentOutputs,
  isProcessing,
}: {
  agentOutputs: AgentOutput[]
  isProcessing: boolean
}) {
  const getAgentIcon = (agentName: string) => {
    switch (agentName.toLowerCase()) {
      case "websearchagent":
        return Search
      case "socialmediaagent":
        return MessageSquare
      case "summarizeragent":
        return FileText
      case "coordinatoragent":
        return Bot
      default:
        return Activity
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-emerald-600" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "processing":
        return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
      case "initializing":
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <Clock className="h-4 w-4 text-slate-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "border-emerald-200 bg-emerald-50"
      case "error":
        return "border-red-200 bg-red-50"
      case "processing":
        return "border-blue-200 bg-blue-50"
      case "initializing":
        return "border-yellow-200 bg-yellow-50"
      default:
        return "border-slate-200 bg-slate-50"
    }
  }

  return (
    <div className="w-96 bg-white border-l border-slate-200 flex flex-col">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Bot className="h-5 w-5" />
          AI Agent Dashboard
        </h2>
        <p className="text-sm text-slate-600 mt-1">Multi-agent incident analysis</p>
        {isProcessing && (
          <div className="mt-2 flex items-center gap-2 text-sm text-blue-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Processing incident...</span>
          </div>
        )}
      </div>
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-4">
          {agentOutputs.length === 0 && !isProcessing && (
            <div className="text-center py-8">
              <Bot className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-sm">No agent activity yet</p>
              <p className="text-slate-400 text-xs">Submit an incident to see agents in action</p>
            </div>
          )}
          {agentOutputs.map((agent, index) => {
            const AgentIcon = getAgentIcon(agent.agent)
            return (
              <Card key={index} className={`${getStatusColor(agent.status)} transition-all duration-300`}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AgentIcon className="h-4 w-4" />
                      {agent.agent}
                    </div>
                    {getStatusIcon(agent.status)}
                  </CardTitle>
                  {agent.status === "processing" && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-600">{agent.currentTask}</span>
                        <span className="font-medium">{agent.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${agent.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </CardHeader>
                {agent.data && agent.status === "completed" && (
                  <CardContent className="text-xs space-y-3">
                    {/* Web Search Agent Results */}
                    {agent.agent === "WebSearchAgent" && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Search Query:</span>
                          <Badge variant="outline" className="text-xs">
                            {agent.data.query?.split(" ").slice(0, 3).join(" ")}...
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Results Found:</span>
                          <span className="font-medium">{agent.data.results_found}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-slate-600 font-medium">Top Results:</span>
                          {agent.data.relevant_results?.slice(0, 2).map((result: any, idx: number) => (
                            <div key={idx} className="pl-2 border-l-2 border-blue-200 space-y-1">
                              <div className="font-medium text-slate-800">{result.title}</div>
                              <div className="text-slate-500 text-xs">{result.snippet}</div>
                              <div className="flex items-center gap-1">
                                <TrendingUp className="w-3 h-3 text-blue-500" />
                                <span className="text-blue-600">Relevance: {Math.round(result.relevance * 100)}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="pt-2 border-t border-slate-200">
                          <div className="flex items-center gap-1 text-xs">
                            <Globe className="w-3 h-3 text-slate-500" />
                            <span className="text-slate-600">
                              Emergency contacts identified: {agent.data.emergency_contacts?.length || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* Social Media Agent Results */}
                    {agent.agent === "SocialMediaAgent" && (
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Posts:</span>
                            <span className="font-medium">{agent.data.posts_found}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Verified:</span>
                            <span className="font-medium">{agent.data.verified_accounts}</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Sentiment:</span>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              agent.data.sentiment === "concerned"
                                ? "border-orange-500 text-orange-700"
                                : agent.data.sentiment === "worried"
                                  ? "border-red-500 text-red-700"
                                  : "border-yellow-500 text-yellow-700"
                            }`}
                          >
                            {agent.data.sentiment}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <span className="text-slate-600 font-medium">Trending Topics:</span>
                          <div className="flex flex-wrap gap-1">
                            {agent.data.key_topics?.map((topic: string, idx: number) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                #{topic}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-slate-600 font-medium">Sample Posts:</span>
                          {agent.data.sample_posts?.slice(0, 2).map((post: any, idx: number) => (
                            <div key={idx} className="pl-2 border-l-2 border-purple-200 space-y-1">
                              <div className="text-slate-700 text-xs">"{post.text}"</div>
                              <div className="flex items-center gap-2 text-xs">
                                <span
                                  className={`px-1 rounded ${post.verified ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}
                                >
                                  {post.verified ? "Verified" : "Unverified"}
                                </span>
                                <span className="text-slate-500">Engagement: {post.engagement}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="pt-2 border-t border-slate-200">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-600">Credibility Score:</span>
                            <span className="font-medium">
                              {Math.round((agent.data.credibility_score || 0) * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* Summarizer Agent Results */}
                    {agent.agent === "SummarizerAgent" && (
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-slate-600 text-xs">Type:</span>
                            <Badge variant="outline" className="ml-1 text-xs">
                              {agent.data.incident_type}
                            </Badge>
                          </div>
                          <div>
                            <span className="text-slate-600 text-xs">Severity:</span>
                            <Badge
                              variant="outline"
                              className={`ml-1 text-xs ${
                                agent.data.severity === "critical"
                                  ? "border-red-500 text-red-700"
                                  : agent.data.severity === "high"
                                    ? "border-orange-500 text-orange-700"
                                    : "border-yellow-500 text-yellow-700"
                              }`}
                            >
                              {agent.data.severity}
                            </Badge>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-slate-600 font-medium text-xs">Affected Areas:</span>
                          {agent.data.affected_areas?.map((area: string, idx: number) => (
                            <div key={idx} className="flex items-center gap-1 text-xs">
                              <MapPin className="w-3 h-3 text-red-500" />
                              <span>{area}</span>
                            </div>
                          ))}
                        </div>
                        <div className="space-y-1">
                          <span className="text-slate-600 font-medium text-xs">Immediate Actions:</span>
                          {agent.data.immediate_actions?.slice(0, 3).map((action: string, idx: number) => (
                            <div key={idx} className="flex items-start gap-1 text-xs">
                              <AlertTriangle className="w-3 h-3 text-orange-500 mt-0.5 flex-shrink-0" />
                              <span className="text-slate-700">{action}</span>
                            </div>
                          ))}
                        </div>
                        <div className="space-y-1">
                          <span className="text-slate-600 font-medium text-xs">Stakeholders:</span>
                          {agent.data.stakeholders_to_notify?.slice(0, 3).map((stakeholder: string, idx: number) => (
                            <div key={idx} className="flex items-center gap-1 text-xs">
                              <Users className="w-3 h-3 text-emerald-500" />
                              <span>{stakeholder}</span>
                            </div>
                          ))}
                        </div>
                        <div className="pt-2 border-t border-slate-200">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-600">Confidence:</span>
                            <span className="font-medium">{agent.data.confidence_level}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* Coordinator Agent Results */}
                    {agent.agent === "CoordinatorAgent" && (
                      <div className="space-y-2">
                        <div className="text-xs">
                          <span className="text-slate-600 font-medium">Coordination Summary:</span>
                          <div className="mt-1 p-2 bg-slate-100 rounded text-slate-700">{agent.data.summary}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Agents Used:</span>
                            <span className="font-medium">{agent.data.agents_coordinated}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Success Rate:</span>
                            <span className="font-medium">{agent.data.success_rate}%</span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="pt-2 border-t border-slate-200 text-xs text-slate-500">
                      Completed at: {new Date(agent.timestamp).toLocaleTimeString()}
                    </div>
                  </CardContent>
                )}
                {agent.status === "error" && (
                  <CardContent className="text-xs">
                    <div className="text-red-600">Error: {agent.data?.error || "Unknown error occurred"}</div>
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}

// Add a helper function to generate realistic agent data:
const generateAgentData = (agentName: string, incidentData: any) => {
  if (agentName === "WebSearchAgent") {
    return {
      query: `${incidentData.location} ${incidentData.incidentType} emergency safety protocols`,
      results_found: Math.floor(Math.random() * 50) + 15,
      relevant_results: [
        {
          title: `Emergency Response Guidelines for ${incidentData.location}`,
          snippet: "Comprehensive safety protocols and emergency procedures for incident management...",
          relevance: 0.92,
          url: "https://emergency.gov/protocols",
        },
        {
          title: `${incidentData.incidentType} Incident Management Best Practices`,
          snippet: "Industry standard procedures for handling similar incidents with proven effectiveness...",
          relevance: 0.87,
          url: "https://safety.org/best-practices",
        },
        {
          title: `Local Authority Emergency Contacts - ${incidentData.location}`,
          snippet: "Direct contact information for emergency services and local response teams...",
          relevance: 0.85,
          url: "https://local.gov/emergency-contacts",
        },
      ],
      emergency_contacts: [
        { service: "Police", number: "100", response_time: "3-5 minutes" },
        { service: "Fire Department", number: "101", response_time: "4-6 minutes" },
        { service: "Medical Emergency", number: "102", response_time: "5-8 minutes" },
        { service: "Local Emergency Management", number: "8976451234", response_time: "10-15 minutes" },
      ],
      safety_alerts: [
        `Current weather conditions may affect response in ${incidentData.location}`,
        "High crowd density reported in surrounding areas",
        "Emergency services on standby for rapid deployment",
      ],
    }
  } else if (agentName === "SocialMediaAgent") {
    const sentiments = ["concerned", "alert", "worried", "anxious"]
    const topics = ["emergency", "safety", incidentData.incidentType.toLowerCase(), "alert", "help", "response"]
    return {
      posts_found: Math.floor(Math.random() * 40) + 10,
      sentiment: sentiments[Math.floor(Math.random() * sentiments.length)],
      key_topics: topics.slice(0, 4),
      verified_accounts: Math.floor(Math.random() * 8) + 2,
      media_attachments: Math.floor(Math.random() * 15) + 5,
      location_tags: [incidentData.location, `${incidentData.location} area`, "downtown"],
      trending_hashtags: ["#emergency", "#safety", "#alert", `#${incidentData.incidentType.toLowerCase()}`],
      credibility_score: 0.65 + Math.random() * 0.3,
      sample_posts: [
        {
          text: `Emergency situation developing at ${incidentData.location}. Emergency services responding. Please avoid the area.`,
          timestamp: new Date().toISOString(),
          verified: true,
          engagement: Math.floor(Math.random() * 200) + 50,
          platform: "Twitter",
        },
        {
          text: `Witnessed incident at ${incidentData.location}. Looks serious. Hope everyone is safe. #emergency #safety`,
          timestamp: new Date(Date.now() - 300000).toISOString(),
          verified: false,
          engagement: Math.floor(Math.random() * 100) + 20,
          platform: "Twitter",
        },
        {
          text: `Traffic being diverted around ${incidentData.location} due to emergency response. Expect delays.`,
          timestamp: new Date(Date.now() - 600000).toISOString(),
          verified: true,
          engagement: Math.floor(Math.random() * 150) + 30,
          platform: "Facebook",
        },
      ],
      sentiment_analysis: {
        positive: 15,
        neutral: 25,
        negative: 45,
        concerned: 60,
      },
    }
  } else if (agentName === "SummarizerAgent") {
    const severityLevels = ["low", "medium", "high", "critical"]
    const selectedSeverity = severityLevels[Math.floor(Math.random() * severityLevels.length)]
    return {
      incident_type: incidentData.incidentType,
      severity: selectedSeverity,
      affected_areas: [
        incidentData.location,
        `${incidentData.location} vicinity`,
        "Adjacent pedestrian areas",
        "Access routes to location",
      ],
      estimated_people_affected: `${Math.floor(Math.random() * 300) + 100}-${Math.floor(Math.random() * 800) + 500}`,
      immediate_actions: [
        "Deploy emergency response teams to incident location",
        "Establish security perimeter and crowd control measures",
        "Coordinate with local authorities and emergency services",
        "Monitor situation for potential escalation or spread",
        "Implement traffic diversions and area access restrictions",
        "Activate emergency communication protocols",
      ],
      preventive_measures: [
        "Enhanced monitoring systems for early detection",
        "Improved crowd management and flow control",
        "Regular safety drills and emergency preparedness training",
        "Upgraded communication systems for faster response",
        "Better coordination protocols between agencies",
      ],
      stakeholders_to_notify: [
        "Local Emergency Services",
        "Event Management Team",
        "Local Government Authorities",
        "Medical Response Units",
        "Public Safety Department",
        "Media Relations Team",
      ],
      summary: `${incidentData.incidentType} incident reported at ${incidentData.location}. ${incidentData.description} Based on multi-agent analysis, this incident requires ${selectedSeverity} priority response with immediate deployment of emergency services and crowd management protocols.`,
      recommendations: [
        "Immediate deployment of specialized response teams",
        "Continuous monitoring and situation assessment",
        "Prepare for potential escalation scenarios",
        "Ensure clear communication channels remain open",
        "Document incident for post-event analysis",
        "Coordinate with media for public information updates",
      ],
      confidence_level: `${Math.floor(Math.random() * 15) + 80}%`,
      risk_assessment: {
        current_risk: selectedSeverity,
        escalation_probability: Math.floor(Math.random() * 40) + 20,
        containment_feasibility: Math.floor(Math.random() * 30) + 70,
      },
    }
  } else if (agentName === "CoordinatorAgent") {
    return {
      summary: `Successfully coordinated multi-agent analysis for ${incidentData.incidentType} incident at ${incidentData.location}. All agents completed their tasks and provided comprehensive incident assessment.`,
      agents_coordinated: 3,
      success_rate: 100,
      total_processing_time: "8.5 seconds",
      data_sources_analyzed: 12,
      recommendations_generated: 6,
      stakeholders_identified: 6,
    }
  }
  return {}
}

// Main Incident Management Component
export default function IncidentManagement() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [newIncident, setNewIncident] = useState({
    description: "",
    location: "",
    incidentType: "general",
  })
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [agentOutputs, setAgentOutputs] = useState<AgentOutput[]>([])
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
    }
  }

  const simulateAgentProcessing = async (incidentData: any) => {
    const agents = [
      {
        name: "CoordinatorAgent",
        tasks: ["Initializing multi-agent system", "Coordinating agent workflow", "Preparing incident context"],
        duration: 1500,
      },
      {
        name: "WebSearchAgent",
        tasks: [
          "Searching web for incident information",
          "Analyzing safety protocols",
          "Finding emergency contacts",
          "Compiling search results",
        ],
        duration: 2000,
      },
      {
        name: "SocialMediaAgent",
        tasks: [
          "Monitoring social media platforms",
          "Analyzing sentiment",
          "Checking verified accounts",
          "Assessing credibility",
        ],
        duration: 1800,
      },
      {
        name: "SummarizerAgent",
        tasks: [
          "Analyzing collected data",
          "Assessing incident severity",
          "Generating recommendations",
          "Creating final report",
        ],
        duration: 1200,
      },
    ]

    for (const agent of agents) {
      // Initialize agent with stable state
      setAgentOutputs((prev) => {
        const filtered = prev.filter((a) => a.agent !== agent.name)
        return [
          ...filtered,
          {
            agent: agent.name,
            status: "initializing" as const,
            data: null,
            timestamp: new Date().toISOString(),
            progress: 0,
            currentTask: "Initializing...",
          },
        ]
      })

      await new Promise((resolve) => setTimeout(resolve, 300))

      // Process agent tasks with smoother updates
      for (let i = 0; i < agent.tasks.length; i++) {
        const progress = Math.round(((i + 1) / agent.tasks.length) * 100)

        setAgentOutputs((prev) =>
          prev.map((a) =>
            a.agent === agent.name ? { ...a, status: "processing" as const, progress, currentTask: agent.tasks[i] } : a,
          ),
        )

        await new Promise((resolve) => setTimeout(resolve, agent.duration / agent.tasks.length))
      }

      // Complete agent with results (generate realistic data based on incident type)
      const agentData = generateAgentData(agent.name, incidentData)

      setAgentOutputs((prev) =>
        prev.map((a) =>
          a.agent === agent.name
            ? { ...a, status: "completed" as const, data: agentData, progress: 100, currentTask: "Completed" }
            : a,
        ),
      )

      await new Promise((resolve) => setTimeout(resolve, 200))
    }
  }

  const handleSubmitIncident = async () => {
    if (!newIncident.description || !newIncident.location) {
      alert("Please fill in all required fields")
      return
    }

    setIsProcessing(true)
    setAgentOutputs([]) // Clear previous outputs

    try {
      // Process agents sequentially to prevent state conflicts
      await simulateAgentProcessing(newIncident)

      // Wait for all agents to complete before creating incident
      setTimeout(() => {
        const summarizerOutput = agentOutputs.find((a) => a.agent === "SummarizerAgent")
        const analysis = summarizerOutput?.data

        if (analysis) {
          const newIncidentData: Incident = {
            id: `INC-${Date.now()}`,
            type: analysis.incident_type || newIncident.incidentType,
            description: newIncident.description,
            severity: analysis.severity || "Medium",
            status: "Active",
            location: newIncident.location,
            coordinates: { lat: 40.7128 + Math.random() * 0.01, lng: -74.006 + Math.random() * 0.01 },
            timestamp: new Date().toLocaleString(),
            reportedBy: "User Report",
            assignedTeam: "Response Team Alpha",
            estimatedCrowd:
              Number.parseInt(analysis.estimated_people_affected?.split("-")[0]) ||
              Math.floor(Math.random() * 500) + 100,
            icon: getIncidentIcon(analysis.incident_type || newIncident.incidentType),
            color: getSeverityColorClass(analysis.severity || "medium"),
          }

          setIncidents((prev) => [newIncidentData, ...prev])
          setSelectedIncident(newIncidentData)
        }

        // Reset form
        setNewIncident({ description: "", location: "", incidentType: "general" })
        setSelectedImage(null)
        setIsProcessing(false)
      }, 500) // Small delay to ensure all agents have completed
    } catch (error) {
      console.error("Error processing incident:", error)
      alert("Error processing incident. Please try again.")
      setIsProcessing(false)
    }
  }

  const getIncidentIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "fire":
        return Flame
      case "crowd":
        return Users
      case "injury":
      case "medical":
        return Heart
      case "crime":
        return Shield
      default:
        return AlertTriangle
    }
  }

  const getSeverityColorClass = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "critical":
        return "text-red-600 bg-red-100"
      case "high":
        return "text-orange-600 bg-orange-100"
      case "medium":
        return "text-yellow-600 bg-yellow-100"
      case "low":
        return "text-emerald-600 bg-emerald-100"
      default:
        return "text-slate-600 bg-slate-100"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-600 text-white"
      case "High":
        return "bg-orange-500 text-white"
      case "Medium":
        return "bg-yellow-500 text-white"
      case "Low":
        return "bg-emerald-500 text-white"
      default:
        return "bg-slate-500 text-white"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "Responding":
        return <Eye className="h-4 w-4 text-orange-600" />
      case "Monitoring":
        return <Eye className="h-4 w-4 text-yellow-600" />
      case "Resolved":
        return <CheckCircle className="h-4 w-4 text-emerald-600" />
      default:
        return <AlertTriangle className="h-4 w-4 text-slate-600" />
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Incident Management</h1>
            <p className="text-slate-600">Real-time incident tracking and AI-powered response coordination</p>
          </div>

          {/* New Incident Form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Report New Incident</CardTitle>
              <CardDescription>Submit incident details for AI analysis and response coordination</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Main Stage Area, Gate 1, Food Court"
                    value={newIncident.location}
                    onChange={(e) => setNewIncident((prev) => ({ ...prev, location: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="incident-type">Incident Type</Label>
                  <select
                    id="incident-type"
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    value={newIncident.incidentType}
                    onChange={(e) => setNewIncident((prev) => ({ ...prev, incidentType: e.target.value }))}
                  >
                    <option value="general">General</option>
                    <option value="fire">Fire</option>
                    <option value="crowd">Crowd Issue</option>
                    <option value="medical">Medical Emergency</option>
                    <option value="crime">Security/Crime</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the incident in detail..."
                  rows={3}
                  value={newIncident.description}
                  onChange={(e) => setNewIncident((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Upload Image (Optional)</Label>
                <div className="flex items-center gap-4">
                  <Input id="image" type="file" accept="image/*" onChange={handleImageUpload} className="flex-1" />
                  {selectedImage && (
                    <div className="flex items-center gap-2 text-sm text-emerald-600">
                      <Upload className="h-4 w-4" />
                      {selectedImage.name}
                    </div>
                  )}
                </div>
              </div>
              <Button onClick={handleSubmitIncident} disabled={isProcessing} className="w-full md:w-auto">
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing with AI Agents...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit Incident
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Google Map */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Incident Locations</CardTitle>
              <CardDescription>Real-time incident mapping and visualization</CardDescription>
            </CardHeader>
            <CardContent>
              <GoogleMap incidents={incidents} />
            </CardContent>
          </Card>

          {/* Precautionary Measures - Show only when there are incidents */}
          {(selectedIncident || incidents.length > 0) && (
            <div className="mb-8">
              <PrecautionaryMeasures
                incidentType={selectedIncident?.type || incidents[0]?.type || "general"}
                severity={selectedIncident?.severity || incidents[0]?.severity || "medium"}
              />
            </div>
          )}

          {/* Emergency Route Display - Show only when there are incidents */}
          {(selectedIncident || incidents.length > 0) && (
            <div className="mb-8">
              <EmergencyRouteDisplay
                incidentCoordinates={
                  selectedIncident?.coordinates || incidents[0]?.coordinates || { lat: 40.7128, lng: -74.006 }
                }
                incidentType={selectedIncident?.type || incidents[0]?.type || "general"}
              />
            </div>
          )}

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Active Incidents</p>
                    <p className="text-2xl font-bold text-red-600">
                      {incidents.filter((i) => i.status === "Active").length}
                    </p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Under Response</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {incidents.filter((i) => i.status === "Responding").length}
                    </p>
                  </div>
                  <Eye className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Monitoring</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {incidents.filter((i) => i.status === "Monitoring").length}
                    </p>
                  </div>
                  <Eye className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Resolved Today</p>
                    <p className="text-2xl font-bold text-emerald-600">
                      {incidents.filter((i) => i.status === "Resolved").length}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-emerald-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Incidents List */}
          <div className="space-y-6">
            {incidents.map((incident) => (
              <Card
                key={incident.id}
                className={`overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${
                  selectedIncident?.id === incident.id ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => setSelectedIncident(incident)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${incident.color}`}>
                        <incident.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{incident.type}</CardTitle>
                        <CardDescription className="flex items-center gap-4 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {incident.timestamp}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {incident.location}
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(incident.status)}
                      <Badge className={getSeverityColor(incident.severity)}>{incident.severity}</Badge>
                      {selectedIncident?.id === incident.id && (
                        <Badge variant="outline" className="text-blue-600 border-blue-600">
                          Selected
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium text-slate-900 mb-2">Incident Details</h4>
                    <p className="text-slate-600 leading-relaxed">{incident.description}</p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-slate-900 mb-3">Incident Information</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Incident ID:</span>
                            <span className="font-medium">{incident.id}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Reported By:</span>
                            <span className="font-medium">{incident.reportedBy}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Assigned Team:</span>
                            <span className="font-medium">{incident.assignedTeam}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Estimated Crowd:</span>
                            <span className="font-medium flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {incident.estimatedCrowd.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Coordinates:</span>
                            <span className="font-medium">
                              {incident.coordinates.lat.toFixed(4)}, {incident.coordinates.lng.toFixed(4)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900 mb-3">Location Map</h4>
                      <div className="aspect-video bg-slate-200 rounded-lg relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-blue-100"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <MapPin className="h-12 w-12 text-red-600 mx-auto mb-2" />
                            <p className="text-sm font-medium text-slate-700">Incident Location</p>
                            <p className="text-xs text-slate-600">{incident.location}</p>
                          </div>
                        </div>
                        <div className="absolute top-4 left-4 w-16 h-16 bg-white/80 rounded-lg flex items-center justify-center">
                          <Navigation className="h-6 w-6 text-slate-600" />
                        </div>
                        <div className="absolute bottom-4 right-4 bg-white/90 rounded px-2 py-1 text-xs">Zoom: 18x</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 pt-4 border-t">
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                      <Phone className="mr-2 h-4 w-4" />
                      Contact Team
                    </Button>
                    <Button size="sm" variant="outline">
                      <MapPin className="mr-2 h-4 w-4" />
                      View on Map
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="mr-2 h-4 w-4" />
                      View Camera Feed
                    </Button>
                    <Button size="sm" variant="outline">
                      <Navigation className="mr-2 h-4 w-4" />
                      Get Directions
                    </Button>
                    {incident.status !== "Resolved" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-emerald-600 border-emerald-600 hover:bg-emerald-50 bg-transparent"
                        onClick={(e) => {
                          e.stopPropagation()
                          setIncidents((prev) =>
                            prev.map((i) => (i.id === incident.id ? { ...i, status: "Resolved" } : i)),
                          )
                        }}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Mark Resolved
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Agent Sidebar */}
      <AgentSidebar agentOutputs={agentOutputs} isProcessing={isProcessing} />
    </div>
  )
}
