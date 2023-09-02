let tools = new Map() // map with available tools (+ a none for the select box)
let active = [] // tools active on the webpage
let ars = [] // list of dynamic arrays

tools.set('none', { title: 'Select Tool' })

tools.set('bban2iban', {
  run: (n) => {
    const pf = "t" + n + "_", c = gC(pf + "c"), h = gC(pf + "hum"), ct = gV(pf + "ctry")
    gE("txt" + n).value = gV("txt" + (n - 1)).split('\n').map(l => { return toIBAN(c ? l.slice(0, 2) : ct, c ? l.slice(2) : l, h) }).join("\n");
  },
  intxt: [10, 100],
  outxt: [10, 100],
  title: 'BBAN to IBAN',
  inputs: [
    { id: 'ctry', typ: 'text', siz: 2, val: "BE", lbl: "Country" },
    { id: 'c', typ: 'checkbox', val: false, lbl: "Country code in Input text (f.ex. BE 979931653073)" },
    { id: 'hum', typ: 'checkbox', val: false, lbl: "IBAN in human format" },
  ]
})

tools.set('grep', {
  run: (n) => {
    try {
      const pf = "t" + n + "_";
      let re = new RegExp(gV(pf + "pat"), gC(pf + "ic") ? "i" : "")
      let ls = gV("txt" + (n - 1)).split('\n').filter(l => (l.match(re) != null) != gC(pf + "inv")) // filter lines
      if (gC(pf + "match") && !gC(pf + "inv")) { ls = ls.map(l => l.match(re)[0]) } // only keep matched part
      gE("txt" + n).value = ls.join("\n")
      sOK(pf + "pat")
    } catch (e) { sErr(pf + "pat", e, "txt" + n) }
  },
  intxt: [10, 100],
  outxt: [10, 100],
  title: 'Match Lines',
  inputs: [
    { id: 'pat', typ: 'text', siz: 50, val: "", lbl: "Pattern", help: '<a href="docs/regex.html" target="_blank">cheatsheet</a>' },
    { id: 'inv', typ: 'checkbox', val: false, lbl: "Invert match (only keep non-matching lines)" },
    { id: 'ic', typ: 'checkbox', val: false, lbl: "Ignore case" },
    { id: 'match', typ: 'checkbox', val: false, lbl: "Only Matching (only keep part that matched)" },
  ]
})

tools.set('lines2list', {
  run: (n) => {
    const pf = "t" + n + "_";
    let t = gV("txt" + (n - 1)).split('\n'), q = gV(pf + "quote")
    t = t.map(l => gC(pf + "lead") ? l.trimLeft() : l).map(l => gC(pf + "trail") ? l.trimEnd() : l)
    if (gC(pf + "empty")) { t = t.filter(l => l.length > 0) }
    gE("txt" + n).value = t.map(l => q + l + q).join(gV(pf + "sep"))
  },
  intxt: [10, 100],
  outxt: [10, 100],
  title: 'Lines To List',
  inputs: [
    { id: 'sep', typ: 'text', siz: 4, val: ",", lbl: "Separator String" },
    { id: 'quote', typ: 'text', siz: 1, val: "'", lbl: "Quote Char" },
    { id: 'empty', typ: 'checkbox', val: true, lbl: "Remove empty lines" },
    { id: 'lead', typ: 'checkbox', val: true, lbl: "Remove leading whitespace" },
    { id: 'trail', typ: 'checkbox', val: true, lbl: "Remove trailing whitespace" },
  ]
})

tools.set('exampleibans', {
  run: (n) => {
    const pf = "t" + n + "_";
    const ctrs = gV(pf + "ctrs").toUpperCase().split(","), nbr = Number(gV(pf + "nbr")); let IBANs = [], c
    gE("txt" + n).value = [...Array(nbr)].map(_ => IBANex(c = ran(ctrs), gC(pf + "hum")) || (c + " ?")).join("\n")
  },
  intxt: false,
  outxt: [10, 100],
  title: 'Example IBANs',
  inputs: [
    { id: 'ctrs', typ: 'text', siz: 30, val: "BE,ES,FR,IT,NL,PT,PL,LU", lbl: "Countries" },
    { id: 'nbr', typ: 'text', siz: 5, val: "15", lbl: "Number of IBANs" },
    { id: 'hum', typ: 'checkbox', val: true, lbl: "Human format" },
  ]
})

