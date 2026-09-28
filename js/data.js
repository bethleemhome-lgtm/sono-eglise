// Données fixes de l'application : le matériel à vérifier et les tranches de la table.
// Pour ajouter ou retirer un équipement, modifie simplement ces listes.

export const EQUIPEMENT = [
  ["Régie", ["Table de mixage Soundcraft EFX8", "Snake 16 pistes"]],
  ["Micros HF", ["Micro HF pupitre Shure", "Micro HF lead Sennheiser 1", "Micro HF lead Sennheiser 2"]],
  ["Micros filaires", ["Micro filaire XLR 1", "Micro filaire XLR 2", "Micro filaire XLR 3", "Pied de micro 1", "Pied de micro 2", "Pied de micro 3"]],
  ["Batterie", ["Micro kick + pied", "Micro caisse claire (snare) + pied"]],
  ["Piano", ["Piano Yamaha S750", "Câble jack piano"]],
  ["Amplification & diffusion", ["Ampli façade 4000 W", "Ampli retour 2000 W (MAX)", "Colonne façade gauche", "Colonne façade droite", "Colonne retour"]],
  ["Alimentation", ["Rallonge 1 (4 prises)", "Rallonge 2 (4 prises)"]],
];

export const ITEMS = EQUIPEMENT.flatMap(([groupe, liste]) => liste.map((nom) => ({ groupe, nom })));

export const TYPES_CULTE = ["Culte du dimanche", "Culte de semaine", "Veillée de prière", "Répétition", "Événement spécial"];

// États possibles d'un équipement pendant la vérification
export const LABEL = { ok: "Bon état", bad: "Défaillant", abs: "Absent" };

// Tranches de la Soundcraft EFX8 (onglet Réglages)
export const TRANCHES = [
  ["1", "Kick"], ["2", "Caisse claire"], ["3", "Micro filaire 1"], ["4", "Micro filaire 2"],
  ["5", "Micro filaire 3"], ["6", "HF Sennheiser 1"], ["7", "HF Sennheiser 2"], ["8", "HF pupitre Shure"],
  ["STE1", "Piano Yamaha"], ["STE2", "Libre / playback"],
];
export const CHAMPS_REGLAGE = ["gain", "aux", "fx", "fader", "note"];
