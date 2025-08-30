// HUD状態管理
let hudStore = {
  visible: false,
  timings: new Map(),
  region: 'unknown',
  cache: 'unknown',
  totalTime: 0,
  requests: []
};

let subscribers = [];

export function getHudState() {
  return { ...hudStore };
}

//状態変更の通知を受け取る
export function subscribeToHud(callback) {
  subscribers.push(callback);
  return () => {
    subscribers = subscribers.filter(sub => sub !== callback);
  };
}

export function toggleHud() {
  hudStore.visible = !hudStore.visible;
  notifySubscribers();
}

export function addTiming(data) {
  hudStore.requests.push({
    ...data,
    timestamp: Date.now()
  });
  
  // 最新20件のみ保持
  if (hudStore.requests.length > 20) {
    hudStore.requests = hudStore.requests.slice(-20);
  }
  
  // 合計時間を計算
  hudStore.totalTime = hudStore.requests.reduce((sum, req) => sum + (req.totalTime || 0), 0);
  
  notifySubscribers();
}

//変更を全コンポーネントに通知
function notifySubscribers() {
  subscribers.forEach(callback => callback(getHudState()));
}