tools.set('matchlist', {
  run: (n) => {
    const pf = "t" + n + "_", pat = gV(pf + "match"), s = gV(pf + "sc"); let ms = []
    sOK(pf + "match")
    if (pat == "") { gE("txt" + n).value = ""; return }
    function addm(txt) { let m = txt.match(re); (m != null) ? gC(pf + "glob") ? ms = ms.concat(m) : ms.push(m[0]) : 1 } // helper: add all matches in txt to the matches list
    try { // execute matches on full text or each line depending on scope (sc) setting
      var re = new RegExp(pat, (gC(pf + "ic") ? "i" : "") + (gC(pf + "glob") ? "g" : "") + (s == "M" ? "m" : ""))
      if (s == "L") { gV("txt" + (n - 1)).split("\n").forEach(l => addm(l)); } else { addm(gV("txt" + (n - 1))) }
      gE("txt" + n).value = ms.map(m => m.replace(re, gE(pf + "list").value)).join("\n")
    } catch (e) { sErr(pf + "match", e, "txt" + n) }
  },
  intxt: [10, 150],
  outxt: [10, 150],
  title: 'List Matches',
  inputs: [
    { id: 'match', typ: 'text', siz: 50, val: "", lbl: "Match pattern", help: '<a href="docs/regex.html" target="_blank">cheatsheet</a>' },
    { id: 'list', typ: 'text', siz: 50, val: "$&", lbl: "List pattern" },
    {
      id: 'sc', typ: 'select', lbl: "Match scope", ops: [
        { op: "F", val: 'Full (^ and $ on doc level)', sel: false },
        { op: "M", val: 'Full (^ and $ on line level)', sel: true },
        { op: "L", val: 'Line by Line match', sel: false }
      ]
    },
    { id: 'ic', typ: 'checkbox', val: false, lbl: "Ignore case" },
    { id: 'glob', typ: 'checkbox', val: true, lbl: "Global match (more than 1 match possible)" },
  ]
})

tools.set('xpathlist', {
  run: (n) => {
    const pf = "t" + n + "_";
    sOK([pf + "xp", "txt" + (n - 1)])
    let elt = parseXML(gV("txt" + (n - 1))) // parse XML
    if (XMLerr(elt, "txt" + (n - 1), "txt" + n)) return // stop if parse erro
    try { gE("txt" + n).value = getElByXPath(gV(pf + "xp"), elt).join("\n") } catch (e) { sErr(pf + "xp", e, "txt" + n) }
  },
  intxt: [10, 100],
  outxt: [10, 100],
  title: 'XPath to list',
  inputs: [
    { id: 'xp', typ: 'text', siz: 40, val: "", lbl: "XPath", help: '<a href="docs/ xpath.html" target="_blank">cheatsheet</a>' }
  ]
})

tools.set('xpathslist', {
  run: (n) => {
    const pf = "t" + n + "_";
    let elt = parseXML(gV("txt" + (n - 1))), lines = []; const lp = gV(pf + "lp")
    if (XMLerr(elt, "txt" + (n - 1), "txt" + n)) return
    sOK(["txt" + (n - 1)]);
    for (let l = 1, found = true, v = []; found; l++) { // add lines while predicat matches are found in XML
      found = false
      for (let i = 1; gE(pf + "xp" + i) && gV(pf + "xp" + i); i++) { // try each XPath match -> fill in v array
        let id = pf + "xp" + i, xp = gV(id).replace(/\[i\]/, "[" + l + "]"), pred = gV(id) != xp; sOK(id)
        try { let els = getElByXPath(xp, elt); v[i] = els[0] || ""; if (pred && els.length > 0) found = true; } catch (e) { sErr(id, e) }
      }
      let line = lp, xlen = 0, repl, m, re = /\$\$|\${[0-9]+}/gd
      while (m = re.exec(lp)) { // find $$ and $n and replace it with $ or nth Xpath match
        if ((repl = m[0][1] == "$" ? "$" : v[m[0].slice(2, -1)]) == null) continue
        line = line.slice(0, m.index + xlen) + repl + line.slice(m.index + xlen + m[0].length)
        xlen += repl.length - m[0].length
      }
      if (found) lines.push(line)
    }
    gE("txt" + n).value = lines.join("\n")
  },
  intxt: [10, 100],
  outxt: [10, 100],
  title: 'Multiple XPaths to list',
  inputs: [
    { id: 'xp', typ: 'array', siz: 40, val: "", lbl: "XPath", help: 'use predicate [i] to select a record - f.ex. (//tag)[i]/text() -- <a href="docs/xpath.html" target="_blank">XPath cheatsheet</a><br>' },
    { id: 'lp', typ: 'text', siz: 40, val: "", lbl: "List Pattern", help: ' &nbsp;f.ex: acc: ${1} balance: $$${2} -- ${n} = nth XPath, $$ = $' }
  ]
})

