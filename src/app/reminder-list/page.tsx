"use client";

import React, { useState } from "react";
import { useMockDb, Reminder } from "../../context/MockDbContext";
import { Table, Column } from "../../components/common/Table";
import { Delete, Add } from "@mui/icons-material";
import { Modal } from "../../components/common/Modal";
import { Input } from "../../components/common/Input";
import { Select } from "../../components/common/Select";

export default function ReminderListPage() {
  const { reminders, users, leads, addReminder, deleteReminder } = useMockDb();

  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [reminderDate, setReminderDate] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const lead = leads.find(l => l.id === selectedLeadId);
    if (!lead) return;

    addReminder({
      title,
      leadId: selectedLeadId,
      name: lead.name,
      phone_number: lead.phone_number,
      reminderDate,
      product: lead.product,
      amount: lead.amount,
      quantity: lead.quantity,
      subtotal: lead.subtotal
    });
    setModalOpen(false);
    setTitle("");
    setReminderDate("");
  };

  const columns: Column<Reminder>[] = [
    { key: "id", header: "No", render: (_, __, i) => i + 1, sortable: false },
    { key: "title", header: "Title" },
    { key: "name", header: "Customer Name" },
    { key: "phone_number", header: "Phone Number" },
    { key: "product", header: "Product Name" },
    { key: "subtotal", header: "Subtotal", render: (val) => `₹${val}` },
    { key: "reminderDate", header: "Reminder Date" },
    {
      key: "actions",
      header: "Action",
      sortable: false,
      render: (_, row) => (
        <button
          onClick={() => deleteReminder(row.id)}
          className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-400 hover:text-red-500 rounded transition-all"
        >
          <Delete className="w-4 h-4" />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-black uppercase tracking-wider text-zinc-900 dark:text-zinc-50">
            Reminder List
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">
            Review schedule and follow up timings for hot leads
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedLeadId(leads[0]?.id || "");
            setModalOpen(true);
          }}
          className="flex items-center gap-1 py-1.5 px-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-sm transition-all"
        >
          <Add className="w-4 h-4" /> Set Reminder
        </button>
      </div>

      <Table data={reminders} columns={columns} />

      {/* Set Reminder Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Set Follow-up Reminder">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Reminder Title" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. Call back regarding health query" />
          <Select
            label="Select Active Lead"
            value={selectedLeadId}
            onChange={(e) => setSelectedLeadId(e.target.value)}
            options={leads.filter(l => !l.isDeleted).map(l => ({ value: l.id, label: `${l.name} (${l.product})` }))}
          />
          <Input
            label="Reminder Date"
            type="date"
            value={reminderDate}
            onChange={(e) => setReminderDate(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase tracking-wider text-xs rounded-md shadow transition-all"
          >
            Schedule Reminder
          </button>
        </form>
      </Modal>
    </div>
  );
}
