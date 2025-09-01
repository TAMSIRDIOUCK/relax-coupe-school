// src/components/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";

interface Props {
  children: JSX.Element;
}

/**
 * ⚠️ Version simple : utilise localStorage pour savoir si l'utilisateur est connecté.
 * Plus tard tu pourras remplacer ça par un vrai AuthContext (ex: Supabase, Firebase).
 */
const ProtectedRoute: React.FC<Props> = ({ children }) => {
  // Vérifie si on a un "user" dans localStorage
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  // Si pas connecté → redirection vers login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Sinon → on affiche la page protégée
  return children;
};

export default ProtectedRoute;