tools.set('replace', {
  run: (n) => {
    const pf = "t" + n + "_", s = gV(pf + "sc"), r = gV(pf + "r")
    try {
      let re = new RegExp(gE(pf + "m").value, (gC(pf + "ic") ? "i" : "") + (gC(pf + "gl") ? "g" : "") + (s == "M" ? "m" : ""))
      gE("txt" + n).value = (s == "L") ? gV("txt" + (n - 1)).split('\n').map(l => l.replace(re, r)).join("\n") : gV("txt" + (n - 1)).replace(re, r)
      sOK(pf + "m")
    } catch (e) { sErr(pf + "m", e, "txt" + n) }
  },
  intxt: [10, 150],
  outxt: [10, 150],
  title: 'REplace Text',
  inputs: [
    { id: 'm', typ: 'text', siz: 50, val: "", lbl: "Match Pattern", help: '<a href="docs/regex.html" target="_blank">cheatsheet</a>' },
    { id: 'r', typ: 'text', siz: 50, val: "", lbl: "Replace Pattern", help: "match: $&amp; - precedes: $`- follows: $' - group: $n - named: $&lt;Name&gt;" },
    {
      id: 'sc', typ: 'select', lbl: "Match scope", ops: [
        { op: "F", val: 'Full (^ and $ on doc level)', sel: false },
        { op: "M", val: 'Full (^ and $ on line level)', sel: true },
        { op: "L", val: 'Line by Line match', sel: false }
      ]
    },
    { id: 'ic', typ: 'checkbox', val: false, lbl: "Ignore case" },
    { id: 'gl', typ: 'checkbox', val: true, lbl: "Global match (more than 1 match possible)" },
  ]
})

