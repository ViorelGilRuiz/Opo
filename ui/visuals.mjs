import { esc } from "./components.mjs";
/** @param {import('../core/types.js').Lesson} lesson */
export function lessonVisual(lesson) {
  const key = lesson.topic + " " + lesson.category + " " + lesson.title;
  if (/Subnetting/.test(key))
    return '<section class="learning-visual"><div class="eyebrow">DESCOMPONER UNA RED · /27</div><div class="subnet-steps"><div><small>01 · Bits de host</small><b>32 − 27 = 5</b></div><div><small>02 · Direcciones</small><b>2⁵ = 32</b></div><div><small>03 · Hosts habituales</small><b>32 − 2 = 30</b></div></div><p>En una subred IPv4 convencional: una dirección de red y una de broadcast.</p></section>';
  if (/OSI/.test(key))
    return (
      '<section class="learning-visual"><div class="eyebrow">MODELO OSI · DE LA APLICACIÓN AL MEDIO</div><ol class="osi-stack">' +
      [
        "Aplicación · HTTP, DNS",
        "Presentación · formato y representación",
        "Sesión · diálogo",
        "Transporte · TCP, UDP",
        "Red · IP y routers",
        "Enlace · tramas y MAC",
        "Física · bits y señales",
      ]
        .map(
          (text, i) =>
            "<li><b>" + (7 - i) + "</b><span>" + text + "</span></li>",
        )
        .join("") +
      "</ol></section>"
    );
  if (/DNS/.test(key))
    return '<section class="learning-visual"><div class="eyebrow">DNS · CADA REGISTRO TIENE UNA FUNCIÓN</div><div class="compare-grid"><article><h3>A / AAAA</h3><p>Nombre → IPv4 / IPv6</p></article><article><h3>CNAME</h3><p>Alias → nombre canónico</p></article><article><h3>MX</h3><p>Servidor de correo del dominio</p></article><article><h3>PTR</h3><p>IP → nombre en la zona inversa</p></article></div></section>';
  if (/ARP/.test(key))
    return '<section class="learning-visual"><div class="eyebrow">ARP · RED LOCAL IPv4</div><div class="concept-diagram"><span>Dirección IPv4</span><b>→</b><span>Dirección MAC</span></div><p>Si el destino está fuera de la subred, se resuelve la MAC de la puerta de enlace.</p></section>';
  if (/ICMP/.test(key))
    return '<section class="learning-visual"><div class="eyebrow">PING · ICMP</div><div class="concept-diagram"><span>Echo Request</span><b>⇄</b><span>Echo Reply</span></div><p>ICMP no utiliza puertos TCP o UDP. Un ping bloqueado no demuestra por sí solo que el host esté apagado.</p></section>';
  if (/TCP|UDP|Transporte/.test(key))
    return '<section class="learning-visual"><div class="eyebrow">TRANSPORTE · DOS ESTRATEGIAS</div><div class="compare-grid"><article><h3>TCP</h3><p>Conexión · entrega ordenada · retransmisión</p><span class="visual-chip">Fiabilidad</span></article><article><h3>UDP</h3><p>Datagramas · sin garantía de entrega u orden</p><span class="visual-chip">Menor sobrecarga</span></article></div></section>';
  if (/SQL|Bases de datos/.test(key))
    return '<section class="terminal"><div class="terminal-top"><span>● ● ●</span> SQL · ejemplo de consulta</div><pre><code><span class="code-keyword">SELECT</span> tema, aciertos\n<span class="code-keyword">FROM</span> progreso\n<span class="code-keyword">WHERE</span> aciertos &gt;= 8;</code></pre><div class="terminal-foot">Ejemplo visual · no ejecuta consultas</div></section>';
  if (/Linux|Windows|Sistemas/.test(key))
    return (
      '<section class="terminal"><div class="terminal-top"><span>● ● ●</span> Diagnóstico · comandos de referencia</div><pre><code>' +
      (/Windows/.test(key)
        ? "PS&gt; ipconfig /all\nPS&gt; Resolve-DnsName example.com"
        : "$ ip addr\n$ ps aux\n$ ls -l") +
      '</code></pre><div class="terminal-foot">Terminal ilustrativa · no ejecuta comandos</div></section>'
    );
  return (
    '<aside class="lesson-callout"><span class="visual-chip">REGLA PARA RECORDAR</span><p>' +
    esc(lesson.rule) +
    "</p></aside>"
  );
}
