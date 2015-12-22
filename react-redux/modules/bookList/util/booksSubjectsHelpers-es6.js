function setBookResultsSubjects(books, subjectsHash){
    books.forEach(b => b.subjectObjects = b.subjects.map(s => subjectsHash[s] || { name: '<subject not found>' }));
    return books;
}

function stackAndGetTopLevelSubjects(subjectsHash){
    let subjects = Object.keys(subjectsHash).map(_id => subjectsHash[_id]);
    subjects.forEach(s => {
        s.children = [];
        s.children.push(...subjects.filter(sc => new RegExp(`,${s._id},$`).test(sc.path)));
    });
    return stackSubjects(subjects).filter(s => s.path == null);
}

function stackSubjects(subjects){
    subjects.forEach(s => {
        s.children = [];
        s.children.push(...subjects.filter(sc => new RegExp(`,${s._id},$`).test(sc.path)));
    });
    return subjects;
}

module.exports = { setBookResultsSubjects, stackAndGetTopLevelSubjects };