import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { mkdtemp, readFile, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import ssg from '../src/index.js'

test('generated html has translations and no InContext editor markers', async (t) => {
  const srv = createServer((req, res) => {
    res.writeHead(200, { 'content-type': 'application/json' })
    res.end(req.url.includes('/de/') ? JSON.stringify({ 'Hello world': 'Hallo Welt' }) : '{}')
  }).listen(0, '127.0.0.1')
  t.after(() => srv.close())
  await new Promise((resolve) => srv.once('listening', resolve))

  const dir = await mkdtemp(join(tmpdir(), 'locizify-ssg-'))
  await writeFile(join(dir, 'page.html'), '<!doctype html><html><head><title>Hello world</title></head><body><p>Hello world</p></body></html>')
  await ssg(join(dir, 'page.html'), 'de', join(dir, 'out-{{lng}}.html'), {
    backend: {
      projectId: '00000000-0000-0000-0000-000000000000',
      loadPath: `http://127.0.0.1:${srv.address().port}/{{lng}}/{{ns}}.json`
    }
  })

  const out = await readFile(join(dir, 'out-de.html'), 'utf8')
  assert.doesNotMatch(out, /[‌‍]/)
  assert.match(out, /<title>Hallo Welt<\/title>/)
  assert.match(out, /<p[^>]*>Hallo Welt<\/p>/)
})
