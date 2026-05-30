"use client";

import React, { useState } from "react";
import { useMockDb, Task } from "../../context/MockDbContext";
import { Table, Column } from "../../components/common/Table";
import { Modal } from "../../components/common/Modal";
import { Input } from "../../components/common/Input";
import { Select } from "../../components/common/Select";
import { Add, Delete } from "@mui/icons-material";

export default function TaskListPage() {
  const { tasks, users, addTask, toggleTask, deleteTask } = useMockDb();

  const [modalOpen, setModalOpen] = useState(false);
  const [assignee, setAssignee] = useState("");
  const [customer, setCustomer] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    addTask({
      assginUser: assignee || users[0]?.name || "Aman Sharma",
      lead: customer,
      phone_number: phone,
      addedBy: "Super Admin",
      message
    });
    setModalOpen(false);
    setCustomer("");
    setPhone("");
    setMessage("");
  };

  const columns: Column<Task>[] = [
    { key: "date", header: "Date" },
    { key: "assginUser", header: "Assign User" },
    { key: "lead", header: "Lead" },
    { key: "phone_number", header: "Phone Number" },
    { key: "addedBy", header: "Added By" },
    { key: "message", header: "Message" },
    {
      key: "status",
      header: "Status",
      render: (val, row) => (
        <button
          onClick={() => toggleTask(row.id)}
          className={`flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider text-white ${
            val === "Completed" ? "bg-indigo-600" : "bg-yellow-600"
          }`}
        >
          {val}
        </button>
      )
    },
    {
      key: "actions",
      header: "Action",
      sortable: false,
      render: (_, row) => (
        <button
          onClick={() => deleteTask(row.id)}
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
            Task List
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">
            Distribute operational tasks across call agents
          </p>
        </div>
        <button
          onClick={() => {
            setAssignee(users[0]?.name || "");
            setModalOpen(true);
          }}
          className="flex items-center gap-1 py-1.5 px-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-sm transition-all"
        >
          <Add className="w-4 h-4" /> Assign Task
        </button>
      </div>

      <Table data={tasks} columns={columns} />

      {/* Assign Task Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create New Task">
        <form onSubmit={handleCreate} className="space-y-4">
          <Select
            label="Assign Agent"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            options={users.map(u => ({ value: u.name, label: u.name }))}
          />
          <Input label="Customer Name" value={customer} onChange={(e) => setCustomer(e.target.value)} required />
          <Input label="Customer Mobile" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          <Input label="Action Message" value={message} onChange={(e) => setMessage(e.target.value)} required />
          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase tracking-wider text-xs rounded-md shadow transition-all"
          >
            Dispatch Task
          </button>
        </form>
      </Modal>
    </div>
  );
}
