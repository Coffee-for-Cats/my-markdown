const fileTitlePlaceholder = document.getElementById('file-title-placeholder')
const fileContentPlaceholder = document.getElementById('file-content-placeholder')
const markdownPlaceholder = document.getElementById('markdown-content-placeholder')
const saveButton = document.getElementById('save-file');
const editButton = document.getElementById('edit-file')
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

  markdownPlaceholder.innerHTML = marked.parse(fileContent)
  fileContentPlaceholder.innerHTML = fileContent

  // show toolbar
  document.getElementById('toolbar').classList.remove('hidden')
  // allow title editing
  fileTitlePlaceholder.disabled = false;
}

// TODO
function showNoFileOpen() {
  fileTitlePlaceholder.value = 'Open a file'
  markdownPlaceholder.innerHTML = `
  Open or create a new file in the left sidebar.
  This field supports markdown.
  Click on the pencil to edit, just remember to save!
    `
}

if (fileId) loadFile()
else showNoFileOpen()

// create new file mini-form
const newFileName = document.getElementById('new-file-name').value.replace('/', '-')
async function createFile() {
  const fileName = await postFile(folderId, newFileName)
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

  // hidden markdown
  markdownPlaceholder.classList.remove("hidden");
  // display textbox
  fileContentPlaceholder.classList.add("hidden");

  // display  edit button
  editButton.classList.remove("hidden");
  // hidden save button
  saveButton.classList.add("hidden");

  // updates the markdown
  markdownPlaceholder.innerHTML = marked.parse(newText)
}

function toggleEdit() {
  // display textbox
  fileContentPlaceholder.classList.remove("hidden");
  // hidden  markdown
  markdownPlaceholder.classList.add("hidden");

  // display save button
  saveButton.classList.remove("hidden");
  // hidden  edit button
  editButton.classList.add("hidden");
}