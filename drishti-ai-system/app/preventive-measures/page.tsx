import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Flame, Shield, Navigation, MapPin, Phone, AlertTriangle, Route, Timer } from "lucide-react"

export default function PreventiveMeasures() {
  const emergencyServices = [
    {
      id: "medical-001",
      type: "Medical Emergency",
      incident: "Heat exhaustion at Main Stage",
      location: "Main Stage Area - Section A",
      coordinates: { lat: 40.7128, lng: -74.006 },
      priority: "Critical",
      services: [
        {
          name: "Ambulance Service",
          department: "City Medical Emergency",
          contact: "+1-911-MED-001",
          currentLocation: "Medical Station Alpha",
          estimatedTime: "3 minutes",
          distance: "0.8 km",
          route: "Via Main Boulevard → Stage Access Road",
          icon: Heart,
          color: "text-red-600 bg-red-100",
        },
        {
          name: "Medical Response Team",
          department: "Event Medical Unit",
          contact: "+1-555-0123",
          currentLocation: "First Aid Station 2",
          estimatedTime: "1 minute",
          distance: "0.2 km",
          route: "Direct path via pedestrian walkway",
          icon: Heart,
          color: "text-red-600 bg-red-100",
        },
      ],
    },
    {
      id: "fire-001",
      type: "Fire Hazard",
      incident: "Electrical equipment smoke",
      location: "Food Court - Vendor Row 3",
      coordinates: { lat: 40.7125, lng: -74.0065 },
      priority: "High",
      services: [
        {
          name: "Fire Department",
          department: "City Fire Brigade Station 12",
          contact: "+1-911-FIRE-12",
          currentLocation: "Fire Station 12",
          estimatedTime: "7 minutes",
          distance: "3.2 km",
          route: "Via Highway 101 → Event Access Road → Food Court",
          icon: Flame,
          color: "text-orange-600 bg-orange-100",
        },
        {
          name: "Event Fire Safety",
          department: "On-site Fire Safety Team",
          contact: "+1-555-0456",
          currentLocation: "Safety Command Center",
          estimatedTime: "2 minutes",
          distance: "0.5 km",
          route: "Via service road to Food Court area",
          icon: Flame,
          color: "text-orange-600 bg-orange-100",
        },
      ],
    },
    {
      id: "security-001",
      type: "Crowd Control",
      incident: "Stampede risk at entrance",
      location: "North Entrance Gate 1",
      coordinates: { lat: 40.713, lng: -74.0058 },
      priority: "Critical",
      services: [
        {
          name: "Police Response Unit",
          department: "Metropolitan Police District 5",
          contact: "+1-911-POL-005",
          currentLocation: "Mobile Unit Patrol Zone B",
          estimatedTime: "4 minutes",
          distance: "1.1 km",
          route: "Via Perimeter Road → North Entrance",
          icon: Shield,
          color: "text-blue-600 bg-blue-100",
        },
        {
          name: "Security Team",
          department: "Event Security Alpha",
          contact: "+1-555-0789",
          currentLocation: "Security Post 3",
          estimatedTime: "1 minute",
          distance: "0.1 km",
          route: "Direct response - already positioned nearby",
          icon: Shield,
          color: "text-blue-600 bg-blue-100",
        },
      ],
    },
  ]

  const preventiveMeasures = [
    {
      category: "Crowd Management",
      measures: [
        "Deploy additional security personnel to high-density areas",
        "Implement one-way pedestrian flow systems",
        "Set up temporary barriers to control crowd movement",
        "Activate emergency evacuation protocols if needed",
      ],
    },
    {
      category: "Medical Preparedness",
      measures: [
        "Position mobile medical units at strategic locations",
        "Increase hydration stations in high-temperature areas",
        "Deploy additional first aid personnel",
        "Prepare emergency medical evacuation routes",
      ],
    },
    {
      category: "Fire Safety",
      measures: [
        "Conduct immediate electrical system inspection",
        "Deploy fire safety personnel to affected area",
        "Prepare evacuation routes for surrounding zones",
        "Ensure fire suppression systems are operational",
      ],
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Preventive Measures & Emergency Response</h1>
          <p className="text-slate-600">Coordinated emergency response routing and preventive action protocols</p>
        </div>

        {/* Emergency Response Coordination */}
        <div className="space-y-8">
          {emergencyServices.map((emergency) => (
            <Card key={emergency.id} className="overflow-hidden">
              <CardHeader className="bg-slate-900 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <AlertTriangle className="h-6 w-6 text-orange-400" />
                      {emergency.type} Response
                    </CardTitle>
                    <CardDescription className="text-slate-300 mt-2">{emergency.incident}</CardDescription>
                  </div>
                  <Badge className={getPriorityColor(emergency.priority)}>{emergency.priority} Priority</Badge>
                </div>
                <div className="flex items-center gap-4 mt-4 text-sm text-slate-300">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {emergency.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Navigation className="h-4 w-4" />
                    {emergency.coordinates.lat.toFixed(4)}, {emergency.coordinates.lng.toFixed(4)}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-6">
                  {emergency.services.map((service, index) => (
                    <div key={index} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${service.color}`}>
                            <service.icon className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900">{service.name}</h3>
                            <p className="text-sm text-slate-600">{service.department}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
                            <Timer className="h-4 w-4" />
                            ETA: {service.estimatedTime}
                          </div>
                          <p className="text-xs text-slate-500 mt-1">{service.distance}</p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-medium text-slate-900 mb-2">Current Location</h4>
                          <p className="text-sm text-slate-600 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {service.currentLocation}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-900 mb-2">Contact</h4>
                          <p className="text-sm text-slate-600 flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {service.contact}
                          </p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-medium text-slate-900 mb-2 flex items-center gap-2">
                          <Route className="h-4 w-4" />
                          Optimal Route
                        </h4>
                        <div className="bg-slate-50 rounded-lg p-3">
                          <p className="text-sm text-slate-700">{service.route}</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                          <Phone className="mr-2 h-4 w-4" />
                          Contact Now
                        </Button>
                        <Button size="sm" variant="outline">
                          <Navigation className="mr-2 h-4 w-4" />
                          Send GPS Coordinates
                        </Button>
                        <Button size="sm" variant="outline">
                          <Route className="mr-2 h-4 w-4" />
                          View Route Map
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Preventive Measures */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Preventive Measures Protocol</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {preventiveMeasures.map((category, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {category.measures.map((measure, measureIndex) => (
                      <li key={measureIndex} className="flex items-start gap-2 text-sm">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-slate-700">{measure}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Emergency Contacts */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-emerald-600" />
              Emergency Contacts Directory
            </CardTitle>
            <CardDescription>Quick access to all emergency services and key personnel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-slate-900 mb-2">Emergency Services</h4>
                <div className="space-y-1 text-sm">
                  <p className="flex justify-between">
                    <span>Police:</span>
                    <span className="font-medium">911</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Fire Department:</span>
                    <span className="font-medium">911</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Medical Emergency:</span>
                    <span className="font-medium">911</span>
                  </p>
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-slate-900 mb-2">Event Command</h4>
                <div className="space-y-1 text-sm">
                  <p className="flex justify-between">
                    <span>Event Director:</span>
                    <span className="font-medium">+1-555-0100</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Security Chief:</span>
                    <span className="font-medium">+1-555-0200</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Medical Coordinator:</span>
                    <span className="font-medium">+1-555-0300</span>
                  </p>
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-slate-900 mb-2">Support Services</h4>
                <div className="space-y-1 text-sm">
                  <p className="flex justify-between">
                    <span>Crowd Control:</span>
                    <span className="font-medium">+1-555-0400</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Technical Support:</span>
                    <span className="font-medium">+1-555-0500</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Logistics:</span>
                    <span className="font-medium">+1-555-0600</span>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
