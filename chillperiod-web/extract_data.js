const fs = require('fs');

try {
  const html = fs.readFileSync('btech_raw.html', 'utf8');
  const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">(.+?)<\/script>/);
  
  if (match && match[1]) {
    const data = JSON.parse(match[1]);
    console.log(JSON.stringify(data, null, 2));
    fs.writeFileSync('src/lib/data/extracted_site_data.json', JSON.stringify(data, null, 2));
  } else {
    console.error('No __NEXT_DATA__ found');
  }
} catch (error) {
  console.error('Error:', error);
}
