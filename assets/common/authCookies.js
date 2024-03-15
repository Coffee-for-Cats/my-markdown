if (!window.localStorage.auth) {
  window.localStorage.auth = generateAuth();
}

let auth = window.localStorage.auth;

function generateAuth() {
  const randomChars = 'abcdefghijklmnopqrstuvwxyz0987654321ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const charAmount = randomChars.length - 1;
  let newAuth = '';
  for (let i = 0; i < 24; i++) {
    newAuth += randomChars[
      Math.floor(Math.random() * charAmount)
    ]
  }

  return newAuth
}

//console.log(auth)