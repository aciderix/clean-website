import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Partner from "@/lib/models/partner"
import { getAuthUser } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const partners = await Partner.find({}).sort({ order: 1 })

    return NextResponse.json(partners, { status: 200 })
  } catch (error) {
    console.error("Get partners error:", error)
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

    const partner = await Partner.create(data)

    return NextResponse.json(partner, { status: 201 })
  } catch (error) {
    console.error("Create partner error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

