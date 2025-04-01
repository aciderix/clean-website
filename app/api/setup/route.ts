import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/lib/models/user"

export async function POST(req: NextRequest) {
  console.log("API Setup: Starting request processing")
  
  try {
    console.log("API Setup: Connecting to database")
    await connectDB()
    console.log("API Setup: Database connection successful")

    // Check if admin user already exists
    console.log("API Setup: Checking if admin user exists")
    const adminExists = await User.findOne({ role: "admin" })
    console.log("API Setup: Admin exists check completed:", !!adminExists)

    if (adminExists) {
      console.log("API Setup: Admin user already exists")
      return NextResponse.json({ message: "Admin user already exists" }, { status: 400 })
    }

    console.log("API Setup: Parsing request body")
    let username, password
    try {
      const body = await req.json()
      username = body.username
      password = body.password
      console.log("API Setup: Request body parsed successfully")
    } catch (parseError) {
      console.error("API Setup: Error parsing request body:", parseError)
      return NextResponse.json({ message: "Invalid request format" }, { status: 400 })
    }

    if (!username || !password) {
      console.log("API Setup: Missing username or password")
      return NextResponse.json({ message: "Please provide username and password" }, { status: 400 })
    }

    // Create admin user
    console.log("API Setup: Creating admin user")
    try {
      const admin = await User.create({
        username,
        password,
        role: "admin",
      })
      console.log("API Setup: Admin user created successfully with ID:", admin._id)

      return NextResponse.json(
        {
          message: "Admin user created successfully",
          user: {
            id: admin._id,
            username: admin.username,
            role: admin.role,
          },
        },
        { status: 201 },
      )
    } catch (createError) {
      console.error("API Setup: Error creating admin user:", createError)
      return NextResponse.json({ 
        message: "Error creating admin user", 
        error: createError instanceof Error ? createError.message : "Unknown error" 
      }, { status: 500 })
    }
  } catch (error) {
    console.error("API Setup: Error in setup process:", error)
    return NextResponse.json({ 
      message: "Internal server error", 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 })
  }
}

