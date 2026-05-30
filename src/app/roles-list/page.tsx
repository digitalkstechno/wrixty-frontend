"use client";

import React, { useState } from "react";
import { Table, Column } from "../../components/common/Table";
import { Security } from "@mui/icons-material";

export default function RolesListPage() {
  const [permissions, setPermissions] = useState([
    { module: "Dashboard View", superadmin: true, manager: true, agent: true },
    { module: "Leads Database Add/Edit", superadmin: true, manager: true, agent: true },
    { module: "Leads Delete", superadmin: true, manager: false, agent: false },
    { module: "Orders Dispatch", superadmin: true, manager: true, agent: false },
    { module: "Restore Deleted Leads", superadmin: true, manager: false, agent: false },
    { module: "Courier Management", superadmin: true, manager: true, agent: false },
    { module: "Users / Employee Management", superadmin: true, manager: false, agent: false },
    { module: "Configure Permissions Matrix", superadmin: true, manager: false, agent: false }
  ]);

  const togglePerm = (index: number, role: "superadmin" | "manager" | "agent") => {
    setPermissions(prev => prev.map((p, idx) => {
      if (idx === index) {
        return { ...p, [role]: !p[role] };
      }
      return p;
    }));
  };

  const columns: Column<typeof permissions[0]>[] = [
    { key: "module", header: "Module / Action", sortable: false },
    {
      key: "superadmin",
      header: "Super Admin",
      sortable: false,
      render: (val, row, i) => (
        <input
          type="checkbox"
          checked={val}
          onChange={() => togglePerm(i, "superadmin")}
          className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
        />
      )
    },
    {
      key: "manager",
      header: "Manager",
      sortable: false,
      render: (val, row, i) => (
        <input
          type="checkbox"
          checked={val}
          onChange={() => togglePerm(i, "manager")}
          className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
        />
      )
    },
    {
      key: "agent",
      header: "Sales Agent",
      sortable: false,
      render: (val, row, i) => (
        <input
          type="checkbox"
          checked={val}
          onChange={() => togglePerm(i, "agent")}
          className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
        />
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="space-y-1">
        <h2 className="text-xl font-black uppercase tracking-wider text-zinc-900 dark:text-zinc-50">
          Roles List & Permissions
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">
          Assign RBAC capability matrices across staff roles
        </p>
      </div>

      <Table data={permissions} columns={columns} searchable={false} />
    </div>
  );
}
