const JSON2VIDEO_BASE = 'https://api.json2video.com/v2';

function splitIntoScenes(script) {
  const sentences = script
    .replace(/\s+/g, ' ')
    .trim()
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean);

  const chunks = [];
  let current = '';
  for (const s of sentences) {
    if ((current + ' ' + s).trim().split(' ').length > 22 && current) {
      chunks.push(current.trim());
      current = s;
    } else {
      current = (current + ' ' + s).trim();
    }
  }
  if (current) chunks.push(current.trim());
  return chunks.length ? chunks : [script];
}

const SCENE_COLORS = ['#141821', '#1F2A44', '#241827', '#182420', '#241C14'];

export function buildMoviePayload(prompt, { voice = 'en-US-AriaNeural' } = {}) {
  const scenes = splitIntoScenes(prompt).map((text, i) => ({
    'background-color': SCENE_COLORS[i % SCENE_COLORS.length],
    elements: [
      {
        type: 'voice',
        text,
        voice,
      },
      {
        type: 'text',
        text,
        style: '003',
        settings: {
          'font-size': '48px',
          color: '#F5F3ED',
        },
        position: 'center-center',
        duration: -1,
      },
    ],
  }));

  return {
    resolution: 'full-hd',
    quality: 'high',
    scenes,
  };
}

export async function renderMovie(prompt, options = {}) {
  const payload = buildMoviePayload(prompt, options);

  const res = await fetch(`${JSON2VIDEO_BASE}/movies`, {
    method: 'POST',
    headers: {
      'x-api-key': process.env.JSON2VIDEO_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || 'JSON2Video render request failed');
  }
  return data.project || data.id || data;
}

export async function getMovieStatus(projectId) {
  const res = await fetch(`${JSON2VIDEO_BASE}/movies?project=${encodeURIComponent(projectId)}`, {
    headers: { 'x-api-key': process.env.JSON2VIDEO_API_KEY },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || 'JSON2Video status request failed');
  }
  return data;
}
