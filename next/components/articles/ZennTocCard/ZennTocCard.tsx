import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, ExternalLink, List, ChevronDown, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function ZennTocCard({ item, defaultExpanded = true }) {
  const [expanded, setExpanded] = React.useState(defaultExpanded);

  if (!item) return null;
  const toc = Array.isArray(item.toc) ? item.toc : [];
  const baseLevel = toc.length ? Math.min(...toc.map((t) => t.level || 2)) : 2;

  const renderTocRow = (h, idx) => {
    const level = h.level ?? baseLevel;
    const indent = Math.max(0, level - baseLevel) * 16;
    const isTop = level === baseLevel;

    return (
      <li key={`${item.slug}-${h.id}-${idx}`} style={{ marginLeft: indent }} className="mb-1">
        <div className="flex items-start py-1">
          <span
            className={`mt-1 mr-2 inline-block rounded-full ${isTop ? "bg-blue-500" : "bg-blue-300"}`}
            style={{ width: 6, height: 6 }}
          />
          <a
            href={`${item.url}#${h.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`hover:text-blue-600 leading-relaxed ${isTop ? "text-sm font-medium text-slate-800" : "text-sm text-slate-700"}`}
          >
            {h.text}
          </a>
        </div>
      </li>
    );
  };

  return (
    <Card className="border border-slate-200 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs">Zenn</Badge>
            </div>

            <h4 className="font-medium text-slate-800 mb-2 line-clamp-2">{item.title}</h4>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">目次</span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpanded((v) => !v)}
                  className="text-slate-600 hover:text-blue-600"
                >
                  <List className="w-3 h-3 mr-1" />
                  目次
                  {expanded ? <ChevronDown className="w-3 h-3 ml-1" /> : <ChevronRight className="w-3 h-3 ml-1" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(item.url, "_blank")}
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-slate-200"
                >
                  {toc.length === 0 ? (
                    <div className="text-center py-4 text-slate-500 text-sm">この記事には目次がありません</div>
                  ) : (
                    <div>
                      <h5 className="text-sm font-medium text-slate-800 mb-3 flex items-center">
                        <List className="w-4 h-4 mr-2" />
                        目次
                      </h5>
                      <div className="bg-slate-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                        <ul>{toc.map((h, idx) => renderTocRow(h, idx))}</ul>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}