export function setBookResultsSubjects(booksHash, subjectsHash){
    let books = Object.keys(booksHash).map(_id => booksHash[_id]);
    books.forEach(b => {
        b.subjectObjects = b.subjects.map(s => subjectsHash[s] || { name: '<subject not found>' })
        let d = new Date(+b.dateAdded);
        b.dateAddedDisplay = `${(d.getMonth()+1)}/${d.getDate()}/${d.getFullYear()}`;
    });
    return books;
}

export function stackAndGetTopLevelSubjects(subjectsHash){
    let subjects = Object.keys(subjectsHash).map(_id => subjectsHash[_id]);
    subjects.forEach(s => {
        s.children = [];
        s.children.push(...subjects.filter(sc => new RegExp(`,${s._id},$`).test(sc.path)));
    });
    return subjects.filter(s => s.path == null);
}

export function allSubjectsSorted(subjectsHash){
    let subjects = Object.keys(subjectsHash).map(_id => subjectsHash[_id]);
    return subjects.sort(({ name: name1 }, { name: name2 }) => {
        let name1After = name1.toLowerCase() > name2.toLowerCase(),
            bothEqual = name1.toLowerCase() === name2.toLowerCase();
        return bothEqual ? 0 : (name1After ? 1 : -1);
    });
}