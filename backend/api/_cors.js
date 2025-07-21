export function setCorsHeaders(req, res) {
  const allowedOrigins = [
    'https://mental-health-project-delta.vercel.app',
    'https://mental-health-project-hgsnro2cg-wajahat-ullah-khans-projects.vercel.app',
    'https://mental-health-project-git-main-wajahat-ullah-khans-projects.vercel.app'
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', allowedOrigins[0]);
  }
  res.setHeader('Vary', 'Origin');
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(200).end();
    return true;
  }
  return false;
} 