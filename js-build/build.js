// Minificare e offuscare il codice JavaScript
const fs = require('fs')
const path = require('path')

// Leggi il file script.js originale
const scriptPath = path.join(__dirname, '..', 'script.js')
const originalCode = fs.readFileSync(scriptPath, 'utf8')

// Funzione per offuscare il codice
function obfuscateCode(code) {
  // Rimuovi commenti e spazi in eccesso
  let obfuscated = code
    .replace(/\/\/.*$/gm, '') // Rimuovi commenti inline
    .replace(/\/\*[\s\S]*?\*\//g, '') // Rimuovi commenti multilinea
    .replace(/\s+/g, ' ') // Riduci più spazi a uno solo
    .replace(/\s*([{}=();,+\-*/&|^!?:.<>[\]])\s*/g, '$1') // Rimuovi spazi intorno agli operatori
    .trim()

  // Aggiungi ulteriore protezione contro la manipolazione del codice
  const protection = `
    (function(){try{var _0x${Math.random()
      .toString(36)
      .substr(2, 5)}=new Date;debugger;if(new Date-_0x${Math.random()
    .toString(36)
    .substr(
      2,
      5
    )}>100)document.body.innerHTML='<div style="text-align:center;padding:50px"><h1>Accesso non consentito</h1><p>Questa pagina è protetta.</p></div>'}catch(e){}})();
  `
    .trim()
    .replace(/\s+/g, ' ')

  return protection + obfuscated
}

// Offusca il codice
const obfuscatedCode = obfuscateCode(originalCode)

// Scrivi il codice offuscato in un nuovo file
const outputPath = path.join(__dirname, '..', 'script.min.js')
fs.writeFileSync(outputPath, obfuscatedCode, 'utf8')

console.log('Il codice è stato minificato e offuscato con successo! 🔒')
console.log(`Dimensione originale: ${originalCode.length} bytes`)
console.log(`Dimensione offuscata: ${obfuscatedCode.length} bytes`)
console.log(
  `Riduzione: ${Math.round(
    (1 - obfuscatedCode.length / originalCode.length) * 100
  )}%`
)
