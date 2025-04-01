import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Event from "@/lib/models/event"
import { getAuthUser } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const events = await Event.find({}).sort({ date: 1 })

    return NextResponse.json(events, { status: 200 })
  } catch (error) {
    console.error("Get events error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser()

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const data = await req.json()

    const event = await Event.create(data)

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error("Create event error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

