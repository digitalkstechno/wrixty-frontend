"use client";

import React, { useState } from "react";
import { useMockDb, Order } from "../../context/MockDbContext";
import { Table, Column } from "../../components/common/Table";
import { Select } from "../../components/common/Select";
import { Delete, Edit } from "@mui/icons-material";
import { Modal } from "../../components/common/Modal";
import { Input } from "../../components/common/Input";

export default function OrderListPage() {
  const { orders, products, users, couriers, deleteOrder, updateOrder } = useMockDb();

  // Filters State
  const [filterProduct, setFilterProduct] = useState("all");
  const [filterAssignee, setFilterAssignee] = useState("all");
  const [filterCourier, setFilterCourier] = useState("all");

  // Edit State
  const [editOpen, setEditOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [courier, setCourier] = useState("");
  const [txnId, setTxnId] = useState("");
  const [status, setStatus] = useState("");

  const filteredOrders = React.useMemo(() => {
    return orders
      .filter(o => filterProduct === "all" || o.product === filterProduct)
      .filter(o => filterAssignee === "all" || o.assginTo === filterAssignee)
      .filter(o => filterCourier === "all" || o.courier === filterCourier);
  }, [orders, filterProduct, filterAssignee, filterCourier]);

  const openEdit = (order: Order) => {
    setActiveOrder(order);
    setCourier(order.courier);
    setTxnId(order.transactionId);
    setStatus(order.status);
    setEditOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrder) return;
    updateOrder(activeOrder.id, {
      courier,
      transactionId: txnId,
      status
    });
    setEditOpen(false);
  };

  const columns: Column<Order>[] = [
    { key: "id", header: "No", render: (_, __, i) => i + 1, sortable: false },
    { key: "name", header: "Lead Name" },
    { key: "product", header: "Product Name" },
    { key: "grandTotal", header: "Grand Total", render: (val) => `₹${val.toLocaleString("en-IN")}` },
    { key: "phone_number", header: "Phone Number" },
    { key: "date", header: "Date" },
    { key: "paymentType", header: "Payment Type" },
    { key: "courier", header: "Courier" },
    { key: "assginTo", header: "Assign To" },
    { key: "transactionId", header: "Transaction ID" },
    {
      key: "status",
      header: "Status",
      render: (val) => {
        let color = "bg-zinc-500";
        if (val === "Delivered") color = "bg-indigo-600";
        if (val === "Dispatched") color = "bg-blue-600";
        if (val === "Returned") color = "bg-red-600";
        return (
          <span className={`px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white rounded ${color}`}>
            {val}
          </span>
        );
      }
    },
    {
      key: "actions",
      header: "Action",
      sortable: false,
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => openEdit(row)}
            className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 hover:text-indigo-500 rounded"
            title="Edit Order"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => deleteOrder(row.id)}
            className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 hover:text-red-500 rounded"
            title="Delete Order"
          >
            <Delete className="w-3.5 h-3.5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="space-y-1">
        <h2 className="text-xl font-black uppercase tracking-wider text-zinc-900 dark:text-zinc-50">
          Orders List
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">
          Track conversions, courier partners, and tracking IDs
        </p>
      </div>

      {/* Advanced Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white dark:bg-zinc-950 p-4 border border-zinc-200 dark:border-zinc-900 rounded-md">
        <Select
          label="Filter by Product"
          value={filterProduct}
          onChange={(e) => setFilterProduct(e.target.value)}
          options={[
            { value: "all", label: "Show All Products" },
            ...products.map(p => ({ value: p.name, label: p.name }))
          ]}
        />
        <Select
          label="Filter by Assignee"
          value={filterAssignee}
          onChange={(e) => setFilterAssignee(e.target.value)}
          options={[
            { value: "all", label: "Show All Staff" },
            ...users.map(u => ({ value: u.name, label: u.name }))
          ]}
        />
        <Select
          label="Filter by Courier"
          value={filterCourier}
          onChange={(e) => setFilterCourier(e.target.value)}
          options={[
            { value: "all", label: "Show All Couriers" },
            ...couriers.map(c => ({ value: c.name, label: c.name }))
          ]}
        />
      </div>

      {/* Table Element */}
      <Table data={filteredOrders} columns={columns} />

      {/* Edit Order Modal */}
      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Update Order Dispatches">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <Select
            label="Courier Partner"
            value={courier}
            onChange={(e) => setCourier(e.target.value)}
            options={couriers.map(c => ({ value: c.name, label: c.name }))}
          />
          <Input
            label="Transaction / Tracking ID"
            value={txnId}
            onChange={(e) => setTxnId(e.target.value)}
            required
          />
          <Select
            label="Order Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              { value: "Dispatched", label: "Dispatched" },
              { value: "Delivered", label: "Delivered & Complete" },
              { value: "Returned", label: "Returned (RTO)" }
            ]}
          />
          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase tracking-wider text-xs rounded-md shadow transition-all"
          >
            Update Order Details
          </button>
        </form>
      </Modal>
    </div>
  );
}
