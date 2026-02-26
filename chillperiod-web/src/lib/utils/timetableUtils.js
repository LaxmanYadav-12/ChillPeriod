import { TIMETABLE_DATA } from '@/lib/data/timetable';

export function getSubjectsForSection(semester, section, group = null) {
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
        // If group is specified, only add the lab for that group
        // If no group specified (legacy/error case), maybe add both? 
        // For now, let's add both if group is null to be safe, or just G1 default?
        // Better: Add relevant ones.
        
        if (group === 'G1' || !group) {
             if (slot.G1) subjects.add({ name: slot.G1, type: 'Lab' });
        }
        if (group === 'G2' || !group) {
             if (slot.G2) subjects.add({ name: slot.G2, type: 'Lab' });
        }
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

// Extract subjects from a custom timetable (user-defined schedule)
export function getSubjectsFromCustomTimetable(customTimetable) {
  if (!customTimetable?.schedule) return [];

  const seenNames = new Set();
  const uniqueSubjects = [];

  // customTimetable.schedule can be a Map or plain object
  const schedule = customTimetable.schedule instanceof Map 
    ? Object.fromEntries(customTimetable.schedule) 
    : customTimetable.schedule;

  Object.values(schedule).forEach(daySlots => {
    if (!Array.isArray(daySlots)) return;
    daySlots.forEach(slot => {
      if (slot.subject && slot.type !== 'BREAK' && slot.type !== 'ACTIVITY' && !seenNames.has(slot.subject)) {
        seenNames.add(slot.subject);
        uniqueSubjects.push({
          name: slot.subject,
          type: slot.type === 'LAB' ? 'Lab' : 'Theory'
        });
      }
    });
  });

  return uniqueSubjects;
}
