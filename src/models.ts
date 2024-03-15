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