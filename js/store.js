// Couche de données : tout ce qui lit ou écrit des données passe par ici.
// Deux modes :
//  - « supabase » : données partagées par toute l'équipe (si config.js est rempli)
//  - « demo »     : données gardées dans le navigateur de ce téléphone seulement
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config.js";

export const MODE = SUPABASE_URL && SUPABASE_ANON_KEY ? "supabase" : "demo";

let sb = null; // client Supabase, chargé seulement si besoin

async function client() {
  if (!sb) {
    const { createClient } = await import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm");
    sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return sb;
}

function check({ data, error }) {
  if (error) throw error;
  return data;
}

// ---------- Mode démo (localStorage) ----------
const LS = {
  read(key, fallback) {
    try { return JSON.parse(localStorage.getItem("sono:" + key)) ?? fallback; } catch { return fallback; }
  },
  write(key, value) {
    try { localStorage.setItem("sono:" + key, JSON.stringify(value)); } catch { /* stockage indisponible */ }
  },
};
const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

// ---------- Connexion ----------
export async function currentUser() {
  if (MODE === "demo") return { email: "données gardées sur ce téléphone" };
  const c = await client();
  const { data } = await c.auth.getSession();
  return data.session?.user ?? null;
}

export async function onAuthChange(cb) {
  if (MODE === "demo") return;
  const c = await client();
  c.auth.onAuthStateChange((_evt, session) => cb(session?.user ?? null));
}

export async function sendLoginLink(email) {
  const c = await client();
  const redirect = location.origin + location.pathname;
  check(await c.auth.signInWithOtp({ email, options: { emailRedirectTo: redirect, shouldCreateUser: false } }));
}

export async function signOut() {
  if (MODE === "demo") return;
  const c = await client();
  await c.auth.signOut();
}

// ---------- Vérifications ----------
const fromRowV = (r) => ({ id: r.id, date: r.date, type: r.type, tech: r.tech || "", note: r.note || "", items: r.items || {}, savedAt: r.updated_at });

export async function listVerifications() {
  if (MODE === "demo") return LS.read("verifications", []).sort((a, b) => (a.date < b.date ? 1 : -1));
  const c = await client();
  return check(await c.from("verifications").select("*").order("date", { ascending: false }).limit(200)).map(fromRowV);
}

// Une seule vérification par date + type de culte : on remplace si elle existe déjà.
export async function saveVerification(v) {
  if (MODE === "demo") {
    const all = LS.read("verifications", []).filter((x) => !(x.date === v.date && x.type === v.type));
    all.push({ ...v, id: uid(), savedAt: new Date().toISOString() });
    LS.write("verifications", all);
    return;
  }
  const c = await client();
  check(await c.from("verifications").upsert(
    { date: v.date, type: v.type, tech: v.tech, note: v.note, items: v.items, updated_at: new Date().toISOString() },
    { onConflict: "date,type" }
  ));
}

// ---------- Pannes ----------
const fromRowP = (r) => ({ id: r.id, item: r.item, statut: r.statut, s: r.etat, r: r.remarque || "", depuis: r.depuis, lastSeen: r.last_seen, vus: r.vus, tech: r.tech || "", repareLe: r.repare_le });

export async function listPannes() {
  if (MODE === "demo") return LS.read("pannes", []);
  const c = await client();
  return check(await c.from("pannes").select("*").order("depuis", { ascending: true }).limit(500)).map(fromRowP);
}

// Après une vérification : ajoute les nouveaux problèmes, met à jour ceux déjà ouverts.
// Renvoie le nombre de pannes ajoutées ou mises à jour.
export async function recordPannes(v, pannesActuelles) {
  const problemes = Object.entries(v.items || {}).filter(([, i]) => i.s === "bad" || i.s === "abs");
  let n = 0;
  for (const [item, i] of problemes) {
    const ouverte = pannesActuelles.find((p) => p.item === item && p.statut === "a_reparer");
    if (ouverte && ouverte.lastSeen === v.date) continue;
    if (ouverte) await updatePanne(ouverte.id, { s: i.s, r: i.r || ouverte.r, lastSeen: v.date, vus: (ouverte.vus || 1) + 1 });
    else await createPanne({ item, statut: "a_reparer", s: i.s, r: i.r || "", depuis: v.date, lastSeen: v.date, vus: 1, tech: v.tech || "" });
    n++;
  }
  return n;
}

async function createPanne(p) {
  if (MODE === "demo") {
    LS.write("pannes", [...LS.read("pannes", []), { ...p, id: uid() }]);
    return;
  }
  const c = await client();
  check(await c.from("pannes").insert({ item: p.item, statut: p.statut, etat: p.s, remarque: p.r, depuis: p.depuis, last_seen: p.lastSeen, vus: p.vus, tech: p.tech }));
}

async function updatePanne(id, patch) {
  if (MODE === "demo") {
    LS.write("pannes", LS.read("pannes", []).map((p) => (p.id === id ? { ...p, ...patch } : p)));
    return;
  }
  const row = {};
  if ("s" in patch) row.etat = patch.s;
  if ("r" in patch) row.remarque = patch.r;
  if ("lastSeen" in patch) row.last_seen = patch.lastSeen;
  if ("vus" in patch) row.vus = patch.vus;
  if ("statut" in patch) row.statut = patch.statut;
  if ("repareLe" in patch) row.repare_le = patch.repareLe;
  const c = await client();
  check(await c.from("pannes").update(row).eq("id", id));
}

export function markRepaired(id, date) {
  return updatePanne(id, { statut: "repare", repareLe: date });
}

// ---------- Réglages de la table ----------
export async function getReglages() {
  if (MODE === "demo") return LS.read("reglages", null);
  const c = await client();
  const rows = check(await c.from("reglages").select("*").eq("id", "efx8").limit(1));
  return rows[0] ? { ...rows[0].data, updatedAt: rows[0].updated_at } : null;
}

export async function saveReglages(data) {
  const updatedAt = new Date().toISOString();
  if (MODE === "demo") { LS.write("reglages", { ...data, updatedAt }); return; }
  const c = await client();
  check(await c.from("reglages").upsert({ id: "efx8", data, updated_at: updatedAt }));
}
