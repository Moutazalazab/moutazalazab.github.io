/* "Inside a digital forensics investigation": original animated illustrations (English + Arabic). */
(function () {
  var host = document.getElementById('fx-story'); if (!host) return;
  var AR = !!document.querySelector('.page[dir="rtl"]');
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;

  var css = document.createElement('style');
  css.textContent =
    '.fx{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(0,1fr);gap:22px;align-items:center}' +
    '@media (max-width:860px){.fx{grid-template-columns:minmax(0,1fr)}}' +
    '.fx-stage{position:relative;border-radius:16px;overflow:hidden;background:linear-gradient(160deg,#0b1531,#132a63 70%,#173a8a);box-shadow:0 14px 34px rgba(11,21,49,.25);aspect-ratio:52/32;max-width:100%}' +
    '.fx-stage svg{display:block;width:100%;height:100%}' +
    '.fx-cap{position:absolute;inset-inline-start:14px;top:12px;font:700 .72rem ui-monospace,Menlo,monospace;letter-spacing:.12em;color:#9fe9f3;background:rgba(0,0,0,.28);padding:4px 9px;border-radius:6px;direction:ltr}' +
    '.fx-steps{display:flex;flex-direction:column;gap:8px}' +
    '.fx-step{all:unset;box-sizing:border-box;cursor:pointer;display:grid;grid-template-columns:36px minmax(0,1fr);gap:12px;align-items:start;padding:11px 13px;border-radius:12px;border:1px solid var(--line,#e3e7f1);background:var(--surface-2,#f5f7fc);color:var(--ink,#111827);transition:border-color .2s,background .2s}' +
    '.fx-step:hover{border-color:var(--accent,#00a7bf)}' +
    '.fx-step:focus-visible{outline:2px solid var(--accent,#00a7bf);outline-offset:2px}' +
    '.fx-step[aria-selected="true"]{border-color:var(--accent,#00a7bf);background:var(--tint,rgba(0,167,191,.09))}' +
    '.fx-step .n{width:32px;height:32px;border-radius:50%;display:grid;place-items:center;font-weight:800;font-size:.9rem;background:var(--line,#e3e7f1);color:var(--head,#122a63)}' +
    '.fx-step[aria-selected="true"] .n{background:var(--navy-2,#122a63);color:#fff}' +
    '.fx-step b{display:block;font-size:.98rem;color:var(--head,#122a63)}' +
    '.fx-step span.d{display:none;font-size:.88rem;color:var(--ink-2,#4a5468);margin-top:3px;line-height:1.5}' +
    '.fx-step[aria-selected="true"] span.d{display:block}' +
    '.fx-ctrl{display:flex;gap:8px;align-items:center;margin-top:10px;flex-wrap:wrap}' +
    '.fx-ctrl button{border:1px solid var(--line,#e3e7f1);background:var(--surface,#fff);color:var(--head,#122a63);font:700 .82rem inherit;font-family:inherit;padding:7px 13px;border-radius:8px;cursor:pointer}' +
    '.fx-prog{flex:1;min-width:80px;height:5px;border-radius:3px;background:var(--line,#e3e7f1);overflow:hidden}' +
    '.fx-prog i{display:block;height:100%;width:0;background:var(--accent,#00a7bf)}' +
    /* svg animation classes */
    '@keyframes fxBlink{0%,100%{opacity:1}50%{opacity:.15}}.fx-blink{animation:fxBlink 1.1s infinite}' +
    '@keyframes fxScan{0%{transform:translateY(0)}100%{transform:translateY(150px)}}.fx-scan{animation:fxScan 2.4s linear infinite alternate}' +
    '@keyframes fxBar{0%{width:0}85%,100%{width:230px}}.fx-bar{animation:fxBar 3.2s ease-out infinite}' +
    '@keyframes fxFade{0%,40%{opacity:0}60%,100%{opacity:1}}.fx-late{animation:fxFade 3.2s infinite}' +
    '@keyframes fxFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}.fx-float{animation:fxFloat 3s ease-in-out infinite}' +
    '@keyframes fxDash{to{stroke-dashoffset:-24}}.fx-flow{stroke-dasharray:6 6;animation:fxDash 1s linear infinite}' +
    '@keyframes fxPop{0%,20%{transform:scale(0);opacity:0}35%,100%{transform:scale(1);opacity:1}}.fx-pop{transform-box:fill-box;transform-origin:center;animation:fxPop 3.2s infinite}' +
    '@keyframes fxGrow{0%{transform:scaleX(0)}60%,100%{transform:scaleX(1)}}.fx-grow{transform-box:fill-box;transform-origin:left;animation:fxGrow 3.6s ease-out infinite}' +
    '@media (prefers-reduced-motion:reduce){.fx-stage *{animation:none!important}.fx-late,.fx-pop{opacity:1}.fx-bar{width:230px}}';
  document.head.appendChild(css);

  var T = AR ? {
    title: 'مراحل التحقيق الجنائي الرقمي', play: 'تشغيل', pause: 'إيقاف', prev: 'السابق', next: 'التالي',
    steps: [
      ['تحديد الأدلة وضبطها', 'تُحدَّد الأجهزة والحسابات ذات الصلة، وتوضع في أكياس أدلة مختومة مع بطاقة تعريف لكل دليل.'],
      ['الحفظ ومنع التعديل', 'يُوصل الجهاز عبر مانع كتابة (Write Blocker) حتى لا يتغيّر أي بت أثناء الفحص.'],
      ['النسخ الجنائي والبصمة الرقمية', 'تُنشأ نسخة طبق الأصل من الجهاز، وتُحسب بصمة SHA-256 للأصل والنسخة للتأكد من تطابقهما.'],
      ['التحليل والاستعادة', 'تُفحص الملفات والسجلات ورسائل واتساب والبريد، وتُستعاد الرسائل المحذوفة وتُكتشف البرمجيات الخبيثة.'],
      ['إعادة بناء التسلسل الزمني', 'تُرتّب الأحداث زمنياً: متى دخل المهاجم، ومتى أُرسلت الرسالة، ومتى حُوّلت الأموال.'],
      ['التقرير والشهادة', 'يُعدّ تقرير خبرة واضح بالعربية أو الإنجليزية، ويشرح الخبير نتائجه أمام المحكمة.']
    ],
    lbl: { exhibit: 'دليل', case: 'قضية', sealed: 'مختوم', wb: 'مانع كتابة', ro: 'قراءة فقط', src: 'الأصل', img: 'النسخة', match: 'متطابقة', rec: 'رسالة محذوفة مُستعادة', mal: 'برمجية خبيثة', t: ['دخول', 'بريد مزوّر', 'تحويل', 'اكتشاف'], rep: 'تقرير الخبرة', court: 'المحكمة' }
  } : {
    title: 'Inside a digital forensics investigation', play: 'Play', pause: 'Pause', prev: 'Previous', next: 'Next',
    steps: [
      ['Identify and seize', 'The relevant devices and accounts are identified and sealed in evidence bags, each with its own exhibit label.'],
      ['Preserve without changing', 'The device is connected through a hardware write blocker, so not a single bit changes during examination.'],
      ['Forensic image and hash', 'An exact copy of the device is made, and SHA-256 fingerprints of the original and the copy prove they match.'],
      ['Analyse and recover', 'Files, logs, WhatsApp chats and emails are examined; deleted messages are recovered and malware is identified.'],
      ['Reconstruct the timeline', 'Events are put in order: when the attacker got in, when the email was sent, when the money moved.'],
      ['Report and testify', 'A clear expert report is written in Arabic or English, and the findings are explained to the court.']
    ],
    lbl: { exhibit: 'EXHIBIT', case: 'CASE', sealed: 'SEALED', wb: 'WRITE BLOCKER', ro: 'READ-ONLY', src: 'ORIGINAL', img: 'IMAGE', match: 'MATCH', rec: 'Deleted message recovered', mal: 'Malware found', t: ['Login', 'Forged email', 'Transfer', 'Discovery'], rep: 'EXPERT REPORT', court: 'COURT' }
  };
  var L = T.lbl, F = 'font-family="ui-monospace,Menlo,monospace"', S = 'font-family="IBM Plex Sans,IBM Plex Sans Arabic,system-ui,sans-serif"';
  var grid = '<g opacity=".08" stroke="#9fe9f3">' + Array.from({ length: 13 }, function (_, i) { return '<line x1="' + i * 40 + '" y1="0" x2="' + i * 40 + '" y2="320"/>'; }).join('') + Array.from({ length: 8 }, function (_, i) { return '<line x1="0" y1="' + i * 40 + '" x2="520" y2="' + i * 40 + '"/>'; }).join('') + '</g>';

  var scenes = [
    // 1 evidence bag
    grid + '<g class="fx-float"><rect x="140" y="50" width="240" height="220" rx="10" fill="#dfe8f5" opacity=".95"/><rect x="140" y="50" width="240" height="34" rx="10" fill="#c0392b"/><rect x="140" y="70" width="240" height="14" fill="#c0392b"/>' +
      '<text x="260" y="73" text-anchor="middle" fill="#fff" ' + S + ' font-weight="800" font-size="13" letter-spacing="2">' + L.sealed + '</text>' +
      '<rect x="168" y="104" width="86" height="140" rx="12" fill="#1b2a4a"/><rect x="175" y="114" width="72" height="116" rx="6" fill="#2d4a86"/><circle cx="211" cy="236" r="4" fill="#556"/>' +
      '<g fill="#9fe9f3" opacity=".8"><rect x="183" y="126" width="44" height="7" rx="3"/><rect x="183" y="140" width="56" height="7" rx="3"/><rect x="195" y="154" width="44" height="7" rx="3"/></g>' +
      '<rect x="266" y="104" width="96" height="70" rx="6" fill="#fff" stroke="#8a1538" stroke-width="2"/><text x="276" y="124" fill="#8a1538" ' + F + ' font-size="11" font-weight="700">' + L.exhibit + ' MA-01</text>' +
      '<text x="276" y="141" fill="#334" ' + F + ' font-size="9">' + L.case + ' 2026/346</text><line x1="276" y1="152" x2="352" y2="152" stroke="#99a" /><line x1="276" y1="164" x2="340" y2="164" stroke="#99a"/>' +
      '<g transform="translate(270 188)"><rect width="88" height="54" rx="4" fill="#27324d"/><rect x="5" y="5" width="78" height="40" rx="2" fill="#3d5a99"/><rect x="-6" y="54" width="100" height="6" rx="2" fill="#1b2a4a"/></g></g>' +
      '<g class="fx-blink"><circle cx="420" cy="70" r="6" fill="#c9a227"/></g>',
    // 2 write blocker
    grid + '<g><rect x="40" y="120" width="110" height="80" rx="8" fill="#2d3b5c" stroke="#9fe9f3" stroke-opacity=".4"/><circle cx="95" cy="160" r="26" fill="#1b2a4a" stroke="#9fe9f3" stroke-opacity=".5"/><circle cx="95" cy="160" r="5" fill="#9fe9f3"/><line x1="95" y1="160" x2="115" y2="146" stroke="#9fe9f3" stroke-width="3"/>' +
      '<text x="95" y="218" text-anchor="middle" fill="#cfe0ff" ' + S + ' font-size="11">' + L.src + '</text></g>' +
      '<path d="M150 160 H205" stroke="#00bcd4" stroke-width="4" class="fx-flow" fill="none"/>' +
      '<g><rect x="205" y="118" width="120" height="84" rx="10" fill="#c9a227"/><rect x="215" y="128" width="100" height="26" rx="4" fill="#0b1531"/><text x="265" y="146" text-anchor="middle" fill="#f4e4b0" ' + F + ' font-size="10" font-weight="700">' + L.wb + '</text>' +
      '<circle cx="232" cy="178" r="6" fill="#2ecc71" class="fx-blink"/><circle cx="252" cy="178" r="6" fill="#e74c3c"/><text x="300" y="182" text-anchor="middle" fill="#0b1531" ' + F + ' font-size="9" font-weight="700">' + L.ro + '</text></g>' +
      '<path d="M325 160 H375" stroke="#00bcd4" stroke-width="4" class="fx-flow" fill="none"/>' +
      '<g><rect x="375" y="96" width="110" height="80" rx="6" fill="#1b2a4a" stroke="#9fe9f3" stroke-opacity=".5"/><rect x="383" y="104" width="94" height="62" rx="3" fill="#0e1f44"/>' +
      '<g fill="#2ecc71" ' + F + ' font-size="7"><text x="389" y="118">$ fls -r /dev/sdb</text><text x="389" y="130" class="fx-late">r/r 1204: invoice.pdf</text><text x="389" y="142" class="fx-late">r/r 1205: chat.db</text><text x="389" y="154" class="fx-late">-/r * 1310: deleted.eml</text></g>' +
      '<rect x="415" y="176" width="30" height="16" fill="#27324d"/><rect x="395" y="192" width="70" height="6" rx="2" fill="#27324d"/></g>' +
      '<g transform="translate(250 60)"><g class="fx-float"><rect x="0" y="12" width="30" height="24" rx="4" fill="#9fe9f3"/><path d="M6 12 V6 a9 9 0 0 1 18 0 V12" fill="none" stroke="#9fe9f3" stroke-width="4"/></g></g>',
    // 3 imaging + hash
    grid + '<g><rect x="50" y="70" width="120" height="150" rx="10" fill="#2d3b5c"/><circle cx="110" cy="130" r="42" fill="#1b2a4a" stroke="#9fe9f3" stroke-opacity=".4"/><circle cx="110" cy="130" r="8" fill="#9fe9f3"/>' +
      '<text x="110" y="205" text-anchor="middle" fill="#cfe0ff" ' + S + ' font-size="11">' + L.src + '</text></g>' +
      '<g><rect x="350" y="70" width="120" height="150" rx="10" fill="#2d3b5c"/><circle cx="410" cy="130" r="42" fill="#1b2a4a" stroke="#c9a227" stroke-opacity=".6"/><circle cx="410" cy="130" r="8" fill="#c9a227"/>' +
      '<text x="410" y="205" text-anchor="middle" fill="#f4e4b0" ' + S + ' font-size="11">' + L.img + '</text></g>' +
      '<g ' + F + ' font-size="10" fill="#9fe9f3" opacity=".7"><text x="190" y="110">0110 1001 0011</text><text x="196" y="126" class="fx-late">1010 0111 0101</text><text x="190" y="142">0011 1100 1010</text></g>' +
      '<rect x="145" y="240" width="230" height="10" rx="5" fill="#1b2a4a"/><rect x="145" y="240" height="10" rx="5" fill="#00bcd4" class="fx-bar"/>' +
      '<g class="fx-late"><text x="260" y="276" text-anchor="middle" fill="#cfe0ff" ' + F + ' font-size="10">SHA-256 9f86d081…b0f00a08</text><text x="260" y="292" text-anchor="middle" fill="#cfe0ff" ' + F + ' font-size="10">SHA-256 9f86d081…b0f00a08</text></g>' +
      '<g class="fx-pop"><circle cx="260" cy="60" r="22" fill="#1f8a5b"/><path d="M249 60 l8 8 l15 -16" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/></g><text x="260" y="100" text-anchor="middle" fill="#7ef0b0" ' + S + ' font-size="12" font-weight="800" class="fx-late">' + L.match + '</text>',
    // 4 analysis
    grid + '<g><rect x="30" y="40" width="282" height="240" rx="10" fill="#0e1f44" stroke="#9fe9f3" stroke-opacity=".25"/>' +
      Array.from({ length: 12 }, function (_, i) { var y = 64 + i * 18; var hx = ['4d 5a 90 00 03 00', '50 4b 03 04 14 00', '7b 22 6d 73 67 22', '64 65 6c 65 74 65', '68 74 74 70 3a 2f', '00 00 ff ff 00 00'][i % 6]; return '<text x="40" y="' + y + '" fill="' + (i === 5 ? '#ffd166' : '#6f8fc9') + '" ' + F + ' font-size="9">' + (1024 + i * 16).toString(16).padStart(6, '0') + '  ' + hx + ' ' + hx.split(' ').reverse().join(' ') + '</text>'; }).join('') +
      '<rect x="34" y="150" width="274" height="16" fill="#ffd166" opacity=".15"/><rect x="34" y="54" width="274" height="16" fill="#00bcd4" opacity=".18" class="fx-scan"/></g>' +
      '<g transform="translate(262 150)"><circle r="46" fill="none" stroke="#c9a227" stroke-width="8"/><circle r="40" fill="#9fe9f3" opacity=".12"/><line x1="32" y1="32" x2="70" y2="70" stroke="#c9a227" stroke-width="12" stroke-linecap="round"/></g>' +
      '<g class="fx-pop"><rect x="318" y="60" width="192" height="54" rx="12" fill="#1f9d55"/><text x="330" y="82" fill="#fff" ' + S + ' font-size="10" font-weight="700">💬 ' + L.rec + '</text><text x="330" y="100" fill="#d7ffe7" ' + S + ' font-size="10">“…transfer to the new account”</text></g>' +
      '<g class="fx-late"><rect x="318" y="140" width="192" height="54" rx="12" fill="#c0392b"/><text x="330" y="163" fill="#fff" ' + S + ' font-size="11" font-weight="700">⚠ ' + L.mal + '</text><text x="330" y="181" fill="#ffdcd7" ' + F + ' font-size="9">Trojan.Agent · update.exe</text></g>',
    // 5 timeline
    grid + '<line x1="50" y1="170" x2="470" y2="170" stroke="#9fe9f3" stroke-opacity=".5" stroke-width="3"/><line x1="50" y1="170" x2="470" y2="170" stroke="#00bcd4" stroke-width="3" class="fx-grow"/>' +
      [[90, '#6f8fc9', '09:02', 0], [200, '#c9a227', '09:11', 1], [320, '#c0392b', '10:47', 2], [430, '#1f8a5b', '13:30', 3]].map(function (e, i) {
        var up = i % 2 === 0, y = up ? 80 : 200;
        return '<g class="fx-pop" style="animation-delay:' + (i * .35) + 's"><circle cx="' + e[0] + '" cy="170" r="11" fill="' + e[1] + '" stroke="#0b1531" stroke-width="3"/>' +
          '<line x1="' + e[0] + '" y1="' + (up ? 159 : 181) + '" x2="' + e[0] + '" y2="' + (up ? 128 : 200) + '" stroke="' + e[1] + '" stroke-width="2"/>' +
          '<rect x="' + (e[0] - 52) + '" y="' + y + '" width="104" height="48" rx="8" fill="#12224a" stroke="' + e[1] + '"/>' +
          '<text x="' + e[0] + '" y="' + (y + 20) + '" text-anchor="middle" fill="#fff" ' + F + ' font-size="11" font-weight="700">' + e[2] + '</text>' +
          '<text x="' + e[0] + '" y="' + (y + 37) + '" text-anchor="middle" fill="#cfe0ff" ' + S + ' font-size="11">' + L.t[e[3]] + '</text></g>';
      }).join(''),
    // 6 report + court
    grid + '<g class="fx-float"><rect x="70" y="50" width="170" height="220" rx="8" fill="#f7f9fd"/><rect x="70" y="50" width="170" height="36" rx="8" fill="#122a63"/><rect x="70" y="72" width="170" height="14" fill="#122a63"/>' +
      '<text x="155" y="74" text-anchor="middle" fill="#fff" ' + S + ' font-size="11" font-weight="800" letter-spacing="1">' + L.rep + '</text>' +
      '<g fill="#c5cee0"><rect x="88" y="104" width="134" height="7" rx="3"/><rect x="88" y="120" width="116" height="7" rx="3"/><rect x="88" y="136" width="126" height="7" rx="3"/><rect x="88" y="152" width="96" height="7" rx="3"/><rect x="88" y="176" width="134" height="7" rx="3"/><rect x="88" y="192" width="108" height="7" rx="3"/></g>' +
      '<g transform="translate(196 236)"><g class="fx-pop"><circle r="22" fill="#c9a227"/><circle r="16" fill="none" stroke="#fff" stroke-width="2"/><text y="4" text-anchor="middle" fill="#fff" ' + F + ' font-size="9" font-weight="800">346</text></g></g>' +
      '<path d="M92 240 q10 -12 20 0 t20 0" stroke="#122a63" stroke-width="2" fill="none"/></g>' +
      '<g transform="translate(290 70)"><polygon points="90,0 180,40 0,40" fill="#dfe8f5"/><rect x="0" y="40" width="180" height="12" fill="#c5d3ea"/>' +
      [16, 52, 88, 124, 160].map(function (x) { return '<rect x="' + (x - 7) + '" y="56" width="14" height="110" fill="#dfe8f5"/>'; }).join('') +
      '<rect x="-8" y="166" width="196" height="14" fill="#c5d3ea"/><rect x="-16" y="180" width="212" height="12" fill="#dfe8f5"/>' +
      '<text x="90" y="32" text-anchor="middle" fill="#122a63" ' + S + ' font-size="11" font-weight="800" letter-spacing="2">' + L.court + '</text></g>' +
      '<g transform="translate(250 190) rotate(-30)"><g class="fx-float"><rect x="-8" y="-40" width="16" height="70" rx="4" fill="#8a5a2b"/><rect x="-26" y="-58" width="52" height="24" rx="6" fill="#a06a35"/></g></g>'
  ];

  host.innerHTML = '<div class="fx"><div class="fx-stage" id="fx-stage"><span class="fx-cap" id="fx-cap"></span></div><div><div class="fx-steps" role="tablist" aria-label="' + T.title + '">' +
    T.steps.map(function (s, i) { return '<button type="button" class="fx-step" role="tab" aria-selected="' + (i === 0) + '" data-i="' + i + '"><span class="n">' + (i + 1) + '</span><span><b>' + s[0] + '</b><span class="d">' + s[1] + '</span></span></button>'; }).join('') +
    '</div><div class="fx-ctrl"><button type="button" id="fx-prev">' + T.prev + '</button><button type="button" id="fx-play">' + (RM ? T.play : T.pause) + '</button><button type="button" id="fx-next">' + T.next + '</button><span class="fx-prog"><i id="fx-bar"></i></span></div></div></div>';

  var stage = document.getElementById('fx-stage'), cap = document.getElementById('fx-cap'), cur = 0, playing = !RM, timer = null, t0 = 0, DUR = 6000;
  function show(i) {
    cur = (i + scenes.length) % scenes.length;
    var old = stage.querySelector('svg'); if (old) old.remove();
    stage.insertAdjacentHTML('beforeend', '<svg viewBox="0 0 520 320" style="direction:ltr" role="img" aria-label="' + T.steps[cur][0] + '">' + scenes[cur] + '</svg>');
    cap.textContent = 'STEP ' + (cur + 1) + ' / ' + scenes.length;
    host.querySelectorAll('.fx-step').forEach(function (b, k) { b.setAttribute('aria-selected', String(k === cur)); });
    t0 = performance.now();
  }
  function tick(t) {
    if (playing && vis) { var k = (t - t0) / DUR; document.getElementById('fx-bar').style.width = Math.min(100, k * 100) + '%'; if (k >= 1) show(cur + 1); }
    timer = requestAnimationFrame(tick);
  }
  host.addEventListener('click', function (e) {
    var b = e.target.closest('.fx-step'); if (b) { show(+b.dataset.i); return; }
    if (e.target.id === 'fx-next') show(cur + 1);
    if (e.target.id === 'fx-prev') show(cur - 1);
    if (e.target.id === 'fx-play') { playing = !playing; e.target.textContent = playing ? T.pause : T.play; t0 = performance.now(); if (!playing) document.getElementById('fx-bar').style.width = '0'; }
  });
  host.addEventListener('keydown', function (e) {
    if (!e.target.closest('.fx-step')) return;
    var d = e.key === 'ArrowDown' || e.key === (AR ? 'ArrowLeft' : 'ArrowRight') ? 1 : e.key === 'ArrowUp' || e.key === (AR ? 'ArrowRight' : 'ArrowLeft') ? -1 : 0;
    if (d) { e.preventDefault(); show(cur + d); host.querySelectorAll('.fx-step')[cur].focus(); }
  });
  // pause autoplay when off screen
  var vis = true;
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { vis = es[0].isIntersecting; if (vis) t0 = performance.now() - (parseFloat(document.getElementById('fx-bar').style.width) || 0) / 100 * DUR; }).observe(host);
  show(0); timer = requestAnimationFrame(tick);
})();
