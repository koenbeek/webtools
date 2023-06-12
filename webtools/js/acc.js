// js code based on https://github.com/arhs/iban.js/blob/master/iban.js
var NON_ALPHANUM = /[^a-zA-Z0-9]/g,
    A = 'A'.charCodeAt(0),
    Z = 'Z'.charCodeAt(0);

function iso13616Prepare(iban) {
    iban = iban.toUpperCase();
    iban = iban.substr(4) + iban.substr(0, 4);

    return iban.split('').map(function (n) {
        var code = n.charCodeAt(0);
        if (code >= A && code <= Z) { // A = 10, B = 11, ... Z = 35
            return code - A + 10;
        } else {
            return n;
        }
    }).join('');
}

function iso7064Mod97_10(iban) {
    var remainder = iban, block;
    while (remainder.length > 2) {
        block = remainder.slice(0, 9);
        remainder = parseInt(block, 10) % 97 + remainder.slice(block.length);
    }
    return parseInt(remainder, 10) % 97;
}

function toIBAN(ctry, bban, human) {
    bban = bban.replace(NON_ALPHANUM, '').toUpperCase();
    var remainder = iso7064Mod97_10(iso13616Prepare(ctry + '00' + bban)),
        checkDigit = ('0' + (98 - remainder)).slice(-2);
    var iban = ctry + checkDigit + bban;
    return human ? iban.replace(/.{4}(?=.)/g, '$& ') : iban
}

export { toIBAN }
