const { put } = require('@vercel/blob');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { filename, contentType, data } = req.body || {};

    if (!data || !filename) {
      return res.status(400).json({ error: 'Missing file data or filename.' });
    }

    // data is base64 encoded
    const buffer = Buffer.from(data, 'base64');

    // Max 5MB
    if (buffer.length > 5 * 1024 * 1024) {
      return res.status(400).json({ error: 'File too large. Max 5MB.' });
    }

    // Only allow images
    const allowedTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (contentType && !allowedTypes.includes(contentType)) {
      return res.status(400).json({ error: 'Only image files are allowed.' });
    }

    const blob = await put(`skills/${Date.now()}-${filename}`, buffer, {
      contentType: contentType || 'image/png',
      access: 'public',
    });

    return res.status(200).json({ url: blob.url });
  } catch (e) {
    console.error('Upload error:', e);
    return res.status(500).json({ error: 'Upload failed. Please try again.' });
  }
};
