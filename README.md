# Check-list Sono 🎚️

Application web pour vérifier le matériel sonore de l'église avant chaque culte.
Elle s'installe sur l'écran d'accueil du téléphone comme une vraie app (Android et iPhone).

**Fonctions**
- **Vérification** : chaque équipement est noté *Bon état*, *Défaillant* ou *Absent*, avec une remarque. Le rapport se partage sur WhatsApp ou par email.
- **Pannes** : les équipements défaillants arrivent automatiquement dans une liste « À réparer » jusqu'à ce qu'on les marque réparés.
- **Historique** : toutes les vérifications enregistrées, par date et par culte.
- **Réglages** : la fiche de réglages de référence de la table Soundcraft EFX8.
- **Infos & formation** : schéma de câblage, plan des tranches, allumage, dépannage.

---

## Comment le projet est organisé

```
sono-eglise/
├── index.html              ← la page de l'app (structure des écrans)
├── css/style.css           ← les couleurs et la mise en page
├── js/
│   ├── app.js              ← démarrage, onglets, connexion
│   ├── config.js           ← clés Supabase (vides = mode démo)
│   ├── data.js             ← LA LISTE DU MATÉRIEL (à modifier ici)
│   ├── store.js            ← lecture / écriture des données
│   ├── util.js             ← petites fonctions utiles
│   └── views/              ← un fichier par onglet
├── sw.js                   ← fonctionnement hors ligne
├── manifest.webmanifest    ← nom et icône de l'app installée
├── icons/                  ← icônes de l'app
├── supabase/schema.sql     ← création de la base de données
└── .github/workflows/      ← mise en ligne automatique
```

Il n'y a **rien à installer ni à compiler** : ce sont des fichiers HTML, CSS et JavaScript simples.

---

## 1. Tester sur ton ordinateur

Dans le dossier du projet :

```bash
python -m http.server 8000
```

Puis ouvre http://localhost:8000 dans le navigateur.
Sans configuration Supabase, l'app tourne en **MODE DÉMO** : les données restent dans ce navigateur uniquement.

## 2. Mettre en ligne (GitHub Pages)

1. Sur GitHub, ouvre le repo → **Settings** → **Pages**.
2. Dans **Source**, choisis **GitHub Actions**.
3. À chaque `git push` sur `main`, l'app est mise en ligne automatiquement (onglet **Actions** pour suivre).
4. Adresse de l'app : `https://bethleemhome-lgtm.github.io/sono-eglise/`

## 3. Partager les données avec l'équipe (Supabase, gratuit)

1. Crée un compte sur https://supabase.com → **New project** (région : Europe, la plus proche d'Abidjan).
2. **SQL Editor** → **New query** → colle le contenu de `supabase/schema.sql` → **Run**.
3. **Authentication** → **Sign In / Providers** → désactive **Allow new users to sign up**
   (seules les personnes que tu invites pourront se connecter).
4. **Authentication** → **URL Configuration** → **Site URL** : `https://bethleemhome-lgtm.github.io/sono-eglise/`
5. **Authentication** → **Users** → **Invite user** : ajoute l'email de chaque membre de l'équipe sono.
6. **Project Settings** → **API** : copie **Project URL** et la clé **anon public** dans `js/config.js`.
7. Commit + push : l'app passe en mode équipe. Chacun se connecte avec un lien reçu par email.

## 4. Installer l'app sur le téléphone

- **Android (Chrome)** : ouvre l'adresse de l'app → menu ⋮ → **Ajouter à l'écran d'accueil**.
- **iPhone (Safari)** : bouton **Partager** → **Sur l'écran d'accueil**.

---

## Modifier l'app

| Je veux… | Fichier à modifier |
|---|---|
| Ajouter / retirer un équipement | `js/data.js` → `EQUIPEMENT` |
| Changer les types de culte | `js/data.js` → `TYPES_CULTE` |
| Modifier le plan des tranches | `js/data.js` → `TRANCHES` et `js/views/infos.js` |
| Changer un texte de formation | `js/views/infos.js` |
| Changer les couleurs | `css/style.css` (en haut, bloc `:root`) |

⚠️ Après une modification, augmente `VERSION` dans `sw.js` (ex. `sono-v2`) pour que les téléphones reçoivent la mise à jour.

## Workflow Git conseillé

```bash
git pull                      # récupérer la dernière version
# … modifier les fichiers …
git add .
git commit -m "Ajoute le micro HF 3 à la liste"
git push                      # met l'app en ligne automatiquement
```
