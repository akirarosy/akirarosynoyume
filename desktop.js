/* Rosy·Claude 电脑版专属：只在电脑浏览器（窗口够宽 + 用鼠标）时加载，手机不会下载这个文件
   1. 电脑版排版：底栏变成浮在底部中间的扁平长条，内容居中，Home 分两栏
   2. 拖进来就行：图片拖进窗口 → 发到聊天；.md 文件 → 资料库；电子书（epub / txt / pdf）拖进窗口 → 放上书架
   3. 比分小窗：左下角一颗很小的比分条；点「⧉」弹出一个置顶小窗，打游戏时也能看到
   4. 雾中卷宗：在聊天里只发 🥱😶‍🌫️ 开始听真实案件的睡前故事，只发 😶‍🌫️😶‍🌫️ 结束（基于 DardoMoon/mist-dossier，MIT） */
(function () {
  if (!window.Rosy) return;
  var R = window.Rosy;

  /* ---------- 1. 排版 ---------- */
  var css = `
  .tabs{position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:40;width:auto;gap:2px;padding:6px;border-radius:999px;border:1px solid var(--gl,rgba(255,255,255,.6));box-shadow:0 12px 40px rgba(60,30,10,.18),inset 0 1px 0 rgba(255,255,255,.7)}
  .tabs::before{border-radius:999px}
  .tabs button{flex:none;flex-direction:row;gap:7px;padding:9px 16px;border-radius:999px;font-size:12.5px;letter-spacing:.12em}
  .tabs button svg{width:18px;height:18px}
  #vHome,#vFoot,#vGame,#vPlay,#vBook{padding-bottom:110px!important}
  #vHome{padding:36px max(48px,calc((100% - 1120px)/2)) 110px}
  #vFoot,#vGame,#vPlay{padding-left:max(40px,calc((100% - 920px)/2));padding-right:max(40px,calc((100% - 920px)/2))}
  .hcols{display:grid;grid-template-columns:1.05fr 1fr;gap:0 32px;align-items:start}
  .hcols>div>.lbl:first-child{margin-top:6px}
  @media (max-width:999px){.hcols{display:block}}
  #fPlayers{grid-template-columns:repeat(5,1fr)}
  #fPlayers .fp{font-size:13.5px}
  #vChat .msgs{padding-left:max(24px,calc((100% - 820px)/2));padding-right:max(24px,calc((100% - 820px)/2))}
  #vChat .dock{padding-bottom:84px}
  #vChat .compose{max-width:820px;margin-left:auto;margin-right:auto}
  #vChat .foot{text-align:center;background:none!important}
  /* 拖进来 */
  .dropzone{position:fixed;inset:14px;z-index:120;border-radius:28px;border:2.5px dashed var(--caramel);background:rgba(255,246,230,.72);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;flex-direction:column;gap:8px;color:var(--ink);font:600 20px "Noto Serif SC","Songti SC",Georgia,serif;pointer-events:none}
  .dropzone small{font:400 14px "Noto Sans SC","PingFang SC",sans-serif;color:var(--mute)}
  .dropzone[hidden]{display:none}
  @media (prefers-color-scheme:dark){.dropzone{background:rgba(40,28,14,.75)}}
  /* 比分小条 */
  .mscore{position:fixed;left:14px;bottom:14px;z-index:45;display:flex;align-items:center;gap:6px;max-width:300px;padding:5px 6px 5px 11px;border-radius:999px;font:500 12px/1.2 "Noto Sans SC","PingFang SC",sans-serif;color:var(--ink);background:var(--g1,rgba(255,250,234,.8));border:1px solid var(--line);box-shadow:0 6px 18px rgba(60,30,10,.16);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);cursor:pointer}
  .mscore[hidden]{display:none}
  .mscore .dot{width:6px;height:6px;border-radius:50%;background:#e0483a;flex:none;animation:lcp 1.4s ease-in-out infinite}
  .mscore .dot.pre{background:var(--mute);animation:none}
  .mscore span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .mscore b{font-variant-numeric:tabular-nums}
  .mscore button{flex:none;width:20px;height:20px;border-radius:50%;border:0;background:rgba(180,120,60,.14);color:var(--mute);font-size:11px;line-height:20px;padding:0;cursor:pointer}

  /* 雾中卷宗 */
  .mistchip{position:fixed;left:50%;top:62px;transform:translateX(-50%);z-index:30;display:flex;align-items:center;gap:8px;padding:6px 8px 6px 14px;border-radius:999px;font:500 12.5px/1.2 "Noto Sans SC","PingFang SC",sans-serif;color:var(--ink);background:var(--g1,rgba(250,248,244,.82));border:1px solid var(--line);box-shadow:0 6px 18px rgba(40,40,60,.14);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px)}
  .mistchip[hidden]{display:none}
  .mistchip button{border:0;border-radius:999px;padding:4px 10px;font:inherit;font-size:11.5px;background:rgba(120,130,150,.16);color:var(--mute);cursor:pointer}
  body.mist #vChat::before{content:"";position:fixed;inset:0;pointer-events:none;z-index:0;background:radial-gradient(120% 70% at 50% 110%,rgba(170,180,195,.35),transparent 60%),radial-gradient(90% 50% at 10% 0%,rgba(190,195,210,.22),transparent 70%);animation:mistdrift 18s ease-in-out infinite alternate}
  @keyframes mistdrift{from{opacity:.75;transform:translateX(-1.5%)}to{opacity:1;transform:translateX(1.5%)}}
  @media (prefers-color-scheme:dark){body.mist #vChat::before{background:radial-gradient(120% 70% at 50% 110%,rgba(120,130,150,.28),transparent 60%),radial-gradient(90% 50% at 10% 0%,rgba(110,120,140,.2),transparent 70%)}}
  `;
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function homeCols() {
    var h = document.getElementById('vHome'); if (!h || h.querySelector('.hcols')) return;
    var kids = [].slice.call(h.children);
    var a0 = kids.findIndex(function (x) { return x.id === 'hPlant'; });
    var b0 = kids.findIndex(function (x) { return x.classList.contains('lbl') && /Countdown/.test(x.textContent); });
    if (a0 < 0 || b0 < 0) return;
    var c = document.createElement('div'), a = document.createElement('div'), b = document.createElement('div');
    c.className = 'hcols'; c.appendChild(a); c.appendChild(b);
    kids.slice(a0, b0).forEach(function (x) { a.appendChild(x); });
    kids.slice(b0).forEach(function (x) { b.appendChild(x); });
    h.appendChild(c);
  }
  homeCols();

  /* ---------- 2. 拖进来就行 ---------- */
  var dz = document.createElement('div');
  dz.className = 'dropzone'; dz.hidden = true;
  dz.innerHTML = '🦉 松手就行<small>图片 → 发到聊天　·　.md → 资料库　·　.skill / .zip → 技能　·　电子书（epub / txt / pdf）→ 放上书架</small>';
  document.body.appendChild(dz);
  var depth = 0;
  function hasFiles(e) { return e.dataTransfer && [].indexOf.call(e.dataTransfer.types || [], 'Files') >= 0; }
  addEventListener('dragenter', function (e) { if (!hasFiles(e)) return; depth++; dz.hidden = false; });
  addEventListener('dragleave', function (e) { if (!hasFiles(e)) return; depth = Math.max(0, depth - 1); if (!depth) dz.hidden = true; });
  addEventListener('dragover', function (e) { if (hasFiles(e)) e.preventDefault(); });
  addEventListener('drop', function (e) {
    if (!hasFiles(e)) return; e.preventDefault(); depth = 0; dz.hidden = true;
    var fs = [].slice.call(e.dataTransfer.files || []);
    var imgs = fs.filter(function (f) { return /^image\//.test(f.type); });
    var sks = fs.filter(function (f) { return /\.(skill|zip)$/i.test(f.name) || /^SKILL\.md$/i.test(f.name); });
    var mds = fs.filter(function (f) { return /\.(md|markdown)$/i.test(f.name) && !/^SKILL\.md$/i.test(f.name); });
    var books = fs.filter(function (f) { return /\.(epub|txt|pdf)$/i.test(f.name) || /epub|pdf|text\/plain/.test(f.type); });
    if (sks.length && R.addSkills) { R.go('chat'); R.addSkills(sks); }
    else if (mds.length && R.addFiles) { R.go('chat'); R.addFiles(mds); }
    else if (imgs.length) { R.go('chat'); R.addImages(imgs).then(function () { R.toast('🖼️ 加了 ' + Math.min(imgs.length, 4) + ' 张图，写句话就能发', 2200); }); }
    else if (books.length) { R.go('book'); R.importBook(books[0]); if (books.length > 1) R.toast('一次放一本，先放了《' + books[0].name.replace(/\.[^.]+$/, '') + '》', 2600); }
    else R.toast('这个文件我认不出来，图片或者 epub / txt / pdf 才行', 2600);
  });

  /* ---------- 3. 比分小窗 ---------- */
  var bar = document.createElement('div');
  bar.className = 'mscore'; bar.hidden = true; bar.title = '点一下去 Football；⧉ 弹出置顶小窗';
  document.body.appendChild(bar);
  var up = [], pip = null;

  function fmtT(t) { var d = new Date(t); return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); }
  function line() {
    var L = R.live();
    if (L.length) {
      var e = L[0];
      return { live: true, html: '<b>' + esc(e.home) + ' ' + esc(e.hs) + ':' + esc(e.as) + ' ' + esc(e.away) + '</b> · ' + esc(e.state === 'in' ? (e.clock || 'LIVE') : '终场') + (L.length > 1 ? ' · 等 ' + L.length + ' 场' : '') };
    }
    var n = up.filter(function (x) { return x.t > Date.now() - 2 * 36e5; })[0];
    if (n && n.t - Date.now() < 6 * 36e5) return { live: false, html: fmtT(n.t) + ' ' + esc(n.home) + ' vs ' + esc(n.away) };
    return null;
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function render() {
    var l = line();
    if (!l && !pip) { bar.hidden = true; return; }
    var inner = '<i class="dot' + (l && l.live ? '' : ' pre') + '"></i><span>' + (l ? l.html : '现在没有比赛') + '</span>';
    bar.innerHTML = inner + (window.documentPictureInPicture ? '<button data-pip title="弹出置顶小窗">⧉</button>' : '');
    bar.hidden = false;
    if (pip) { var b = pip.document.getElementById('s'); if (b) b.innerHTML = inner; }
  }
  bar.addEventListener('click', function (e) {
    if (e.target.closest('[data-pip]')) { openPip(); return; }
    R.go('foot');
  });

  async function openPip() {
    if (!window.documentPictureInPicture) { R.toast('这个浏览器不支持置顶小窗，用 Chrome 或 Edge 试试', 2600); return; }
    if (pip) { pip.focus(); return; }
    try {
      pip = await documentPictureInPicture.requestWindow({ width: 260, height: 44 });
    } catch (e) { R.toast('小窗没打开：' + (e.message || e), 2400); return; }
    var dark = matchMedia('(prefers-color-scheme: dark)').matches;
    pip.document.head.innerHTML = '<meta charset="utf-8"><title>比分</title><style>' +
      'html,body{margin:0;height:100%;background:' + (dark ? '#2a1d10' : '#fff6e6') + ';color:' + (dark ? '#f6e6c8' : '#432a14') + ';font:500 13px/1.2 "Noto Sans SC","PingFang SC","Microsoft YaHei",sans-serif;overflow:hidden}' +
      '#s{display:flex;align-items:center;gap:7px;height:100%;padding:0 12px;white-space:nowrap}#s span{overflow:hidden;text-overflow:ellipsis}#s b{font-variant-numeric:tabular-nums}' +
      '.dot{width:7px;height:7px;border-radius:50%;background:#e0483a;flex:none;animation:p 1.4s ease-in-out infinite}.dot.pre{background:#a08060;animation:none}@keyframes p{50%{opacity:.25}}</style>';
    pip.document.body.innerHTML = '<div id="s"></div>';
    R.keep(true); render();
    pip.addEventListener('pagehide', function () { pip = null; R.keep(false); render(); });
    R.toast('小窗弹出来了，把它拖到左下角，下次会记住位置', 2800);
  }

  function refreshUp() { R.upcoming().then(function (l) { up = l || []; render(); }).catch(function () {}); }
  refreshUp(); setInterval(refreshUp, 5 * 6e4);
  setInterval(render, 15000); setTimeout(render, 4000);

  /* ---------- 4. 雾中卷宗 ---------- */
  (function () {
    var ACT = '🥱😶‍🌫️', STOP = '😶‍🌫️😶‍🌫️';
    var norm = function (s) { return String(s || '').replace(/️/g, '').trim(); };
    var RULE = [
      '【雾中卷宗模式】猫猫想听真实刑事案件的睡前故事（参考 DardoMoon 的 mist-dossier）。核心：讲给人听的故事，不是案件调查报告。',
      '优先级：准确和尊重真实的人 > 可靠可追溯的来源 > 案件本身撑得起一段完整叙述 > 防剧透和连贯 > 舒服自然的节奏。绝不为了悬念牺牲准确和尊严。',
      '选案：全球范围，不偏英语、美国、欧洲或热门案子；优先未破案、身份未明、失踪等，也可以是冷门但调查过程有看头的已破案件；连续几次尽量换国家地区，但不能为此降低可靠性；不因为血腥猎奇选案。推荐前必须先用联网搜索做调研：通常至少三个彼此独立、可追溯的可靠来源（官方/法庭材料、当时的报道、严肃调查报道、学术或档案研究；同一篇报道的转载不算独立），能拼出有来源的时间线，并且有两三处真正的进展（新发现、改变局面的证词、调查方向转变、新的鉴定结果、嫌疑范围变化、有记录的调查失误等）。只靠谣言、阴谋论、单一来源撑着的案子不要；资料不够就换案，宁缺毋滥，可以直说暂时没有合格的候选。尽量查案发地当地语言的资料。',
      '证据：心里清楚每句话属于哪一类——已证实的事实、警方/检方/法院的官方说法、证人陈述、媒体报道、专家解读、有争议的指控、未经证实的推测——讲的时候用平常话交代清楚，不把指控说成事实、不把警方推论说成判决。来源互相矛盾就说矛盾在哪；查不到就说查不到，绝不编造引语、记录、来源。',
      '防剧透：结局没讲到之前，不说出凶手和决定性答案，也不用语气、强调、反应去暗示；猫猫猜嫌疑人时，只讨论已讲出的证据支持什么、不支持什么，不确认也不否认她猜得对不对。可以为了好懂调整讲述顺序，但不能改时间线、隐瞒会改变证据含义的背景、制造假象。揭晓时讲清结论、关键证据、调查过程、残留争议和准确的法律状态（起诉不等于定罪）。未破案就停在已知、未知和目前官方状态，绝不发明凶手或动机。',
      '讲法：熟悉、自然、温暖的聊天口吻，像睡前在灯下讲故事，不是纪录片旁白、讲课、播报或案情简报。从一个具体的人、地方、普通的一天或一个物件开始，人物和背景慢慢带出来，先说清某人为什么重要再加新名字。每次只讲一小段连贯的内容，不要一次塞好几个调查进展；在自然的停顿处停下。不要“第一幕”“第二阶段”这种标签，不要每段预告、总结、强行制造悬念或结尾抛问题，不出题、不要求她推理、不反复问要不要继续。她插话、提问、说自己的猜测或聊别的，先回应她；不嘲笑错误猜想，也不为了让她高兴附和没有证据的猜想。不渲染血腥细节、不用吓人的形容词和故作阴森的语气。可以有真实的好奇、克制的反应、同情，偶尔对官僚程序或人性矛盾冷幽默，但绝不拿受害者的死亡、伤痛和家属的悲伤开玩笑。正文里少用颜文字和卖萌。',
      '结束一个案件时：已破案讲清结论、关键证据、调查路径、法律状态和残留争议；未破案讲清已知、未知和目前官方状态；附一份简短来源列表；把猫猫的推理和有记录的结论分开。',
      '【进度记录，必须】这个模式下的每一条回复最后，都附一份最新的进度记录，用 [[卷宗]] 和 [[/卷宗]] 包起来。界面会把它藏起来存好、下次原样还给你，猫猫看不到，所以没讲到的结局也要写进去。格式（400 字以内）：\n[[卷宗]]\n案件：（还在挑就写“挑选中”，并列出候选）\n状态：未破/已破/身份未明等，及目前法律或调查状态\n讲到哪：\n已经讲过的事实：（简短，标来源）\n猫猫的问题和猜测：\n还没揭晓的（含结局，绝不能提前说）：\n下一段从哪儿接：\n来源：（网址或出处）\n[[/卷宗]]'
    ].join('\n\n');

    var M = function () { var m = R.mem(); if (!m.dossier) m.dossier = { on: false }; return m.dossier; };
    var noteBlock = function (d) { return d.note ? '\n\n【上次的进度记录（只有你看得到）】\n' + d.note : '\n\n（目前没有进度记录。）'; };

    R.hooks.before = function (text, c) {
      var d = M(), t = norm(text), here = d.on && String(d.conv) === String(c.id);
      if (t === norm(ACT)) {
        d.on = true; d.conv = c.id; d.at = Date.now(); R.save(); render();
        return { sys: RULE + noteBlock(d) + '\n\n这一条是开场暗号。有可靠的进度记录就从“下一段从哪儿接”自然地接着讲（先用一两句帮她回忆到哪了）；没有就先联网调研，给两三个已经核查过、值得讲的候选案件（每个一两句不剧透的介绍），让她挑。', web: true, uses: 8, busy: '翻卷宗中…', searching: '在雾里翻资料…' };
      }
      if (t === norm(STOP) && here) {
        d.on = false; R.save(); render();
        return { sys: '【雾中卷宗·收尾】猫猫发了结束暗号：立刻停下案件，回到平常聊天，用一两句温柔地收个尾就好，不要再讲案情。回复最后照常附一份最新的 [[卷宗]] 进度记录，方便下次接着讲。' + noteBlock(d) };
      }
      if (here) return { sys: RULE + noteBlock(d), web: true, uses: 5, busy: '翻卷宗中…', searching: '在雾里翻资料…' };
      return null;
    };
    var RX = /\[\[卷宗\]\]([\s\S]*?)\[\[\/卷宗\]\]/g;
    R.hooks.strip = function (s) {
      s = String(s || '').replace(RX, '');
      var i = s.indexOf('[[卷宗]]'); if (i >= 0) s = s.slice(0, i);
      return s.replace(/\[\[?(卷宗?\]?\]?)?$/, '').replace(/\s+$/, '');
    };
    R.hooks.reply = function (s, c) {
      var d = M(), last = null, m;
      RX.lastIndex = 0; while ((m = RX.exec(s))) last = m[1];
      if (last != null && String(d.conv) === String(c.id)) {
        d.note = last.trim().slice(0, 4000); d.at = Date.now();
        var cm = d.note.match(/案件[：:]\s*([^\n]+)/); d.case = cm ? cm[1].trim().slice(0, 40) : '';
        R.save(); render();
      }
      return R.hooks.strip(s) || s.replace(RX, '').trim() || '嗯。';
    };

    var chip = document.createElement('div');
    chip.className = 'mistchip'; chip.hidden = true;
    document.body.appendChild(chip);
    chip.addEventListener('click', function (e) {
      if (e.target.closest('[data-stop]')) R.send(STOP);
    });
    function render() {
      var d = M(), here = d.on && String(d.conv) === String(R.conv()) && !document.getElementById('vChat').hidden;
      document.body.classList.toggle('mist', !!here);
      if (!here) { chip.hidden = true; return; }
      var name = d.case && !/挑选中/.test(d.case) ? d.case : '挑案子中';
      chip.innerHTML = '<span>🌫️ 雾中卷宗 · ' + esc(name) + '</span><button data-stop title="等于发送 😶‍🌫️😶‍🌫️">今晚就到这</button>';
      chip.hidden = false;
      var mr = document.getElementById('msgs').getBoundingClientRect(); if (mr.width) chip.style.left = (mr.left + mr.width / 2) + 'px';
    }
    setInterval(render, 1000); render();
  })();
})();
