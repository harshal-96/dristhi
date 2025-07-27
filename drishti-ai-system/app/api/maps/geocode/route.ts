import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const location = searchParams.get("location")

  if (!location) {
    return NextResponse.json({ error: "Location parameter is required" }, { status: 400 })
  }

  try {
    // Use the Google Geocoding API with the provided key
    const apiKey = "AIzaSyCaPXuD7N5pw9YgM8oiyaVEEnijUH16LvA"
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${apiKey}`,
    )

    const data = await response.json()

    if (data.status === "OK" && data.results.length > 0) {
      const result = data.results[0]
      return NextResponse.json({
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
        formatted_address: result.formatted_address,
        place_id: result.place_id,
      })
    } else {
      // Fallback coordinates (Times Square, NYC)
      return NextResponse.json({
        lat: 40.758,
        lng: -73.9855,
        formatted_address: "Times Square, New York, NY, USA",
        place_id: "fallback",
      })
    }
  } catch (error) {
    console.error("Geocoding error:", error)
    // Fallback coordinates
    return NextResponse.json({
      lat: 40.758,
      lng: -73.9855,
      formatted_address: "Times Square, New York, NY, USA",
      place_id: "fallback",
    })
  }
}
