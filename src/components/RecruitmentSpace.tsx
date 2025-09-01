import React, { useState } from 'react';
import { Search, MapPin, Star, User, Award, Phone, Mail, Eye } from 'lucide-react';

const RecruitmentSpace: React.FC = () => {
  const [selectedProfile, setSelectedProfile] = useState<number | null>(null);

  const graduates = [
    {
      id: 1,
      name: "Mamadou Diallo",
      location: "Dakar, Sénégal",
      specialties: ["Dégradé", "Taper", "Contour"],
      experience: "Nouveaux diplômé",
      rating: 4.9,
      completionDate: "Janvier 2025",
      phone: "+221 77 123 45 67",
      email: "mamadou.diallo@email.com",
      portfolio: ["Dégradé moderne", "Coupe classique", "Finitions précises"],
      description: "Passionné par la coiffure masculine moderne, spécialisé dans les dégradés et les finitions de précision."
    },
    {
      id: 2,
      name: "Ibrahima Sarr",
      location: "Thiès, Sénégal",
      specialties: ["Rasage", "Coupe classique", "Hygiène"],
      experience: "Nouveaux diplômé",
      rating: 4.8,
      completionDate: "Décembre 2024",
      phone: "+221 76 987 65 43",
      email: "ibrahima.sarr@email.com",
      portfolio: ["Rasage traditionnel", "Coupes élégantes", "Service client"],
      description: "Expert en techniques de rasage traditionnel et coupes classiques, avec un excellent sens du service client."
    },
    {
      id: 3,
      name: "Ousmane Ba",
      location: "Saint-Louis, Sénégal",
      specialties: ["Taper", "Contour", "Dégradé"],
      experience: "Nouveaux diplômé",
      rating: 4.7,
      completionDate: "Janvier 2025",
      phone: "+221 78 456 78 90",
      email: "ousmane.ba@email.com",
      portfolio: ["Taper moderne", "Contours artistiques", "Styles créatifs"],
      description: "Créatif et minutieux, spécialisé dans les coupes modernes et les contours artistiques."
    }
  ];

  const ProfileModal = ({ graduate }: { graduate: any }) => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-black" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">{graduate.name}</h3>
                <div className="flex items-center space-x-2 text-gray-300">
                  <MapPin className="w-4 h-4" />
                  <span>{graduate.location}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedProfile(null)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">À propos</h4>
              <p className="text-gray-300">{graduate.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Spécialités</h4>
                <div className="flex flex-wrap gap-2">
                  {graduate.specialties.map((specialty: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Portfolio</h4>
                <div className="space-y-2">
                  {graduate.portfolio.map((item: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2 text-gray-300">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-6">
              <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-300">{graduate.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-300">{graduate.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">Espace Recrutement</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Découvrez nos diplômés certifiés RELAX-COUPE SCHOOL, prêts à rejoindre votre équipe
        </p>
      </div>

      

      {/* Graduates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {graduates.map((graduate) => (
          <div
            key={graduate.id}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden hover:border-gray-600 transition-all duration-200 cursor-pointer"
          >
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-black" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white">{graduate.name}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>{graduate.location}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Note moyenne</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-white font-medium">{graduate.rating}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Diplômé</span>
                  <span className="text-white font-medium">{graduate.completionDate}</span>
                </div>

                <div>
                  <span className="text-sm text-gray-400 block mb-2">Spécialités</span>
                  <div className="flex flex-wrap gap-1">
                    {graduate.specialties.slice(0, 2).map((specialty, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs"
                      >
                        {specialty}
                      </span>
                    ))}
                    {graduate.specialties.length > 2 && (
                      <span className="px-2 py-1 bg-gray-600 text-gray-300 rounded text-xs">
                        +{graduate.specialties.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedProfile(graduate.id)}
                className="w-full mt-6 flex items-center justify-center space-x-2 py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>Voir le profil</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Profile Modal */}
      {selectedProfile && (
        <ProfileModal 
          graduate={graduates.find(g => g.id === selectedProfile)!} 
        />
      )}

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 border border-yellow-400/20 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">
          Vous cherchez des coiffeurs qualifiés ?
        </h2>
        <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
          Tous nos diplômés ont suivi une formation complète de 3 mois et obtenu leur certification. 
          Contactez-les directement pour recruter les meilleurs talents.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          
        <a
  href="https://wa.me/221704776258" // Remplace par ton numéro complet avec l'indicatif pays
  target="_blank" // Ouvre dans un nouvel onglet
  rel="noopener noreferrer"
  className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
>
  Contacter l'école
</a>
        </div>
      </div>
    </div>
  );
};

export default RecruitmentSpace;