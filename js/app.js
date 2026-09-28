// Point d'entrée de l'application : connexion, onglets et chargement des données.
import * as store from "./store.js";
import { $, el } from "./util.js";
import { mountCheck, loadVerification, renderIfIdle } from "./views/check.js";
import { renderPannes } from "./views/pannes.js";
import { renderHistorique } from "./views/historique.js";
import { mountReglages, fillReglages } from "./views/reglages.js";
import { INFOS_HTML } from "./views/infos.js";

const TABS = ["check", "pannes", "hist", "regl", "info"];
let pannes = [];
let started = false;

// ---------- Onglets ----------
function showTab(name) {
  for (const t of TABS) {
    $("tab-" + t).setAttribute("aria-selected", t === name);
    $("view-" + t).hidden = t !== name;
  }
  if (name !== "check" && name !== "info") refresh();
}

// ---------- Données ----------
async function refresh() {
  try {
    const [p, v] = await Promise.all([store.listPannes(), store.listVerifications()]);
    pannes = p;
    renderPannes(pannes, refresh);
    renderHistorique(v, (verif) => { loadVerification(verif); showTab("check"); });
    renderIfIdle();
  } catch (e) {
    console.error(e);
    $("hist-list").textContent = "Impossible de charger les données. Vérifie ta connexion internet.";
  }
}

// ---------- Démarrage de l'app (une fois connecté) ----------
async function start(user) {
  $("view-login").hidden = true;
  $("app").hidden = false;
  $("who-email").textContent = user.email;
  $("mode").hidden = store.MODE !== "demo";
  $("btn-logout").hidden = store.MODE === "demo";
  if (started) return;
  started = true;

  $("view-info").innerHTML = INFOS_HTML;
  for (const a of document.querySelectorAll(".toc a")) {
    a.onclick = (e) => {
      e.preventDefault();
      document.querySelector(a.getAttribute("href")).scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    };
  }
  for (const t of TABS) $("tab-" + t).onclick = () => showTab(t);

  mountCheck({ getPannes: () => pannes, refresh });
  mountReglages();
  await refresh();
  try { fillReglages(await store.getReglages()); } catch (e) { console.error(e); }
}

function showLogin() {
  $("app").hidden = true;
  $("view-login").hidden = false;
}

// ---------- Connexion par lien email (mode Supabase) ----------
$("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = $("login-email").value.trim();
  const msg = $("login-msg");
  msg.textContent = "Envoi du lien…";
  try {
    await store.sendLoginLink(email);
    msg.textContent = `Lien envoyé à ${email}. Ouvre l'email sur ce téléphone et appuie sur le lien.`;
  } catch (err) {
    console.error(err);
    msg.textContent = "Cet email n'est pas autorisé ou l'envoi a échoué. Demande au responsable de t'ajouter à l'équipe.";
  }
});

$("btn-logout").onclick = async () => { await store.signOut(); location.reload(); };

// Hors connexion : petit bandeau d'information
function updateOnline() { $("offline").hidden = navigator.onLine; }
addEventListener("online", updateOnline);
addEventListener("offline", updateOnline);
updateOnline();

// Installation hors ligne (service worker)
if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js").catch(() => {});

(async () => {
  try {
    const user = await store.currentUser();
    if (user) start(user); else showLogin();
    store.onAuthChange((u) => (u ? start(u) : showLogin()));
  } catch (e) {
    console.error(e);
    showLogin();
    $("login-msg").textContent = "Impossible de joindre le serveur. Vérifie ta connexion internet.";
  }
})();
