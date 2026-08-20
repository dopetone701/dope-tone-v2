// src/features/api.js - V2 - YOUR WORKERS - PROPERLY FORMATTED
const API_URL = 'https://api.dopetonevault.com';
const STATS_API = 'https://dopetone-stats.dopetone701.workers.dev';
const PRICE_API = 'https://track-price-api.dopetone701.workers.dev';

function normalizePrice(raw, info) {
  if (info?.price != null) {
    const p = Number(info.price);
    return p > 100 ? p / 100 : p;
  }
  if (raw == null) return 29.99;
  const n = Number(raw);
  if (isNaN(n)) return 29.99;
  return n > 100 ? n / 100 : n;
}

export async function getBeats() {
  try {
    const [beatsRes, statsRes, priceRes] = await Promise.all([
      fetch(`${API_URL}/api/beats`),
      fetch(`${STATS_API}/api/stats/top`).catch(() => ({ json: () => [] })),
      fetch(`${PRICE_API}/api/monetization/all`).catch(() => ({ json: () => [] }))
    ]);

    if (!beatsRes.ok) throw new Error('Failed to fetch beats');
    const beats = await beatsRes.json();

    let statsMap = {};
    try {
      const topStats = await statsRes.json();
      if (Array.isArray(topStats)) {
        topStats.forEach(s => { statsMap[s.id] = s; });
      }
    } catch {}

    let priceMap = {};
    try {
      const priceList = await priceRes.json();
      if (Array.isArray(priceList)) {
        priceList.forEach(p => {
          priceMap[String(p.id)] = {
            mode: (p.monetization_mode || 'paid').toLowerCase(),
            price: p.price
          };
        });
      }
    } catch {}

    return beats.map(b => {
      const priceInfo = priceMap[String(b.id)];
      const rawMode = b.monetization_mode || 'paid';
      const finalMode = priceInfo ? priceInfo.mode : rawMode.toLowerCase();
      const normalizedMode = finalMode === 'free_tagged' || finalMode === 'tagged' ? 'hybrid' : finalMode;

      return {
        id: String(b.id),
        title: b.title,
        genre: b.genre || 'Trap',
        bpm: b.bpm || 140,
        cover: b.cover_url,
        cover_url: b.cover_url,
        mp3_url: b.mp3_url,
        audio: b.mp3_url,
        price: normalizePrice(b.price, priceInfo),
        monetization_mode: normalizedMode,
        is_free: normalizedMode === 'free' ? 1 : 0,
        has_free_tagged: normalizedMode === 'hybrid' ? 1 : 0,
        play_count: statsMap[b.id]?.play_count || b.play_count || 0,
        download_count: statsMap[b.id]?.download_count || 0,
        like_count: statsMap[b.id]?.like_count || 0,
        created_at: b.created_at
      };
    });

  } catch (err) {
    console.warn('Using mock beats - workers offline', err);
    // MOCK FALLBACK - so you SEE shell even without internet
    return [
      { id: '1', title: 'Midnight Vault', genre: 'Trap', bpm: 140, cover_url: 'https://picsum.photos/seed/1/300', mp3_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', price: 29.99, monetization_mode: 'paid', play_count: 1200, created_at: new Date().toISOString() },
      { id: '2', title: 'Dope Red', genre: 'Drill', bpm: 144, cover_url: 'https://picsum.photos/seed/2/300', mp3_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', price: 0, is_free: 1, monetization_mode: 'free', play_count: 800, created_at: new Date().toISOString() },
      { id: '3', title: 'Navy Dreams', genre: 'R&B', bpm: 92, cover_url: 'https://picsum.photos/seed/3/300', mp3_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', price: 49.99, monetization_mode: 'paid', play_count: 600, created_at: new Date().toISOString() },
      { id: '4', title: 'Chrome Heart', genre: 'Afro', bpm: 110, cover_url: 'https://picsum.photos/seed/4/300', mp3_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', price: 29.99, monetization_mode: 'hybrid', play_count: 400, created_at: new Date().toISOString() },
      { id: '5', title: 'Deep Void', genre: 'Trap', bpm: 150, cover_url: 'https://picsum.photos/seed/5/300', mp3_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', price: 19.99, monetization_mode: 'paid', play_count: 300, created_at: new Date().toISOString() }
    ];
  }
}

export async function getStatsOverview() {
  try {
    const res = await fetch(`${STATS_API}/api/stats/global?range=day`);
    const data = await res.json();
    return { totalPlays: data.totalPlays || 0, totalLikes: data.totalLikes || 0 };
  } catch {
    return { totalPlays: 0, totalLikes: 0 };
  }
}

export async function trackBeatPlay(beatId) {
  try {
    await fetch(`${STATS_API}/api/stats/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ beat_id: parseInt(beatId), event_type: 'play' })
    });
  } catch {}
}

