import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { supabase } from './lib/supabaseClient';

/**
 * Vérifie si l'utilisateur est connecté et si c'est sa première visite.
 * Redirige vers la page de connexion si nécessaire.
 */
const checkAuthentication = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Erreur lors de la récupération de la session Supabase :', error.message);
      window.location.href = '/login';
      return;
    }

    const hasVisited = localStorage.getItem('hasVisited');

    if (!hasVisited) {
      // Première visite : on redirige vers la page de connexion
      localStorage.setItem('hasVisited', 'true');
      window.location.href = '/login';
      return;
    }

    // Si l'utilisateur n'est pas connecté, on le redirige aussi
    if (!session?.user) {
      window.location.href = '/login';
      return;
    }
  } catch (err) {
    console.error('Erreur lors de la vérification de l’authentification :', err);
    window.location.href = '/login';
  }
};

// Appel de la vérification avant de rendre l'application
checkAuthentication();

// Rendu de l'application React
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
