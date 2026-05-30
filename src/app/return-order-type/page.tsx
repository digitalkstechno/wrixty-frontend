"use client";

import React, { useState } from "react";
import { Table, Column } from "../../components/common/Table";
import { Delete, Add, Edit } from "@mui/icons-material";
import { Modal } from "../../components/common/Modal";
import { Input } from "../../components/common/Input";

export default function ReturnOrderTypePage() {
  const [types, setTypes] = useState([
    { id: "1", name: "Wrong Product Delivered" },
    { id: "2", name: "Customer Refused to Accept" },
    { id: "3", name: "Courier Loss / Damaged" },
    { id: "4", name: "Incorrect Delivery Address" }
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [activeType, setActiveType] = useState<typeof types[0] | null>(null);
  const [name, setName] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setTypes([...types, { id: Date.now().toString(), name }]);
    setModalOpen(false);
    setName("");
  };

  const openEdit = (type: typeof types[0]) => {
    setActiveType(type);
    setName(type.name);
    setEditOpen(true);
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeType) return;
    setTypes(types.map(t => t.id === activeType.id ? { ...t, name } : t));
    setEditOpen(false);
    setName("");
  };

  const handleDelete = (id: string) => {
    setTypes(types.filter(t => t.id !== id));
  };

  const columns: Column<typeof types[0]>[] = [
    { key: "id", header: "No", render: (_, __, i) => i + 1, sortable: false },
    { key: "name", header: "Name" },
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
            onClick={() => handleDelete(row.id)}
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
            Return Categories (Types)
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">
            Configure RTO classifications and categorization reason codes
          </p>
        </div>
        <button
          onClick={() => {
            setName("");
            setModalOpen(true);
          }}
          className="flex items-center gap-1 py-1.5 px-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-sm transition-all"
        >
          <Add className="w-4 h-4" /> Add Type
        </button>
      </div>

      <Table data={types} columns={columns} />

      {/* Add Type Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Return Classification">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Classification Name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Package Tampered" />
          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase tracking-wider text-xs rounded-md shadow transition-all"
          >
            Register Type
          </button>
        </form>
      </Modal>

      {/* Edit Type Modal */}
      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Edit Return Classification">
        <form onSubmit={handleEdit} className="space-y-4">
          <Input label="Classification Name" value={name} onChange={(e) => setName(e.target.value)} required />
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
