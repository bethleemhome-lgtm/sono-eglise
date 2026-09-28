// Écran « Pannes » : les équipements à réparer et ceux déjà réparés.
import { LABEL } from "../data.js";
import { $, el, fmtShort, daysSince, today, plural, confirmButton } from "../util.js";
import * as store from "../store.js";

export function renderPannes(pannes, refresh) {
  const open = pannes.filter((p) => p.statut === "a_reparer").sort((a, b) => (a.depuis < b.depuis ? -1 : 1));
  const done = pannes.filter((p) => p.statut === "repare").sort((a, b) => ((b.repareLe || "") < (a.repareLe || "") ? -1 : 1));

  const badge = $("badge");
  badge.hidden = !open.length;
  badge.textContent = open.length;

  const O = $("pannes-open");
  O.textContent = "";
  if (!open.length) O.append(el("p", { className: "empty", textContent: "Aucune panne en cours. Tout le matériel est en état." }));

  for (const p of open) {
    const j = daysSince(p.depuis);
    const btn = el("button", { className: "btn ghost", type: "button" });
    confirmButton(btn, "Marquer réparé", "Confirmer : réparé", async () => {
      btn.disabled = true;
      try { await store.markRepaired(p.id, today()); await refresh(); }
      catch (e) { console.error(e); btn.disabled = false; btn.textContent = "Échec, réessaie"; }
    });
    O.append(el("div", { className: "card open" + (p.s === "abs" ? " abs" : "") },
      el("div", { className: "row" },
        el("strong", { textContent: p.item }),
        el("span", { className: "chip " + (p.s === "abs" ? "abs" : "bad"), textContent: LABEL[p.s] || "Défaillant" })),
      el("span", { className: p.r ? "" : "empty", textContent: p.r || "Pas de description." }),
      el("span", { className: "days", textContent: `Depuis le ${fmtShort(p.depuis)} (${j ? plural(j, "jour") : "aujourd'hui"}) · signalé à ${plural(p.vus || 1, "culte")}` }),
      el("div", { className: "actions" }, btn)));
  }

  $("pannes-done-box").hidden = !done.length;
  $("done-count").textContent = `(${done.length})`;
  const D = $("pannes-done");
  D.textContent = "";
  for (const p of done.slice(0, 30)) {
    D.append(el("div", { className: "card done" },
      el("strong", { textContent: p.item }),
      el("span", { className: "days", textContent: `En panne le ${fmtShort(p.depuis)} · réparé le ${fmtShort(p.repareLe)}` }),
      p.r ? el("span", { className: "sub", textContent: p.r }) : null));
  }
}
