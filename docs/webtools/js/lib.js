function gE(id) { return document.getElementById(id) } // get an Element by ID
function gV(id) { return gE(id).type !== "checkbox" ? gE(id).value : gC(id) ? "on" : "off" } // get an Element value by ID - on/off for checkbox
function gC(id) { return gE(id).checked } // get checked status of a checkbox by ID
function fromCP() { navigator.clipboard.readText().then((t) => { gE("txt0").value = t; window.run() }); } // read clipboard and use it for txt0 textarea content
function toCP(n) { navigator.clipboard.writeText(gV("txt" + n)) } // copy txtn textarea content to clipboard
function setErr(id, e, txt) { gE(id).style.borderColor = "red"; gE(id).style.color = "red"; if (e) gE(txt).value = e.name + ': ' + e.message } // set an element as in error
function setOK(id) { gE(id).style.borderColor = "inherit"; gE(id).style.color = "inherit"; } // set an element as OK
function sErr(ids, e, txt) { if (Array.isArray(ids)) { ids.forEach(id => setErr(id, e, txt)) } else { setErr(ids, e, txt) } } // set elements as in error
function sOK(ids) { if (Array.isArray(ids)) { ids.forEach(id => setOK(id)) } else { setOK(ids) } } // set elements as OK
function r(N) { return Math.floor(Math.random() * N) } // get a random integer nbr between 0 and N not included
function ran(N) { if (Array.isArray(N)) { return N[r(N.length)] } else if (typeof N === 'string') { return N.charAt(r(N.length)) } else { return r(N) } } // get a random el from an Array, char from a string or a number between 0 and N not included// get a random el from an Array, char from a string or a number between 0 and N not included
function ranTxt(len, pool) { let r = '', i = 0; for (; i < len; i++) { r += ran(pool); }; return r } // create random string of length len based on chars in pool 
function ranNum(len) { let n = ranTxt(len, '0123456789'); return len < 16 ? parseInt(n) : BigInt(n) } // create random number of length len
function createEl(typ, attrs) { let el = document.createElement(typ); Object.assign(el, attrs); return el } // create a html document element
function addChild(typ, attrs, id) { gE(id).appendChild(createEl(typ, attrs)) } // add a child element to an existing html document element
function addArEl(pf, pid, i, txt, siz) { let id = pf + pid + i; addChild("div", { id: "div" + id, innerHTML: '<label>' + txt + i + ':&nbsp;<input type="text" id="' + id + '" size=' + siz + ' oninput="run()"></label><br>' }, pf + pid + "s") } // add html element to array
function intxt(i) { return createEl("div", { innerHTML: "<h2>Input <button onclick='fromCP()'>Get From Clipboard</button><button onclick='gE(\"" + "infile" + "\").click()'>Upload File</button><input type='file' style='display:none;' id='infile' onchange='doUL()'/></h2><textarea id='txt0' rows='" + i[0] + "' cols='" + i[1] + "'></textarea>" }) }
function outxt(o, n) { return createEl("div", { innerHTML: "<h2>Output <button onclick='toCP(" + n + ")'>Copy To Clipboard</button><button onclick='doDL(" + n + ")'>Download</button></h2><textarea id='txt" + n + "' rows='" + o[0] + "' cols='" + o[1] + "' readonly></textarea>" }) }
function doUL() { let r = new FileReader(); r.onload = e => { gE('txt0').value = e.target.result; window.run() }; r.readAsText(gE("infile").files[0]) } // upload file as txt0
function doDL(n) { createEl("a", { href: "data:x-application/text," + escape(gV("txt" + n)), download: 'output.txt' }).click() } // download txtn as file
function InEls(f) { ["input[type = 'text']", "#txt0", "input[type='checkbox']", "select"].forEach(q => { document.querySelectorAll(q).forEach(f) }) } // for each input element do f