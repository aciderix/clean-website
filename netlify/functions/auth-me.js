const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Schéma utilisateur (identique à celui de setup.js)
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

// Modèle User
const User = mongoose.models.User || mongoose.model("User", UserSchema);

// Vérification du token JWT
function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error("Erreur de vérification du token:", error.message);
    return null;
  }
}

// Connexion à MongoDB
async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI environment variable is not defined");
  }
  
  console.log("Connexion à MongoDB...");
  return mongoose.connect(uri);
}

exports.handler = async function(event, context) {
  // Déterminer le domaine pour utiliser le bon CORS
  const origin = event.headers.origin || 'https://clean-eau.netlify.app';
  
  // Headers CORS - Ajuster pour le domaine spécifique plutôt que '*'
  const headers = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cookie',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Credentials': 'true',
    'Cache-Control': 'no-cache'
  };

  // Gestion des OPTIONS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Vérification de la méthode
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Method Not Allowed' })
    };
  }

  try {
    console.log("API Auth/Me: Récupération du token");
    console.log("Headers reçus:", JSON.stringify(event.headers));
    
    // Récupérer le token dans les cookies
    const cookies = event.headers.cookie || '';
    console.log("Cookies reçus:", cookies);
    
    let token = null;
    
    // Chercher le token dans les cookies
    cookies.split(';').forEach(cookie => {
      const parts = cookie.trim().split('=');
      if (parts[0] === 'token') {
        token = parts[1];
      }
    });
    
    if (!token) {
      console.log("API Auth/Me: Aucun token trouvé");
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ 
          message: "Unauthorized",
          authenticated: false 
        })
      };
    }

    // Vérifier le token
    const decoded = verifyToken(token);
    
    if (!decoded) {
      console.log("API Auth/Me: Token invalide");
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ 
          message: "Unauthorized",
          authenticated: false
        })
      };
    }

    console.log("API Auth/Me: Token valide pour:", decoded.username);

    // Connexion à la base de données
    await connectDB();
    
    // Chercher l'utilisateur dans la base de données
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      console.log("API Auth/Me: Utilisateur non trouvé");
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ 
          message: "Unauthorized",
          authenticated: false
        })
      };
    }

    // Retourner les informations de l'utilisateur
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        authenticated: true,
        user: {
          id: user._id,
          username: user.username,
          role: user.role
        }
      })
    };
  } catch (error) {
    console.error("Erreur dans auth/me:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: "Internal server error",
        error: error.message,
        authenticated: false
      })
    };
  }
}; 