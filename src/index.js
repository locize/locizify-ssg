import { JSDOM, VirtualConsole } from 'jsdom'
import { writeFile } from 'fs/promises'
import fetch from 'cross-fetch'

const ssgLng = async (htmlFile, lng, outputFile, locizifyOptions) => {
  // initialize dom
  const virtualConsole = new VirtualConsole()
  virtualConsole.sendTo(console, { omitJSDOMErrors: true })
  const dom = await JSDOM.fromFile(htmlFile, {
    virtualConsole,
    pretendToBeVisual: true,
    runScripts: 'dangerously'
  })

  // polyfill some stuff...
  global.fetch = fetch
  global.window = dom.window
  global.document = dom.window.document
  global.DOMParser = dom.window.DOMParser
  global.MutationObserver = dom.window.MutationObserver

  // use correct lang attribute
  dom.window.document.documentElement.lang = lng

  // if locizify is used via script tag, set the language
  const locizifyScript = dom.window.document.getElementById('locizify')
  if (locizifyScript) locizifyScript.setAttribute('lng', lng)

  // locizify on server side
  const locizify = (await import('locizify')).default
  dom.window.locizify = locizify
  const init = new Promise((resolve) => {
    locizify.i18next.on('initialized', resolve)
    locizify.init({
      ...locizifyOptions,
      lng
    })
  })
  await init

  if (typeof dom.window.locizifySSG === 'function') {
    try {
      dom.window.locizifySSG()
    } catch (err) { }
  }

  if (dom.window.document.body.style && dom.window.document.body.style.display === 'none') {
    dom.window.document.body.style.display = 'block'
  }

  let serialized = dom.serialize()

  // if locizify is used as code, set the language
  if (!locizifyScript) {
    if (serialized.indexOf('locizify.init({') > 0) {
      serialized = serialized.replace('locizify.init({', `locizify.init({ lng: '${lng}',`)
    } else if (serialized.indexOf('fallbackLng:') > 0) {
      serialized = serialized.replace('fallbackLng:', `lng: '${lng}', fallbackLng:`)
    } else if (serialized.indexOf('backend:') > 0) {
      serialized = serialized.replace('backend:', `lng: '${lng}', backend:`)
    }
  }

  // save result
  await writeFile(outputFile, serialized)
}

export default async (htmlFile, lng, outputFile, locizifyOptions) => {
  if (!Array.isArray(lng)) return ssgLng(htmlFile, lng, outputFile.replace('{{lng}}', lng), locizifyOptions)
  for (const l of lng) {
    await ssgLng(htmlFile, l, outputFile.replace('{{lng}}', l), locizifyOptions)
  }
}
