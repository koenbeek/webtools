// code based on https://github.com/arhs/iban.js/blob/master/iban.js
// info about country specific BBAN checkdigits from 
//     - https://docs.oracle.com/cd/E18727_01/doc.121/e13483/T359831T498954.htm
// and - https://github.com/globalcitizen/php-iban/issues/39
// and - https://www.ecbs.org/iban.htm
//   not all countries are supported for BBAN checkdigits

import { ran, ranTxt } from './lib.js';

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

function toIBAN(ctry, bban, human = false) {
    bban = bban.replace(NON_ALPHANUM, '').toUpperCase();
    var remainder = iso7064Mod97_10(iso13616Prepare(ctry + '00' + bban)),
        checkDigit = ('0' + (98 - remainder)).slice(-2);
    var iban = ctry + checkDigit + bban;
    return human ? iban.replace(/.{4}(?=.)/g, '$& ') : iban
}

const BBANformats = new Map([
    // we consider bankcode and subbankcode as 1 large bankcode - strictly incorrect but enough for our use cases
    // blist is incomplete - just used as example bankcode when generating examples - not used to check BBAN validity
    ['BE', { re: /^[0-9]{12}$/, len: 12, bpos: 0, blen: 3, blist: ['000', '299', '979', '210'], apos: 3, alen: 7, cdpos: 10, cdlen: 2 }],
    ['ES', { re: /^[0-9]{20}$/, len: 20, bpos: 0, blen: 8, blist: ['21000418', '20951234', '04879876', '14655678'], apos: 10, alen: 10, cdpos: 8, cdlen: 2 }],
    ['FR', { re: /^[0-9]{10}[0-9A-Z]{11}[0-9]{2}$/, len: 23, bpos: 0, blen: 10, blist: ['3000600001', '2004101005', '3000400003', '3000100794'], apos: 10, alen: 11, cdpos: 21, cdlen: 2 }],
    ['NL', { re: /^[A-z0-9]{4}[0-9]{10}$/, len: 14, bpos: 0, blen: 4, blist: ['ABNA', 'RABO', 'INGB'], apos: 4, alen: 10, cdpos: 0, cdlen: 0 }]
])

// check BBAN format and CD is OK (no check on bankcode existence) - returns true when OK - false when KO
// returns null if country is not supported
function BBANok(ctry, bban) {
    if (!BBANformats.has(ctry)) { return null; };
    if (!bban.match(BBANformats.get(ctry).re)) { return false; };
    var result = BBANcd(ctry, bban);
    return ((result != null) && (bban == result.bban));
}

// calculate cd of a BBAN, CD and BBAN with CD is returned - i.e. we return {cd:'73', bban:'979931653073'] for BE
// as input a BBAN in full length should be given - at CD position any value can be stored - f.ex. 979931653000
// no bban format check is carried out
// in case the country is not supported or a cd cannot be calculated a null is returned
function BBANcd(ctry, bban) {
    switch (ctry) {
        case 'BE': // modulo 97 on first 10 digits - if 00 -> 97
            try {
                bban = bban.substring(0, 10);
                var cd = parseInt(bban) % 97;
                cd = (cd == 0) ? 97 : cd;
                cd = String(cd).padStart(2, '0');
                bban = bban.substring(0, 10) + cd;
                return { bban: bban, cd: cd }
            } catch (e) { return null; }
        case 'ES': try { // CD1 = weighted CD on bank & branch code - CD2 weighted CD on acc nbr -- then 11 - MOD 11
            var s1 = 0, s2 = 0, c1, c2;
            [4, 8, 5, 10, 9, 7, 3, 6].forEach((w, i) => { s1 += w * parseInt(bban[i]) });
            [1, 2, 4, 8, 5, 10, 9, 7, 3, 6].forEach((w, i) => { s2 += w * parseInt(bban[i + 10]) })
            c1 = 11 - (s1 % 11)
            c2 = 11 - (s2 % 11)
            if (c1 > 9) { c1 = 11 - c1 }
            if (c2 > 9) { c2 = 11 - c2 }
            return { bban: bban, cd: String(c1) + String(c2) }
        } catch (e) { return null; }
        case 'FR': // (97 - modulo 97 on full bban using 00 as cd) - convert characters to numbers firsts
            try {
                bban = bban.substr(0, 21); // throw away fake cd at the end
                var t = bban.replace(/[AJ]/, '1').replace(/[BKS]/, '2').replace(/[CLT]/, '3');
                t = t.replace(/[DMU]/, '4').replace(/[ENV]/, '5').replace(/[FOW]/, '6');
                t = t.replace(/[GPX]/, '7').replace(/[HQY]/, '8').replace(/[IRZ]/, '9');
                t = BigInt(t + "00");
                var cd = String(97n - (t % 97n)).padStart(2, '0');
                return { bban: bban + cd, cd: cd }
            } catch (e) { return null; }
        case 'NL': // acc = 10 digits - 1st digit * 10, 2nd * 9, 3rd * 8 ... 10th * 1 - sum of all should be divisible by 11
            // not sure if this is also OK for Post and Giro accounts - in national format these start with a G or a P
            //  but these probably follow the same rules in BBAN format
            // todo: make sure P and G accounts are correctly handled by this code
            try {
                var tot = 0, i = 0;
                for (; i < 10; i++) { tot += parseInt(bban[4 + i]) * (10 - i); }
                if (tot % 11 == 0) { return { bban: bban, cd: '' } } else { return null }
            } catch (e) { return null; }
        default: return null;
    }
}

// create an example BBAN for a certain country
// in case the country is not supported a null is returned
function BBANex(ctry) {
    if (!BBANformats.has(ctry)) { return null; };
    var f = BBANformats.get(ctry), b = ran(f.blist), bban = '', acc = ranTxt(f.alen, '01234567890');
    if (ctry == 'NL') { // The Dutch acc nbr doesn't have a seperate CD but a control on acc nbr
        while (BBANcd('NL', 'ABNA' + acc) == null) { acc = ranTxt(f.alen, '01234567890') }
    }
    bban = "0".repeat(f.len)
    bban = bban.substring(0, f.bpos) + b + bban.substring(f.bpos + f.blen, f.len)
    bban = bban.substring(0, f.apos) + acc + bban.substring(f.apos + f.alen, f.len)
    var cd = BBANcd(ctry, bban).cd
    return bban.substring(0, f.cdpos) + cd + bban.substring(f.cdpos + f.cdlen, f.len);
}

// create an example IBAN for a certain country
// in case the country is not supported a null is returned
function IBANex(ctry, human = false) {
    var bban = BBANex(ctry);
    return bban ? toIBAN(ctry, bban, human) : null;
}

export { toIBAN, BBANcd, BBANok, BBANex, IBANex }
