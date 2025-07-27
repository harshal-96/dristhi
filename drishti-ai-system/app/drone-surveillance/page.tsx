"use client"

import { useState } from "react"
import axios from "axios"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Upload, Play, AlertTriangle, Users, Flame, Heart,
  Shield, Download, Eye, Clock, MapPin
} from "lucide-react"

export default function DroneSurveillance() {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [detectedAnomalies, setDetectedAnomalies] = useState<any[]>([])
  const [summaryData, setSummaryData] = useState<any>(null)

  const handleUpload = async () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "video/*"
    input.onchange = async (event: any) => {
      const file = event.target.files?.[0]
      if (!file) return

      setIsProcessing(true)
      setUploadProgress(0)

      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 300)

      const formData = new FormData()
      formData.append("video_file", file)

      try {
        const response = await axios.post("http://localhost:8000/api/drone/analyze", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        })

        clearInterval(progressInterval)
        setUploadProgress(100)

        const { analysis, summary } = response.data
        setTimeout(() => {
          setIsProcessing(false)
          setAnalysisComplete(true)
          setDetectedAnomalies(analysis)
          setSummaryData(summary)
        }, 1000)

      } catch (error) {
        console.error("Upload failed:", error)
        clearInterval(progressInterval)
        setIsProcessing(false)
      }
    }

    input.click()
  }
  const handleCreateAlert = async (anomaly: any) => {
  try {
    await axios.post("http://localhost:8000/api/alerts", anomaly);
    alert("Alert created successfully");
  } catch (error) {
    console.error("Alert creation failed", error);
    alert("Failed to create alert");
  }
};
const handleViewFrame = (framePath: string) => {
  if (!framePath) return;
  window.open(`http://localhost:8000/${framePath}`, "_blank"); // Make sure backend exposes frame path
};

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical": return "bg-red-600 text-white"
      case "High": return "bg-red-500 text-white"
      case "Medium": return "bg-yellow-500 text-white"
      case "Low": return "bg-emerald-500 text-white"
      default: return "bg-slate-500 text-white"
    }
  }
const handleDownloadReport = async () => {
  const pdfUrl = "http://localhost:8000/temp/final_report.pdf";
  const response = await fetch(pdfUrl);

  if (!response.ok) {
    console.error("Failed to fetch PDF file.");
    return;
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "analysis_summary.pdf";  // File name for download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url); // Clean up
};



  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Drone Surveillance Analysis</h1>
          <p className="text-slate-600">AI-powered video analysis for anomaly detection and incident identification</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Upload Panel */}
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-blue-600" />
                  Video Upload
                </CardTitle>
                <CardDescription>Upload drone footage for AI analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isProcessing && !analysisComplete && (
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                    <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 mb-2">Drop video files here or click to browse</p>
                    <p className="text-sm text-slate-500">Supports MP4, AVI, MOV formats</p>
                    <Button className="mt-4" onClick={handleUpload}>
                      Select Video File
                    </Button>
                  </div>
                )}

                {isProcessing && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Play className="h-8 w-8 text-blue-600 animate-pulse" />
                      </div>
                      <p className="font-medium text-slate-900">Processing Video...</p>
                      <p className="text-sm text-slate-600">AI analysis in progress</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Upload Progress</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2" />
                    </div>
                  </div>
                )}

                {analysisComplete && (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                      <Eye className="h-8 w-8 text-emerald-600" />
                    </div>
                    <p className="font-medium text-slate-900">Analysis Complete</p>
                    <p className="text-sm text-slate-600">{detectedAnomalies.length} anomalies detected</p>
<Button variant="outline" className="w-full bg-transparent" onClick={handleDownloadReport}>
  <Download className="mr-2 h-4 w-4" />
  Download Report
</Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {summaryData && (
              <Card>
                <CardHeader>
                  <CardTitle>Analysis Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Video Duration</span>
                    <span className="text-sm text-slate-600">{summaryData.duration || "Unknown"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Frames Analyzed</span>
                    <span className="text-sm text-slate-600">{summaryData.frames_analyzed}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Processing Time</span>
                    <span className="text-sm text-slate-600">{summaryData.processing_time}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Anomalies Found</span>
                    <Badge className="bg-red-100 text-red-800">{detectedAnomalies.length} detected</Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            {analysisComplete ? (
              <div className="space-y-6">
                {/* Anomalies List */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                      Detected Anomalies
                    </CardTitle>
                    <CardDescription>AI-identified incidents requiring attention</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {detectedAnomalies.map((anomaly: any, index: number) => {
                        const Icon = {
                          "Medical Emergency": Heart,
                          "Fire Hazard": Flame,
                          "Suspicious Activity": Shield,
                          "Crowd Density Alert": Users,
                          "Stampede Risk": Users
                        }[anomaly.type] || AlertTriangle

                        return (
                          <div key={index} className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getSeverityColor(anomaly.severity)}`}>
                                  <Icon className="h-5 w-5" />
                                </div>
                                <div>
                                  <h4 className="font-medium text-slate-900">{anomaly.type}</h4>
                                  <p className="text-sm text-slate-600 flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {anomaly.timestamp}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={getSeverityColor(anomaly.severity)}>{anomaly.severity}</Badge>
                                <span className="text-sm text-slate-600">{anomaly.confidence}%</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-slate-600 flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {anomaly.location}
                              </p>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => handleViewFrame(anomaly.frame_path)}>
                                  View Frame
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleCreateAlert(anomaly)}>
  Create Alert
</Button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="h-96 flex items-center justify-center">
                <div className="text-center text-slate-500">
                  <Upload className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                  <p className="text-lg font-medium mb-2">No Video Uploaded</p>
                  <p>Upload a drone surveillance video to begin AI analysis</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
