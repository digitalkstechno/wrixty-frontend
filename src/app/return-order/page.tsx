"use client";

import React, { useState } from "react";
import { useMockDb, ReturnOrder } from "../../context/MockDbContext";
import { Table, Column } from "../../components/common/Table";
import { Delete, Add } from "@mui/icons-material";
import { Modal } from "../../components/common/Modal";
import { Input } from "../../components/common/Input";
import { Select } from "../../components/common/Select";

export default function ReturnOrderPage() {
  const { returnOrders, users, orders, addReturnOrder, deleteReturnOrder } = useMockDb();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [reason, setReason] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const order = orders.find(o => o.id === selectedOrderId);
    if (!order) return;

    addReturnOrder({
      customerName: order.name,
      phone_number: order.phone_number,
      assginTo: order.assginTo,
      orderDate: order.date,
      returnDate: returnDate,
      product: order.product,
      amount: order.amount,
      quantity: order.quantity,
      subtotal: order.subtotal,
      type: reason
    });
    setModalOpen(false);
    setReason("");
    setReturnDate("");
  };

  const columns: Column<ReturnOrder>[] = [
    { key: "id", header: "No", render: (_, __, i) => i + 1, sortable: false },
    { key: "customerName", header: "Customer Name" },
    { key: "phone_number", header: "Mobile Number" },
    { key: "product", header: "Product Name" },
    { key: "amount", header: "Amount", render: (val) => `₹${val}` },
    { key: "orderDate", header: "Order Date" },
    { key: "returnDate", header: "Return Order Date" },
    { key: "type", header: "Type" },
    { key: "assginTo", header: "Assgin To" },
    {
      key: "actions",
      header: "Action",
      sortable: false,
      render: (_, row) => (
        <button
          onClick={() => deleteReturnOrder(row.id)}
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
            Return Orders
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">
            Monitor rejected and returned shipments (RTO log)
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedOrderId(orders[0]?.id || "");
            setModalOpen(true);
          }}
          className="flex items-center gap-1 py-1.5 px-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-sm transition-all"
        >
          <Add className="w-4 h-4" /> Log Return
        </button>
      </div>

      <Table data={returnOrders} columns={columns} />

      {/* Return Order Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Log Return Shipment (RTO)">
        <form onSubmit={handleCreate} className="space-y-4">
          <Select
            label="Select Dispatched Order"
            value={selectedOrderId}
            onChange={(e) => setSelectedOrderId(e.target.value)}
            options={orders.map(o => ({ value: o.id, label: `${o.name} - ${o.product} (${o.transactionId})` }))}
          />
          <Input
            label="Return Date"
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            required
          />
          <Select
            label="Return Reason (Type)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            options={[
              { value: "Wrong Product Delivered", label: "Wrong Product Delivered" },
              { value: "Customer Refused to Accept", label: "Customer Refused to Accept" },
              { value: "Courier Loss / Damaged", label: "Courier Loss / Damaged" },
              { value: "Incorrect Delivery Address", label: "Incorrect Delivery Address" }
            ]}
          />
          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase tracking-wider text-xs rounded-md shadow transition-all"
          >
            Submit Return Log
          </button>
        </form>
      </Modal>
    </div>
  );
}
