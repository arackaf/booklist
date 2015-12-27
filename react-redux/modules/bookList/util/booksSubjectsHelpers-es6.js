function setBookResultsSubjects(booksHash, subjectsHash){
    let books = Object.keys(booksHash).map(_id => booksHash[_id]);
    books.forEach(b => b.subjectObjects = b.subjects.map(s => subjectsHash[s] || { name: '<subject not found>' }));
    return books;
}

function stackAndGetTopLevelSubjects(subjectsHash){
    let subjects = Object.keys(subjectsHash).map(_id => subjectsHash[_id]);
    subjects.forEach(s => {
        s.children = [];
        s.children.push(...subjects.filter(sc => new RegExp(`,${s._id},$`).test(sc.path)));
    });
    return subjects.filter(s => s.path == null);
}

module.exports = { setBookResultsSubjects, stackAndGetTopLevelSubjects };