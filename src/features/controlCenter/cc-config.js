// cc-config.js - PRO CONFIG - Fixed beatId guard
export const MAIN_API = 'https://api.dopetonevault.com';
export const BEATS_API = 'https://all-beats-analytics-api.dopetone701.workers.dev';
export const STATS_API = 'https://dopetone-stats.dopetone701.workers.dev';
export const ADMIN_EMAIL = 'dopetone701@gmail.com';
export const DEFAULT_LOGO = 'images/logo.png';

export const R2_CDN = 'https://dopetonevault.com/cdn';
export const R2_FOLDERS = { BEATS: 'beats', COVERS: 'covers', WAVS: 'wavs', PROJECTS: 'projects', AUDIO: 'beats' };

export const user = JSON.parse(localStorage.getItem('dopetone_user') || 'null') || {};

export let allBeats = [];
export let filteredBeats = [];
export let currentTrack = null;
export let isPlaying = false;
export let topTracks = [];
export let currentTopIndex = 0;
export let currentBeatId = null;
export let currentRange = 'day';
export const charts = {};

const VALID_RANGES = ['day','week','month','year','all'];

export function setAllBeats(beats) { allBeats = Array.isArray(beats)? beats : []; }
export function setFilteredBeats(beats) { filteredBeats = Array.isArray(beats)? beats : []; }
export function setCurrentTrack(track) { currentTrack = track; }
export function setIsPlaying(state) { isPlaying = !!state; }
export function setTopTracks(tracks) { topTracks = tracks || []; }
export function setCurrentTopIndex(idx) { currentTopIndex = idx; }

export function setCurrentBeatId(id) { 
  if(!id) { currentBeatId = null; return; }
  const s = String(id).toLowerCase();
  if(VALID_RANGES.includes(s)){ 
    console.warn('[CC Config] blocked range as beatId:', id);
    currentBeatId = null; 
    return; 
  }
  currentBeatId = String(id); 
}
export function setCurrentRange(range) {
  const r = String(range||'day').toLowerCase();
  currentRange = VALID_RANGES.includes(r) ? r : 'day';
}

export async function logBeatEvent(beatId, eventType) {
  if (!beatId) return;
  if(VALID_RANGES.includes(String(beatId).toLowerCase())) return;
  try {
    await fetch(`${STATS_API}/api/stats/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ beatId: parseInt(beatId) || beatId, eventType })
    });
  } catch {}
}
export const logPlay = (beatId) => logBeatEvent(beatId, 'play');
export const logLike = (beatId, liked = true) => liked && logBeatEvent(beatId, 'like');
export const logDownload = (beatId) => logBeatEvent(beatId, 'download');
export const logCart = (beatId, added = true) => added && logBeatEvent(beatId, 'cart');

export async function loadDashboardStats() {
  try {
    const res = await fetch(`${STATS_API}/api/stats/global?range=${currentRange}`);
    if (!res.ok) throw new Error(`Stats ${res.status}`);
    const data = await res.json();
    const el = (id) => document.getElementById(id);
    if (el('totalPlays')) el('totalPlays').textContent = (data.totalPlays || 0).toLocaleString();
    if (el('totalDownloads')) el('totalDownloads').textContent = (data.totalDownloads || 0).toLocaleString();
    if (el('cartItems')) el('cartItems').textContent = (data.cartItems || 0).toLocaleString();
    if (el('totalLikes')) el('totalLikes').textContent = (data.totalLikes || 0).toLocaleString();
    if (el('totalOrders')) el('totalOrders').textContent = (data.totalOrders || 0).toLocaleString();
    if (el('totalRevenue')) el('totalRevenue').textContent = `$${(data.totalRevenue || 0).toLocaleString()}`;
    window.dispatchEvent(new CustomEvent('cc_stats_loaded', { detail: data }));
    return data;
  } catch (err) {
    console.warn('[CC Stats] failed', err.message);
    return null;
  }
}

export async function loadAllBeats() {
  try {
    const res = await fetch(`${BEATS_API}/beats`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Beats ${res.status}`);
    const beats = await res.json();
    const arr = Array.isArray(beats)? beats : beats.beats || beats.data || [];
    setAllBeats(arr);
    setFilteredBeats(arr);
    window.dispatchEvent(new CustomEvent('cc_beats_loaded', { detail: arr }));
    return arr;
  } catch (err) {
    console.error('[CC Beats] load failed', err);
    setAllBeats([]); setFilteredBeats([]); return [];
  }
}

export async function loadTopTracks() {
  try {
    const res = await fetch(`${STATS_API}/api/stats/top`);
    if (!res.ok) throw new Error(`Top ${res.status}`);
    const tracks = await res.json();
    setTopTracks(tracks);
    window.dispatchEvent(new CustomEvent('cc_top_tracks_loaded', { detail: tracks }));
    return tracks;
  } catch (err) {
    setTopTracks([]); return [];
  }
}

export function formatNumber(num) {
  const n = Number(num) || 0;
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toLocaleString();
}

export function getTimeAgo(dateString) {
  if (!dateString) return '—';
  const date = new Date(dateString);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function getR2Url(key) {
  if (!key) return '';
  if (key.startsWith('http')) return key;
  return `${R2_CDN}/${key.replace(/^\/+/, '')}`;
}
