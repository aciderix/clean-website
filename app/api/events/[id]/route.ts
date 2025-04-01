import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Event from "@/lib/models/event"
import { getAuthUser } from "@/lib/auth"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const event = await Event.findById(params.id)

    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 })
    }

    return NextResponse.json(event, { status: 200 })
  } catch (error) {
    console.error("Get event error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser()

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const data = await req.json()

    const event = await Event.findByIdAndUpdate(params.id, data, { new: true, runValidators: true })

    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 })
    }

    return NextResponse.json(event, { status: 200 })
  } catch (error) {
    console.error("Update event error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser()

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const event = await Event.findByIdAndDelete(params.id)

    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Event deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Delete event error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

