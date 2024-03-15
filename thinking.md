# markdown editor
Um editor de markdown simples

body { name: 'math class' }
return { folder-id: 'math-class' }
  Primeiro preciso trocar ' ' por '-'.
  Depois usar o url encoder do JS.
  Salvar no banco de dados com o nome de uma folder.

  (json) Folder {
    id: 'math-class',
    auth: 'secret-key/email',
    files: [...] // nomes de arquivos dentro da folder
  }

  salvo no banco de dados com a Key sendo o filename e path.
  (text) File 


  A folder vai ficar salva no banco de dados como chave = '<folder-id>'.
    Um get deve retornar a lista em JSON
  Já os arquivos vão ficar salvos como chave = '<folder-id>/<file-id>';
    Um get deve retornar o conteúdo do arquivo em texto
    Um post deve conter { auth, text } no body, cria o arquivo no banco de dados
  Isso vai ser igual na url.