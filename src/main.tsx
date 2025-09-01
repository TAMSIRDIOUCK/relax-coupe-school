import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { supabase } from './lib/supabaseClient';

const initApp = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Erreur récupération session Supabase :', error.message);
      window.location.href = '/login';
      return;
    }

    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
      localStorage.setItem('hasVisited', 'true');
      window.location.href = '/login';
      return;
    }

    if (!session?.user) {
      window.location.href = '/login';
      return;
    }

    const root = createRoot(document.getElementById('root')!);
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  } catch (err) {
    console.error('Erreur initialisation application :', err);
    window.location.href = '/login';
  }
};

initApp();
