function gE(id) { return document.getElementById(id) };
function gV(id) { return gE(id).value }
function gC(id) { return gE(id).checked };
function toCP() { navigator.clipboard.writeText(gV("outtext")) }
function doSetup(f) {
    const p = new URLSearchParams(document.location.search);
    ["input[type = 'text']", "#intext", "input[type='checkbox']", "select"].forEach(q => {
        document.querySelectorAll(q).forEach(e => {
            if (p.has(e.id)) { e.type === 'checkbox' ? e.checked = (p.get(e.id) == "on") : e.value = p.get(e.id) }
            gE(e.id).addEventListener("input", f)
        })
    })
    f();
    window[f.name] = f;
    window["toCP"] = toCP;
};
function setErr(id) { gE(id).style.color = "red"; };
function setOK(id) { gE(id).style.color = "inherit"; };
function sErr(ids) { if (Array.isArray(ids)) { ids.forEach(id => setErr(id)) } else { setErr(ids) }; }
function sOK(ids) { if (Array.isArray(ids)) { ids.forEach(id => setOK(id)) } else { setOK(ids) }; }

export { gE, gV, gC, toCP, doSetup, sErr, sOK }