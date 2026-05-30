"use client";

import React from "react";
import { useMockDb } from "../../context/MockDbContext";
import { Table, Column } from "../../components/common/Table";

export default function StaffReturnOrderListPage() {
  const { users, orders, returnOrders } = useMockDb();

  const staffStats = React.useMemo(() => {
    return users.map(u => {
      const staffOrders = orders.filter(o => o.assginTo === u.name).length;
      const staffReturns = returnOrders.filter(r => r.assginTo === u.name).length;
      const rate = staffOrders > 0 ? ((staffReturns / staffOrders) * 100).toFixed(1) : "0.0";
      
      return {
        id: u.id,
        name: u.name,
        total: staffOrders,
        returns: staffReturns,
        rate: `${rate}%`
      };
    });
  }, [users, orders, returnOrders]);

  const columns: Column<typeof staffStats[0]>[] = [
    { key: "id", header: "No", render: (_, __, i) => i + 1, sortable: false },
    { key: "name", header: "Staff Name" },
    { key: "total", header: "Total Dispatches" },
    { key: "returns", header: "Return Orders" },
    {
      key: "rate",
      header: "Return Rate",
      render: (val) => (
        <span className="font-black text-red-500 tracking-wider">
          {val}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="space-y-1">
        <h2 className="text-xl font-black uppercase tracking-wider text-zinc-900 dark:text-zinc-50">
          Staff Return Stats
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">
          Analyze shipment returns (RTO) ratio per active agent
        </p>
      </div>

      <Table data={staffStats} columns={columns} />
    </div>
  );
}
