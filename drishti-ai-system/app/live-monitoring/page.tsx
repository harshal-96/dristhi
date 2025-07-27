"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Camera, Maximize2, Volume2, VolumeX, Play, Pause, AlertTriangle, Users, MapPin, Wifi } from "lucide-react"
import { useState } from "react"

export default function LiveMonitoring() {
  const [mutedCameras, setMutedCameras] = useState<Set<string>>(new Set())
  const [playingCameras, setPlayingCameras] = useState<Set<string>>(
    new Set(["cam-1", "cam-2", "cam-3", "cam-4", "cam-5", "cam-6"]),
  )

  const cameras = [
  {
    id: "cam-1",
    name: "Mumbai Central Station",
    location: "Mumbai, Maharashtra",
    status: "Active",
    crowdDensity: "High",
    alerts: 0,
    signal: "Excellent",
    videoSrc: "/videos/cam-1.mp4",
  },
  {
    id: "cam-2",
    name: "Entrance Gate - Connaught Place",
    location: "Delhi, Central Zone",
    status: "Active",
    crowdDensity: "Medium",
    alerts: 0,
    signal: "Good",
    videoSrc: "/videos/cam-2.mp4",
  },
  {
    id: "cam-3",
    name: "Food Court - Phoenix Mall",
    location: "Pune, Maharashtra",
    status: "Active",
    crowdDensity: "Low",
    alerts: 1,
    signal: "Excellent",
    videoSrc: "/videos/cam-3.mp4",
  },
  {
    id: "cam-4",
    name: "Emergency Exit - Howrah Bridge",
    location: "Kolkata, West Bengal",
    status: "Active",
    crowdDensity: "Medium",
    alerts: 0,
    signal: "Fair",
    videoSrc: "/videos/cam-4.mp4",
  },
  {
    id: "cam-5",
    name: "VIP Lounge - Hyderabad Airport",
    location: "Hyderabad, Telangana",
    status: "Active",
    crowdDensity: "Low",
    alerts: 0,
    signal: "Excellent",
    videoSrc: "/videos/cam-5.mp4",
  },
  {
    id: "cam-6",
    name: "Parking Area - Bengaluru IT Park",
    location: "Bengaluru, Karnataka",
    status: "Active",
    crowdDensity: "High",
    alerts: 1,
    signal: "Good",
    videoSrc: "/videos/cam-6.mp4",
  },
]

  const toggleMute = (cameraId: string) => {
    const newMuted = new Set(mutedCameras)
    if (newMuted.has(cameraId)) {
      newMuted.delete(cameraId)
    } else {
      newMuted.add(cameraId)
    }
    setMutedCameras(newMuted)
  }

  const togglePlay = (cameraId: string) => {
    const newPlaying = new Set(playingCameras)
    if (newPlaying.has(cameraId)) {
      newPlaying.delete(cameraId)
    } else {
      newPlaying.add(cameraId)
    }
    setPlayingCameras(newPlaying)
  }

  const getCrowdDensityColor = (density: string) => {
    switch (density) {
      case "High":
        return "text-red-600 bg-red-100"
      case "Medium":
        return "text-yellow-600 bg-yellow-100"
      case "Low":
        return "text-emerald-600 bg-emerald-100"
      default:
        return "text-slate-600 bg-slate-100"
    }
  }

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case "Excellent":
        return "text-emerald-600"
      case "Good":
        return "text-blue-600"
      case "Fair":
        return "text-yellow-600"
      case "Poor":
        return "text-red-600"
      default:
        return "text-slate-600"
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Live Monitoring</h1>
          <p className="text-slate-600">Real-time CCTV and drone surveillance feeds</p>
        </div>

        {/* Status Bar */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Live</span>
                </div>
                <div className="flex items-center gap-2">
                  <Camera className="h-4 w-4 text-slate-600" />
                  <span className="text-sm">{cameras.length} Active Cameras</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-slate-600" />
                  <span className="text-sm">15,432 People Detected</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-600">4 Active Alerts</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Camera Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cameras.map((camera) => (
            <Card key={camera.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{camera.name}</CardTitle>
                  <div className="flex items-center gap-1">
                    <Wifi className={`h-4 w-4 ${getSignalColor(camera.signal)}`} />
                    <span className={`text-xs ${getSignalColor(camera.signal)}`}>{camera.signal}</span>
                  </div>
                </div>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {camera.location}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {/* Video Feed Placeholder */}
                <div className="relative aspect-video">
  {playingCameras.has(camera.id) ? (
    <div className="relative aspect-video">
  {playingCameras.has(camera.id) ? (
    <video
  src={camera.videoSrc}
  className="w-full h-full object-cover"
  autoPlay
  muted
  loop
  playsInline
/>

  ) : (
    <div className="absolute inset-0 bg-slate-800 flex flex-col justify-center items-center">
      <Camera className="h-12 w-12 text-slate-400 mb-2" />
      <p className="text-slate-400">Paused</p>
    </div>
  )}
</div>

  ) : (
    <div className="absolute inset-0 bg-slate-800 flex flex-col justify-center items-center">
      <Camera className="h-12 w-12 text-slate-400 mb-2" />
      <p className="text-slate-400">Paused</p>
    </div>
  )}
</div>

                {/* Camera Info */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status</span>
                    <Badge className="bg-emerald-100 text-emerald-800">{camera.status}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Crowd Density</span>
                    <Badge className={getCrowdDensityColor(camera.crowdDensity)}>{camera.crowdDensity}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Drone Feeds Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Drone Surveillance Feeds</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  Drone Alpha - Aerial Overview
                </CardTitle>
                <CardDescription>Altitude: 150m | Coverage: Main Event Area</CardDescription>
              </CardHeader>
<CardContent className="p-0">
  <div className="aspect-video bg-slate-900 flex items-center justify-center relative">
    <video
      src="/videos/drone-alpha.mp4"
      autoPlay
      muted
      loop
      playsInline
      className="w-full h-full object-cover"
    />
  </div>
</CardContent>

            </Card>

            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                  Drone Beta - Perimeter Patrol
                </CardTitle>
                <CardDescription>Altitude: 100m | Coverage: Security Perimeter</CardDescription>
              </CardHeader>
             <CardContent className="p-0">
  <div className="aspect-video bg-slate-900 flex items-center justify-center relative">
    <video
      src="/videos/drone-beta.mp4"
      autoPlay
      muted
      loop
      playsInline
      className="w-full h-full object-cover"
    />
  </div>
</CardContent>

            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
