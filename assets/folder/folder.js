const fileTitlePlaceholder = document.getElementById('file-title-placeholder')
const fileContentPlaceholder = document.getElementById('file-content-placeholder')
const pageTitlePlaceholder = document.getElementById('page-title')
const pageLocation = window.location.pathname
const pageLocationArray = pageLocation.split('/').filter((s) => s != '')
const folderId = pageLocationArray[0]
const fileId = pageLocationArray[1] || ''
const filesList = document.getElementById('files')

// I don't like the visual of immediately called functions
loadFolder();
async function loadFolder() {
  // show up folders name in the top of the page.
  pageTitlePlaceholder.innerText = folderId
  // my entire CORS problem was with http vs httpS.
  const fileNames = await getFolder(folderId)
  
  // TODO
  // no files in this folder
  // no folder

  // content display
  createFileList(fileNames, filesList)
}

async function loadFile() {
  fileTitlePlaceholder.value = fileId
  const fileContent = await getFile(folderId, fileId)
  fileContentPlaceholder.innerHTML = fileContent
}

// TODO
function showNoFileOpen() {
  fileTitlePlaceholder.value = 'Open a file'
  fileContentPlaceholder.innerHTML = 'Create a file or open an existing one by the navbar at your left.'
}

if (fileId) loadFile()
else showNoFileOpen()

// create new file mini-form
const newFileName = document.getElementById('new-file-name')
async function createFile() {
  const fileName = await postFile(folderId, newFileName.value)
  console.log(fileName)
  loadFolder();
}

// modify existing file in existing folder.
async function saveFile() {
  const newText = fileContentPlaceholder.value
  const newTitle = fileTitlePlaceholder.value

  const result = await updateFile(folderId, fileId, newText, newTitle)
  console.log(result)

  if (newTitle !== fileId) {
    window.location.href = `${folderId}`
  }
}