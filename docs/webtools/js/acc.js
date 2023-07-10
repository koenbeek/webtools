// iban cd code based on https://github.com/arhs/iban.js/blob/master/iban.js
// info about country specific BBAN checkdigits from
//     - https://docs.oracle.com/cd/E18727_01/doc.121/e13483/T359831T498954.htm
// and - https://github.com/globalcitizen/php-iban/issues/39
// and - https://www.ecbs.org/iban.htm
// not all countries are supported for BBAN checkdigits - see BBANformats & BBANcd
import { ran, ranTxt } from './lib.js'
const A = 'A'.charCodeAt(0)

function iso13616Prepare(iban) {
  iban = iban.slice(4) + iban.slice(0, 4)
  return iban.split('').map(n => { return (n >= 'A') ? n.charCodeAt(0) - A + 10 : n }).join('')
}
function iso7064Mod97_10(iban) { return String(98n - (BigInt(iban) % 97n)).padStart(2, '0'); }
function toIBAN(ctry, bban, human = false) {
  bban = bban.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
  const cd = iso7064Mod97_10(iso13616Prepare(ctry.toUpperCase() + '00' + bban))
  const iban = ctry + cd + bban
  return human ? iban.replace(/.{4}(?=.)/g, '$& ') : iban
}
const BBANformats = new Map([
  // we consider bankcode and branchcode as 1 large bankcode - strictly incorrect but enough for our use case
  // blist is obviously incomplete - just used as example bankcode when generating examples - not used to check BBAN validity
  ['BE', { re: /^[0-9]{12}$/, len: 12, bpos: 0, blen: 3, apos: 3, alen: 7, cdpos: 10, cdlen: 2, blist: ['000', '299', '979', '210'] }],
  ['ES', { re: /^[0-9]{20}$/, len: 20, bpos: 0, blen: 8, apos: 10, alen: 10, cdpos: 8, cdlen: 2, blist: ['21000418', '20951234', '04879876', '14655678'] }],
  ['FR', { re: /^[0-9]{10}[0-9A-Z]{11}[0-9]{2}$/, len: 23, bpos: 0, blen: 10, apos: 10, alen: 11, cdpos: 21, cdlen: 2, blist: ['3000600001', '2004101005', '3000400003', '3000100794'] }],
  ['IT', { re: /^[A-Z]{1}[0-9]{10}[0-9A-Z]{12}$/, len: 23, bpos: 1, blen: 10, apos: 11, alen: 12, cdpos: 0, cdlen: 1, blist: ['0542811101', '0306909606', '0853872440', '0200823803'] }],
  ['LU', { re: /^[0-9]{3}[0-9A-Z]{13}$/, len: 16, bpos: 0, blen: 3, apos: 3, alen: 13, cdpos: 0, cdlen: 0, blist: ['001', '010'] }],
  ['NL', { re: /^[A-z0-9]{4}[0-9]{10}$/, len: 14, bpos: 0, blen: 4, apos: 4, alen: 10, cdpos: 0, cdlen: 0, blist: ['ABNA', 'RABO', 'INGB'] }],
  ['PL', { re: /^[0-9]{24}$/, len: 24, bpos: 0, blen: 8, apos: 8, alen: 16, cdpos: 0, cdlen: 0, blist: ['61109010', '10901014', '10500099'] }],
  ['PT', { re: /^[0-9]{21}$/, len: 21, bpos: 0, blen: 8, apos: 8, alen: 11, cdpos: 19, cdlen: 2, blist: ['00020123', '00270000'] }],
])
// check BBAN format and CD is OK (no check on bankcode existence) - returns true when OK - false when KO
// returns null if country is not supported
function BBANok(ctry, bban) {
  if (!BBANformats.has(ctry)) { return null }
  if (!bban.match(BBANformats.get(ctry).re)) { return false }
  const result = BBANcd(ctry, bban)
  return ((result != null) && (bban == result.bban))
}
// calculate cd of a BBAN, CD and BBAN with CD is returned - i.e. we return {cd:'73', bban:'979931653073'] for BE
// as input a BBAN in full length should be given - at CD position any value can be stored - f.ex. 979931653000
// no bban format check is carried out
// in case the country is not supported or a cd cannot be calculated a null is returned
function BBANcd(ctry, bban) {
  switch (ctry) { // no CD check
    case 'LU':
    case 'PL':
      return { bban: bban, cd: '' }
    case 'BE': // modulo 97 on first 10 digits - if 00 -> 97
      try {
        const b = bban.slice(0, 10)
        let cd = parseInt(b) % 97
        cd = String((cd == 0) ? 97 : cd).padStart(2, '0')
        return { bban: b + cd, cd: cd }
      } catch (e) { return null }
    case 'ES': try { // CD1 = weighted CD on bank & branch code - CD2 weighted CD on acc nbr -- then 11 - MOD 11
      let s1 = 0, s2 = 0, c1, c2;
      [4, 8, 5, 10, 9, 7, 3, 6].forEach((w, i) => { s1 += w * parseInt(bban[i]); }); // keep semicolon!
      [1, 2, 4, 8, 5, 10, 9, 7, 3, 6].forEach((w, i) => { s2 += w * parseInt(bban[i + 10]); })
      c1 = 11 - (s1 % 11); c2 = 11 - (s2 % 11)
      if (c1 > 9) { c1 = 11 - c1 }
      if (c2 > 9) { c2 = 11 - c2 }
      const cd = String(c1) + String(c2)
      bban = bban.slice(0, 8) + cd + bban.slice(10, 20)
      return { bban: bban, cd: cd }
    } catch (e) { return null }
    case 'FR': // (97 - modulo 97 on full bban using 00 as cd) - convert characters to numbers first
      try {
        bban = bban.slice(0, 21); // throw away fake cd at the end
        let t = bban.replace(/[AJ]/, '1').replace(/[BKS]/, '2').replace(/[CLT]/, '3')
        t = t.replace(/[DMU]/, '4').replace(/[ENV]/, '5').replace(/[FOW]/, '6')
        t = t.replace(/[GPX]/, '7').replace(/[HQY]/, '8').replace(/[IRZ]/, '9')
        t = BigInt(t + '00')
        const cd = String(97n - (t % 97n)).padStart(2, '0')
        return { bban: bban + cd, cd: cd }
      } catch (e) { return null }
    case 'IT': // add all together (A=0, Z=25) using a map for odd positions - modulo 26 - convert to A-Z char
      try {
        const map = [1, 0, 5, 7, 9, 13, 15, 17, 19, 21, 2, 4, 18, 20, 11, 3, 6, 8, 12, 14, 16, 10, 22, 25, 24, 23]
        let sum = 0, i, c, n
        for (i = 1; i < 23; i++) {
          c = bban.charAt(i)
          n = (c >= 'A') ? c.charCodeAt(0) - A : parseInt(c)
          sum += (i % 2 == 1) ? map[n] : n
        }
        const cd = String.fromCharCode(A + (sum % 26))
        return { bban: cd + bban.slice(1, 23), cd: cd }
      } catch (e) { return null }
    case 'NL': // acc = 10 digits - 1st digit * 10, 2nd * 9, 3rd * 8 ... 10th * 1 - sum of all should be divisible by 11
      try {
        let tot = 0, i = 0
        for (; i < 10; i++) { tot += parseInt(bban[4 + i]) * (10 - i) }
        if (tot % 11 == 0) { return { bban: bban, cd: '' } } else { return null }
      } catch (e) { return null }
    case 'PT': try { // CD = weighted CD on bank & branch code & account -- then 97 - MOD 97
      let sum = 0; const weights = [73, 17, 89, 38, 62, 45, 53, 15, 50, 5, 49, 34, 81, 76, 27, 90, 9, 30, 3]
      weights.forEach((w, i) => { sum += w * parseInt(bban[i]) })
      const cd = iso7064Mod97_10(sum)
      return { bban: bban.slice(0, 19) + cd, cd: cd }
    } catch (e) { return null }
    default: return null
  }
}
// create an example BBAN for a certain country
// in case the country is not supported a null is returned
function BBANex(ctry) {
  if (!BBANformats.has(ctry)) { return null }
  const f = BBANformats.get(ctry), b = ran(f.blist); let bban = '', acc = ranTxt(f.alen, '01234567890')
  if (ctry == 'NL') { while (!BBANcd('NL', b + acc)) { acc = ranTxt(f.alen, '01234567890') } }
  bban = '0'.repeat(f.len)
  bban = bban.slice(0, f.bpos) + b + bban.slice(f.bpos + f.blen)
  bban = bban.slice(0, f.apos) + acc + bban.slice(f.apos + f.alen)
  return BBANcd(ctry, bban).bban
}
// create an example IBAN for a certain country
// in case the country is not supported a null is returned
function IBANex(ctry, human = false) {
  const bban = BBANex(ctry)
  return bban ? toIBAN(ctry, bban, human) : null
}
export { toIBAN, BBANcd, BBANok, BBANex, IBANex }