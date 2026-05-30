"use client";

import React from "react";
import { useMockDb } from "../../context/MockDbContext";
import { Table, Column } from "../../components/common/Table";

export default function ActivityLogPage() {
  const { leads, orders } = useMockDb();

  // Synthesize logs from leads & orders updates
  const logs = React.useMemo(() => {
    const list: { id: string; date: string; user: string; lead: string; message: string }[] = [];
    
    leads.forEach((l, i) => {
      list.push({
        id: `lead-init-${i}`,
        date: l.date,
        user: "System",
        lead: l.name,
        message: `Lead was created and assigned to ${l.assgin} in status ${l.status}.`
      });
      if (l.isDeleted) {
        list.push({
          id: `lead-del-${i}`,
          date: l.deleteDate || l.date,
          user: "Super Admin",
          lead: l.name,
          message: "Soft-deleted from main database."
        });
      }
    });

    orders.forEach((o, i) => {
      list.push({
        id: `order-conv-${i}`,
        date: o.date,
        user: o.assginTo || "Super Admin",
        lead: o.name,
        message: `Converted to active order and dispatched via ${o.courier} (Tracking: ${o.transactionId})`
      });
    });

    // Sort by date desc
    return list.sort((a, b) => b.date.localeCompare(a.date));
  }, [leads, orders]);

  const columns: Column<typeof logs[0]>[] = [
    { key: "date", header: "Date" },
    { key: "user", header: "User" },
    { key: "lead", header: "Lead" },
    { key: "message", header: "Message" }
  ];

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="space-y-1">
        <h2 className="text-xl font-black uppercase tracking-wider text-zinc-900 dark:text-zinc-50">
          Activity Log
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">
          Audit trails of CRM database changes
        </p>
      </div>

      <Table data={logs} columns={columns} />
    </div>
  );
}
