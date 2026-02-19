// IPU Colleges with GPS coordinates for spot search
// Coordinates sourced from Google Maps / Wikipedia

export const COLLEGES = [
  { key: 'AIACTR', name: 'Ambedkar Institute of Advanced Communication Technologies & Research (AIACTR)', lat: 28.6565, lng: 77.2740 },
  { key: 'BPIT', name: 'Bhagwan Parshuram Institute of Technology (BPIT)', lat: 28.7373, lng: 77.1130 },
  { key: 'BVCOE', name: "Bharati Vidyapeeth's College of Engineering (BVCOE)", lat: 28.6758, lng: 77.1123 },
  { key: 'DIAS', name: 'Delhi Institute of Advanced Studies (DIAS)', lat: 28.7363, lng: 77.0953 },
  { key: 'DITM', name: 'Delhi Institute of Technology & Management (DITM)', lat: 29.1532, lng: 77.0403 },
  { key: 'DTC', name: 'Delhi Technical Campus (DTC)', lat: 28.4747, lng: 77.4765 },
  { key: 'GIBS', name: 'Gitarattan International Business School (GIBS)', lat: 28.7061, lng: 77.1277 },
  { key: 'GTBIT', name: 'Guru Tegh Bahadur Institute of Technology (GTBIT)', lat: 28.6317, lng: 77.1164 },
  { key: 'HMRITM', name: 'HMR Institute of Technology & Management (HMRITM)', lat: 28.8279, lng: 77.1476 },
  { key: 'JIMS-R', name: 'Jagan Institute of Management Studies (JIMS) - Rohini', lat: 28.7165, lng: 77.1105 },
  { key: 'JIMS-VK', name: 'Jagan Institute of Management Studies (JIMS) - Vasant Kunj', lat: 28.5284, lng: 77.1648 },
  { key: 'MAIMS', name: 'Maharaja Agrasen Institute of Management Studies (MAIMS)', lat: 28.7183, lng: 77.0661 },
  { key: 'MAIT', name: 'Maharaja Agrasen Institute of Technology (MAIT)', lat: 28.7184, lng: 77.0661 },
  { key: 'MSI', name: 'Maharaja Surajmal Institute (MSI)', lat: 28.6217, lng: 77.0883 },
  { key: 'MSIT', name: 'Maharaja Surajmal Institute of Technology (MSIT)', lat: 28.6204, lng: 77.0928 },
  { key: 'NIEC', name: 'Northern India Engineering College (NIEC) / Dr. Akhilesh Das Gupta Institute', lat: 28.6699, lng: 77.2555 },
  { key: 'RDIAS', name: 'Rukmini Devi Institute of Advanced Studies (RDIAS)', lat: 28.7095, lng: 77.1179 },
  { key: 'TIAS', name: 'Tecnia Institute of Advanced Studies (TIAS)', lat: 28.7061, lng: 77.1277 },
  { key: 'TIPS', name: 'Trinity Institute of Professional Studies (TIPS)', lat: 28.5778, lng: 77.0618 },
  { key: 'USAP', name: 'University School of Architecture & Planning (USAP)', lat: 28.5921, lng: 77.0185 },
  { key: 'USAR', name: 'University School of Automation & Robotics (USAR)', lat: 28.5921, lng: 77.0185 },
  { key: 'USBT', name: 'University School of Biotechnology (USBT)', lat: 28.5921, lng: 77.0185 },
  { key: 'USCT', name: 'University School of Chemical Technology (USCT)', lat: 28.5921, lng: 77.0185 },
  { key: 'USDI', name: 'University School of Design & Innovation (USDI)', lat: 28.5921, lng: 77.0185 },
  { key: 'USICT', name: 'University School of Information, Communication & Technology (USICT)', lat: 28.5950, lng: 77.0189 },
  { key: 'USLLS', name: 'University School of Law & Legal Studies (USLLS)', lat: 28.5921, lng: 77.0185 },
  { key: 'USMS', name: 'University School of Management Studies (USMS)', lat: 28.5921, lng: 77.0185 },
  { key: 'USMC', name: 'University School of Mass Communication (USMC)', lat: 28.5921, lng: 77.0185 },
  { key: 'VMMC', name: 'Vardhman Mahavir Medical College (VMMC)', lat: 28.5691, lng: 77.2009 },
  { key: 'VIPS', name: 'Vivekananda Institute of Professional Studies (VIPS)', lat: 28.6998, lng: 77.1386 },
];

// Helper to find college by key or name
export function findCollege(keyOrName) {
  if (!keyOrName) return null;
  return COLLEGES.find(c =>
    c.key === keyOrName ||
    c.name === keyOrName ||
    c.name.toLowerCase().includes(keyOrName.toLowerCase()) ||
    c.key.toLowerCase() === keyOrName.toLowerCase()
  ) || null;
}

// For backward compat: flat name list for dropdowns
export const COLLEGE_NAMES = COLLEGES.map(c => c.name);
