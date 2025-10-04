import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // Use __dirname to get the same folder as this file
    const filePath = path.join(process.cwd(), 'api', 'artists-data.json');

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(500).json({ error: 'JSON file not found at path: ' + filePath });
    }

    const jsonData = fs.readFileSync(filePath, 'utf8');
    let data = JSON.parse(jsonData);

    // Filter by language if query exists
    const { language } = req.query;
    if (language) {
      data = data.filter(
        item => item.language && item.language.toLowerCase() === language.toLowerCase()
      );
    }

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to read JSON file', details: error.message });
  }
}
