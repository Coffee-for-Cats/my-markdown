const FolderNameInput = document.getElementById('folder-name-input')
const ResultPlaceHolder = document.getElementById('result-placeholder')

async function newFolder() {
  const folderName = FolderNameInput.value;

  const fetchURL = window.location.href + 'api/new-folder';
  const fetchReq = {
    method: "POST",
    body: JSON.stringify({
      name: folderName,
      auth
    })
  }
  const response = await fetch(fetchURL, fetchReq)
  const result = await response.text();

  if (response.status != 200) {
    ResultPlaceHolder.innerText = result + '\n';
    ResultPlaceHolder.classList.add('red');
  } else {
    // result must contain the same as the formated front-end.
    if (result != encodeName(folderName)) {
      alert('Alert! the front-end and back-end are creating different strings from same folder name input.')
    }

    window.location.href = `${result}`;
  }
}

FolderNameInput.addEventListener('input', (e) => {  
  const inputText = FolderNameInput.value
  const outputText = encodeName(inputText);

  if (inputText != outputText) {
    ResultPlaceHolder.innerText = `The name will be formated to: ${outputText}\n`;
    ResultPlaceHolder.classList.remove('red');
  } else {
    ResultPlaceHolder.innerText = '';
  }
})

function encodeName(name) {
  return encodeURI(name.replace(/\s/g, '-'))
}