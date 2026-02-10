import { TIMETABLE_DATA } from '@/lib/data/timetable';

export function getSubjectsForSection(semester, section) {
  const sectionData = TIMETABLE_DATA.sections.find(
    s => s.semester === semester && s.section === section
  );

  if (!sectionData) return [];

  const subjects = new Set();
  const days = Object.keys(sectionData.schedule);

  days.forEach(day => {
    sectionData.schedule[day].forEach(slot => {
      if (slot.type === 'THEORY' && slot.subject) {
        subjects.add({ name: slot.subject, type: 'Theory' });
      } else if (slot.type === 'LAB') {
        if (slot.G1) subjects.add({ name: slot.G1, type: 'Lab' });
        if (slot.G2) subjects.add({ name: slot.G2, type: 'Lab' });
      }
    });
  });

  // Deduplicate by name
  const uniqueSubjects = [];
  const seenNames = new Set();

  subjects.forEach(sub => {
    if (!seenNames.has(sub.name)) {
      seenNames.add(sub.name);
      uniqueSubjects.push(sub);
    }
  });

  return uniqueSubjects;
}
