const jwt = require('jsonwebtoken');
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

// Méthode pour comparer le mot de passe
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Modèle User
const User = mongoose.models.User || mongoose.model("User", UserSchema);

// Génération de token JWT
function generateToken(user) {
  return jwt.sign(
    {
      id: user._id,
      username: user.username,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
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
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
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
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Method Not Allowed' })
    };
  }

  try {
    console.log("API Auth/Login: Traitement de la demande de connexion");
    
    // Parser le corps de la requête
    let { username, password } = JSON.parse(event.body);
    
    if (!username || !password) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: "Please provide username and password" })
      };
    }

    // Connexion à la base de données
    await connectDB();
    
    // Chercher l'utilisateur
    const user = await User.findOne({ username });
    
    if (!user) {
      console.log("API Auth/Login: Utilisateur non trouvé");
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ message: "Invalid credentials" })
      };
    }

    // Vérifier le mot de passe
    const isValid = await user.comparePassword(password);
    
    if (!isValid) {
      console.log("API Auth/Login: Mot de passe invalide");
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ message: "Invalid credentials" })
      };
    }

    // Générer le token JWT
    const token = generateToken(user);
    
    // Créer le cookie avec configuration pour fonctionner sur Netlify
    // Note: on évite d'utiliser SameSite=None car cela pourrait nécessiter https
    const domain = event.headers.host ? `.${event.headers.host.split(':')[0]}` : '';
    const cookieHeader = `token=${token}; Path=/; Max-Age=${60 * 60 * 24}; HttpOnly; ${process.env.NODE_ENV === 'production' ? 'Secure;' : ''}`;
    
    console.log("API Auth/Login: Cookie configuré:", cookieHeader.replace(token, "TOKEN_HIDDEN"));
    
    // Ajouter le Set-Cookie header
    headers['Set-Cookie'] = cookieHeader;

    // Retourner les informations de l'utilisateur
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: "Login successful",
        user: {
          id: user._id,
          username: user.username,
          role: user.role
        }
      })
    };
  } catch (error) {
    console.error("Erreur dans auth/login:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: "Internal server error",
        error: error.message
      })
    };
  }
}; 