# Introduction

[![npm version](https://img.shields.io/npm/v/locizify-ssg.svg?style=flat-square)](https://www.npmjs.com/package/locizify-ssg)

**EXPERIMENTAL**

This package helps to generate website pages on server side that uses [locizify](https://github.com/locize/locizify). This may help to improve SEO, etc.

# Getting started

Source can be loaded via [npm](https://www.npmjs.com/package/locizify-ssg).

```bash
# npm package
$ npm install locizify-ssg
```

Usage via code:

```js
import ssg from 'locizify-ssg'

ssg('index.html', ['de', 'it'], '{{lng}}.html', {
  // debug: true,
  fallbackLng: 'en',
  backend: {
    projectId: '123aa5aa-4660-4154-b6d9-907dbef10bb2',
    version: 'production'
  },
  namespace: 'landingpage'
})

// or
ssg('index.html', 'de', 'de.html', {
  // debug: true,
  fallbackLng: 'en',
  backend: {
    projectId: '123aa5aa-4660-4154-b6d9-907dbef10bb2',
    version: 'production'
  },
  namespace: 'landingpage'
})
```



Usage via CLI:

```sh
npm install locizify-ssg -g

# -i is the input file
# -o is the output file
# -l the languages
# -s the locizify options

locizify-ssg -i /Users/user/my/index.html -o /Users/user/my/de.html -l de -s "{\"fallbackLng\":\"en\",\"backend\":{\"projectId\":\"123aa5aa-4660-4154-b6d9-907dbef10bb2\",\"version\":\"production\"},\"namespace\":\"landingpage\"}"


# or for multiple languages

locizify-ssg -i /Users/user/my/index.html -o /Users/user/my/{{lng}}.html -l de,it,fr -s "{\"fallbackLng\":\"en\",\"backend\":{\"projectId\":\"123aa5aa-4660-4154-b6d9-907dbef10bb2\",\"version\":\"production\"},\"namespace\":\"landingpage\"}"

```
