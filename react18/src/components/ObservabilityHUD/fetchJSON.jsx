import { addTiming } from './store.js';

export async function fetchJSON(url, options = {}) {
  const startTime = performance.now();
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    // Server-Timing ヘッダーを解析
    const serverTiming = response.headers.get('Server-Timing');
    const region = response.headers.get('X-Region') || 'unknown';
    const cache = response.headers.get('X-Cache') || 'unknown';
    
    const totalTime = Math.round(performance.now() - startTime);
    
    // タイミング情報を解析
    const timings = new Map();
    if (serverTiming) {
      serverTiming.split(', ').forEach(timing => {
        const [name, durPart] = timing.split(';');
        if (durPart) {
          const dur = parseFloat(durPart.replace('dur=', ''));
          timings.set(name, dur);
        }
      });
    }

    // HUDストアに追加
    addTiming({
      url,
      method: options.method || 'GET',
      status: response.status,
      timings: Object.fromEntries(timings),
      region,
      cache,
      totalTime,
      serverTime: Array.from(timings.values()).reduce((sum, dur) => sum + dur, 0)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    const totalTime = Math.round(performance.now() - startTime);
    
    addTiming({
      url,
      method: options.method || 'GET',
      status: 0,
      timings: {},
      region: 'unknown',
      cache: 'unknown',
      totalTime,
      serverTime: 0,
      error: error.message
    });
    
    throw error;
  }
}