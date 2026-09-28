// Écran « Vérification » : la check-list du matériel pour un culte.
import { EQUIPEMENT, ITEMS, LABEL, TYPES_CULTE } from "../data.js";
import { $, el, today, fmtShort, fmtLong, counts, confirmButton, plural } from "../util.js";
import * as store from "../store.js";

let state = blank();
let ctx = null; // { getPannes, refresh }

function blank() {
  return { date: today(), type: TYPES_CULTE[0], tech: "", note: "", items: {} };
}

export function mountCheck(context) {
  ctx = context;
  $("f-type").append(...TYPES_CULTE.map((t) => el("option", { value: t, textContent: t })));
  const bind = { "f-date": "date", "f-type": "type", "f-tech": "tech", "f-note": "note" };
  for (const [id, key] of Object.entries(bind)) $(id).addEventListener("input", (e) => { state[key] = e.target.value; });

  $("btn-save").onclick = save;
  $("btn-copy").onclick = copyReport;
  confirmButton($("btn-reset"), "Nouvelle vérification", "Confirmer : tout effacer ?", () => {
    state = blank(); $("report").hidden = true; status(""); render();
  });
  render();
}

// Charge une vérification existante (depuis l'historique)
export function loadVerification(v) {
  state = { ...blank(), date: v.date, type: v.type, tech: v.tech, note: v.note, items: structuredClone(v.items || {}) };
  render();
  status("Vérification chargée depuis l'historique.");
}

// Redessine la liste (sauf si quelqu'un est en train d'écrire dedans)
export function renderIfIdle() {
  if (!$("groups").contains(document.activeElement)) render();
}

function status(msg) { $("status").textContent = msg; }

function render() {
  $("f-date").value = state.date;
  $("f-type").value = state.type;
  $("f-tech").value = state.tech;
  $("f-note").value = state.note;

  const pannes = ctx.getPannes().filter((p) => p.statut === "a_reparer");
  const box = $("groups");
  box.textContent = "";
  for (const [groupe, liste] of EQUIPEMENT) {
    const sec = el("div", { className: "group" }, el("h2", { textContent: groupe }));
    for (const nom of liste) sec.append(itemRow(nom, pannes.find((p) => p.item === nom)));
    box.append(sec);
  }
  meter();
}

function itemRow(nom, panne) {
  const it = state.items[nom] || {};
  const row = el("div", { className: "item" });
  row.dataset.s = it.s || "";

  const name = el("span", { className: "name", textContent: nom });
  if (panne) name.append(" ", el("span", { className: "tag", textContent: "en panne depuis " + fmtShort(panne.depuis) }));

  const seg = el("div", { className: "seg" });
  for (const v of ["ok", "bad", "abs"]) {
    const b = el("button", { type: "button", textContent: LABEL[v] });
    b.dataset.v = v;
    b.setAttribute("aria-pressed", it.s === v ? "true" : "false");
    b.onclick = () => {
      const cur = state.items[nom] || {};
      state.items[nom] = { ...cur, s: cur.s === v ? undefined : v };
      render();
    };
    seg.append(b);
  }
  row.append(el("div", { className: "row" }, name, seg));

  if (it.s === "bad" || it.s === "abs") {
    const inp = el("input", {
      type: "text",
      id: "r-" + nom.replace(/\W+/g, "-"),
      value: it.r || "",
      placeholder: it.s === "bad" ? "Décrire le défaut (grésillement, pas de son…)" : "Où est-il ? Qui l'a ?",
    });
    inp.oninput = (e) => { state.items[nom].r = e.target.value; };
    row.append(inp);
  }
  return row;
}

function meter() {
  const c = counts(state.items), T = ITEMS.length;
  const txt = $("meter-txt");
  txt.textContent = "";
  txt.append(
    el("span", {}, el("b", { textContent: `${c.done}/${T}` }), " vérifiés"),
    el("span", { style: "color:var(--ok)" }, el("b", { textContent: c.ok }), " bon état"),
    el("span", { style: "color:var(--bad)" }, el("b", { textContent: c.bad }), " défaillant"),
    el("span", { style: "color:var(--warn)" }, el("b", { textContent: c.abs }), " absent"),
  );
  const bar = $("meter-bar");
  bar.textContent = "";
  for (const [n, color] of [[c.ok, "--ok"], [c.bad, "--bad"], [c.abs, "--warn"]]) {
    bar.append(el("i", { style: `width:${(n / T) * 100}%;background:var(${color})` }));
  }
}

async function save() {
  const btn = $("btn-save");
  btn.disabled = true;
  status("Enregistrement…");
  try {
    const v = structuredClone(state);
    await store.saveVerification(v);
    const n = await store.recordPannes(v, ctx.getPannes());
    status(n ? `Enregistré ✓ · ${plural(n, "équipement")} dans le suivi des pannes` : "Enregistré dans l'historique ✓");
    await ctx.refresh();
  } catch (e) {
    console.error(e);
    status("Échec de l'enregistrement. Vérifie ta connexion internet et réessaie.");
  } finally {
    btn.disabled = false;
  }
}

export function reportText(s) {
  const c = counts(s.items);
  let t = `RAPPORT SONO — ${s.type}\n${fmtLong(s.date)}\nTechnicien : ${s.tech || "—"}\n\n`;
  t += `${c.ok} bon état · ${c.bad} défaillant · ${c.abs} absent · ${ITEMS.length - c.done} non vérifié\n`;
  const pb = Object.entries(s.items || {}).filter(([, i]) => i.s === "bad" || i.s === "abs");
  if (pb.length) {
    t += "\nÀ SIGNALER :\n";
    for (const [n, i] of pb) t += `- ${n} : ${LABEL[i.s]}${i.r ? " — " + i.r : ""}\n`;
  } else t += "\nAucun problème signalé.\n";
  if (s.note) t += `\nRemarque : ${s.note}\n`;
  return t;
}

async function copyReport() {
  const t = reportText(state);
  const pre = $("report");
  pre.textContent = t;
  pre.hidden = false;
  // Sur téléphone, le menu « Partager » permet d'envoyer directement sur WhatsApp ou par email
  if (navigator.share) {
    try { await navigator.share({ title: "Rapport sono", text: t }); status("Rapport partagé ✓"); return; } catch { /* annulé : on copie */ }
  }
  try {
    await navigator.clipboard.writeText(t);
    status("Rapport copié. Colle-le dans un email ou WhatsApp pour le département musique.");
  } catch {
    const r = document.createRange(); r.selectNodeContents(pre);
    const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r);
    status("Texte sélectionné : fais Copier pour l'envoyer.");
  }
}