tools.set('sort', {
  run: (n) => {
    const pf = "t" + n + "_";
    let lines = [], re, key = gV(pf + "key"), sep = gV(pf + "sep"), range = gV(pf + "range"), comma = gV(pf + "comma"), reopt = gC(pf + "ic") ? "igd" : "gd"

    // basic input value checks
    if (key != "" && sep != "") { sErr([pf + "key", pf + "sep"]); return }; sOK([pf + "key", pf + "sep"]) // can't have key and sep regexp at same time
    if (range != "" && sep == "" && key == "") { key = "." } // no key nor sep but a range is specified ? -> each character is a key
    try { re = new RegExp(key != "" ? key : sep, reopt) } catch (e) { sErr(pf + (key != "" ? "key" : "sep"), e, "txt" + n); return }

    // determine key values for each line -> lines array
    let inlines = gV("txt" + (n - 1)).split('\n')
    if (gC(pf + "unique")) { inlines = [... new Set(inlines)] }
    inlines.map(l => { // for each input line ...
      let allkeys = [], m // determine all the key values for this line l based on sep or key regex
      if (key != "") { allkeys = l.match(re) || [] }
      if (sep != "") { for (var s = 0; m = re.exec(l); allkeys.push(l.slice(s, m.indices[0][0])), s = m.indices[0][1]); allkeys.push(l.slice(s)) }

      range = range.replace(/[^0-9,n-]/g, '') // remove invalid characters from range input
      let sortkey = "" // this "key" will be used to sort the lines on (it's actually just a string composed of all keys seperated by & null char)
      if (range == "") { // no range -> take all keys from 1 to end or full line value if no keys (i.e. no key nor sep regex specified)
        (key == "" && sep == "") ? sortkey = l : sortkey = allkeys.join("\0")
      } else { // determine start and end key nbrs for each key sort range (seperated by dashes '-') and determine sort options : n = numeric
        let start, end
        range.split(",").forEach(r => { // for each keyrange
          let dash = r.indexOf("-"), num = (r.slice(-1) == "n") // '-' position and numeric sort flag
          if (dash == -1) { end = start = parseInt(r.slice(0, num ? -1 : 99999)) } // no range just 1 key -> start = end
          else { start = parseInt(r.slice(0, dash)); end = parseInt(r.slice(dash + 1, num ? -1 : 99999)) } // range of keys from start to end
          for (let k = start; k <= end; k++) { // for each key in the range - add keyvalue to sortkey
            let key = allkeys[k - 1] ?? ""
            if (num) { // numerify the field -> remove all non numeric stuff (except "comma") - then add zeroes to start and end 
              key = key.replace(/[^0-9,.]/g, '').replace(comma == "," ? "." : ",", '') // only digits and our "comma"
              c = key.indexOf(comma)
              prefix = '0'.repeat(Math.max(0, 30 - ((c == -1) ? key.length : c))) // 30 digits before "comma"
              postfix = c == -1 ? comma + '0'.repeat(30) : '0'.repeat(Math.max(0, 31 - key.length + c)) // 30 digits after "comma"
              key = prefix + key + postfix // align comma for all numbers so we can compare as a text string 
              // Todo: correct numeric sort "hack" - now we use 30 digits before comma and 30 after comma and treat as text - should ideally be better handled
            }
            sortkey += key + "\0"
          } // end for each key in range
        }) // end for each keyrange
      } // sortkey filled in
      lines.push({ l: l, k: gC(pf + "ic") ? sortkey.toUpperCase() : sortkey })
    })

    // sort lines based on key k in lines array
    gE("txt" + n).value = lines.sort((a, b) => { let x = a.k, y = b.k; if (gC(pf + "inv")) { [x, y] = [y, x] }; return ((x < y) ? -1 : ((x > y) ? 1 : 0)) }).map(l => l.l).join("\n")
  },
  intxt: [10, 100],
  outxt: [10, 100],
  title: 'Sort Lines',
  inputs: [
    { id: 'key', typ: 'text', siz: 50, val: "", lbl: "Key RegExp", help: 'ex.: keyvalue:[A-Z0-9]{16}' },
    { id: 'sep', typ: 'text', siz: 50, val: "", lbl: "Seperator RegExp", help: 'ex.: [,;]' },
    { id: 'range', typ: 'text', siz: 50, val: "", lbl: "Key Range", help: 'ex.: 4n,5-7n,1' },
    {
      id: 'comma', typ: 'select', lbl: "Numeric comma", ops: [
        { op: ",", val: 'European (,)', sel: true },
        { op: ".", val: 'American (.)', sel: false },
      ]
    },
    { id: 'inv', typ: 'checkbox', val: false, lbl: "Inverse order" },
    { id: 'ic', typ: 'checkbox', val: false, lbl: "Ignore case" },
    { id: 'unique', typ: 'checkbox', val: false, lbl: "Unique lines only" },
  ]
})

