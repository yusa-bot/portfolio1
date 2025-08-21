import { useHUDDispatch } from './store';

export async function fetchJSON(url: string, options: RequestInit = {}): Promise<any> {
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
    const timings: Record<string, number> = {};
    if (serverTiming) {
      serverTiming.split(', ').forEach(timing => {
        const [name, durPart] = timing.split(';');
        if (durPart) {
          const dur = parseFloat(durPart.replace('dur=', ''));
          timings[name] = dur;
        }
      });
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    const totalTime = Math.round(performance.now() - startTime);

    throw error;
  }
}

// HUD storeを使用するためのカスタムフック
export function useFetchJSON() {
  const dispatch = useHUDDispatch();

  const fetchWithHUD = async (url: string, options: RequestInit = {}): Promise<any> => {
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
      const timings: Record<string, number> = {};
      if (serverTiming) {
        serverTiming.split(', ').forEach(timing => {
          const [name, durPart] = timing.split(';');
          if (durPart) {
            const dur = parseFloat(durPart.replace('dur=', ''));
            timings[name] = dur;
          }
        });
      }

      // HUDストアに追加
      dispatch({
        type: 'ADD_TIMING',
        payload: {
          url,
          method: options.method || 'GET',
          status: response.status,
          timings,
          region,
          cache,
          totalTime,
          serverTime: Object.values(timings).reduce((sum, dur) => sum + dur, 0)
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      const totalTime = Math.round(performance.now() - startTime);

      dispatch({
        type: 'ADD_TIMING',
        payload: {
          url,
          method: options.method || 'GET',
          status: 0,
          timings: {},
          region: 'unknown',
          cache: 'unknown',
          totalTime,
          serverTime: 0,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });

      throw error;
    }
  };

  return { fetchWithHUD };
}
