import jwt_decode from "jwt-decode";

// Function to decode a JWT and return the user object
export const decodeJWT = (token) => {
  try {
    const decodedToken = jwt_decode(token);
    return decodedToken;
  } catch (error) {
    // Handle any decoding errors (e.g., invalid token)
    console.error("JWT decoding error:", error.message);
    return null;
  }
};
