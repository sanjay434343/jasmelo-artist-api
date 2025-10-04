import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  // Enable CORS for all origins
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // handle preflight request
  }

  try {
    // JSON file is in the same folder as this API file
    const filePath = path.join(process.cwd(), 'api', 'artists-data.json');
    const jsonData = fs.readFileSync(filePath, 'utf8');
    let data = JSON.parse(jsonData);

    // Optional language filter: /api/artists?lang=English
    const { lang } = req.query;
    if (lang) {
      data = data.filter(item => item.language.toLowerCase() === lang.toLowerCase());
    }

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to read JSON file' });
  }
}
