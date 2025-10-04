import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  // Allow all origins
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Path to JSON file
    const filePath = path.join(process.cwd(), 'data', 'artists-data.json');
    const jsonData = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(jsonData);

    // Optional filter by query parameter: language
    const { language } = req.query;
    let result = data;

    if (language) {
      result = data.filter(item =>
        item.language.toLowerCase() === language.toLowerCase()
      );
    }

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to read JSON file' });
  }
}
