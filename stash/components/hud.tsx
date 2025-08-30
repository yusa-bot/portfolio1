import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Clock, Server, Database, Zap } from 'lucide-react';
import { useHUDState, useHUDDispatch } from './hud/store';

export default function hud() {
  const { visible, requests, totalTime } = useHUDState();
  const dispatch = useHUDDispatch();

  const formatDuration = (ms: number): string => {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const getCacheColor = (cache: string): string => {
    switch (cache) {
      case 'HIT': return 'text-green-600';
      case 'MISS': return 'text-orange-600';
      case 'STALE': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const toggleHud = () => {
    dispatch({ type: 'TOGGLE_HUD' });
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={toggleHud}
        className="fixed top-4 right-4 z-50 bg-slate-900 text-white p-2 rounded-full shadow-lg hover:bg-slate-800 transition-colors"
        title="Observability HUD"
      >
        <Activity className="w-5 h-5" />
      </button>

      {/* HUD Overlay */}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed top-16 right-4 z-40 bg-slate-900/95 backdrop-blur-sm text-white p-4 rounded-lg shadow-xl w-80 max-h-96 overflow-y-auto"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Server className="w-5 h-5 mr-2" />
              Performance Monitor
            </h3>

            {/* Summary */}
            <div className="mb-4 p-3 bg-slate-800/50 rounded">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-300">Total Requests</span>
                <span className="font-mono">{requests.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-300">Avg Response Time</span>
                <span className="font-mono">
                  {requests.length > 0
                    ? formatDuration(totalTime / requests.length)
                    : '0ms'
                  }
                </span>
              </div>
            </div>

            {/* Recent Requests */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-slate-300 mb-2">Recent Requests</h4>
              {requests.slice(-5).reverse().map((request, index) => (
                <div key={index} className="bg-slate-800/30 rounded p-2 text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-blue-300">
                      {request.method} {request.url.split('/').pop()}
                    </span>
                    <span className={`font-mono ${request.status === 200 ? 'text-green-400' : 'text-red-400'}`}>
                      {request.status || 'ERR'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-slate-400">
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatDuration(request.totalTime)}
                    </div>
                    <div className="flex items-center">
                      <Server className="w-3 h-3 mr-1" />
                      {request.region}
                    </div>
                    <div className="flex items-center">
                      <Database className="w-3 h-3 mr-1" />
                      <span className={getCacheColor(request.cache)}>{request.cache}</span>
                    </div>
                  </div>

                  {/* Server Timings */}
                  {Object.keys(request.timings).length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-700">
                      <div className="text-slate-400 mb-1">Server Timings:</div>
                      {Object.entries(request.timings).map(([name, duration]) => (
                        <div key={name} className="flex justify-between">
                          <span>{name}</span>
                          <span className="font-mono">{duration}ms</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {request.error && (
                    <div className="mt-2 text-red-400 text-xs">
                      Error: {request.error}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {requests.length === 0 && (
              <div className="text-center py-4 text-slate-400">
                No requests tracked yet
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
