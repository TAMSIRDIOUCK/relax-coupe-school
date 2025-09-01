// src/components/SignupForm.tsx
import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Scissors, Star, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface SignupFormProps {
  onSignupSuccess: () => void;
  onBackToLogin: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSignupSuccess, onBackToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[.,\-\/]).{6,}$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!emailRegex.test(formData.email.trim())) {
      setErrorMsg('Veuillez entrer un email valide (ex : exemple@gmail.com)');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Les mots de passe ne correspondent pas.');
      return;
    }
    if (!passwordRegex.test(formData.password)) {
      setErrorMsg('Le mot de passe doit contenir au moins 6 caractères, une lettre, un chiffre et un symbole (. , - /)');
      return;
    }

    setLoading(true);

    try {
      // Inscription Supabase
      const { data, error } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (error) throw error;

      const user = data.user;
      if (!user) {
        setErrorMsg("Erreur lors de la création de l'utilisateur.");
        setLoading(false);
        return;
      }

      // Ajouter profil
      const { error: insertError } = await supabase
        .from('profiles')
        .insert([{ id: user.id, name: formData.name.trim(), email: formData.email.trim() }]);

      if (insertError) throw insertError;

      // Callback vers App.tsx
      onSignupSuccess();
    } catch (err: any) {
      let message = 'Une erreur est survenue.';
      if (err.message) {
        if (err.message.includes('User already registered')) message = "Cet email est déjà utilisé.";
        else if (err.message.includes('invalid email')) message = "L'email est invalide.";
        else if (err.message.includes('Password')) message = "Le mot de passe ne respecte pas les critères.";
        else message = err.message;
      }
      setErrorMsg(message);
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
              <h1 className="text-4xl font-bold text-white">RELAX-COUPE</h1>
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold text-white leading-tight">SCHOOL</h2>
            <p className="text-xl text-gray-300 max-w-lg">
              Rejoignez la formation professionnelle en coiffure masculine la plus complète du Sénégal.
              Obtenez votre certification en 3 mois.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto lg:mx-0">
            <div className="flex items-center space-x-3 text-gray-300">
              <Star className="w-5 h-5 text-yellow-400" />
              <span>Formation certifiante</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-300">
              <Star className="w-5 h-5 text-yellow-400" />
              <span>Durée : 3 mois</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-300">
              <Star className="w-5 h-5 text-yellow-400" />
              <span>Vidéos & Quiz</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-300">
              <Star className="w-5 h-5 text-yellow-400" />
              <span>Accès emploi</span>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <div className="max-w-md mx-auto w-full">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Inscription</h3>
              <p className="text-gray-400">Créez votre compte étudiant</p>
            </div>

            {errorMsg && (
              <div className="mb-4 flex items-center space-x-3 text-red-400 bg-red-400/10 border border-red-500 rounded-lg p-3">
                <AlertTriangle className="w-5 h-5" />
                <span className="text-sm">{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Nom */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nom complet</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="Votre nom complet"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="exemple@gmail.com"
                  />
                </div>
              </div>

              {/* Mot de passe */}
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
                    placeholder="Mot de passe"
                  />
                </div>
              </div>

              {/* Confirmer mot de passe */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Confirmer le mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="Confirmer mot de passe"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
              >
                {loading ? 'Inscription...' : "S'inscrire"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={onBackToLogin}
                className="text-gray-400 hover:text-white transition-colors"
                type="button"
              >
                Déjà un compte ? Se connecter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
