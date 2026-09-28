// Petites fonctions utiles partagées par tous les écrans.

export const $ = (id) => document.getElementById(id);

// Crée un élément HTML : el("span", { className: "tag" }, "texte", autreElement)
export function el(tag, props = {}, ...children) {
  const node = Object.assign(document.createElement(tag), props);
  for (const c of children) if (c != null && c !== false) node.append(c);
  return node;
}

// Date du jour au format AAAA-MM-JJ (heure locale)
export function today() {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

export function fmtShort(d) {
  return d ? new Date(d + "T12:00").toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) : "—";
}
export function fmtLong(d) {
  return new Date(d + "T12:00").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}
export function daysSince(d) {
  return Math.max(0, Math.round((Date.now() - new Date(d + "T12:00")) / 864e5));
}
export const plural = (n, word) => `${n} ${word}${n > 1 ? "s" : ""}`;

// Bouton qui demande une confirmation par un second appui (pas de fenêtre popup)
export function confirmButton(btn, label, confirmLabel, action) {
  btn.textContent = label;
  btn.onclick = async () => {
    if (btn.dataset.armed !== "1") {
      btn.dataset.armed = "1";
      btn.textContent = confirmLabel;
      setTimeout(() => { btn.dataset.armed = ""; btn.textContent = label; }, 4000);
      return;
    }
    btn.dataset.armed = "";
    btn.textContent = label;
    await action();
  };
}

// Compte les états d'une vérification
export function counts(items) {
  let ok = 0, bad = 0, abs = 0;
  for (const i of Object.values(items || {})) {
    if (i.s === "ok") ok++; else if (i.s === "bad") bad++; else if (i.s === "abs") abs++;
  }
  return { ok, bad, abs, done: ok + bad + abs };
}
