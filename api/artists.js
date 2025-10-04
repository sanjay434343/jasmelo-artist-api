import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // handle preflight
  }

  try {
    // JSON file directly under api folder
    const filePath = path.join(process.cwd(), 'api', 'artists-data.json');
    const jsonData = fs.readFileSync(filePath, 'utf8');
    let data = JSON.parse(jsonData);

    // Use 'language' query parameter
    const { language } = req.query;
    if (language) {
      data = data.filter(
        item => item.language && item.language.toLowerCase() === language.toLowerCase()
      );
    }

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to read JSON file' });
  }
}

