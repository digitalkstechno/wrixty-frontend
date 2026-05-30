"use client";

import React, { useState } from "react";
import { useMockDb, Status } from "../../context/MockDbContext";
import { Table, Column } from "../../components/common/Table";
import { Delete, Add, Edit } from "@mui/icons-material";
import { Modal } from "../../components/common/Modal";
import { Input } from "../../components/common/Input";

export default function StatusPage() {
  const { statuses, addStatus, updateStatus, deleteStatus } = useMockDb();

  const [modalOpen, setModalOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [activeStatus, setActiveStatus] = useState<Status | null>(null);

  const [name, setName] = useState("");
  const [color, setColor] = useState("#3b82f6");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    addStatus({ name, color });
    setModalOpen(false);
    clear();
  };

  const openEdit = (status: Status) => {
    setActiveStatus(status);
    setName(status.name);
    setColor(status.color);
    setEditOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStatus) return;
    updateStatus(activeStatus.id, { name, color });
    setEditOpen(false);
    clear();
  };

  const clear = () => {
    setName("");
    setColor("#3b82f6");
  };

  const columns: Column<Status>[] = [
    { key: "id", header: "No", render: (_, __, i) => i + 1, sortable: false },
    { key: "name", header: "Name" },
    {
      key: "color",
      header: "Color Badge",
      render: (val) => (
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded border border-zinc-200" style={{ backgroundColor: val }} />
          <span className="font-mono text-xs uppercase text-zinc-500">{val}</span>
        </div>
      )
    },
    {
      key: "actions",
      header: "Action",
      sortable: false,
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => openEdit(row)}
            className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-400 hover:text-indigo-500 rounded transition-all"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => deleteStatus(row.id)}
            className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-400 hover:text-red-500 rounded transition-all"
          >
            <Delete className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-black uppercase tracking-wider text-zinc-900 dark:text-zinc-50">
            Status Colors
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">
            Define dynamic status codes and visual labels
          </p>
        </div>
        <button
          onClick={() => {
            clear();
            setModalOpen(true);
          }}
          className="flex items-center gap-1 py-1.5 px-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-sm transition-all"
        >
          <Add className="w-4 h-4" /> Add Status
        </button>
      </div>

      <Table data={statuses} columns={columns} />

      {/* Add Status Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create Status Code">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Status Name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Doc Approved" />
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider block">Status Color Code</span>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full h-10 border border-zinc-250 rounded-md cursor-pointer bg-white"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase tracking-wider text-xs rounded-md shadow transition-all"
          >
            Register Status
          </button>
        </form>
      </Modal>

      {/* Edit Status Modal */}
      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Edit Status Code">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <Input label="Status Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider block">Status Color Code</span>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full h-10 border border-zinc-250 rounded-md cursor-pointer bg-white"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase tracking-wider text-xs rounded-md shadow transition-all"
          >
            Save Changes
          </button>
        </form>
      </Modal>
    </div>
  );
}
