// Import necessary components from react-router-dom
import { Navigate, Outlet } from "react-router-dom";

/**
 * PrivateRoute Component - A protected route wrapper that checks for authentication
 * Composant PrivateRoute - Un wrapper de route protégée qui vérifie l'authentification
 * 
 * This component:
 * 1. Checks if a user is authenticated (has a token in localStorage)
 * 2. If authenticated, renders the child routes (via Outlet)
 * 3. If not authenticated, redirects to the login page
 * 
 * Ce composant :
 * 1. Vérifie si l'utilisateur est authentifié (a un token dans localStorage)
 * 2. Si authentifié, affiche les routes enfants (via Outlet)
 * 3. Si non authentifié, redirige vers la page de connexion
 */
const PrivateRoute = () => {
  // Get the authentication token from localStorage
  // Récupère le token d'authentification depuis localStorage
  const token = localStorage.getItem("token"); 
  
  // If token exists, render child routes, else redirect to login
  // Si le token existe, affiche les routes enfants, sinon redirige vers /login
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;