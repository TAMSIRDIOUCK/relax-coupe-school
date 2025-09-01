// LoginForm.tsx
import React, { useState, useEffect } from 'react';
import { User, Lock, AlertTriangle, Scissors, Star } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface LoginFormProps {
  onLoginSuccess: (userId: string) => void;  // Passe l'ID utilisateur au parent
  onShowSignup: () => void;                  // Afficher le formulaire d'inscription
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, onShowSignup }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setErrorMsg("Email ou mot de passe incorrect.");
        } else if (error.message.includes('User not found')) {
          setErrorMsg("Utilisateur non trouvé. Veuillez vous inscrire.");
        } else {
          setErrorMsg(error.message);
        }
        return;
      }

      if (data.session?.user) {
        onLoginSuccess(data.session.user.id);
      } else {
        setErrorMsg("Impossible de récupérer l'utilisateur. Veuillez réessayer.");
      }
    } catch (err: any) {
      console.error("Erreur serveur:", err);
      setErrorMsg("Erreur serveur, veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-8 items-center">
        {/* Section gauche */}
        <div className="text-center lg:text-left space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-center lg:justify-start space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center">
                <Scissors className="w-7 h-7 text-black" />
              </div>
              <h1 className="text-4xl font-bold text-white">RELEX-COUPE</h1>
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold text-white leading-tight">SCHOOL</h2>
            <p className="text-xl text-gray-300 max-w-lg">
              Formation professionnelle en coiffure masculine avec certification. 
              Maîtrisez les techniques de coupe moderne en 3 mois.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto lg:mx-0">
            <div className="flex items-center space-x-3 text-gray-300">
              <Star className="w-5 h-5 text-yellow-400" />
              <span>Certification professionnelle</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-300">
              <Star className="w-5 h-5 text-yellow-400" />
              <span>Formation en 3 mois</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-300">
              <Star className="w-5 h-5 text-yellow-400" />
              <span>Vidéos & Quiz interactifs</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-300">
              <Star className="w-5 h-5 text-yellow-400" />
              <span>Accès emploi garanti</span>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <div className="max-w-md mx-auto w-full">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Connexion</h3>
              <p className="text-gray-400">Accédez à votre formation</p>
            </div>

            {errorMsg && (
              <div className="mb-4 flex items-center space-x-3 text-red-400 bg-red-400/10 border border-red-500 rounded-lg p-3">
                <AlertTriangle className="w-5 h-5" />
                <span className="text-sm">{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
              >
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={onShowSignup}
                className="text-gray-400 hover:text-white transition-colors"
                type="button"
              >
                Pas encore de compte ? S'inscrire
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
