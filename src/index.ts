import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'
// @ts-ignore
import manifest from '__STATIC_CONTENT_MANIFEST'

const app = new Hono()

// api controller
import { api } from './api'
app.route('/api', api);

// serving static files
app.get('/*', serveStatic({ root: './', manifest }))

// folder name --> load folder html file
app.on('GET', ['/:folderId/:fileId?', '/:folderId/'],
  serveStatic({ path: '/folder', manifest })
);

export default app
