function getElByXPath(xpath, elt) { // return elements in array matching xpath exp in parsed XML elt
    var r = [], res = elt.evaluate(xpath, elt, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null), i = 0, el
    while ((el = res.snapshotItem(i++)) != null) {
        if (el instanceof Attr) r.push(el.nodeValue)
        else if (el instanceof Text && el.data) r.push(el.data)
        else if (el instanceof Element && el.outerHTML) r.push(el.outerHTML)
        else r.push(el)
    }
    return r;
}
function parseXML(xml) { // Todo: handle namespaces correctly iso just removing it
    return (new DOMParser()).parseFromString(xml.replace(/xmlns="[^"]+"/g, ""), "text/xml")
}
export { getElByXPath, parseXML }