async function setupPage() {
  let html = ""
  html += '<select id="tool" onchange="addTool()">' + "\n"
  tools.forEach((t, k) => { html += '<option value="' + k + '">' + t.title + "</option>\n" })
  html += "</select><br>\n"
  addChild("div", { innerHTML: html }, "selecttool")

  // check URL parameters
  const p = new URLSearchParams(document.location.search) // capture URL parameters
  if (p.has("paramfile")) { try { const js = await (await fetch(p.get("paramfile"))).json(); Object.keys(js).forEach(k => p.append(k, js[k])) } catch (e) { } } // get parameters from a parameter file in JSON format 
  let tooln = 1;
  while (p.has("tool" + tooln)) { gE("tool").value = p.get("tool" + tooln++); addTool() }
  ars.forEach(a => { // for each array : a is like { pf: "t1_", i: "xp", t: "XPath ", s: "40", n: 5 } - A.n is the current nbr of input fields active
    let i = 2;
    do { addArEl(a.pf, a.i, ++a.n, a.t, a.s) } while (p.has(a.pf + a.i + (i++))); a.n = --i;
  })
  InEls((e => { if (p.has(e.id)) { e.type === 'checkbox' ? e.checked = (p.get(e.id) == "on") : e.value = p.get(e.id) } })) // for each input : set value from URL parameter

  window.run()

  let goURL = (input) => { // function used to make URL with params = current params
    let p = {};
    active.forEach((t, i) => { p["tool" + (i + 1)] = t })
    InEls(e => { if ((e.id != "tool") && (e.id != "txt0")) p[e.id] = gV(e.id) });
    if (input && (tools.get(active[0]).intxt != false)) { p["txt0"] = gV("txt0") }
    window.open(window.location.pathname + '?' + new URLSearchParams(p).toString())
  }
  let goParamURL = () => { goURL(false) }
  let goAllURL = () => { goURL(true) }
  document.body.appendChild(createEl("button", { onclick: goParamURL, innerHTML: "make parameter URL link" }))
  document.body.appendChild(createEl("button", { onclick: goAllURL, innerHTML: "make parameter and input URL link" }))
  // button for param URL at end of body
}

function addTool() {
  active.push(gV("tool"))
  let n = active.length, div = gE("tools"), tool = "tool" + n, t = tools.get(gV("tool"))

  if (t.intxt && (n == 1)) { div.appendChild(intxt(t.intxt)) } // create input text element : txt0

  addChild("div", { innerHTML: "<h2>" + t.title + "</h2>" }, "tools") // tool title
  addChild("div", { id: tool }, "tools") // create tooln div
  let e = gE(tool), html = "", pf = "t" + n + "_"

  t.inputs.forEach((i) => { // create input elements in tool1 div
    switch (i.typ) {
      case "text":
        html = "<label>" + i.lbl + ":&nbsp;<input type='text' id='" + pf + i.id + "' size=" + i.siz + "'" + (i.val ? " value='" + i.val + "'" : "") + "></label>" + (i.help ?? "") + "<br>"
        break;
      case "checkbox":
        html = "<label><input type='checkbox' id='" + pf + i.id + "'" + (i.val ? " checked" : "") + ">" + i.lbl + "</label><br>"
        break;
      case "select":
        html = "<label>" + i.lbl + ":&nbsp;\n"
        html += "<select id='" + pf + i.id + "'>\n"
        i.ops.forEach((op) => { html += "<option value='" + op.op + "'" + (op.sel ? " selected='selected'" : "") + ">" + op.val + "</option>\n" })
        html += "</select></label><br>\n"
        break;
      case "array":
        html = '<div id="' + pf + i.id + 's">' + i.help + '</div>'
        break;
    }
    addChild('div', { innerHTML: html }, "tool" + n)
    if (i.typ == "array") { ars.push({ pf: "t" + n + "_", i: i.id, t: i.lbl, s: i.siz, n: 0 }) }
  })

  if (t.outxt) { e.appendChild(outxt(t.outxt, n)) } // create output text element : txtn

  InEls((e) => { gE(e.id).addEventListener("input", window.run) })
  window.run()

  gE("tool").value = "none"
}

window.run = () => {
  active.forEach((t, i) => { tools.get(t).run(i + 1) }) // run run() for each active tool
  ars.forEach(a => { // for each array : a is like { pf: "t1_", i: "xp", t: "XPath ", s: "40", n: 5 } - A.n is the current nbr of input fields active
    if (a.n == 0) { addArEl(a.pf, a.i, ++a.n, a.t, a.s) } // at least 1 element
    while ((a.n > 1) && ((gV(a.pf + a.i + a.n) == "") && (gV(a.pf + a.i + (a.n - 1)) == ""))) { gE(a.pf + a.i + "s").removeChild(gE("div" + a.pf + a.i + a.n--)) } // leave at most 1 empty array element at end
    if (gV(a.pf + a.i + a.n) != '') { addArEl(a.pf, a.i, ++a.n, a.t, a.s) } // add element at end if last is not empty
  })
}
