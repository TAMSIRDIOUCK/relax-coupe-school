// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// ✅ On supprime toute la logique de redirection ici
// ⚡ L’authentification est gérée dans App.tsx avec supabase

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Impossible de trouver l'élément root dans index.html");
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
