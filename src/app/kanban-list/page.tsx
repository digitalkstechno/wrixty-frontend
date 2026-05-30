"use client";

import React from "react";
import { useMockDb, Lead } from "../../context/MockDbContext";
import { ChevronRight, ChevronLeft } from "@mui/icons-material";

export default function KanbanListPage() {
  const { leads, statuses, updateLead } = useMockDb();

  const activeLeads = React.useMemo(() => leads.filter(l => !l.isDeleted), [leads]);

  const moveStatus = (id: string, currentStatus: string, direction: "left" | "right") => {
    const currentIndex = statuses.findIndex(s => s.name === currentStatus);
    if (currentIndex === -1) return;
    
    let nextIndex = currentIndex;
    if (direction === "left") nextIndex = Math.max(0, currentIndex - 1);
    if (direction === "right") nextIndex = Math.min(statuses.length - 1, currentIndex + 1);

    if (nextIndex !== currentIndex) {
      updateLead(id, { status: statuses[nextIndex].name });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="space-y-1">
        <h2 className="text-xl font-black uppercase tracking-wider text-zinc-900 dark:text-zinc-50">
          Kanban Board
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">
          Quickly advance leads across stages visually
        </p>
      </div>

      {/* Board Scrollable container */}
      <div className="flex gap-4 overflow-x-auto pb-4 items-start select-none">
        {statuses.map((stage) => {
          const stageLeads = activeLeads.filter(l => l.status === stage.name);
          return (
            <div
              key={stage.id}
              className="w-72 shrink-0 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-md p-4 space-y-4"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stage.color }} />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                    {stage.name}
                  </h4>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-zinc-50 dark:bg-zinc-900 text-zinc-500 rounded">
                  {stageLeads.length}
                </span>
              </div>

              {/* Cards List */}
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {stageLeads.length > 0 ? (
                  stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="p-3.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 rounded-md shadow-sm space-y-2.5 text-left transition-all hover:shadow-md"
                    >
                      <div>
                        <h5 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide">
                          {lead.name}
                        </h5>
                        <p className="text-[10px] text-zinc-400 font-semibold">
                          📞 {lead.phone_number}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[10px] px-1.5 py-0.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold rounded">
                          {lead.product}
                        </span>
                        <span className="text-[10px] font-black text-zinc-700 dark:text-zinc-300">
                          ₹{lead.subtotal}
                        </span>
                      </div>

                      {lead.note && (
                        <p className="text-[10px] text-zinc-400 dark:text-zinc-500 line-clamp-2">
                          {lead.note}
                        </p>
                      )}

                      {/* Direction Moves */}
                      <div className="flex items-center justify-between pt-2 border-t border-zinc-200 dark:border-zinc-800">
                        <button
                          onClick={() => moveStatus(lead.id, lead.status, "left")}
                          className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded transition-all text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                          title="Move Left"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[9px] uppercase tracking-wider font-extrabold text-zinc-400">
                          Actions
                        </span>
                        <button
                          onClick={() => moveStatus(lead.id, lead.status, "right")}
                          className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded transition-all text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                          title="Move Right"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-[10px] text-zinc-400 dark:text-zinc-600 py-6 font-medium">
                    No leads in this stage
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
