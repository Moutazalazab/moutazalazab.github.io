/* Contact form (English + Arabic). Sends submissions by email through FormSubmit (https://formsubmit.co).
   To hide your email address from the page source: after activating, replace the address below with the
   random alias FormSubmit gives you (e.g. "https://formsubmit.co/ajax/abc123def456..."). */
(function () {
  var FORM_ENDPOINT = 'https://formsubmit.co/ajax/azab_moutaz@yahoo.com';
  var PHONE = '97452061433';
  var holders = document.querySelectorAll('[data-contact-form]'); if (!holders.length) return;

  if (!document.getElementById('cf-style')) {
    var st = document.createElement('style'); st.id = 'cf-style';
    st.textContent = '.cf{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px 16px}' +
      '@media (max-width:640px){.cf{grid-template-columns:minmax(0,1fr)}}' +
      '.cf .full{grid-column:1/-1}' +
      '.cf label{display:block;font-size:.86rem;font-weight:600;color:var(--ink-2,#4a5468);margin-bottom:5px}' +
      '.cf label i{color:#c0392b;font-style:normal}' +
      '.cf input,.cf select,.cf textarea{width:100%;box-sizing:border-box;padding:11px 13px;border:1px solid var(--line,#e3e7f1);border-radius:10px;background:var(--surface-2,#f5f7fc);color:var(--ink,#111827);font:inherit;font-size:.95rem}' +
      '.cf textarea{min-height:130px;resize:vertical}' +
      '.cf input:focus,.cf select:focus,.cf textarea:focus{outline:2px solid var(--accent,#00a7bf);outline-offset:1px;border-color:var(--accent,#00a7bf)}' +
      '.cf [aria-invalid="true"]{border-color:#c0392b;background:rgba(192,57,43,.05)}' +
      '.cf .err{color:#c0392b;font-size:.8rem;margin-top:4px;min-height:1em}' +
      '.cf .count{font-size:.78rem;color:var(--ink-3,#7d879b);text-align:end;margin-top:3px}' +
      '.cf .chk{display:flex;gap:10px;align-items:flex-start;font-weight:400;font-size:.88rem;color:var(--ink-2,#4a5468);cursor:pointer}' +
      '.cf .chk input{width:18px;height:18px;margin-top:2px;flex-shrink:0;accent-color:var(--accent,#00a7bf)}' +
      '.cf .hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}' +
      '.cf .actions{display:flex;flex-wrap:wrap;gap:12px;align-items:center}' +
      '.cf button[type=submit]{border:none;cursor:pointer;background:var(--navy-2,#122a63);color:#fff;font:700 1rem inherit;font-family:inherit;padding:12px 26px;border-radius:10px}' +
      '.cf button[type=submit]:hover{filter:brightness(1.12)}' +
      '.cf button[disabled]{opacity:.6;cursor:wait}' +
      '.cf .note{font-size:.82rem;color:var(--ink-3,#7d879b);margin:0}' +
      '.cf-done{text-align:center;padding:26px 16px;border:1px solid rgba(31,138,91,.35);background:rgba(31,138,91,.07);border-radius:14px}' +
      '.cf-done .tick{width:56px;height:56px;border-radius:50%;background:#1f8a5b;color:#fff;display:grid;place-items:center;font-size:1.8rem;margin:0 auto 10px}' +
      '.cf-done h3{margin:0 0 6px;color:var(--head,#122a63)}.cf-done p{margin:0;color:var(--ink-2,#4a5468)}' +
      '.cf-fail{border:1px solid rgba(192,57,43,.35);background:rgba(192,57,43,.06);border-radius:10px;padding:12px 14px;color:var(--ink,#111827);font-size:.9rem}' +
      '.cf-fail a{font-weight:700}';
    document.head.appendChild(st);
  }

  holders.forEach(function (holder, idx) {
    var AR = holder.getAttribute('data-contact-form') === 'ar';
    var T = AR ? {
      name: 'الاسم الكامل', phone: 'رقم الهاتف', email: 'البريد الإلكتروني', type: 'نوع الطلب', lang: 'لغة التواصل المفضلة', msg: 'اشرح الموقف باختصار',
      msgPh: 'مثال: تعرّضت شركتنا لاحتيال عبر البريد الإلكتروني وحُوّلت دفعة إلى حساب خاطئ يوم الأحد…',
      types: ['خبرة فنية أمام المحاكم / قضية', 'استجابة لحادثة سيبرانية', 'إثبات محادثات واتساب أو بريد إلكتروني', 'تقييم أجهزة أو نزاع بيع وشراء', 'تدريب أو استشارات', 'تعاون أكاديمي أو بحثي', 'أخرى'],
      langs: ['العربية', 'الإنجليزية'],
      consent: 'أوافق على استخدام هذه البيانات للتواصل معي بخصوص طلبي فقط.', send: 'إرسال الطلب', sending: 'جارٍ الإرسال…',
      req: 'هذا الحقل مطلوب.', badEmail: 'أدخل بريداً إلكترونياً صحيحاً.', badPhone: 'أدخل رقماً صحيحاً، مثل ‎+974 5555 5555‎.', needConsent: 'يرجى الموافقة للمتابعة.', short: 'يرجى كتابة 15 حرفاً على الأقل.',
      conf: 'لا تُرسل كلمات مرور أو مستندات سرية عبر هذا النموذج. تُعامل جميع الطلبات بسرية.',
      okT: 'تم استلام طلبك', okP: 'شكراً لك. سيتواصل معك د. معتز العزب في أقرب وقت ممكن.', okUrgent: 'إذا كان الأمر عاجلاً، راسلنا عبر واتساب.',
      fail: 'تعذّر إرسال النموذج الآن. يرجى التواصل مباشرة عبر ', or: ' أو ', wa: 'واتساب', mail: 'البريد الإلكتروني',
      subject: 'طلب جديد من الموقع', chars: 'حرف'
    } : {
      name: 'Full name', phone: 'Phone number', email: 'Email', type: 'What do you need help with?', lang: 'Preferred language', msg: 'Briefly explain the situation',
      msgPh: 'For example: our company received a fake invoice email on Sunday and a payment went to the wrong account…',
      types: ['Expert witness / court case', 'Cyber incident response', 'WhatsApp or email evidence', 'Device valuation or buying/selling dispute', 'Training or consulting', 'Academic or research collaboration', 'Other'],
      langs: ['English', 'Arabic'],
      consent: 'I agree that these details may be used only to contact me about my enquiry.', send: 'Send enquiry', sending: 'Sending…',
      req: 'This field is required.', badEmail: 'Enter a valid email address.', badPhone: 'Enter a valid number, for example +974 5555 5555.', needConsent: 'Please tick to continue.', short: 'Please write at least 15 characters.',
      conf: 'Please do not send passwords or confidential documents through this form. All enquiries are treated as confidential.',
      okT: 'Your enquiry has been received', okP: 'Thank you. Dr. Moutaz Alazab will get back to you as soon as possible.', okUrgent: 'If it is urgent, message on WhatsApp.',
      fail: 'The form could not be sent right now. Please contact directly by ', or: ' or ', wa: 'WhatsApp', mail: 'email',
      subject: 'New enquiry from website', chars: 'characters'
    };
    var id = function (k) { return 'cf' + idx + '-' + k; };
    holder.innerHTML = '<form class="cf" novalidate>' +
      '<div><label for="' + id('name') + '">' + T.name + ' <i>*</i></label><input id="' + id('name') + '" name="name" autocomplete="name" maxlength="120" required><div class="err"></div></div>' +
      '<div><label for="' + id('phone') + '">' + T.phone + ' <i>*</i></label><input id="' + id('phone') + '" name="phone" type="tel" autocomplete="tel" maxlength="30" dir="ltr" placeholder="+974 …" required><div class="err"></div></div>' +
      '<div><label for="' + id('email') + '">' + T.email + ' <i>*</i></label><input id="' + id('email') + '" name="email" type="email" autocomplete="email" maxlength="160" dir="ltr" required><div class="err"></div></div>' +
      '<div><label for="' + id('type') + '">' + T.type + '</label><select id="' + id('type') + '" name="enquiry_type">' + T.types.map(function (t) { return '<option>' + t + '</option>'; }).join('') + '</select></div>' +
      '<div class="full"><label for="' + id('msg') + '">' + T.msg + ' <i>*</i></label><textarea id="' + id('msg') + '" name="message" maxlength="1500" required placeholder="' + T.msgPh + '"></textarea><div class="count" aria-live="polite"><span>0</span> / 1500 ' + T.chars + '</div><div class="err"></div></div>' +
      '<div><label for="' + id('lang') + '">' + T.lang + '</label><select id="' + id('lang') + '" name="preferred_language">' + T.langs.map(function (t) { return '<option>' + t + '</option>'; }).join('') + '</select></div>' +
      '<div class="hp" aria-hidden="true"><label>Leave empty<input name="_honey" tabindex="-1" autocomplete="off"></label></div>' +
      '<div class="full"><label class="chk"><input type="checkbox" id="' + id('consent') + '" name="consent" required> <span>' + T.consent + '</span></label><div class="err"></div></div>' +
      '<div class="full actions"><button type="submit">' + T.send + '</button><p class="note">' + T.conf + '</p></div>' +
      '<div class="full" data-result aria-live="polite"></div>' +
      '</form>';
    var f = holder.querySelector('form'), ta = f.querySelector('textarea');
    ta.addEventListener('input', function () { holder.querySelector('.count span').textContent = ta.value.length; });
    function setErr(el, msg) { var box = el.closest('div').querySelector('.err') || el.closest('.full').querySelector('.err'); el.setAttribute('aria-invalid', msg ? 'true' : 'false'); if (box) box.textContent = msg || ''; }
    function validate() {
      var ok = true, first = null;
      var chk = function (el, msg) { setErr(el, msg); if (msg) { ok = false; first = first || el; } };
      var n = f.elements.name, p = f.elements.phone, e = f.elements.email, m = f.elements.message, c = f.elements.consent;
      chk(n, n.value.trim() ? '' : T.req);
      var digits = p.value.replace(/[^\d]/g, '');
      chk(p, !p.value.trim() ? T.req : (digits.length < 7 || digits.length > 15 || /[^\d+\s()\-]/.test(p.value)) ? T.badPhone : '');
      chk(e, !e.value.trim() ? T.req : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.value.trim()) ? '' : T.badEmail);
      chk(m, !m.value.trim() ? T.req : m.value.trim().length < 15 ? T.short : '');
      chk(c, c.checked ? '' : T.needConsent);
      if (first) first.focus();
      return ok;
    }
    f.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (f.elements._honey.value) return;
      if (!validate()) return;
      var btn = f.querySelector('button[type=submit]'); btn.disabled = true; btn.textContent = T.sending;
      var data = {
        name: f.elements.name.value.trim(), phone: f.elements.phone.value.trim(), email: f.elements.email.value.trim(),
        enquiry_type: f.elements.enquiry_type.value, preferred_language: f.elements.preferred_language.value, message: f.elements.message.value.trim(),
        page: location.href.split('#')[0], _subject: T.subject + ': ' + f.elements.enquiry_type.value + ' – ' + f.elements.name.value.trim(),
        _template: 'table', _replyto: f.elements.email.value.trim(), _captcha: 'false'
      };
      fetch(FORM_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(data) })
        .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
        .then(function (res) {
          if (!res.ok || String(res.j.success) === 'false') throw new Error(res.j.message || 'send failed');
          holder.innerHTML = '<div class="cf-done" role="status"><div class="tick" aria-hidden="true">✓</div><h3>' + T.okT + '</h3><p>' + T.okP + '</p><p style="margin-top:8px">' + T.okUrgent + ' <a href="https://wa.me/' + PHONE + '" target="_blank" rel="noopener">WhatsApp</a></p></div>';
          holder.scrollIntoView({ block: 'center', behavior: 'smooth' });
        })
        .catch(function () {
          btn.disabled = false; btn.textContent = T.send;
          f.querySelector('[data-result]').innerHTML = '<div class="cf-fail" role="alert">' + T.fail + '<a href="https://wa.me/' + PHONE + '" target="_blank" rel="noopener">' + T.wa + '</a>' + T.or + '<a href="mailto:m.alazab@bau.edu.jo">' + T.mail + '</a> (m.alazab@bau.edu.jo).</div>';
        });
    });
    f.addEventListener('input', function (e) { if (e.target.getAttribute('aria-invalid') === 'true') setErr(e.target, ''); });
  });
})();
