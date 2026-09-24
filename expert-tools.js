/* WhatsApp evidence strength, email header analyser and device value estimator (English + Arabic). */
(function () {
  var AR = !!document.querySelector('.page[dir="rtl"]');
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var fmt = function (n) { return Math.round(n).toLocaleString('en-US'); };
  var L = AR ? {
    waQ: [
      ['phone', 'هل لديك الهاتف الأصلي الذي يحتوي المحادثة؟', 25, 1],
      ['owner', 'هل رقم الطرف الآخر مرتبط بشخص معروف بشكل واضح؟', 15, 1],
      ['full', 'هل المحادثة متوفرة كاملة وليست رسائل مختارة فقط؟', 15, 1],
      ['export', 'هل صُدّرت المحادثة أو استُخرجت بطريقة فنية، وليست لقطات شاشة فقط؟', 20, 1],
      ['backup', 'هل توجد نسخة احتياطية أو هاتف الطرف الآخر؟', 10, 1],
      ['reset', 'هل أُعيد ضبط الهاتف أو حُذف التطبيق أو أُعيد تثبيته؟', -20, 0],
      ['edited', 'هل تظهر رسائل "محذوفة" أو "معدّلة" في المحادثة؟', -5, 0]
    ],
    yes: 'نعم', no: 'لا', unsure: 'لا أعرف',
    strength: 'قوة الدليل', lv: ['ضعيف', 'متوسط', 'قوي'],
    lvTxt: ['الدليل بصورته الحالية سهل الطعن فيه. التدخل الفني المبكر قد يستعيد أدلة أقوى من الهاتف أو النسخ الاحتياطية.', 'الدليل له قيمة، لكن توجد ثغرات يمكن للطرف الآخر استغلالها. الفحص الفني يعزّز موثوقيته.', 'وضع جيد. الفحص الجنائي للهاتف وتقرير الخبرة يثبّتان أصالة المحادثة أمام المحكمة.'],
    tips: { phone: 'احتفظ بالهاتف الأصلي؛ فهو أقوى مصدر لإثبات المحادثة.', export: 'لقطات الشاشة وحدها سهلة الفبركة والطعن. الاستخراج الفني من الهاتف أقوى بكثير.', reset: 'إعادة الضبط أو إعادة التثبيت قد تمحو بيانات، لكن جزءاً منها قد يُستعاد من النسخ الاحتياطية.', full: 'قدّم المحادثة كاملة؛ فالرسائل المجتزأة يسهل الطعن في سياقها.', owner: 'ربط الرقم بصاحبه يتطلب أدلة إضافية مثل سجلات المشغّل أو قرائن أخرى.', backup: 'النسخ الاحتياطية وهاتف الطرف الآخر مصادر مهمة للمقارنة والتحقق.', edited: 'الرسائل المحذوفة أو المعدّلة قد تُستعاد جزئياً بالفحص الجنائي.' },
    waNote: 'هذا تقييم أولي تثقيفي وليس رأياً فنياً في قضيتك.',
    mTitle: 'الصق ترويسة الرسالة (Headers)', mHow: 'في Gmail: ⋮ ← "عرض الرسالة الأصلية". في Outlook: ملف ← خصائص ← ترويسات الإنترنت.', mBtn: 'حلّل الرسالة', mSample: 'مثال لرسالة مشبوهة', mClear: 'مسح',
    mFields: { from: 'المرسل (From)', reply: 'الرد إلى (Reply-To)', ret: 'مسار الإرجاع (Return-Path)', date: 'التاريخ', hops: 'عدد الخوادم', ip: 'أول عنوان IP خارجي' },
    mChecks: 'نتائج التحقق', mPass: 'ناجح', mFail: 'فاشل', mNone: 'غير موجود',
    mFlags: { spf: 'فشل التحقق من SPF: الخادم المرسل غير مخوّل بالإرسال باسم هذا النطاق.', dkim: 'فشل أو غياب توقيع DKIM: لا يمكن التأكد من أن الرسالة لم تُعدّل.', dmarc: 'فشل DMARC: النطاق لا يعترف بهذه الرسالة.', reply: 'عنوان "الرد إلى" يختلف عن نطاق المرسل؛ وهو أسلوب شائع في احتيال تحويل المدفوعات.', ret: 'مسار الإرجاع من نطاق مختلف عن المرسل.', msgid: 'معرّف الرسالة صادر من نطاق مختلف عن المرسل.', look: 'اسم النطاق يحتوي أرقاماً أو شرطات قد تُستخدم لتقليد نطاق حقيقي.', none: 'لم تُكتشف مؤشرات تحذيرية شائعة في الترويسة.' },
    mVerdict: ['مؤشرات منخفضة', 'مشبوهة', 'عالية الخطورة'], mNote: 'يتم التحليل داخل متصفحك فقط. هذا فحص أولي، ولا يغني عن الفحص الجنائي للرسالة الأصلية.', mEmpty: 'الصق الترويسة ثم اضغط "حلّل الرسالة".',
    vCat: 'نوع الجهاز', vPrice: 'سعر الشراء (ريال قطري)', vAge: 'عمر الجهاز', vYears: 'سنة', vCond: 'الحالة', vBox: 'مع العلبة والملحقات الأصلية', vWar: 'ما زال ضمن الضمان',
    cats: [['phone', 'هاتف ذكي', .35], ['tablet', 'جهاز لوحي', .30], ['laptop', 'حاسوب محمول', .28], ['desktop', 'حاسوب مكتبي', .25], ['server', 'خادم أو معدات شبكات', .20], ['cctv', 'كاميرات مراقبة', .22], ['printer', 'طابعة أو ماسح', .25]],
    conds: [['sealed', 'جديد مغلق', 1], ['excellent', 'ممتاز', .9], ['good', 'جيد', .75], ['fair', 'مقبول، آثار استخدام واضحة', .55], ['faulty', 'به أعطال', .3]],
    vOut: 'القيمة التقديرية الحالية', vRange: 'النطاق التقريبي', vDep: 'نسبة الانخفاض', vChart: 'انخفاض القيمة مع الزمن', vQar: 'ر.ق', vNote: 'تقدير إرشادي مبني على معدلات إهلاك نموذجية. التقييم الرسمي للمحكمة يعتمد على المعاينة وأسعار السوق الفعلية والمواصفات والأعطال.', vNow: 'الآن'
  } : {
    waQ: [
      ['phone', 'Do you have the original phone that holds the chat?', 25, 1],
      ['owner', "Is the other number clearly linked to a known person?", 15, 1],
      ['full', 'Is the full conversation available, not just selected messages?', 15, 1],
      ['export', 'Was the chat exported or extracted technically, not just screenshotted?', 20, 1],
      ['backup', "Is there a backup, or access to the other party's phone?", 10, 1],
      ['reset', 'Has the phone been reset, or WhatsApp deleted or reinstalled?', -20, 0],
      ['edited', 'Does the chat show "deleted" or "edited" messages?', -5, 0]
    ],
    yes: 'Yes', no: 'No', unsure: 'Not sure',
    strength: 'Evidence strength', lv: ['Weak', 'Moderate', 'Strong'],
    lvTxt: ['As it stands the evidence is easy to challenge. Early forensic work can often recover stronger evidence from the phone or backups.', 'The evidence has value, but there are gaps the other side could exploit. A forensic examination strengthens it.', 'A good position. A forensic examination of the phone and an expert report can establish authenticity in court.'],
    tips: { phone: 'Keep the original phone; it is the strongest source for proving a chat.', export: 'Screenshots alone are easy to fake and to challenge. A forensic extraction from the phone is far stronger.', reset: 'A reset or reinstall can erase data, but some may be recoverable from backups.', full: 'Provide the whole conversation; selected messages are easy to dispute out of context.', owner: 'Linking a number to its owner may need extra evidence, such as operator records or other corroboration.', backup: "Backups and the other party's phone are valuable for cross-checking.", edited: 'Deleted or edited messages can sometimes be partly recovered forensically.' },
    waNote: 'This is an educational first check, not an expert opinion on your case.',
    mTitle: 'Paste the email headers', mHow: 'Gmail: ⋮ → "Show original". Outlook: File → Properties → Internet headers.', mBtn: 'Analyse email', mSample: 'Load a suspicious example', mClear: 'Clear',
    mFields: { from: 'From', reply: 'Reply-To', ret: 'Return-Path', date: 'Date', hops: 'Servers passed', ip: 'First external IP' },
    mChecks: 'Authentication results', mPass: 'pass', mFail: 'fail', mNone: 'none',
    mFlags: { spf: 'SPF failed: the sending server is not authorised to send for this domain.', dkim: 'DKIM failed or missing: there is no proof the message was not altered.', dmarc: 'DMARC failed: the domain does not vouch for this message.', reply: 'Reply-To points to a different domain from the sender, a classic payment-fraud technique.', ret: 'Return-Path is on a different domain from the sender.', msgid: 'The Message-ID was issued by a different domain from the sender.', look: 'The domain contains digits or hyphens that may imitate a real domain.', none: 'No common warning signs found in the headers.' },
    mVerdict: ['Low risk signs', 'Suspicious', 'High risk'], mNote: 'Analysed inside your browser only. This is a first screen and does not replace a forensic examination of the original message.', mEmpty: 'Paste headers, then press "Analyse email".',
    vCat: 'Device type', vPrice: 'Purchase price (QAR)', vAge: 'Device age', vYears: 'years', vCond: 'Condition', vBox: 'With original box and accessories', vWar: 'Still under warranty',
    cats: [['phone', 'Smartphone', .35], ['tablet', 'Tablet', .30], ['laptop', 'Laptop', .28], ['desktop', 'Desktop PC', .25], ['server', 'Server or network equipment', .20], ['cctv', 'CCTV cameras', .22], ['printer', 'Printer or scanner', .25]],
    conds: [['sealed', 'New, sealed', 1], ['excellent', 'Excellent', .9], ['good', 'Good', .75], ['fair', 'Fair, clear signs of use', .55], ['faulty', 'Faulty', .3]],
    vOut: 'Estimated current value', vRange: 'Indicative range', vDep: 'Loss of value', vChart: 'Value over time', vQar: 'QAR', vNote: 'An indicative estimate using typical depreciation rates. A formal valuation for court relies on inspection, actual market prices, specification and faults.', vNow: 'now'
  };

  /* ---------- WhatsApp evidence strength ---------- */
  var wa = document.getElementById('ew-wa');
  if (wa) {
    var ans = { phone: 'yes', owner: 'yes', full: 'no', export: 'no', backup: 'unsure', reset: 'no', edited: 'no' };
    var h = '<div class="ew-wiz"><div><div class="ew-wq">' + L.waQ.map(function (q) {
      return '<div class="ew-wrow"><p>' + esc(q[1]) + '</p><div class="ew-seg" role="group" aria-label="' + esc(q[1]) + '">' + ['yes', 'no', 'unsure'].map(function (v) { return '<button type="button" data-q="' + q[0] + '" data-v="' + v + '">' + L[v] + '</button>'; }).join('') + '</div></div>';
    }).join('') + '</div></div><div class="ew-result" id="ew-wa-out"></div></div>';
    wa.innerHTML = h;
    function score() {
      var s = 0, tips = [];
      L.waQ.forEach(function (q) {
        var a = ans[q[0]], w = q[2], good = q[3];
        if (good) { if (a === 'yes') s += w; else if (a === 'unsure') s += w / 3; if (a !== 'yes') tips.push(L.tips[q[0]]); }
        else { if (a === 'yes') { s += w; tips.push(L.tips[q[0]]); } else if (a === 'unsure') s += w / 2; }
      });
      s = Math.max(0, Math.min(100, Math.round(s / 85 * 100)));
      var lv = s >= 70 ? 2 : s >= 40 ? 1 : 0, col = ['#c0392b', '#e0a526', '#1f8a5b'][lv];
      document.getElementById('ew-wa-out').innerHTML = '<h3>' + L.strength + '</h3>' +
        '<div class="ew-gauge"><svg viewBox="0 0 120 70" aria-hidden="true"><path d="M10 62 A50 50 0 0 1 110 62" fill="none" stroke="var(--line)" stroke-width="12" stroke-linecap="round"/><path d="M10 62 A50 50 0 0 1 110 62" fill="none" stroke="' + col + '" stroke-width="12" stroke-linecap="round" pathLength="100" stroke-dasharray="' + s + ' 100"/></svg><div><b style="color:' + col + '">' + s + '<small>/100</small></b><span class="ew-lv" style="background:' + col + '22;color:' + col + '">' + L.lv[lv] + '</span></div></div>' +
        '<p>' + L.lvTxt[lv] + '</p>' + (tips.length ? '<ul>' + tips.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' : '') + '<p class="ew-empty">' + L.waNote + '</p>';
      wa.querySelectorAll('.ew-seg button').forEach(function (b) { b.setAttribute('aria-pressed', String(ans[b.dataset.q] === b.dataset.v)); });
    }
    wa.addEventListener('click', function (e) { var b = e.target.closest('.ew-seg button'); if (!b) return; ans[b.dataset.q] = b.dataset.v; score(); });
    score();
  }

  /* ---------- Email header analyser ---------- */
  var ml = document.getElementById('ew-mail');
  if (ml) {
    var SAMPLE = 'Return-Path: <billing@mail-relay-77.example.net>\nReceived: from mail-relay-77.example.net (unknown [203.0.113.45])\n\tby mx.company-qatar.example (Postfix) with ESMTP id 4F2A1\n\tfor <accounts@company-qatar.example>; Mon, 15 Sep 2026 09:12:03 +0300\nReceived: from [198.51.100.23] by mail-relay-77.example.net; Mon, 15 Sep 2026 06:11:58 +0000\nAuthentication-Results: mx.company-qatar.example;\n\tspf=softfail smtp.mailfrom=mail-relay-77.example.net;\n\tdkim=none;\n\tdmarc=fail header.from=supp1ier-trading.example\nFrom: "Supplier Accounts" <accounts@supp1ier-trading.example>\nReply-To: finance.dept@freemail.example\nTo: accounts@company-qatar.example\nSubject: URGENT: updated bank details for invoice 2291\nDate: Mon, 15 Sep 2026 09:11:52 +0300\nMessage-ID: <a81f2c@mail-relay-77.example.net>';
    ml.innerHTML = '<div class="ew-wiz"><div><label for="ew-mailin" class="ew-q" style="display:block">' + L.mTitle + '</label><p class="ew-empty" style="margin:0 0 8px">' + L.mHow + '</p>' +
      '<textarea id="ew-mailin" class="ew-ta" spellcheck="false" dir="ltr"></textarea>' +
      '<div class="ew-nav" style="justify-content:flex-start"><button type="button" class="ew-btn dark" id="ew-mailgo">' + L.mBtn + '</button><button type="button" class="ew-btn line" id="ew-mailsample">' + L.mSample + '</button><button type="button" class="ew-btn line" id="ew-mailclr">' + L.mClear + '</button></div></div>' +
      '<div class="ew-result" id="ew-mail-out"></div></div>';
    var ta = document.getElementById('ew-mailin'), out = document.getElementById('ew-mail-out');
    function unfold(t) { return t.replace(/\r/g, '').replace(/\n[ \t]+/g, ' '); }
    function hdr(t, name) { var m = t.match(new RegExp('^' + name + ':\\s*(.*)$', 'im')); return m ? m[1].trim() : ''; }
    function dom(v) { var m = (v || '').match(/@([A-Za-z0-9.-]+)/); return m ? m[1].toLowerCase() : ''; }
    function base(d) { var p = d.split('.'); return p.slice(-2).join('.'); }
    function analyse() {
      var raw = ta.value.trim(); if (!raw) { out.innerHTML = '<h3>' + L.mChecks + '</h3><p class="ew-empty">' + L.mEmpty + '</p>'; return; }
      var t = unfold(raw), from = hdr(t, 'From'), reply = hdr(t, 'Reply-To'), ret = hdr(t, 'Return-Path'), date = hdr(t, 'Date'), msgid = hdr(t, 'Message-ID');
      var auth = (t.match(/^Authentication-Results:.*$/gim) || []).join(' ') + ' ' + (t.match(/^Received-SPF:.*$/gim) || []).join(' ');
      var r = function (k) { var m = auth.match(new RegExp(k + '=([a-z]+)', 'i')); if (m) return m[1].toLowerCase(); if (k === 'spf') { var m2 = auth.match(/Received-SPF:\s*([a-z]+)/i); if (m2) return m2[1].toLowerCase(); } return 'none'; };
      var spf = r('spf'), dkim = r('dkim'), dmarc = r('dmarc');
      var hops = (t.match(/^Received:/gim) || []).length;
      var ips = (t.match(/\[(\d{1,3}(?:\.\d{1,3}){3})\]/g) || []).map(function (x) { return x.slice(1, -1); });
      var ip = ips.length ? ips[ips.length - 1] : '—';
      var fd = dom(from), flags = [], risk = 0;
      if (/fail|softfail/.test(spf)) { flags.push(L.mFlags.spf); risk += 2; }
      if (dkim !== 'pass') { flags.push(L.mFlags.dkim); risk += 1; }
      if (dmarc === 'fail') { flags.push(L.mFlags.dmarc); risk += 3; }
      if (reply && dom(reply) && fd && base(dom(reply)) !== base(fd)) { flags.push(L.mFlags.reply); risk += 3; }
      if (ret && dom(ret) && fd && base(dom(ret)) !== base(fd)) { flags.push(L.mFlags.ret); risk += 1; }
      if (msgid && dom(msgid) && fd && base(dom(msgid)) !== base(fd)) { flags.push(L.mFlags.msgid); risk += 1; }
      if (fd && (/[a-z]\d|\d[a-z]/.test(fd.split('.')[0]) || (fd.split('.')[0].match(/-/g) || []).length >= 1 && /\d/.test(fd))) { flags.push(L.mFlags.look); risk += 2; }
      var lv = risk >= 5 ? 2 : risk >= 2 ? 1 : 0, col = ['#1f8a5b', '#e0a526', '#c0392b'][lv];
      var badge = function (v) { var ok = v === 'pass', none = v === 'none'; return '<span class="ew-pill ' + (ok ? 'ok' : none ? 'na' : 'bad') + '">' + (ok ? L.mPass : none ? L.mNone : v) + '</span>'; };
      out.innerHTML = '<span class="ew-urg" style="background:' + col + '22;color:' + col + '">' + L.mVerdict[lv] + '</span>' +
        '<div class="ew-auth"><div>SPF ' + badge(spf) + '</div><div>DKIM ' + badge(dkim) + '</div><div>DMARC ' + badge(dmarc) + '</div></div>' +
        '<div class="ew-kv">' + [['from', from], ['reply', reply], ['ret', ret], ['date', date], ['hops', String(hops)], ['ip', ip]].filter(function (x) { return x[1]; }).map(function (x) { return '<b>' + L.mFields[x[0]] + '</b><span dir="ltr" style="text-align:start;word-break:break-all">' + esc(x[1]) + '</span>'; }).join('') + '</div>' +
        '<ul>' + (flags.length ? flags : [L.mFlags.none]).map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('') + '</ul><p class="ew-empty">' + L.mNote + '</p>';
    }
    document.getElementById('ew-mailgo').onclick = analyse;
    document.getElementById('ew-mailsample').onclick = function () { ta.value = SAMPLE; analyse(); };
    document.getElementById('ew-mailclr').onclick = function () { ta.value = ''; analyse(); ta.focus(); };
    ta.value = SAMPLE; analyse();
  }

  /* ---------- Device value estimator ---------- */
  var dv = document.getElementById('ew-value');
  if (dv) {
    dv.innerHTML = '<div class="ew-wiz"><div class="ew-form">' +
      '<label for="ew-vcat">' + L.vCat + '</label><select id="ew-vcat">' + L.cats.map(function (c) { return '<option value="' + c[0] + '">' + c[1] + '</option>'; }).join('') + '</select>' +
      '<label for="ew-vprice">' + L.vPrice + '</label><input id="ew-vprice" type="number" min="0" step="50" value="4500" inputmode="numeric">' +
      '<label for="ew-vage">' + L.vAge + ': <b id="ew-vagev"></b></label><input id="ew-vage" type="range" min="0" max="8" step="0.5" value="1.5">' +
      '<label for="ew-vcond">' + L.vCond + '</label><select id="ew-vcond">' + L.conds.map(function (c) { return '<option value="' + c[0] + '"' + (c[0] === 'good' ? ' selected' : '') + '>' + c[1] + '</option>'; }).join('') + '</select>' +
      '<label class="ew-cbx"><input type="checkbox" id="ew-vbox" checked> ' + L.vBox + '</label><label class="ew-cbx"><input type="checkbox" id="ew-vwar"> ' + L.vWar + '</label>' +
      '</div><div class="ew-result" id="ew-vout"></div></div>';
    var $ = function (id) { return document.getElementById(id); };
    function calc() {
      var cat = L.cats.filter(function (c) { return c[0] === $('ew-vcat').value; })[0], rate = cat[2];
      var price = Math.max(0, +$('ew-vprice').value || 0), age = +$('ew-vage').value;
      var cond = L.conds.filter(function (c) { return c[0] === $('ew-vcond').value; })[0][2];
      var extra = 1 + ($('ew-vbox').checked ? .05 : 0) + ($('ew-vwar').checked ? .05 : 0);
      if ($('ew-vcond').value === 'sealed') cond = Math.max(cond, 1);
      var val = price * Math.pow(1 - rate, age) * cond * extra; val = Math.min(val, price);
      $('ew-vagev').textContent = age + ' ' + L.vYears;
      // chart
      var W = 320, H = 150, pl = 8, pr = 8, pt = 14, pb = 22, maxY = 8;
      var X = function (a) { return pl + a / maxY * (W - pl - pr); }, Y = function (v) { return pt + (1 - (price ? v / price : 0)) * (H - pt - pb); };
      var pts = []; for (var a = 0; a <= maxY; a += .25) pts.push([X(a), Y(Math.min(price, price * Math.pow(1 - rate, a) * cond * extra))]);
      var path = 'M' + pts.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join('L');
      var area = path + 'L' + X(maxY) + ',' + Y(0) + 'L' + X(0) + ',' + Y(0) + 'Z';
      var ticks = [0, 2, 4, 6, 8].map(function (a) { return '<text x="' + X(a) + '" y="' + (H - 6) + '" text-anchor="middle">' + a + '</text>'; }).join('');
      var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" class="ew-vchart" role="img" aria-label="' + L.vChart + '" dir="ltr"><defs><linearGradient id="ewvg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#00a7bf" stop-opacity=".35"/><stop offset="1" stop-color="#00a7bf" stop-opacity="0"/></linearGradient></defs>' +
        '<line x1="' + pl + '" x2="' + (W - pr) + '" y1="' + Y(0) + '" y2="' + Y(0) + '" class="gl"/><path d="' + area + '" fill="url(#ewvg)"/><path d="' + path + '" fill="none" stroke="#00a7bf" stroke-width="2.5"/>' +
        '<circle cx="' + X(age) + '" cy="' + Y(val) + '" r="5.5" fill="#c9a227" stroke="#fff" stroke-width="2"/>' + ticks + '</svg>';
      $('ew-vout').innerHTML = '<h3>' + L.vOut + '</h3><div class="ew-big"><b>' + fmt(val) + '</b> <span>' + L.vQar + '</span></div>' +
        '<div class="ew-kv"><b>' + L.vRange + '</b><span><bdi dir="ltr">' + fmt(val * .85) + ' – ' + fmt(val * 1.15) + '</bdi> ' + L.vQar + '</span><b>' + L.vDep + '</b><span><bdi dir="ltr">' + (price ? Math.round((1 - val / price) * 100) : 0) + '%</bdi></span></div>' +
        '<p class="ew-empty" style="margin:4px 0">' + L.vChart + ' (' + L.vYears + ')</p>' + svg + '<p class="ew-empty">' + L.vNote + '</p>';
    }
    ['ew-vcat', 'ew-vprice', 'ew-vage', 'ew-vcond', 'ew-vbox', 'ew-vwar'].forEach(function (id) { $(id).addEventListener('input', calc); $(id).addEventListener('change', calc); });
    calc();
  }
})();
