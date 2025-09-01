// src/components/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { Play, Lock, CheckCircle, Circle, Star, Clock } from 'lucide-react';
import ProgressTracker from './ProgressTracker';
import SignupForm from './SignupForm';
import { supabase } from '../lib/supabaseClient';

interface UserProgress {
  userId: string;
  currentSection: number;
  completedSections: number[];
  scores: Record<number, number>;
  hasPaid: boolean;
}

interface DashboardProps {
  userId?: string;
  onSectionSelect?: (sectionId: number) => void;
}

interface Section {
  id: number;
  title: string;
  description: string;
  duration: string;
  videos: number;
  color: string;
}

// ✅ Définition des sections (plan de formation)
const sections: Section[] = [
  {
    id: 1,
    title: "Hygiène & Préparation",
    description: "Organisation du salon, matériel, accueil client, préparation avant coiffure",
    duration: "45 min",
    videos: 3,
    color: "from-blue-500 to-blue-600"
  },
  {
    id: 2,
    title: "Rasage & Coupe Simple",
    description: "Techniques de base du rasage et coupes simples",
    duration: "60 min",
    videos: 4,
    color: "from-green-500 to-green-600"
  },
  {
    id: 3,
    title: "Dégradé",
    description: "Maîtrise des techniques de dégradé moderne",
    duration: "75 min",
    videos: 5,
    color: "from-purple-500 to-purple-600"
  },
  {
    id: 4,
    title: "Taper",
    description: "Techniques avancées de taper cut",
    duration: "60 min",
    videos: 4,
    color: "from-orange-500 to-orange-600"
  },
  {
    id: 5,
    title: "Contour",
    description: "Finitions et contours professionnels",
    duration: "50 min",
    videos: 4,
    color: "from-red-500 to-red-600"
  }
];

const Dashboard: React.FC<DashboardProps> = ({ userId, onSectionSelect }) => {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Scroll en haut de page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ✅ Vérification authentification Supabase
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session?.user) {
        console.warn('Utilisateur non authentifié. Redirection vers la page d\'inscription.');
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  // ✅ Récupération progression depuis Supabase
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchProgress = async () => {
      try {
        const { data, error } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        if (error) console.error("Erreur récupération progression :", error.message);

        if (data) {
          setProgress({
            userId: data.user_id,
            currentSection: data.current_section ?? 1,
            completedSections: data.completed_sections ?? [],
            scores: data.scores ?? {},
            hasPaid: data.has_paid ?? false,
          });
        } else {
          // Première connexion → initialisation progression
          setProgress({
            userId,
            currentSection: 1,
            completedSections: [],
            scores: {},
            hasPaid: false,
          });
        }
      } catch (err: any) {
        console.error("Erreur serveur lors de la récupération de progression :", err.message);
        setProgress({
          userId,
          currentSection: 1,
          completedSections: [],
          scores: {},
          hasPaid: false,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [userId]);

  // ✅ Icône de statut pour chaque section
  const getStatusIcon = (sectionId: number) => {
    if (!progress) return <Circle className="w-6 h-6 text-gray-500" />;
    if (progress.completedSections.includes(sectionId)) return <CheckCircle className="w-6 h-6 text-green-400" />;
    if (sectionId === progress.currentSection) return <Circle className="w-6 h-6 text-yellow-400" />;
    if (sectionId > progress.currentSection) return <Lock className="w-6 h-6 text-gray-500" />;
    return <Circle className="w-6 h-6 text-gray-500" />;
  };

  // ✅ Couleur des scores
  const getScoreColor = (score: number) => (score >= 10 ? 'text-green-400' : 'text-red-400');

  // ✅ Vérifie si une section est accessible
  const isAccessible = (sectionId: number) => {
    if (!progress) return false;
    if (sectionId === 1) return true;
    return progress.hasPaid || sectionId <= progress.currentSection || progress.completedSections.includes(sectionId);
  };

  // ✅ Gestion clic sur une section
  const handleSectionClick = (sectionId: number) => {
    if (!userId) return; // ne fait rien si pas connecté
    if (isAccessible(sectionId)) onSectionSelect?.(sectionId);
  };

  // 🔴 Redirection vers SignupForm si pas connecté
  if (!userId) return <SignupForm onSignupSuccess={() => {}} onBackToLogin={() => {}} />;
  if (loading) return <div className="text-white text-center mt-10">Chargement...</div>;

  return (
    <div className="space-y-8">
      {/* Message de bienvenue */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">Bienvenue à RELAX-COUPE SCHOOL</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Votre parcours vers l'excellence en coiffure masculine commence ici
        </p>
      </div>

      {/* Barre de progression */}
      {progress && <ProgressTracker userId={progress.userId} />}

      {/* Liste des sections de la formation */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Programme de Formation</h2>
        <div className="grid gap-6">
          {sections.map((section) => {
            const isCompleted = progress?.completedSections.includes(section.id);
            const score = progress?.scores[section.id];
            const accessible = isAccessible(section.id);

            return (
              <div
                key={section.id}
                className={`bg-gray-800/50 backdrop-blur-sm rounded-xl border ${
                  accessible ? 'border-gray-700 hover:border-gray-600' : 'border-gray-800'
                } transition-all duration-200 ${
                  accessible ? 'cursor-pointer hover:transform hover:scale-[1.02]' : 'cursor-not-allowed opacity-60'
                }`}
                onClick={() => handleSectionClick(section.id)}
              >
                <div className="p-6 flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <div className={`w-12 h-12 bg-gradient-to-r ${section.color} rounded-lg flex items-center justify-center text-white font-bold text-lg`}>
                        {section.id}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{section.title}</h3>
                        <p className="text-gray-400">{section.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6 text-sm text-gray-400">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{section.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Play className="w-4 h-4" />
                        <span>{section.videos} vidéos</span>
                      </div>
                      {isCompleted && score !== undefined && (
                        <div className={`flex items-center space-x-2 font-medium ${getScoreColor(score)}`}>
                          <Star className="w-4 h-4" />
                          <span>{score}/20</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(section.id)}
                    {accessible && (
                      <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                        <Play className="w-4 h-4 text-yellow-400" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
