const { TIMETABLE_DATA, getSemesters } = require('./src/lib/data/timetable.js');

console.log('Semesters:', getSemesters());
console.log('Sections for Sem 2:', TIMETABLE_DATA.sections.filter(s => s.semester === 2));
console.log('Sections for Sem 4:', TIMETABLE_DATA.sections.filter(s => s.semester === 4));
console.log('Sections for Sem 6:', TIMETABLE_DATA.sections.filter(s => s.semester === 6));
