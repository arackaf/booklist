export class Book {
  id = 0;
  subjects = [];
  constructor(name) {
    this.name = name;
    this.primarySubjects = [];
  }

  addSubject(s) {
    this.subjects.push(s);
  }
}
