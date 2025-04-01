const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Schéma utilisateur
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please provide a username"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["admin", "editor"],
      default: "editor",
    },
  },
  { timestamps: true },
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Modèle User
const User = mongoose.models.User || mongoose.model("User", UserSchema);

// Connexion à MongoDB
async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  console.log("Connecting to MongoDB...");
  return mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

exports.handler = async function(event, context) {
  // Activer CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  // Vérifier que c'est une requête POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' })
    };
  }

  console.log("API Setup Function: Starting request processing");
  
  try {
    console.log("API Setup Function: Connecting to database");
    await connectDB();
    console.log("API Setup Function: Database connection successful");

    // Vérifier si un admin existe déjà
    console.log("API Setup Function: Checking if admin user exists");
    const adminExists = await User.findOne({ role: "admin" });
    console.log("API Setup Function: Admin exists check completed:", !!adminExists);

    if (adminExists) {
      console.log("API Setup Function: Admin user already exists");
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Admin user already exists" })
      };
    }

    // Parsing du body
    console.log("API Setup Function: Parsing request body");
    let requestBody;
    try {
      requestBody = JSON.parse(event.body);
      console.log("API Setup Function: Request body parsed successfully");
    } catch (parseError) {
      console.error("API Setup Function: Error parsing request body:", parseError);
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid request format" })
      };
    }

    const { username, password } = requestBody;

    if (!username || !password) {
      console.log("API Setup Function: Missing username or password");
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Please provide username and password" })
      };
    }

    // Création de l'admin
    console.log("API Setup Function: Creating admin user");
    try {
      const admin = await User.create({
        username,
        password,
        role: "admin",
      });
      console.log("API Setup Function: Admin user created successfully with ID:", admin._id);

      return {
        statusCode: 201,
        body: JSON.stringify({
          message: "Admin user created successfully",
          user: {
            id: admin._id,
            username: admin.username,
            role: admin.role,
          }
        })
      };
    } catch (createError) {
      console.error("API Setup Function: Error creating admin user:", createError);
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "Error creating admin user",
          error: createError.message || "Unknown error"
        })
      };
    }
  } catch (error) {
    console.error("API Setup Function: Error in setup process:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Internal server error",
        error: error.message || "Unknown error"
      })
    };
  }
}; 