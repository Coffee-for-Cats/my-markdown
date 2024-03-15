import { Hono } from 'hono'

export const api = new Hono()

import { Folder } from './models'

interface FolderRef {
  auth: string,
  files: string[]
}

// Create a new folder using body's auth and name.
api.post('/new-folder', async c => {
  const db: any = c.env['my-markdown-db'];
  const { auth, name } = await c.req.json();

  // processa o name como url-encoded.
  const folderId = encodeURI(name.replaceAll(/\s/g, '-'))

  // doesn't allow the modification of an already existing folder adm.
  const exists = await db.get(folderId);
  if (exists) {
    return c.text('Error! This folder name is already in use.', 409);
  }

  // creates the folder with auth and name.
  await db.put(
    folderId,
    new Folder(auth, name).json()
  )

  return c.text(folderId);
})

// Create a new file in existing folder. Doesn't need text.
api.post('/:folder/:file', async c => {
  const db: any = c.env['my-markdown-db'];
  // path params
  const { folder, file } = c.req.param();
  // body params
  const { auth } = await c.req.json();

  // Auth
  const folderRef: FolderRef = JSON.parse(await db.get(folder));
  if (!folderRef) {
    return c.text('Error! Folder does not exist.', 404);
  }
  if (folderRef.auth != auth) {
    return c.text('Error! Auth does not match!', 401);
  }

  // Update folder file list
  folderRef.files.push(file);
  await db.put(
    folder,
    JSON.stringify(folderRef)
  )

  // Creates the file with the text in body
  await db.put(
    `${folder}/${file}`,
    '(empty)'
  )

  return c.text('Ok!')
})

// Modify existing file in existing folder. Needs text.
api.put('/:folder/:file', async c => {
  const db: any = c.env['my-markdown-db'];
  // path params
  const { folder, file } = c.req.param();
  // body params
  const { auth, text, title } = await c.req.json();
  
  // title entintling
  const encodedTitle = encodeURI(title.replaceAll(/\s/g, '-'))
  const newFileName = encodedTitle || file;

  // Original folder
  const folderRef: FolderRef = JSON.parse(await db.get(folder));
  
  // Auth
  if (!folderRef) {
    return c.text('Error! Folder does not exist.', 404);
  }
  if (folderRef.auth != auth) {
    return c.text('Error! Auth does not match!', 401);
  }
  const fileExists = await db.get(`${folder}/${file}`)
  if (!fileExists) {
    return c.text('Error! File does not exist', 404);
  }

  // Modify the file with the text in body
  await db.delete(`${folder}/${file}`)
  await db.put(`${folder}/${newFileName}`,
    text
  )

  // Updates folder (with the reference to this object)
  folderRef.files.forEach((fileRef, index) => {
    if (fileRef === file) {
      folderRef.files[index] = newFileName;
    }
  })

  // saves to database the new folder reference
  await db.delete(folder);
  await db.put(folder, JSON.stringify(folderRef));

  return c.text('Ok!');
})

// List files in folder
api.get('/:folder', async c => {
  const db: any = c.env['my-markdown-db'];
  // path params
  const { folder } = c.req.param();
  
  const dbResponse = await db.get(folder)
    
  if (!dbResponse) return c.text('Error! Folder does not exist.', 404);
  
  const { files } = JSON.parse(dbResponse)
  return c.json(files)
})

// Get existing file from existing folder.
// Doesn't need auth
api.get('/:folder/:file', async c => {
  const db: any = c.env['my-markdown-db'];
  // path params
  const { folder, file } = c.req.param()

  const response = await db.get(`${folder}/${file}`);

  console.log('text: ', response);
  return c.text(response)

  // if (response) {
  //   return c.text(response);
  // } else {
  //   return c.text('Error! Folder or file does not exist.', 404);
  // }
})