// Onglet « Infos & formation » : contenu fixe (schéma, plan des tranches, réglages, dépannage).
// Pour modifier un texte, change-le directement ici.
export const INFOS_HTML = `
<nav class="toc" aria-label="Sommaire">
      <a href="#schema">Schéma de câblage</a><a href="#patch">Plan des tranches</a><a href="#efx8">Réglages EFX8</a><a href="#allumage">Allumage / extinction</a><a href="#depannage">Dépannage</a><a href="#pratiques">Bonnes pratiques</a>
    </nav>

    <article class="block" id="schema">
      <h2>Schéma de câblage</h2>
      <p>Le son part de la scène, passe par la table de mixage, puis va vers les amplis et les colonnes.</p>
      <div class="svgbox">
      <svg viewBox="0 0 360 620" role="img" aria-labelledby="svgt">
        <title id="svgt">Chemin du son : micros et piano vers la table de mixage, puis amplis façade et retour vers les colonnes</title>
        <defs><marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="ah"/></marker></defs>
        <g class="zone"><rect x="4" y="4" width="352" height="66" rx="6"/><text x="12" y="18">SCÈNE</text></g>
        <g class="n"><rect x="12" y="24" width="160" height="40" rx="5"/><text x="92" y="41">Micros filaires ×3</text><text x="92" y="56" class="s">sur pieds</text></g>
        <g class="n"><rect x="188" y="24" width="160" height="40" rx="5"/><text x="268" y="41">Kick + caisse claire</text><text x="268" y="56" class="s">batterie</text></g>
        <line x1="92" y1="64" x2="150" y2="102" class="w" marker-end="url(#ar)"/><line x1="268" y1="64" x2="210" y2="102" class="w" marker-end="url(#ar)"/>
        <text x="100" y="92" class="c">XLR</text><text x="244" y="92" class="c">XLR</text>
        <g class="n k"><rect x="100" y="104" width="160" height="40" rx="5"/><text x="180" y="121">Snake 16 pistes</text><text x="180" y="136" class="s">boîtier de scène</text></g>
        <g class="n"><rect x="8" y="184" width="150" height="46" rx="5"/><text x="83" y="202">Récepteurs HF ×3</text><text x="83" y="218" class="s">Shure + 2 Sennheiser</text></g>
        <g class="n"><rect x="202" y="184" width="150" height="46" rx="5"/><text x="277" y="202">Piano Yamaha S750</text><text x="277" y="218" class="s">L/R → STE1</text></g>
        <line x1="180" y1="144" x2="180" y2="270" class="w" marker-end="url(#ar)"/><text x="186" y="170" class="c" text-anchor="start">multipaire</text>
        <line x1="83" y1="230" x2="130" y2="270" class="w" marker-end="url(#ar)"/><line x1="277" y1="230" x2="230" y2="270" class="w" marker-end="url(#ar)"/>
        <text x="70" y="256" class="c">XLR</text><text x="290" y="256" class="c">jack</text>
        <g class="zone"><rect x="4" y="262" width="352" height="96" rx="6"/><text x="12" y="276">RÉGIE</text></g>
        <g class="n k main"><rect x="60" y="272" width="240" height="54" rx="5"/><text x="180" y="294">Soundcraft EFX8</text><text x="180" y="312" class="s">8 micros + 2 stéréo + effets</text></g>
        <text x="100" y="344" class="o">MIX L/R</text><text x="260" y="344" class="o">AUX 1 (retour)</text>
        <line x1="100" y1="326" x2="100" y2="392" class="w" marker-end="url(#ar)"/><line x1="260" y1="326" x2="260" y2="392" class="w" marker-end="url(#ar)"/>
        <text x="106" y="376" class="c" text-anchor="start">XLR (MIX L/R)</text><text x="266" y="376" class="c" text-anchor="start">jack (AUX1 OUT)</text>
        <g class="n"><rect x="20" y="394" width="160" height="46" rx="5"/><text x="100" y="412">Ampli façade</text><text x="100" y="428" class="s">4000 W</text></g>
        <g class="n"><rect x="190" y="394" width="150" height="46" rx="5"/><text x="265" y="412">Ampli retour MAX</text><text x="265" y="428" class="s">2000 W</text></g>
        <line x1="70" y1="440" x2="56" y2="486" class="w" marker-end="url(#ar)"/><line x1="130" y1="440" x2="144" y2="486" class="w" marker-end="url(#ar)"/><line x1="265" y1="440" x2="265" y2="486" class="w" marker-end="url(#ar)"/>
        <text x="100" y="470" class="c">Speakon</text><text x="271" y="470" class="c" text-anchor="start">Speakon</text>
        <g class="zone"><rect x="4" y="480" width="352" height="64" rx="6"/></g>
        <g class="n sp"><rect x="12" y="488" width="84" height="46" rx="5"/><text x="54" y="506">Colonne</text><text x="54" y="522" class="s">façade G</text></g>
        <g class="n sp"><rect x="104" y="488" width="84" height="46" rx="5"/><text x="146" y="506">Colonne</text><text x="146" y="522" class="s">façade D</text></g>
        <g class="n sp"><rect x="216" y="488" width="98" height="46" rx="5"/><text x="265" y="506">Colonne</text><text x="265" y="522" class="s">retour (scène)</text></g>
        <g class="pw"><rect x="4" y="560" width="352" height="54" rx="6"/><text x="180" y="580">⚡ Rallonge 1 : table + récepteurs HF + piano</text><text x="180" y="600">⚡ Rallonge 2 : ampli façade + ampli retour</text></g>
      </svg>
      </div>
      <p class="note">Les deux amplis sur une rallonge à part évitent que leur appel de courant fasse grésiller la table. Si possible, branche cette rallonge sur une prise murale différente.</p>
    </article>

    <article class="block" id="patch">
      <h2>Plan des tranches – Soundcraft EFX8</h2>
      <p>Toujours brancher chaque source sur la même tranche : l'équipe retrouve ses réglages d'un culte à l'autre. Tes 8 micros remplissent exactement les 8 tranches micro.</p>
      <div class="tbl"><table>
        <thead><tr><th>Tranche</th><th>Source</th><th>Branchement</th></tr></thead>
        <tbody>
          <tr><td>1</td><td>Kick</td><td>Snake 1 → XLR MIC 1</td></tr>
          <tr><td>2</td><td>Caisse claire</td><td>Snake 2 → XLR MIC 2</td></tr>
          <tr><td>3</td><td>Micro filaire 1</td><td>Snake 3 → XLR MIC 3</td></tr>
          <tr><td>4</td><td>Micro filaire 2</td><td>Snake 4 → XLR MIC 4</td></tr>
          <tr><td>5</td><td>Micro filaire 3</td><td>Snake 5 → XLR MIC 5</td></tr>
          <tr><td>6</td><td>HF lead Sennheiser 1</td><td>Récepteur → XLR MIC 6</td></tr>
          <tr><td>7</td><td>HF lead Sennheiser 2</td><td>Récepteur → XLR MIC 7</td></tr>
          <tr><td>8</td><td>HF pupitre Shure</td><td>Récepteur → XLR MIC 8</td></tr>
          <tr><td>STE1</td><td>Piano Yamaha S750</td><td>Jack L + R (ou L seul = mono)</td></tr>
          <tr><td>STE2</td><td>Libre</td><td>Ordinateur, téléphone (playback)</td></tr>
        </tbody>
      </table></div>
      <p class="note">Sorties : MIX L/R (XLR, en haut à droite) vers l'ampli façade 4000 W ; AUX1 OUT (jack) vers l'ampli retour MAX 2000 W.</p>
    </article>

    <article class="block" id="efx8">
      <h2>Ta table : réglages clés de l'EFX8</h2>
      <ul>
        <li><strong>GAIN (bouton rouge)</strong> : fais parler ou jouer la personne, monte le gain jusqu'à ce que le voyant <em>PEAK</em> clignote rarement, puis redescends un peu. Il ne doit jamais rester allumé.</li>
        <li><strong>PFL</strong> : appuie sur PFL d'une tranche pour voir son niveau seul sur les vu-mètres (le voyant AFL/PFL ACTIVE s'allume). Pense à le relâcher.</li>
        <li><strong>AUX1 (bouton turquoise)</strong> = ce que les musiciens entendent dans la colonne retour. Mets le commutateur <strong>PRE</strong> (près de POWER) : le retour ne change pas quand tu bouges les faders.</li>
        <li><strong>FX (bouton violet) + effets Lexicon</strong> : pour une réverbération sur les voix, choisis un programme <em>PLATE</em> ou <em>HALL</em> avec PROGRAM SELECT, puis monte un peu le FX des micros chant (tranches 3 à 8). Laisse le kick et la caisse claire à zéro.</li>
        <li><strong>PHANTOM 48V</strong> : il s'applique aux 8 tranches à la fois. Tes micros dynamiques et tes récepteurs HF n'en ont pas besoin. Laisse-le éteint, sauf si un micro batterie est un statique (à condensateur).</li>
        <li><strong>MUTE (bouton rouge)</strong> : coupe une tranche sans perdre son réglage, pratique entre deux parties du culte.</li>
      </ul>
    </article>

    <article class="block" id="allumage">
      <h2>Allumage et extinction</h2>
      <div class="two">
        <div><h3>Allumer</h3><ol>
          <li>Faders à zéro (surtout MIX L/R jaunes), 48V éteint, amplis coupés.</li>
          <li>Allumer la rallonge 1 : table, récepteurs HF, piano.</li>
          <li>Allumer les micros HF (piles chargées).</li>
          <li>Allumer les amplis <strong>en dernier</strong>, volumes à zéro, puis monter doucement.</li>
        </ol></div>
        <div><h3>Éteindre</h3><ol>
          <li>Baisser les faders MIX L/R (jaunes).</li>
          <li>Éteindre les amplis <strong>en premier</strong>.</li>
          <li>Éteindre la table, les récepteurs HF et le piano.</li>
          <li>Éteindre les micros HF et retirer les piles.</li>
        </ol></div>
      </div>
      <p class="note">Règle simple : les amplis s'allument en dernier et s'éteignent en premier. Sinon, le « poc » d'allumage de la table part dans les colonnes et peut abîmer les haut-parleurs.</p>
    </article>

    <article class="block" id="depannage">
      <h2>Dépannage rapide</h2>
      <details><summary>Un micro HF ne donne pas de son</summary><ul>
        <li>Le micro est-il allumé et pas en « mute » ? Les piles sont-elles chargées ?</li>
        <li>Le récepteur affiche-t-il du signal (voyant RF / AF) quand on parle ?</li>
        <li>Micro et récepteur sont-ils sur le même canal / la même fréquence ?</li>
        <li>Sur la table : tranche pas en mute, gain monté, fader levé.</li>
      </ul></details>
      <details><summary>Larsen (sifflement)</summary><ul>
        <li>Baisser le fader du micro concerné, puis le volume du retour (AUX 1).</li>
        <li>Ne jamais pointer un micro vers une colonne façade ou la colonne retour.</li>
        <li>Placer les colonnes façade <strong>devant</strong> la ligne des micros.</li>
      </ul></details>
      <details><summary>Grésillement ou son qui coupe</summary><ul>
        <li>Bouger doucement le câble XLR : si ça grésille, changer le câble.</li>
        <li>Vérifier que les connecteurs du snake sont bien enfoncés (clic).</li>
        <li>Éloigner les câbles audio des rallonges électriques.</li>
      </ul></details>
      <details><summary>Pas de son du tout en façade</summary><ul>
        <li>Faders MIX L/R (jaunes) levés ? Vu-mètres qui bougent ?</li>
        <li>Ampli façade allumé, volume ouvert, protection (clip/protect) éteinte ?</li>
        <li>Câbles Speakon bien verrouillés (tourner d'un quart de tour).</li>
      </ul></details>
      <details><summary>Pas de son dans le retour</summary><ul>
        <li>Le bouton AUX 1 est-il monté sur les tranches que les musiciens veulent entendre ?</li>
        <li>Bouton LEVEL de AUX1 OUT monté (en haut à droite), ampli retour MAX allumé ?</li>
      </ul></details>
    </article>

    <article class="block" id="pratiques">
      <h2>Bonnes pratiques</h2>
      <ul>
        <li><strong>Gain d'abord, fader ensuite</strong> : régler le gain pendant que la personne parle ou joue normalement, puis ajuster le volume au fader.</li>
        <li><strong>Enrouler les câbles en « over-under »</strong> (une boucle normale, une boucle retournée) : ils durent beaucoup plus longtemps.</li>
        <li><strong>Piles</strong> : toujours avoir un jeu de piles neuves pour les 3 micros HF.</li>
        <li><strong>Balance</strong> : faire un test son 30 min avant le culte, avec chaque micro et le piano.</li>
        <li><strong>Après le culte</strong> : couvrir la table (poussière), ranger les micros dans leurs housses.</li>
      </ul>
    </article>
`;
