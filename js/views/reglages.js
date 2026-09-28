// Écran « Réglages » : la fiche de réglages de référence de la Soundcraft EFX8.
import { TRANCHES, CHAMPS_REGLAGE } from "../data.js";
import { $, el } from "../util.js";
import * as store from "../store.js";

const EXEMPLES = { gain: "12 h", aux: "10 h", fx: "9 h", fader: "0", note: "—" };
const NOMS = { gain: "gain", aux: "AUX1", fx: "FX", fader: "fader", note: "note" };

export function mountReglages() {
  const body = $("regl-body");
  for (const [t, src] of TRANCHES) {
    const tr = el("tr", {}, el("td", { textContent: t }), el("td", { textContent: src }));
    for (const f of CHAMPS_REGLAGE) {
      const input = el("input", { type: "text", id: `rg-${t}-${f}`, placeholder: EXEMPLES[f] });
      input.setAttribute("aria-label", `${src} : ${NOMS[f]}`);
      tr.append(el("td", {}, input));
    }
    body.append(tr);
  }
  $("btn-regl").onclick = save;
}

export function fillReglages(d) {
  if (!d) return;
  for (const [t] of TRANCHES) for (const f of CHAMPS_REGLAGE) {
    const v = d.tranches?.[t]?.[f];
    if (v != null) $(`rg-${t}-${f}`).value = v;
  }
  for (const k of ["prog", "mix", "aux"]) if (d[k] != null) $("rg-" + k).value = d[k];
  if (d.updatedAt) {
    $("regl-status").textContent = "Dernière mise à jour : " +
      new Date(d.updatedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  }
}

async function save() {
  const tranches = {};
  for (const [t] of TRANCHES) {
    tranches[t] = {};
    for (const f of CHAMPS_REGLAGE) tranches[t][f] = $(`rg-${t}-${f}`).value.trim();
  }
  const data = { tranches, prog: $("rg-prog").value.trim(), mix: $("rg-mix").value.trim(), aux: $("rg-aux").value.trim() };
  try {
    await store.saveReglages(data);
    $("regl-status").textContent = "Réglages enregistrés ✓";
  } catch (e) {
    console.error(e);
    $("regl-status").textContent = "Échec de l'enregistrement. Vérifie ta connexion et réessaie.";
  }
}
