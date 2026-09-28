// Écran « Historique » : les vérifications enregistrées.
import { LABEL } from "../data.js";
import { $, el, counts } from "../util.js";

export function renderHistorique(verifs, onOpen) {
  const L = $("hist-list");
  L.textContent = "";
  if (!verifs.length) {
    L.append(el("p", { className: "empty", textContent: "Aucune vérification enregistrée pour l'instant." }));
    return;
  }
  for (const v of verifs) {
    const c = counts(v.items);
    const pb = Object.entries(v.items || {}).filter(([, i]) => i.s === "bad" || i.s === "abs");
    const open = el("button", { className: "btn ghost", type: "button", textContent: "Ouvrir" });
    open.onclick = () => onOpen(v);
    L.append(el("div", { className: "card" },
      el("div", { className: "row" },
        el("strong", { textContent: v.type }),
        el("span", { className: "mono", textContent: new Date(v.date + "T12:00").toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }) })),
      el("span", { className: "sub", textContent: "Technicien : " + (v.tech || "—") }),
      el("div", { className: "chips" },
        el("span", { className: "chip ok", textContent: `${c.ok} bon` }),
        el("span", { className: "chip bad", textContent: `${c.bad} défaillant` }),
        el("span", { className: "chip abs", textContent: `${c.abs} absent` })),
      pb.length ? el("ul", { className: "defauts" }, ...pb.map(([n, i]) => el("li", { textContent: `${n} : ${LABEL[i.s]}${i.r ? " — " + i.r : ""}` }))) : null,
      el("div", { className: "actions" }, open)));
  }
}
