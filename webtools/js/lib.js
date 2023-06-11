function gE(id) { return document.getElementById(id) };
function gV(id) { return gE(id).value }
function gC(id) { return gE(id).checked };
function toCP() { navigator.clipboard.writeText(gE("outtext").value) };
function doSetup(f) {
    const p = new URLSearchParams(document.location.search);
    document.querySelectorAll("input[type='text']").forEach(d => {
        if (p.has(d.id)) { d.value = p.get(d.id) }
        gE(d.id).addEventListener('input', f)
    });
    if (p.has("intext")) { gE("intext").value = p.get("intext") }
    gE("intext").addEventListener('input', f)
    document.querySelectorAll("input[type='checkbox']").forEach(d => {
        if (p.has(d.id)) { d.checked = (p.get(d.id) == "on") }
        gE(d.id).addEventListener('change', f)
    });
    document.querySelectorAll("select").forEach(d => {
        if (p.has(d.id)) { d.value = p.get(d.id) }
        gE(d.id).addEventListener('change', f)
    });
    f();
    window[f.name] = f;
    window["toCP"] = toCP;
};
function setErr(id) { gE(id).style.color = "red"; };
function setOK(id) { gE(id).style.color = "inherit"; };
function sErr(ids) {  if (Array.isArray(ids)) { ids.forEach(id => setErr(id))} else { setErr(id)};}
function sOK(ids) {  if (Array.isArray(ids)) { ids.forEach(id => setOK(id))} else { setOK(id)};}

export { gE, gV, gC, toCP, doSetup, sErr, sOK }