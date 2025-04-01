import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Partner from "@/lib/models/partner"
import { getAuthUser } from "@/lib/auth"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const partner = await Partner.findById(params.id)

    if (!partner) {
      return NextResponse.json({ message: "Partner not found" }, { status: 404 })
    }

    return NextResponse.json(partner, { status: 200 })
  } catch (error) {
    console.error("Get partner error:", error)
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

    const partner = await Partner.findByIdAndUpdate(params.id, data, { new: true, runValidators: true })

    if (!partner) {
      return NextResponse.json({ message: "Partner not found" }, { status: 404 })
    }

    return NextResponse.json(partner, { status: 200 })
  } catch (error) {
    console.error("Update partner error:", error)
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

    const partner = await Partner.findByIdAndDelete(params.id)

    if (!partner) {
      return NextResponse.json({ message: "Partner not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Partner deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Delete partner error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

