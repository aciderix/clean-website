import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Section from "@/lib/models/section"
import { getAuthUser } from "@/lib/auth"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const section = await Section.findById(params.id)

    if (!section) {
      return NextResponse.json({ message: "Section not found" }, { status: 404 })
    }

    return NextResponse.json(section, { status: 200 })
  } catch (error) {
    console.error("Get section error:", error)
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

    const section = await Section.findByIdAndUpdate(params.id, data, { new: true, runValidators: true })

    if (!section) {
      return NextResponse.json({ message: "Section not found" }, { status: 404 })
    }

    return NextResponse.json(section, { status: 200 })
  } catch (error) {
    console.error("Update section error:", error)
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

    const section = await Section.findByIdAndDelete(params.id)

    if (!section) {
      return NextResponse.json({ message: "Section not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Section deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Delete section error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

