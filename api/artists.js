import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), 'api', 'languages.json');
    const jsonData = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(jsonData);

    // Get 'language' from query params, e.g., /api/languages?language=Tamil
    const { language } = req.query;

    if (language) {
      // Filter the languages array
      const filtered = data.languages.filter(
        (item) => item.language.toLowerCase() === language.toLowerCase()
      );

      // If nothing found, return empty array
      return res.status(200).json({ languages: filtered });
    }

    // If no filter, return all
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Unable to read JSON file' });
  }
}
