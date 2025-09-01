// ProgressTracker.tsx
import React, { useEffect, useState } from 'react';
import { CheckCircle, Circle, Lock } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface UserProgress {
  averageScore: number; // Calculé depuis scores JSON
  progress: number; // en %
  certificateStatus: 'obtenue' | 'en cours' | 'non obtenue';
  completedSections: number[];
}

interface ProgressTrackerProps {
  userId: string; // UUID réel provenant de session.user.id
}

// Définition des sections
const sections = [
  { id: 1, name: "Hygiène" },
  { id: 2, name: "Rasage" },
  { id: 3, name: "Dégradé" },
  { id: 4, name: "Taper" },
  { id: 5, name: "Contour" },
];

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ userId }) => {
  const [progressData, setProgressData] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ajout pour s'assurer que le haut de la page est affiché en premier
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Ajout de l'authentification pour afficher la page
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session?.user) {
        console.error('Utilisateur non authentifié. Redirection vers la page de connexion.');
        window.location.href = '/login';
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!userId || userId.trim() === '') {
        setError("Utilisateur non identifié. Veuillez vous reconnecter.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await supabase
          .from('user_progress')
          .select('current_section, completed_sections, scores, has_paid')
          .eq('user_id', userId)
          .maybeSingle();

        if (fetchError) {
          console.error("Erreur récupération progression:", fetchError.message);
          setError(`Erreur récupération progression : ${fetchError.message}`);
          setProgressData(null);
        } else if (!data) {
          // Pas de progression trouvée : valeurs par défaut
          setProgressData({
            averageScore: 0,
            progress: 0,
            certificateStatus: 'en cours',
            completedSections: [],
          });
        } else {
          // Calcul du score moyen depuis le JSON 'scores'
          const scoresObj: Record<number, number> = data.scores ?? {};
          const scoreValues = Object.values(scoresObj);
          const averageScore =
            scoreValues.length > 0
              ? Math.round(scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length)
              : 0;

          // Progression en % selon nombre de sections complétées
          const progress = Math.round(
            ((data.completed_sections?.length ?? 0) / sections.length) * 100
          );

          // Statut du certificat
          const certificateStatus =
            data.completed_sections?.length === sections.length ? 'obtenue' : 'en cours';

          setProgressData({
            averageScore,
            progress,
            certificateStatus,
            completedSections: data.completed_sections ?? [],
          });
        }
      } catch (err) {
        console.error("Erreur serveur inconnue:", err);
        setError("Erreur serveur inconnue. Veuillez réessayer plus tard.");
        setProgressData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [userId]);

  if (loading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 text-white">
        Chargement de votre progression...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-600/50 backdrop-blur-sm rounded-xl p-6 border border-red-700 text-white">
        {error}
      </div>
    );
  }

  if (!progressData) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 text-red-400">
        Impossible de charger votre progression.
      </div>
    );
  }

  // Détermine le statut d'une section
  const getStepStatus = (sectionId: number) => {
    if (progressData.completedSections.includes(sectionId)) return 'completed';
    const currentSection =
      Math.min(progressData.completedSections.length + 1, sections.length);
    if (sectionId === currentSection) return 'current';
    return 'locked';
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
      <h3 className="text-lg font-bold text-white mb-6">Votre Progression</h3>

      <div className="mb-4 text-white text-sm space-y-1">
        <p>Score moyen : <span className="font-bold">{progressData.averageScore}/20</span></p>
        <p>Progression : <span className="font-bold">{progressData.progress}%</span></p>
        <p>Statut du certificat : <span className="font-bold">{progressData.certificateStatus}</span></p>
      </div>

      <div className="relative">
        {/* Barre de progression */}
        <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-700">
          <div
            className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 transition-all duration-500"
            style={{ width: `${progressData.progress}%` }}
          />
        </div>

        {/* Étapes */}
        <div className="relative flex justify-between">
          {sections.map((section) => {
            const status = getStepStatus(section.id);
            return (
              <div key={section.id} className="flex flex-col items-center space-y-2">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                  status === 'completed' ? 'bg-green-500 border-green-500' :
                  status === 'current' ? 'bg-yellow-500 border-yellow-500' :
                  'bg-gray-800 border-gray-700'
                }`}>
                  {status === 'completed' ? (
                    <CheckCircle className="w-6 h-6 text-white" />
                  ) : status === 'current' ? (
                    <Circle className="w-6 h-6 text-white" />
                  ) : (
                    <Lock className="w-5 h-5 text-gray-500" />
                  )}
                </div>

                <p className={`text-sm font-medium ${
                  status === 'completed' || status === 'current' ? 'text-white' : 'text-gray-500'
                }`}>
                  {section.name}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
