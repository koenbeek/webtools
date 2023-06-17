function gE(id) { return document.getElementById(id) }
function gV(id) { return gE(id).value }
function gC(id) { return gE(id).checked }
function fromCP() { navigator.clipboard.readText().then((t) => { gE("intext").value = t; window.run() }); }
function toCP() { navigator.clipboard.writeText(gV("outtext")) }
function doSetup(f) {
    const p = new URLSearchParams(document.location.search);
    ["input[type = 'text']", "#intext", "input[type='checkbox']", "select"].forEach(q => {
        document.querySelectorAll(q).forEach(e => {
            if (p.has(e.id)) { e.type === 'checkbox' ? e.checked = (p.get(e.id) == "on") : e.value = p.get(e.id) }
            gE(e.id).addEventListener("input", f)
        })
    })
    f()
    window["run"] = f; window["toCP"] = toCP; window["fromCP"] = fromCP
}
function setErr(id) { gE(id).style.color = "red"; }
function setOK(id) { gE(id).style.color = "inherit"; }
function sErr(ids) { if (Array.isArray(ids)) { ids.forEach(id => setErr(id)) } else { setErr(ids) } }
function sOK(ids) { if (Array.isArray(ids)) { ids.forEach(id => setOK(id)) } else { setOK(ids) } }
function r(N) { return Math.floor(Math.random() * N) }
function ran(N) {
    if (Array.isArray(N)) {
        return N[r(N.length)]
    } else if (typeof N === 'string') {
        return N.charAt(r(N.length))
    } else { return r(N) }
}
function ranTxt(len, pool) { var r = '', i = 0; for (; i < len; i++) { r += ran(pool); }; return r }
function ranNum(len) { var n = ranTxt(len, '0123456789'); return len < 16 ? parseInt(n) : BigInt(n) }

export { gE, gV, gC, doSetup, sErr, sOK, ran, ranTxt, ranNum }