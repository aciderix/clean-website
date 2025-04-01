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
    console.log("API Auth/Logout: Traitement de la déconnexion");
    
    // Créer un cookie qui expire immédiatement
    const cookieHeader = 'token=; HttpOnly; Path=/; Max-Age=0;';
    console.log("API Auth/Logout: Cookie configuré:", cookieHeader);
    
    // Ajouter le Set-Cookie header
    headers['Set-Cookie'] = cookieHeader;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "Logout successful" })
    };
  } catch (error) {
    console.error("Erreur dans auth/logout:", error);
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