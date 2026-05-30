"use client";

import React from "react";
import { useMockDb, Lead } from "../../context/MockDbContext";
import { Table, Column } from "../../components/common/Table";
import { Restore } from "@mui/icons-material";

export default function RestoreDataPage() {
  const { leads, restoreLead } = useMockDb();

  const deletedLeads = React.useMemo(() => leads.filter(l => l.isDeleted), [leads]);

  const columns: Column<Lead>[] = [
    { key: "id", header: "No", render: (_, __, i) => i + 1, sortable: false },
    { key: "name", header: "Customer Name" },
    { key: "phone_number", header: "Phone Number" },
    { key: "product", header: "Product Name" },
    { key: "subtotal", header: "Total", render: (val) => `₹${val}` },
    { key: "date", header: "Lead Date" },
    { key: "deleteDate", header: "Delete Date" },
    { key: "reason_call", header: "Reason Call", render: (val) => val || "-" },
    {
      key: "actions",
      header: "Action",
      sortable: false,
      render: (_, row) => (
        <button
          onClick={() => restoreLead(row.id)}
          className="flex items-center gap-1 py-1 px-2.5 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-600 hover:text-white text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 rounded transition-all"
        >
          <Restore className="w-3.5 h-3.5" /> Restore
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="space-y-1">
        <h2 className="text-xl font-black uppercase tracking-wider text-zinc-900 dark:text-zinc-50">
          Restore Deleted Data
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">
          Inspect and restore soft-deleted leads
        </p>
      </div>

      <Table data={deletedLeads} columns={columns} />
    </div>
  );
}
