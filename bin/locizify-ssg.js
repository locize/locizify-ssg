#!/usr/bin/env node

const ssg = require('../')

const cliArgs = process.argv.slice(2)

let inputFile, outputFile, lng, locizifyOptions

const inputArgIndex = cliArgs.indexOf('-i')
const outputArgIndex = cliArgs.indexOf('-o')
const lngIndex = cliArgs.indexOf('-l')
const locizifyOptionsIndex = cliArgs.indexOf('-s')

if (inputArgIndex > -1 && cliArgs[inputArgIndex + 1]) inputFile = cliArgs[inputArgIndex + 1]
if (outputArgIndex > -1 && cliArgs[outputArgIndex + 1]) outputFile = cliArgs[outputArgIndex + 1]
if (lngIndex > -1 && cliArgs[lngIndex + 1]) lng = cliArgs[lngIndex + 1]
if (locizifyOptionsIndex > -1 && cliArgs[locizifyOptionsIndex + 1]) locizifyOptions = cliArgs[locizifyOptionsIndex + 1]

if (!inputFile) throw new Error('Please provide an input file!')
if (!outputFile) throw new Error('Please provide an output file!')
if (!lng) throw new Error('Please provide a language!')
if (!locizifyOptions) throw new Error('Please provide options for locizify!')

try {
  locizifyOptions = JSON.parse(locizifyOptions)
} catch (e) {
  throw new Error('Please provide a correct JSON string for the locizify options!')
}

if (lng.indexOf(',') > 0) lng = lng.split(',')

ssg(inputFile, lng, outputFile, locizifyOptions)
