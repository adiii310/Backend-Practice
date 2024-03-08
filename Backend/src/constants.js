export const DB_NAME = "videotube";
export const options = {
    httpOnly: true, // Prevents access from client-side scripts
    secure: false, // Not needed for localhost
    sameSite: "Lax", // Allows cookies to be sent with top-level navigations
    path: "/", // Available for all paths
    domain: "localhost", // Set to localhost for development
  };