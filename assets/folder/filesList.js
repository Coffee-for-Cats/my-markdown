function createFileList(fileNames, fileListPlaceholder) {
  filesList.innerHTML = ''                      // empties the nav fileList
  fileNames.forEach(fileName => {               // add one by one.
    const file = document.createElement('li')
    const link = document.createElement('a')
    link.href = `http://${window.location.host}/${folderId}/${fileName}`
    file.appendChild(link)
    link.innerText = `> ${fileName}`;           // template for every one of them.
    filesList.appendChild(file);
  })
}