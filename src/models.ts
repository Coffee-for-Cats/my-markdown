export class Folder {
  auth: string;
  name: string;
  files: string[];

  constructor(auth, name, files = []) {
    this.auth = auth;
    this.name = name;
    this.files = files;
  }

  json() {
    return JSON.stringify(this);
  }
}

export function encodeFolderId(name: string) {
  return encodeURI(name.replaceAll(/\s/g, '-'))
}

export const Database = {
  getFolder,
  getFileFromName,
  createFolder,
  createEmptyFile,
  updateExistingFile,
}

async function getFolder(db: any, folderId) {
  return JSON.parse(
    await db.get(folderId)
  )
}

async function getFileFromName(db: any, folderId: string, fileId: string) {
  const dbKey = `${folderId}/${fileId}`;
  const response = await db.get(dbKey)
  console.log(dbKey);
  return response
}

async function createFolder(db: any, auth: string, name: string,) {
  const folderId = encodeFolderId(name);

  // creates the folder with auth and name.
  await db.put(
    folderId,
    new Folder(auth, name).json()
  )

  return folderId;
}

async function createEmptyFile(db: any, folderId: string, fileId: string) {  
  const folderRef = await getFolder(db, folderId)
  // Update folderRef's file list
  folderRef.files.push(fileId);
  // updates in db
  await db.delete(folderId)
  await db.put(
    folderId,
    JSON.stringify(folderRef)
  )
    
  // creates file
  await db.put(
    `${folderId}/${fileId}`,
    '(empty)'
  )
} 

async function updateExistingFile(
  db: any, folderId: string, fileId: string,
  newFileName: string, text: string
) {
  const filePath = `${folderId}/${fileId}`;
  
  // Updates folder
  const folderRef = await Database.getFolder(db, folderId)
  folderRef.files.forEach((fileNameInFolder: string, index: number) => {
    // finds the actual file
    if (fileNameInFolder === fileId) {
      // updates it
      folderRef.files[index] = newFileName;
    }
  })
  // saves to db
  await db.delete(folderId)  // saves to db
  await db.put(folderId, JSON.stringify(folderRef));

  // Updates file
  await db.delete(filePath)
  await db.put(`${folderId}/${newFileName}`, text)
}