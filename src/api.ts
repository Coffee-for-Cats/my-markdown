import { Hono } from 'hono'

export const api = new Hono()

import { Database } from './models'

interface FolderRef {
  auth: string,
  files: string[]
}

// Create a new folder using body's auth and name.
api.post('/new-folder', async c => {
  const db: any = c.env['my-markdown-db'];
  const { auth, name } = await c.req.json();

  const folderExists = await Database.getFolder(db, name);
  if (folderExists) {
    return c.text('Error! This folder name is already in use.', 409);
  }

  const folderId = await Database.createFolder(db, auth, name);

  return c.text(folderId);
})

// Create a new empty file
api.post('/:folder/:file', async c => {
  const db: any = c.env['my-markdown-db'];
  // path params
  const { folder, file } = c.req.param();
  const fileName = encodeURI(file.replaceAll(/\s/g, '-'));
  // body params
  const { auth } = await c.req.json();

  // Auth
  const folderRef = await Database.getFolder(db, folder);
  if (!folderRef) {
    return c.text('Error! Folder does not exist!', 404);
  }
  if (folderRef.auth != auth) {
    return c.text('Error! Auth does not match!', 401);
  }
  if (folderRef.files.includes(fileName)) {
    return c.text('Error! File already exists!', 401);
  }

  await Database.createEmptyFile(db, folder, fileName);

  return c.text('Ok!')
})

// Gets existing file content
api.get('/:folder/:file', async c => {
  const db: any = c.env['my-markdown-db'];
  // path params
  const { folder, file } = c.req.param()

  const fileRef = await Database.getFileFromName(db, folder, file)

  return c.text(fileRef)
})

// Modify existing file.
api.put('/:folder/:file', async c => {
  const db: any = c.env['my-markdown-db'];
  // path params
  const { folder, file } = c.req.param();
  // body params
  const { auth, text, title } = await c.req.json();
  
  // title entintling
  const encodedTitle = encodeURI(title.replaceAll(/\s/g, '-'))
  const newFileName = encodedTitle || file;

  const folderRef: FolderRef = await Database.getFolder(db, folder);
  
  // Auth
  if (!folderRef) {
    return c.text('Error! Folder does not exist.', 404);
  }
  if (folderRef.auth != auth) {
    return c.text('Error! Auth does not match!', 401);
  }
  const fileExists = await Database.getFileFromName(db, folder, file)
  if (!fileExists) {
    return c.text('Error! File does not exist', 404);
  }

  await Database.updateExistingFile(db, folder, file, newFileName, text)

  return c.text('Ok!');
})

// List files in folder
api.get('/:folder', async c => {
  const db: any = c.env['my-markdown-db'];
  // path params
  const { folder } = c.req.param();
  
  const folderRef = await Database.getFolder(db, folder);
  if (!folderRef) return c.text('Error! Folder does not exist.', 404);
  
  return c.json(folderRef.files)
})