// CourseSection.tsx
import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { UserProgressFlat } from '../App';

interface CourseSectionProps {
  sectionId: number;
  userProgress: UserProgressFlat;
  onBack: () => void;
  onComplete: (
    sectionId: number,
    score: number,
    updatedCompletedSections: number[],
    updatedScores: Record<number, number>
  ) => void;
}

interface QuizItem {
  question: string;
  options: string[];
  correct: number;
}

interface SectionContent {
  title: string;
  videos: string[];
  contents: string[];
  quiz: QuizItem[];
}

// CourseSection.tsx - Hygiène & Préparation (Coiffeur Pro Homme)
const sectionContent: Record<number, SectionContent> = {
  1: {
    title: "Hygiène & Préparation - Coiffeur Professionnel Homme",
    videos: [
      "https://www.youtube.com/embed/Yilm5PILEzA?rel=0&showinfo=0",
      "https://www.youtube.com/embed/bFvea3rOAiA?rel=0&showinfo=0",
      "https://www.youtube.com/embed/Sq-vSoMA1xk?rel=0&showinfo=0"
    ],
    
    
    
    contents: [
      // Vidéo 1 : Introduction à l'hygiène
      `<h2 style="font-weight:bold; color:#fff; font-size:28px; margin-bottom:20px;">🧼 Introduction à l'hygiène professionnelle</h2>
       <p style="color:#fff; font-size:18px; line-height:1.8; margin-bottom:20px;">
         L'hygiène est la <b>base</b> d’un salon de coiffure professionnel pour hommes.  
         Elle protège la santé du <b>client</b> comme celle du <b>coiffeur</b>, tout en reflétant le sérieux et 
         le professionnalisme du salon.  
         Un client qui voit un espace propre, des outils désinfectés et un coiffeur attentif à l’hygiène 
         se sentira en sécurité et valorisé.  
          L’hygiène n’est donc pas seulement une obligation, mais un atout pour la <b>réputation</b> du salon.
       </p>
       <ul style="color:#fff; font-size:17px; line-height:1.8; margin-left:15px;">
  
         <li style="margin-bottom:25px;">
           🧴 <b>Se laver les mains soigneusement avant et après chaque client</b>  
           <p style="margin-top:8px;">
             Les mains sont le premier outil du coiffeur.  
             Avant chaque coupe, elles doivent être lavées pendant <b>30 à 40 secondes</b> avec un antibactérien, 
             en frottant les paumes, le dos, entre les doigts et sous les ongles.  
             Après la prestation, il faut répéter l’opération ou utiliser du gel hydroalcoolique.  
              Ce geste simple évite la transmission des microbes et rassure immédiatement le client.
           </p>
         </li>
  
         <li style="margin-bottom:25px;">
           ✂️ <b>Désinfecter les outils après chaque utilisation</b>  
           <p style="margin-top:8px;">
             Les ciseaux, peignes, tondeuses, brosses et rasoirs doivent être désinfectés <b>systématiquement</b>.  
             Exemple : une tondeuse doit être brossée pour retirer les cheveux, pulvérisée avec un spray antibactérien, 
             puis huilée pour rester performante.  
             Les ciseaux et peignes, eux, peuvent être trempés dans une solution désinfectante.  
             Un outil non nettoyé peut transmettre <b>pellicules, irritations, mycoses ou infections cutanées</b>.
           </p>
         </li>
  
         <li style="margin-bottom:25px;">
           🪑 <b>Maintenir un espace de travail propre et ordonné</b>  
           <p style="margin-top:8px;">
             Le poste de travail est le miroir du coiffeur.  
             Après chaque client, il est obligatoire de balayer les cheveux tombés, de désinfecter le fauteuil, 
             d’essuyer les outils et de nettoyer le miroir.  
             Les serviettes, capes et peignes doivent être changés ou lavés systématiquement.  
             Un espace propre et organisé inspire <b>confiance, luxe et fidélité</b>.
           </p>
         </li>
       </ul>`,
  
      // Vidéo 2 : Organisation du salon
      `<h2 style="font-weight:bold; color:#fff; font-size:28px; margin-bottom:20px;">🛋️ Organisation du salon</h2>
       <p style="color:#fff; font-size:18px; line-height:1.8; margin-bottom:20px;">
         L’organisation du salon influence directement le confort du client et l’efficacité du coiffeur.  
         Un espace bien pensé est agréable, fluide et donne une <b>image haut de gamme</b>.  
          Un client qui entre dans un salon ordonné se sent immédiatement dans un lieu professionnel.
       </p>
       <ul style="color:#fff; font-size:17px; line-height:1.8; margin-left:15px;">
         <li style="margin-bottom:20px;">📍 <b>Zones distinctes</b> : séparer clairement la zone <b>coupe</b>, la zone <b>lavage</b> et l’espace <b>attente</b> pour éviter toute confusion.</li>
         <li style="margin-bottom:20px;">🪑 <b>Postes alignés</b> : chaque fauteuil doit être espacé et disposé logiquement pour garantir fluidité et intimité.</li>
         <li style="margin-bottom:20px;">💡 <b>Éclairage de qualité</b> : une lumière précise permet des coupes nettes et met en valeur le style du salon.</li>
         <li style="margin-bottom:20px;">📢 <b>Signalisation claire</b> : des indications visibles (toilettes, caisse, zone attente) améliorent le confort du client.</li>
       </ul>`,
  
      // Vidéo 3 : Matériel
      `<h2 style="font-weight:bold; color:#fff; font-size:28px; margin-bottom:20px;">🛠️ Matériel et outils du coiffeur</h2>
       <p style="color:#fff; font-size:18px; line-height:1.8; margin-bottom:20px;">
         Les outils sont le prolongement de la main du coiffeur.  
         Un matériel de qualité, bien entretenu et propre assure une coupe <b>précise, rapide et agréable</b>.  
         ➡️ Un coiffeur qui prend soin de son matériel renforce son image de <b>professionnel exigeant</b>.
       </p>
       <ul style="color:#fff; font-size:17px; line-height:1.8; margin-left:15px;">
         <li style="margin-bottom:20px;">✂️ <b>Ciseaux professionnels</b> : droits, sculpteurs, désépaississeurs – chacun a un rôle précis pour un rendu soigné.</li>
         <li style="margin-bottom:20px;">🔌 <b>Tondeuse</b> : avec différents sabots pour des hauteurs variées, toujours <b>nettoyée et huilée</b> après usage.</li>
         <li style="margin-bottom:20px;">🪮 <b>Peignes et brosses</b> : propres et désinfectés après chaque client pour éviter toute contamination.</li>
         <li style="margin-bottom:20px;">🧖 <b>Serviettes et capes</b> : lavées régulièrement et changées pour chaque client, elles protègent et renforcent l’hygiène.</li>
         <li style="margin-bottom:20px;">🧴 <b>Produits désinfectants</b> : sprays antibactériens, lingettes et solutions pour maintenir une hygiène irréprochable.</li>
       </ul>`,
    ],
  
    quiz: [
      {
        question: "Pourquoi l'hygiène est-elle essentielle en salon ?",
        options: [
          "Pour impressionner le client",
          "Pour protéger le client et le coiffeur",
          "Pour gagner du temps",
          "Pour décorer le salon",
          "Aucune raison"
        ],
        correct: 1,
      },
      {
        question: "Quelle zone doit être séparée dans un salon ?",
        options: [
          "Salle de bain et cuisine",
          "Poste de coupe et zone d'attente",
          "Stockage et salon",
          "Bar et coiffeur",
          "Aucune zone"
        ],
        correct: 1,
      },
      {
        question: "Quels outils doivent être désinfectés après chaque client ?",
        options: [
          "Ciseaux, tondeuse, peignes",
          "Chaise et miroir",
          "Téléphone du coiffeur",
          "Lampes du salon",
          "Plantes du salon"
        ],
        correct: 0,
      },
      {
        question: "Comment accueillir un client correctement ?",
        options: [
          "L'ignorer et commencer la coupe",
          "S'assurer qu'il se sente bien et comprendre ses attentes",
          "Demander de payer avant",
          "Lui montrer la décoration",
          "Parler de sa vie personnelle"
        ],
        correct: 1,
      },
      {
        question: "Que faire avant de commencer la coupe ?",
        options: [
          "Rien, commencer directement",
          "Préparer le client et les outils",
          "Allumer la radio",
          "Demander au client de nettoyer le salon",
          "Prendre une photo"
        ],
        correct: 1,
      },
    ],
  },
  
  
  2: {
    title: "Techniques de Base du Rasage & Coupes Simples",
    videos: [
      "/videos/rasage_intro.mp4",
      "/videos/rasage_techniques.mp4",
      "/videos/coupes_simples_ciseaux.mp4",
      "/videos/coupes_simples_tondeuse.mp4",
    ],
    contents: [
      // Vidéo 1 : Préparation au rasage
      `<h2 style="font-weight:bold; color:#fff; font-size:28px; margin-bottom:20px;">🪒 Préparation au rasage</h2>
       <p style="color:#fff; font-size:18px; line-height:1.9; margin-bottom:20px;">
         Le secret d’un rasage confortable et professionnel commence par une bonne préparation.  
         Avant même que la lame ne touche la peau, le coiffeur doit prendre le temps de <b>préparer la barbe et la peau</b>.  
         ➡️ Cette étape réduit considérablement les risques de coupures, d’irritations et améliore le confort du client.  
       </p>
       <ul style="color:#fff; font-size:17px; line-height:1.9; margin-left:15px;">
         <li style="margin-bottom:25px;">
           💧 <b>Hydratation de la peau</b>  
           <p style="margin-top:8px;">
             Appliquer une <b>serviette chaude et humide</b> pendant 2 à 3 minutes.  
             Cela ouvre les pores, assouplit le poil et relâche les tensions du visage.  
             ➡️ Le client se détend et son rasage devient une expérience de confort.
           </p>
         </li>
         <li style="margin-bottom:25px;">
           🧴 <b>Huile ou crème de pré-rasage</b>  
           <p style="margin-top:8px;">
             Elle forme une fine barrière protectrice entre la peau et la lame.  
             Cela facilite le glissement et limite les rougeurs.  
             ➡️ Un détail qui transforme un rasage classique en expérience haut de gamme.
           </p>
         </li>
         <li style="margin-bottom:25px;">
           🪒 <b>Choix de la lame</b>  
           <p style="margin-top:8px;">
             Toujours utiliser une lame <b>neuve, propre et bien affûtée</b>.  
             Une lame émoussée tire sur le poil au lieu de le couper, provoquant inconfort et coupures.  
           </p>
         </li>
       </ul>`,
  
      // Vidéo 2 : Techniques de rasage
      `<h2 style="font-weight:bold; color:#fff; font-size:28px; margin-bottom:20px;">💈 Techniques de rasage</h2>
       <p style="color:#fff; font-size:18px; line-height:1.9; margin-bottom:20px;">
         Le rasage ne dépend pas seulement de la lame mais surtout de la <b>maîtrise des gestes</b>.  
         Un bon barbier adopte toujours une méthode précise et respectueuse de la peau du client.  
       </p>
       <ul style="color:#fff; font-size:17px; line-height:1.9; margin-left:15px;">
         <li style="margin-bottom:25px;">➡️ <b>Premier passage dans le sens du poil</b> : réduit les risques d’irritation et coupe le poil en douceur.</li>
         <li style="margin-bottom:25px;">🔄 <b>Deuxième passage à rebrousse-poil</b> (facultatif) : uniquement si la peau est résistante et pour un rasage ultra net.</li>
         <li style="margin-bottom:25px;">💦 <b>Réapplication de la mousse</b> : toujours remettre une couche avant un nouveau passage pour protéger la peau.</li>
         <li style="margin-bottom:25px;">🖐️ <b>Tendre la peau</b> : utiliser les doigts pour étirer légèrement la zone et faciliter la glisse de la lame.</li>
       </ul>`,
  
      // Vidéo 3 : Coupes simples aux ciseaux
      `<h2 style="font-weight:bold; color:#fff; font-size:28px; margin-bottom:20px;">✂️ Coupes simples aux ciseaux</h2>
       <p style="color:#fff; font-size:18px; line-height:1.9; margin-bottom:20px;">
         La coupe aux ciseaux reste l’outil le plus noble du barbier.  
         Elle permet des <b>ajustements précis</b> et un rendu <b>naturel et élégant</b>, adapté à chaque morphologie.  
       </p>
       <ul style="color:#fff; font-size:17px; line-height:1.9; margin-left:15px;">
         <li style="margin-bottom:25px;">🪮 <b>Préparation</b> : toujours peigner les cheveux pour bien visualiser les volumes et les longueurs.</li>
         <li style="margin-bottom:25px;">✂️ <b>Coupe de base</b> : commencer par les côtés et progresser vers le haut, mèche par mèche.</li>
         <li style="margin-bottom:25px;">📏 <b>Respect des proportions</b> : adapter la longueur au visage (longueur de nez, mâchoire, front).</li>
         <li style="margin-bottom:25px;">✨ <b>Finitions</b> : vérifier la symétrie, égaliser les pointes et donner un mouvement naturel.</li>
       </ul>`,
  
      // Vidéo 4 : Coupes simples à la tondeuse
      `<h2 style="font-weight:bold; color:#fff; font-size:28px; margin-bottom:20px;">🔌 Coupes simples à la tondeuse</h2>
       <p style="color:#fff; font-size:18px; line-height:1.9; margin-bottom:20px;">
         La tondeuse est l’outil incontournable pour des coupes rapides, modernes et nettes.  
         Elle est particulièrement utilisée pour les <b>dégradés, contours et styles courts</b>.  
       </p>
       <ul style="color:#fff; font-size:17px; line-height:1.9; margin-left:15px;">
         <li style="margin-bottom:25px;">⚡ <b>Choisir le bon sabot</b> : sélectionner la bonne hauteur selon la coupe désirée.</li>
         <li style="margin-bottom:25px;">🪞 <b>Travail des contours</b> : nettoyer la nuque, les tempes et la barbe pour un rendu net et soigné.</li>
         <li style="margin-bottom:25px;">🧴 <b>Hygiène</b> : brosser, désinfecter et huiler la tondeuse après chaque utilisation pour garder sa précision.</li>
       </ul>`,
    ],
  
    quiz: [
      {
        question: "Quelle est la première étape avant de commencer un rasage ?",
        options: [
          "Appliquer de la mousse directement",
          "Utiliser une serviette chaude pour préparer la peau",
          "Commencer à raser sans préparation",
          "Couper les cheveux avant",
          "Demander au client de se raser lui-même"
        ],
        correct: 1,
      },
      {
        question: "Pourquoi faut-il raser dans le sens du poil au premier passage ?",
        options: [
          "Pour aller plus vite",
          "Pour éviter les irritations et coupures",
          "Pour impressionner le client",
          "Pour économiser de la mousse",
          "Aucune raison"
        ],
        correct: 1,
      },
      {
        question: "Quel outil est le plus adapté pour un rendu naturel ?",
        options: [
          "La tondeuse",
          "Les ciseaux",
          "La brosse",
          "Le peigne seul",
          "La serviette chaude"
        ],
        correct: 1,
      },
      {
        question: "Quel outil est le plus pratique pour les dégradés rapides ?",
        options: [
          "La tondeuse",
          "Les ciseaux",
          "Le rasoir droit",
          "La cire capillaire",
          "Le sèche-cheveux"
        ],
        correct: 0,
      },
      {
        question: "Que doit-on faire après avoir utilisé la tondeuse ?",
        options: [
          "La ranger directement",
          "La brosser, désinfecter et huiler",
          "Changer le sabot uniquement",
          "La prêter à un collègue",
          "Rien du tout"
        ],
        correct: 1,
      },
    ],
  },
  
  
  3: {
    title: "Maîtrise des techniques de dégradé moderne",
    videos: [
      "/videos/preparation_degrade.mp4",
      "/videos/fondamentaux_degrade.mp4",
      "/videos/perfection_transitions.mp4",
      "/videos/styles_modernes.mp4",
      "/videos/finitions_conseils.mp4",
    ],
    contents: [
      // Vidéo 1 : Préparation du cuir chevelu
      `<h2 style="font-weight:bold; color:#fff; font-size:28px; margin-bottom:20px;">🧴 Préparation du cuir chevelu</h2>
       <p style="color:#fff; font-size:18px; line-height:1.9; margin-bottom:25px;">
         Un dégradé réussi commence toujours par une préparation minutieuse.  
         Cette étape permet d’obtenir une coupe <b>fluide, nette et confortable</b> pour le client, tout en garantissant un rendu haut de gamme.  
       </p>
       <ul style="color:#fff; font-size:17px; line-height:2; margin-left:20px;">
         <li style="margin-bottom:25px;">
           💆‍♂️ <b>Nettoyage et hydratation</b>  
           <p style="margin-top:8px;">Laver ou humidifier les cheveux pour éliminer impuretés, résidus de produits et faciliter la coupe.</p>
         </li>
         <li style="margin-bottom:25px;">
           🪞 <b>Observation de la tête</b>  
           <p style="margin-top:8px;">Analyser la forme du crâne, les épis et la texture capillaire afin d’adapter la technique du dégradé.</p>
         </li>
         <li style="margin-bottom:25px;">
           🧴 <b>Produit protecteur</b>  
           <p style="margin-top:8px;">Appliquer un spray protecteur ou une lotion adoucissante pour préparer le cheveu et protéger la peau.</p>
         </li>
       </ul>`,
  
      // Vidéo 2 : Fondamentaux du dégradé
      `<h2 style="font-weight:bold; color:#fff; font-size:28px; margin-bottom:20px;">📏 Fondamentaux du dégradé</h2>
       <p style="color:#fff; font-size:18px; line-height:1.9; margin-bottom:25px;">
         Le dégradé repose sur la <b>progression des longueurs</b> et la précision des gestes.  
         L’objectif est de créer une <b>transition harmonieuse</b> adaptée au style et à la morphologie du client.  
       </p>
       <ul style="color:#fff; font-size:17px; line-height:2; margin-left:20px;">
         <li style="margin-bottom:25px;">📐 <b>Définir la ligne de départ</b> : bas, moyen ou haut selon le rendu recherché.</li>
         <li style="margin-bottom:25px;">✂️ <b>Progression des sabots</b> : utiliser différents sabots pour fondre les longueurs progressivement.</li>
         <li style="margin-bottom:25px;">🔄 <b>Tondeuse sur peigne</b> : contrôler la transition et éviter les démarcations visibles.</li>
         <li style="margin-bottom:25px;">🖐️ <b>Contrôle constant</b> : vérifier régulièrement la symétrie et l’équilibre du dégradé.</li>
       </ul>`,
  
      // Vidéo 3 : Perfection des transitions
      `<h2 style="font-weight:bold; color:#fff; font-size:28px; margin-bottom:20px;">🌗 Perfection des transitions</h2>
       <p style="color:#fff; font-size:18px; line-height:1.9; margin-bottom:25px;">
         La qualité d’un dégradé moderne se mesure à la <b>fluidité de ses transitions</b>.  
         Aucun trait de démarcation ne doit apparaître, et le passage d’une longueur à l’autre doit être invisible.  
       </p>
       <ul style="color:#fff; font-size:17px; line-height:2; margin-left:20px;">
         <li style="margin-bottom:25px;">🎯 <b>Suppression des lignes</b> : utiliser la tondeuse sans sabot ou des ciseaux sculpteurs pour effacer les démarcations.</li>
         <li style="margin-bottom:25px;">🔍 <b>Contrôle de la symétrie</b> : comparer les deux côtés du crâne pour garantir l’harmonie.</li>
         <li style="margin-bottom:25px;">🪒 <b>Contours nets</b> : finaliser avec un rasoir droit ou une tondeuse de précision pour une finition impeccable.</li>
       </ul>`,
  
      // Vidéo 4 : Styles de dégradés modernes
      `<h2 style="font-weight:bold; color:#fff; font-size:28px; margin-bottom:20px;">🔥 Styles de dégradés modernes</h2>
       <p style="color:#fff; font-size:18px; line-height:1.9; margin-bottom:25px;">
         Le dégradé moderne s’est imposé comme une tendance mondiale.  
         Chaque style correspond à une personnalité et à une morphologie différente.  
       </p>
       <ul style="color:#fff; font-size:17px; line-height:2; margin-left:20px;">
         <li style="margin-bottom:25px;">💎 <b>Skin Fade</b> : rasé à blanc sur les côtés pour un effet ultra net.</li>
         <li style="margin-bottom:25px;">🌊 <b>Taper Fade</b> : fondu léger et subtil au niveau des tempes et de la nuque.</li>
         <li style="margin-bottom:25px;">📏 <b>Low, Mid et High Fade</b> : variation selon la hauteur du point de départ du dégradé.</li>
         <li style="margin-bottom:25px;">🎨 <b>Dégradés créatifs</b> : intégration de motifs, dessins ou lignes artistiques dans le fondu.</li>
       </ul>`,
  
      // Vidéo 5 : Finitions & conseils professionnels
      `<h2 style="font-weight:bold; color:#fff; font-size:28px; margin-bottom:20px;">✨ Finitions & Conseils professionnels</h2>
       <p style="color:#fff; font-size:18px; line-height:1.9; margin-bottom:25px;">
         Le secret d’un dégradé premium réside dans les <b>finitions parfaites</b> et l’attention aux détails.  
         Ce sont ces éléments qui distinguent un simple coiffeur d’un <b>barbier de prestige</b>.  
       </p>
       <ul style="color:#fff; font-size:17px; line-height:2; margin-left:20px;">
         <li style="margin-bottom:25px;">🪞 <b>Vérification sous différents angles</b> : observer le dégradé à la lumière naturelle et artificielle.</li>
         <li style="margin-bottom:25px;">⚡ <b>Contours nets</b> : dessiner des lignes précises sur la nuque et les tempes.</li>
         <li style="margin-bottom:25px;">💡 <b>Conseils d’entretien</b> : recommander au client les produits et la fréquence de coupe pour conserver le style.</li>
         <li style="margin-bottom:25px;">🏆 <b>Signature personnelle</b> : ajouter une touche unique qui fidélise le client.</li>
       </ul>`,
    ],
  
    quiz: [
      {
        question: "Quelle est la première étape avant de commencer un dégradé ?",
        options: [
          "Raser directement",
          "Nettoyer et hydrater les cheveux",
          "Tracer les contours",
          "Choisir un motif créatif",
          "Mettre du gel coiffant"
        ],
        correct: 1,
      },
      {
        question: "À quoi sert la progression des sabots ?",
        options: [
          "À aller plus vite",
          "À ne pas avoir besoin de peigne",
          "À créer une transition harmonieuse",
          "À couper les cheveux plus longs",
          "À impressionner le client",
          "À créer une transition harmonieuse",
        ],
        correct: 4,
      },
      {
        question: "Quel outil est utilisé pour effacer les lignes visibles ?",
        options: [
          "Le sèche-cheveux",
          "La brosse",
          "La tondeuse sans sabot ou les ciseaux",
          "Le peigne seul",
          "La serviette chaude"
        ],
        correct: 2,
      },
      {
        question: "Quel style correspond à un fondu léger sur la nuque et les tempes ?",
        options: [
          "Skin Fade",
          "Taper Fade",
          "High Fade",
          "Low Fade",
          "Dégradé créatif"
        ],
        correct: 1,
      },
      {
        question: "Quelle est la clé d’un dégradé moderne réussi ?",
        options: [
          "Un rasage rapide",
          "Des transitions fluides sans démarcations",
          "Utiliser uniquement un sabot",
          "Ajouter beaucoup de cire",
          "Ignorer la symétrie"
        ],
        correct: 1,
      },
    ],
  },
  
  4: {
    title: "Techniques avancées de Taper Cut",
    videos: [
      "/videos/preparation_taper.mp4",
      "/videos/maitrise_transitions_taper.mp4",
      "/videos/styles_taper_modernes.mp4",
      "/videos/finitions_taper.mp4",
    ],
    contents: [
      // Vidéo 1 : Préparation & Mise en place
      `<h2 style="font-weight:bold; color:#FFD700; font-size:32px; margin-bottom:25px;">💆‍♂️ Préparation & Mise en place</h2>
       <p style="color:#e0e0e0; font-size:19px; line-height:2; margin-bottom:30px;">
         Le taper cut, véritable signature des barbershops modernes, exige une <b>préparation minutieuse</b>.  
         Avant même de poser la tondeuse, l’art du taper commence par l’analyse de la chevelure et du visage du client afin d’adapter la coupe à sa morphologie.
       </p>
       <ul style="color:#fff; font-size:18px; line-height:2; margin-left:25px;">
         <li style="margin-bottom:30px;">🧴 <b>Nettoyage & humidification</b> : assouplir les cheveux pour une meilleure précision lors du fondu.</li>
         <li style="margin-bottom:30px;">🪞 <b>Observation des zones clés</b> : tempes, nuque et pattes sont les repères stratégiques du taper cut.</li>
         <li style="margin-bottom:30px;">✂️ <b>Matériel préparé</b> : tondeuses de précision, peignes adaptés et rasoir droit à portée de main.</li>
       </ul>`,
  
      // Vidéo 2 : Maîtrise des transitions
      `<h2 style="font-weight:bold; color:#FFD700; font-size:32px; margin-bottom:25px;">📏 Maîtrise des transitions</h2>
       <p style="color:#e0e0e0; font-size:19px; line-height:2; margin-bottom:30px;">
         Le taper cut repose sur un <b>dégradé subtil et localisé</b>, particulièrement aux contours.  
         La réussite vient de la précision des transitions et du fondu presque imperceptible.
       </p>
       <ul style="color:#fff; font-size:18px; line-height:2; margin-left:25px;">
         <li style="margin-bottom:30px;">🎯 <b>Création de la ligne guide</b> : définir le niveau de départ du fondu.</li>
         <li style="margin-bottom:30px;">🔄 <b>Progression en douceur</b> : utiliser les sabots par étapes pour fondre progressivement.</li>
         <li style="margin-bottom:30px;">🖐️ <b>Vérification constante</b> : contrôler la symétrie des deux côtés pour un rendu parfait.</li>
       </ul>`,
  
      // Vidéo 3 : Styles modernes du Taper Cut
      `<h2 style="font-weight:bold; color:#FFD700; font-size:32px; margin-bottom:25px;">🔥 Styles modernes du Taper Cut</h2>
       <p style="color:#e0e0e0; font-size:19px; line-height:2; margin-bottom:30px;">
         Le taper cut s’adapte à toutes les générations et devient une <b>tendance universelle</b>.  
         Chaque style transmet une image raffinée et personnalisée.
       </p>
       <ul style="color:#fff; font-size:18px; line-height:2; margin-left:25px;">
         <li style="margin-bottom:30px;">💎 <b>Classic Taper</b> : transitions douces pour un style intemporel.</li>
         <li style="margin-bottom:30px;">⚡ <b>Low Taper</b> : fondu bas au niveau de la nuque pour un rendu discret.</li>
         <li style="margin-bottom:30px;">🌊 <b>Temple Taper</b> : accent mis sur les tempes et la ligne frontale.</li>
         <li style="margin-bottom:30px;">🎨 <b>Taper créatif</b> : motifs et finitions artistiques pour un look unique.</li>
       </ul>`,
  
      // Vidéo 4 : Finitions & Détails de maître
      `<h2 style="font-weight:bold; color:#FFD700; font-size:32px; margin-bottom:25px;">✨ Finitions & Détails de maître</h2>
       <p style="color:#e0e0e0; font-size:19px; line-height:2; margin-bottom:30px;">
         Ce sont les <b>détails et finitions</b> qui distinguent un simple taper cut d’une véritable œuvre de barbier.  
         Les contours nets et l’attention portée aux proportions transforment la coupe en une expérience premium.
       </p>
       <ul style="color:#fff; font-size:18px; line-height:2; margin-left:25px;">
         <li style="margin-bottom:30px;">🪒 <b>Contours précis</b> : travailler la nuque, les tempes et les pattes avec rasoir ou tondeuse de détail.</li>
         <li style="margin-bottom:30px;">🪞 <b>Contrôle des proportions</b> : vérifier le fondu sous différents angles et lumières.</li>
         <li style="margin-bottom:30px;">💡 <b>Conseils au client</b> : entretien, produits adaptés et fréquence des retouches.</li>
         <li style="margin-bottom:30px;">🏆 <b>Signature personnelle</b> : apporter une touche qui fait de ton taper une marque de fabrique.</li>
       </ul>`,
    ],
  
    quiz: [
      {
        question: "Quelles zones sont essentielles pour un taper cut ?",
        options: [
          "Le sommet du crâne",
          "Les tempes, la nuque et les pattes",
          "Uniquement la barbe",
          "Les oreilles",
          "Aucune zone spécifique"
        ],
        correct: 1,
      },
      {
        question: "Quelle est la clé d’un taper cut réussi ?",
        options: [
          "Un fondu subtil et localisé",
          "Un rasage à blanc complet",
          "Utiliser un seul sabot",
          "Ignorer la symétrie",
          "Appliquer du gel"
        ],
        correct: 0,
      },
      {
        question: "Quel style de taper est le plus discret ?",
        options: [
          "Temple Taper",
          "Low Taper",
          "Classic Taper",
          "Taper créatif",
          "Skin Fade"
        ],
        correct: 1,
      },
      {
        question: "Quel outil est utilisé pour des finitions précises ?",
        options: [
          "Sèche-cheveux",
          "Peigne large",
          "Rasoir droit ou tondeuse de détail",
          "Serviette chaude",
          "Gel coiffant"
        ],
        correct: 2,
      },
      {
        question: "Que doit faire un barbier après la coupe ?",
        options: [
          "Ne rien dire",
          "Donner des conseils d’entretien au client",
          "Raser à nouveau",
          "Prendre une photo uniquement",
          "Laisser le client décider seul"
        ],
        correct: 1,
      },
    ],
  },
  
  5: {
    title: "Finitions et Contours Professionnels",
    videos: [
      "/videos/preparation_contours.mp4",
      "/videos/techniques_precises.mp4",
      "/videos/styles_contours_modernes.mp4",
      "/videos/soins_post_coupe.mp4",
    ],
    contents: [
      // Vidéo 1 : Préparation avant contours
      `<h2 style="font-weight:bold; color:#FFD700; font-size:32px; margin-bottom:25px;">🧼 Préparation avant contours</h2>
       <p style="color:#e0e0e0; font-size:19px; line-height:2; margin-bottom:30px;">
         La réussite des finitions commence toujours par une <b>préparation impeccable</b>.  
         Avant de tracer ou de redessiner les lignes, il est essentiel de travailler sur une base propre, hydratée et bien observée.
       </p>
       <ul style="color:#fff; font-size:18px; line-height:2; margin-left:25px;">
         <li style="margin-bottom:30px;">🧴 <b>Nettoyage et hydratation</b> : appliquer une serviette chaude ou une lotion pour assouplir la peau et les cheveux.</li>
         <li style="margin-bottom:30px;">🪞 <b>Analyse des lignes naturelles</b> : repérer la symétrie, les irrégularités et la densité de pousse.</li>
         <li style="margin-bottom:30px;">✂️ <b>Préparer le matériel</b> : tondeuses de précision, rasoir droit, peignes fins et spray désinfectant.</li>
       </ul>`,
  
      // Vidéo 2 : Techniques précises de contours
      `<h2 style="font-weight:bold; color:#FFD700; font-size:32px; margin-bottom:25px;">📏 Techniques précises de contours</h2>
       <p style="color:#e0e0e0; font-size:19px; line-height:2; margin-bottom:30px;">
         Les contours définissent l’identité visuelle d’une coupe.  
         Chaque trait doit être <b>net, équilibré et parfaitement symétrique</b> pour un rendu haut de gamme.
       </p>
       <ul style="color:#fff; font-size:18px; line-height:2; margin-left:25px;">
         <li style="margin-bottom:30px;">🎯 <b>Lignes frontales</b> : dessiner une ligne nette adaptée à la morphologie du visage.</li>
         <li style="margin-bottom:30px;">🔄 <b>Tempes et pattes</b> : utiliser la tondeuse de détail pour fondre naturellement avec la barbe ou le taper.</li>
         <li style="margin-bottom:30px;">🪒 <b>Rasoir droit</b> : obtenir une finition ultra nette sans irritation.</li>
         <li style="margin-bottom:30px;">🖐️ <b>Symétrie constante</b> : vérifier régulièrement chaque côté avec un miroir de contrôle.</li>
       </ul>`,
  
      // Vidéo 3 : Styles modernes des contours
      `<h2 style="font-weight:bold; color:#FFD700; font-size:32px; margin-bottom:25px;">🔥 Styles modernes des contours</h2>
       <p style="color:#e0e0e0; font-size:19px; line-height:2; margin-bottom:30px;">
         Les finitions et contours peuvent être personnalisés selon les goûts du client.  
         Les barbers modernes maîtrisent différents styles pour répondre à toutes les demandes.
       </p>
       <ul style="color:#fff; font-size:18px; line-height:2; margin-left:25px;">
         <li style="margin-bottom:30px;">💎 <b>Contour classique</b> : lignes droites et propres, adaptées à un look professionnel.</li>
         <li style="margin-bottom:30px;">⚡ <b>Contour arrondi</b> : lignes adoucies pour un rendu naturel.</li>
         <li style="margin-bottom:30px;">🌊 <b>Contour créatif</b> : intégration de motifs, dessins ou angles originaux.</li>
         <li style="margin-bottom:30px;">🏆 <b>Signature personnelle</b> : adapter le contour au style global du client (fade, taper, barbe).</li>
       </ul>`,
  
      // Vidéo 4 : Soins & entretien post-coupe
      `<h2 style="font-weight:bold; color:#FFD700; font-size:32px; margin-bottom:25px;">✨ Soins & Entretien post-coupe</h2>
       <p style="color:#e0e0e0; font-size:19px; line-height:2; margin-bottom:30px;">
         Les soins après les finitions garantissent non seulement un confort immédiat pour le client,  
         mais aussi une <b>fidélisation grâce à une expérience premium</b>.
       </p>
       <ul style="color:#fff; font-size:18px; line-height:2; margin-left:25px;">
         <li style="margin-bottom:30px;">🧴 <b>Application de lotion apaisante</b> : éviter les irritations et hydrater la peau.</li>
         <li style="margin-bottom:30px;">💡 <b>Conseils personnalisés</b> : recommander des produits adaptés pour l’entretien à domicile.</li>
         <li style="margin-bottom:30px;">🪞 <b>Vérification finale</b> : montrer au client sous différents angles pour assurer sa satisfaction.</li>
         <li style="margin-bottom:30px;">🎁 <b>Expérience premium</b> : ajouter une touche finale (parfum pour cheveux, serviette chaude, massage rapide).</li>
       </ul>`,
    ],
  
    quiz: [
      {
        question: "Quelle est la première étape avant de tracer les contours ?",
        options: [
          "Tracer directement",
          "Nettoyer et hydrater la peau et les cheveux",
          "Appliquer du gel coiffant",
          "Dessiner un motif créatif",
          "Allumer la tondeuse"
        ],
        correct: 1,
      },
      {
        question: "Quel outil permet d’obtenir des contours ultra nets ?",
        options: [
          "La brosse",
          "Le sèche-cheveux",
          "Le rasoir droit",
          "La serviette chaude",
          "Un peigne large"
        ],
        correct: 2,
      },
      {
        question: "Quel style de contour est le plus adapté pour un look professionnel classique ?",
        options: [
          "Contour créatif",
          "Contour arrondi",
          "Contour classique",
          "Signature personnelle",
          "Aucun contour"
        ],
        correct: 2,
      },
      {
        question: "Pourquoi les soins post-coupe sont-ils importants ?",
        options: [
          "Pour accélérer la repousse",
          "Pour hydrater et éviter les irritations",
          "Pour décorer le salon",
          "Pour impressionner les autres barbiers",
          "Ils ne sont pas importants"
        ],
        correct: 1,
      },
      {
        question: "Quelle touche finale renforce l’expérience premium ?",
        options: [
          "Appliquer du parfum pour cheveux ou une serviette chaude",
          "Raser une deuxième fois",
          "Ajouter du gel en excès",
          "Laisser le client partir sans vérification",
          "Ne rien faire de spécial"
        ],
        correct: 0,
      },
    ],
  },
  
};
const CourseSection: React.FC<CourseSectionProps> = ({ sectionId, userProgress, onBack, onComplete }) => {
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number | null>>(() => {
    const saved = localStorage.getItem(`quizAnswers-section-${sectionId}`);
    return saved ? JSON.parse(saved) : {};
  });
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [isQuizLocked, setIsQuizLocked] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<'course' | 'quiz'>('course');
  const [showPurchaseAlert, setShowPurchaseAlert] = useState(false);
  const [canAccessQuiz, setCanAccessQuiz] = useState(true);

  const section = sectionContent[sectionId];
  if (!section) return <div className="text-white font-bold p-4">Section non trouvée</div>;

  useEffect(() => window.scrollTo(0, 0), []);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session?.user) window.location.href = '/login';
    };
    checkAuth();
  }, []);

  const handleQuizAnswer = (qIdx: number, aIdx: number) => {
    if (isQuizLocked) return;
    const updated = { ...quizAnswers, [qIdx]: aIdx };
    setQuizAnswers(updated);
    localStorage.setItem(`quizAnswers-section-${sectionId}`, JSON.stringify(updated));
  };

  const calculateScore = () => {
    const correctCount = section.quiz.reduce((acc, q, idx) => quizAnswers[idx] === q.correct ? acc + 1 : acc, 0);
    return Math.round((correctCount / section.quiz.length) * 20);
  };

  const handleCompleteQuiz = async () => {
    if (userProgress.completedSections.includes(sectionId)) {
      setErrorMessage("Ce quiz a déjà été validé. Vous ne pouvez pas le refaire.");
      return;
    }

    const calculatedScore = calculateScore();
    setScore(calculatedScore);
    setShowResults(true);
    setIsQuizLocked(true);

    if (calculatedScore >= 10) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return setErrorMessage('Utilisateur non connecté.');

        const updatedCompleted = Array.from(new Set([...userProgress.completedSections, sectionId]));
        const updatedScores = { ...userProgress.scores, [sectionId]: calculatedScore };

        await supabase.from('user_progress').upsert({
          user_id: session.user.id,
          current_section: Math.max(sectionId + 1, userProgress.currentSection),
          completed_sections: updatedCompleted,
          scores: updatedScores,
        }, { onConflict: 'user_id' });

        onComplete(sectionId, calculatedScore, updatedCompleted, updatedScores);
      } catch (err: any) {
        setErrorMessage(`Erreur lors de la mise à jour : ${err.message}`);
      }
    } else {
      setErrorMessage("Vous n'avez pas atteint la moyenne. Veuillez revoir le cours.");
    }
  };

  const handleRetryQuiz = () => {
    setQuizAnswers({});
    localStorage.removeItem(`quizAnswers-section-${sectionId}`);
    setShowResults(false);
    setIsQuizLocked(false);
    setErrorMessage(null);
  };

  useEffect(() => {
    const checkQuizAccess = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return setErrorMessage('Utilisateur non connecté.');

        const { data } = await supabase.from('profiles')
          .select('can_access_quiz')
          .eq('id', session.user.id)
          .maybeSingle();

        if (!data?.can_access_quiz) {
          setIsQuizLocked(true);
          setCanAccessQuiz(false);
          setShowPurchaseAlert(true);
        } else {
          setCanAccessQuiz(true);
          setShowPurchaseAlert(false);
        }
      } catch (err) {
        console.error(err);
      }
    };
    checkQuizAccess();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button onClick={onBack} className="flex items-center space-x-2 text-gray-300 hover:text-white">
          <ArrowLeft className="w-5 h-5" /> <span>Retour</span>
        </button>
        <h1 className="text-3xl font-bold text-white">{section.title}</h1>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mt-4">
        <button onClick={() => setCurrentTab('course')} className={`px-4 py-2 rounded-lg font-bold ${currentTab === 'course' ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-white'}`}>Cours</button>
        <button onClick={() => setCurrentTab('quiz')} className={`px-4 py-2 rounded-lg font-bold ${currentTab === 'quiz' ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-white'}`}>Quiz</button>
      </div>

      {/* Contenu */}
      {currentTab === 'course' && section.videos.map((video, idx) => (
        <div key={idx} className="space-y-4 mt-10">
          <h2 className="text-xl font-bold text-white">Vidéo {idx + 1}</h2>
          <div className="aspect-video bg-gray-700 rounded-lg flex items-center justify-center">
            <iframe src={video} title={`video-${idx}`} width="100%" height="100%" frameBorder="0" allowFullScreen />
          </div>
          <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: section.contents[idx] }} />
        </div>
      ))}

      {currentTab === 'quiz' && (
        <div className="space-y-6 mt-6">
          <h2 className="text-2xl font-bold text-white">Quiz</h2>
          {section.quiz.map((q, qIdx) => (
            <div key={qIdx} className="bg-gray-700/50 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">{q.question}</h4>
              <div className="grid gap-2">
                {q.options.map((opt, optIdx) => (
                  <button key={optIdx} onClick={() => handleQuizAnswer(qIdx, optIdx)} disabled={isQuizLocked} className={`w-full py-2 px-4 rounded-lg text-left flex items-center space-x-2 ${quizAnswers[qIdx] === optIdx ? 'bg-yellow-500 text-black font-bold' : 'bg-gray-700 hover:bg-yellow-600 text-white'}`}>
                    {quizAnswers[qIdx] === optIdx && <span className="w-4 h-4 bg-black rounded-full border-2 border-white"></span>}
                    <span>{opt}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Résultats */}
      {showResults && (
        <div className="text-center mt-6">
          <h2 className="text-2xl font-bold text-white">Résultats</h2>
          <p className="text-gray-300">Votre score : <span className="font-bold">{score}/20</span></p>
          {score !== null && score >= 10 ? (
            <p className="text-green-400 font-bold">Félicitations, vous avez réussi !</p>
          ) : (
            <div>
              <p className="text-red-400 font-bold">Vous n'avez pas atteint la moyenne. Veuillez revoir le cours.</p>
              <button onClick={handleRetryQuiz} className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded-lg">Refaire le Quiz</button>
            </div>
          )}
        </div>
      )}

      {/* Boutons */}
      {currentTab === 'quiz' && !showResults && (
        <div className="text-center mt-6">
          <button onClick={handleCompleteQuiz} className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded-lg">Terminer le Quiz</button>
        </div>
      )}
      {currentTab === 'course' && (
        <div className="text-center mt-6">
          <button onClick={() => setCurrentTab('quiz')} className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded-lg">Passer les tests</button>
        </div>
      )}

      {/* Message d'erreur */}
      {errorMessage && <div className="p-6 text-red-500 font-bold">{errorMessage}</div>}

      {/* Alerte achat */}
      {showPurchaseAlert && !canAccessQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-0">
          <div className="bg-white rounded-lg shadow-lg p-5 text-center space-y-7 max-w-md">
            <h2 className="text-2xl font-bold text-gray-800">Accès refusé</h2>
            <p className="text-gray-600">Veuillez acheter la formation pour accéder au quiz.</p>
            <a href="https://wa.me/704776258" target="_blank" rel="noopener noreferrer" className="px-7 py-1 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors">Acheter la formation</a>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseSection;