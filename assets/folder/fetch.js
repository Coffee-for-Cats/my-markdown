const defaultApiURL = `http://${window.location.host}/api`;

async function getFolder(folderId) {
  const fetchURL = defaultApiURL + `/${folderId}`;
  const response = await fetch(fetchURL)
  return await response.json()
}

async function getFile(folderId, fileId) {
  const fetchURL = defaultApiURL + `/${folderId}/${fileId}`
  const response = await fetch(fetchURL)
  const content = await response.text()
  return decodeURIComponent(content)
}

async function postFile(folderId, filename) {
  // change to https
  const fetchURL = defaultApiURL + `/${folderId}/${filename}`
  const fetchReq = {
    method: "POST",
    body: JSON.stringify({
      auth,
    })
  }
  const newFilePath = await fetch(fetchURL, fetchReq)
  return await newFilePath.text()
}

async function updateFile(folderId, fileId, newText, newTitle) {
  const newLineReplacedText = encodeURIComponent(newText.replace(/\\n/g, "\n"))
  console.log('sent: ', newLineReplacedText)
  const fetchURL = defaultApiURL + `/${folderId}/${fileId}`

  const fetchReq = {
    method: "PUT",
    body: JSON.stringify({
      auth,                         // creator's signature
      text: newLineReplacedText,    // to change it uses the same http api route
      title: newTitle
    })
  }

  const response = await fetch(fetchURL, fetchReq)
  return await response.text()
}