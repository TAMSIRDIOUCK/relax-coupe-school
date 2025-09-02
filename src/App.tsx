// src/App.tsx
import React, { useState, useEffect } from 'react';
import { Menu, X, BookOpen, Users } from 'lucide-react';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import CourseSection from './components/CourseSection';
import RecruitmentSpace from './components/RecruitmentSpace';
import { supabase } from './lib/supabaseClient';

// ---------------- Types ----------------
export interface UserProgressFlat {
  userId: string;
  currentSection: number;
  completedSections: number[];
  scores: Record<number, number>;
  canAccessQuiz: boolean;
  averageScore: number;
  certificateStatus: 'obtenue' | 'en cours' | 'non obtenue';
  hasPaid: boolean;
}

// ---------------- Composant principal ----------------
const App: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProgress, setUserProgress] = useState<UserProgressFlat | null>(null);
  const [currentView, setCurrentView] = useState<'login' | 'signup' | 'dashboard' | 'recruitment'>('login');
  const [selectedSection, setSelectedSection] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // ---------------- Scroll top ----------------
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ---------------- Session utilisateur ----------------
  useEffect(() => {
    const initSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (data.session?.user) {
          setUserId(data.session.user.id);
          setCurrentView('dashboard');
        } else {
          setUserId(null);
          setCurrentView('login');
        }
      } catch (err: any) {
        console.error('Erreur récupération session Supabase :', err.message);
        setUserId(null);
        setCurrentView('login');
      } finally {
        setLoading(false);
      }
    };

    initSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUserId(session.user.id);
        setCurrentView('dashboard');
      } else {
        setUserId(null);
        setCurrentView('login');
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // ---------------- Récupérer progression ----------------
  useEffect(() => {
    if (!userId) return;

    const fetchUserProgress = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (error) throw error;

        setUserProgress(
          data
            ? {
                userId: data.id,
                currentSection: data.current_section || 1,
                completedSections: data.completed_sections || [],
                scores: data.scores || {},
                canAccessQuiz: data.has_paid || false,
                averageScore: data.average_score || 0,
                certificateStatus: data.certificate_status || 'non obtenue',
                hasPaid: data.has_paid || false,
              }
            : {
                userId,
                currentSection: 1,
                completedSections: [],
                scores: {},
                canAccessQuiz: false,
                averageScore: 0,
                certificateStatus: 'non obtenue',
                hasPaid: false,
              }
        );
      } catch (err: any) {
        console.error('Erreur récupération progression utilisateur:', err.message);
      }
    };

    fetchUserProgress();
  }, [userId]);

  // ---------------- Gestion de fin de section ----------------
  const handleSectionComplete = (sectionId: number, score: number) => {
    if (!userProgress) return;
    const updatedProgress = {
      ...userProgress,
      currentSection: Math.max(userProgress.currentSection, sectionId + 1),
      completedSections: [...new Set([...userProgress.completedSections, sectionId])],
      scores: { ...userProgress.scores, [sectionId]: score },
    };
    setUserProgress(updatedProgress);
    setSelectedSection(null);
  };

  // ---------------- Chargement ----------------
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white text-lg">
        ⏳ Chargement de l’application...
      </div>
    );
  }

  // ---------------- Contenu principal ----------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Header */}
      <header className="bg-black/90 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg overflow-hidden">
                <img
                  src="/images/ed0c860a-8055-414d-8f31-77036e49bd27.jpg"
                  alt="Icône"
                  className="w-auto h-auto max-w-full max-h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/fallback-logo.png'; // ✅ évite bug image cassée
                  }}
                />
              </div>
              <h1 className="text-xl font-bold text-white">RELAX-COUPE SCHOOL</h1>
            </div>

            {/* Menu mobile */}
            <div className="md:hidden">
              <button onClick={() => setMenuOpen(!menuOpen)} className="text-white">
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Navigation desktop */}
            <nav className="hidden md:flex items-center space-x-4">
              {!userId ? (
                <>
                  <button
                    onClick={() => setCurrentView('login')}
                    className={`px-3 py-2 rounded-lg ${
                      currentView === 'login' ? 'bg-gray-800 text-yellow-400' : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    Connexion
                  </button>
                  <button
                    onClick={() => setCurrentView('signup')}
                    className={`px-3 py-2 rounded-lg ${
                      currentView === 'signup' ? 'bg-gray-800 text-yellow-400' : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    Inscription
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setCurrentView('dashboard')}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                      currentView === 'dashboard' ? 'bg-gray-800 text-yellow-400' : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    <BookOpen className="w-5 h-5" />
                    <span className="hidden sm:inline">Formation</span>
                  </button>
                  <button
                    onClick={() => setCurrentView('recruitment')}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                      currentView === 'recruitment' ? 'bg-gray-800 text-yellow-400' : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    <Users className="w-5 h-5" />
                    <span className="hidden sm:inline">Recrutement</span>
                  </button>
                </>
              )}

              <a
                href="https://wa.me/221704776258"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 sm:px-7 py-2 bg-green-400 hover:bg-green-500 text-white font-medium rounded-lg transition-colors"
              >
                Acheter la formation
              </a>
            </nav>
          </div>
        </div>

        {/* Menu mobile ouvert */}
        {menuOpen && (
          <div className="md:hidden px-4 pb-4 space-y-2">
            {!userId ? (
              <>
                <button
                  onClick={() => {
                    setCurrentView('login');
                    setMenuOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 rounded-lg ${
                    currentView === 'login' ? 'bg-gray-800 text-yellow-400' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  🔑 Connexion
                </button>
                <button
                  onClick={() => {
                    setCurrentView('signup');
                    setMenuOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 rounded-lg ${
                    currentView === 'signup' ? 'bg-gray-800 text-yellow-400' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  📝 Inscription
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setCurrentView('dashboard');
                    setMenuOpen(false);
                  }}
                  className={`flex items-center space-x-2 block w-full text-left px-4 py-2 rounded-lg ${
                    currentView === 'dashboard' ? 'bg-gray-800 text-yellow-400' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <BookOpen className="w-5 h-5" />
                  <span>📘 Formation</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentView('recruitment');
                    setMenuOpen(false);
                  }}
                  className={`flex items-center space-x-2 block w-full text-left px-4 py-2 rounded-lg ${
                    currentView === 'recruitment' ? 'bg-gray-800 text-yellow-400' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <Users className="w-5 h-5" />
                  <span>👥 Recrutement</span>
                </button>
              </>
            )}

            <a
              href="https://wa.me/221704776258"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-left px-4 py-2 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition"
            >
              💳 Acheter la formation
            </a>
          </div>
        )}
      </header>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {!userId && currentView === 'login' && (
          <LoginForm
            onLoginSuccess={() => setCurrentView('dashboard')}
            onShowSignup={() => setCurrentView('signup')}
          />
        )}

        {!userId && currentView === 'signup' && (
          <SignupForm
            onSignupSuccess={() => setCurrentView('dashboard')}
            onBackToLogin={() => setCurrentView('login')}
          />
        )}

        {userId && currentView === 'dashboard' && (
          <>
            {!selectedSection && (
              <Dashboard userId={userId} onSectionSelect={setSelectedSection} />
            )}
            {selectedSection !== null && !userProgress && (
              <div className="text-white text-center mt-10">
                Chargement des données utilisateur...
              </div>
            )}
            {selectedSection !== null && userProgress && (
              <CourseSection
                sectionId={selectedSection}
                userProgress={userProgress}
                onBack={() => setSelectedSection(null)}
                onComplete={handleSectionComplete}
              />
            )}
          </>
        )}

        {userId && currentView === 'recruitment' && <RecruitmentSpace />}
      </main>
    </div>
  );
};

export default App;
