import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Shield, Zap, Brain, Users, BarChart3, ArrowRight, Play } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const features = [
    {
      icon: Eye,
      title: "Real-time AI Monitoring",
      description:
        "Advanced computer vision algorithms continuously analyze crowd patterns and behaviors across multiple camera feeds.",
    },
    {
      icon: Zap,
      title: "Instant Incident Detection",
      description:
        "Millisecond response time for identifying potential safety threats, stampedes, and emergency situations.",
    },
    {
      icon: Shield,
      title: "Automated Emergency Dispatch",
      description:
        "Intelligent routing system automatically alerts and dispatches appropriate emergency services to incident locations.",
    },
    {
      icon: Brain,
      title: "Preventive Analytics",
      description:
        "Predictive modeling identifies high-risk areas and situations before they become critical safety hazards.",
    },
    {
      icon: Users,
      title: "Multi-Authority Coordination",
      description: "Seamless communication platform connecting police, medical, fire, and security teams in real-time.",
    },
    {
      icon: BarChart3,
      title: "Historical Incident Tracking",
      description:
        "Comprehensive database of past incidents with detailed analytics for improved future event planning.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1200')] opacity-10"></div>
        <div className="relative container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-sm font-medium">
              Next-Generation Crowd Safety
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              DRISHTI AI
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Proactive Crowd Safety Through AI Intelligence
            </p>
            <p className="text-lg mb-10 text-slate-400 max-w-2xl mx-auto">
              Transform reactive monitoring into intelligent, proactive intervention for large-scale public events.
              Prevent incidents before they happen with cutting-edge AI technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3">
                <Link href="/dashboard">
                  Launch Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-slate-300 text-slate-300 hover:bg-slate-800 px-8 py-3 bg-transparent"
              >
                <Link href="/live-monitoring">
                  <Play className="mr-2 h-5 w-5" />
                  View Live Demo
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Intelligent Safety Features</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Comprehensive AI-powered solutions designed to keep large crowds safe through proactive monitoring and
              instant response capabilities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 border-slate-200 hover:border-emerald-300"
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors">
                    <feature.icon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <CardTitle className="text-xl text-slate-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-600 leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Event Safety?</h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Join leading event organizers who trust DRISHTI AI to keep their crowds safe with intelligent, proactive
            monitoring.
          </p>
          <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3">
            <Link href="/dashboard">
              Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
