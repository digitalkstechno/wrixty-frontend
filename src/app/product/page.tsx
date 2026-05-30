"use client";

import React, { useState } from "react";
import { useMockDb, Product } from "../../context/MockDbContext";
import { Table, Column } from "../../components/common/Table";
import { Delete, Add, Edit } from "@mui/icons-material";
import { Modal } from "../../components/common/Modal";
import { Input } from "../../components/common/Input";

export default function ProductPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useMockDb();

  const [modalOpen, setModalOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  const [codDiscount, setCodDiscount] = useState(0);
  const [prepaidDiscount, setPrepaidDiscount] = useState(0);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct({
      name,
      amount,
      cod_dicount: codDiscount,
      prepad_disocount: prepaidDiscount
    });
    setModalOpen(false);
    clear();
  };

  const openEdit = (product: Product) => {
    setActiveProduct(product);
    setName(product.name);
    setAmount(product.amount);
    setCodDiscount(product.cod_dicount);
    setPrepaidDiscount(product.prepad_disocount);
    setEditOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProduct) return;
    updateProduct(activeProduct.id, {
      name,
      amount,
      cod_dicount: codDiscount,
      prepad_disocount: prepaidDiscount
    });
    setEditOpen(false);
    clear();
  };

  const clear = () => {
    setName("");
    setAmount(0);
    setCodDiscount(0);
    setPrepaidDiscount(0);
  };

  const columns: Column<Product>[] = [
    { key: "id", header: "No", render: (_, __, i) => i + 1, sortable: false },
    { key: "name", header: "Name" },
    { key: "amount", header: "Amount", render: (val) => `₹${val}` },
    { key: "cod_dicount", header: "COD Discount", render: (val) => `${val}%` },
    { key: "prepad_disocount", header: "Prepaid Discount", render: (val) => `${val}%` },
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
            onClick={() => deleteProduct(row.id)}
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
            Product Catalogue
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">
            Monitor Ayurvedic products, base pricing and discounts
          </p>
        </div>
        <button
          onClick={() => {
            clear();
            setModalOpen(true);
          }}
          className="flex items-center gap-1 py-1.5 px-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-sm transition-all"
        >
          <Add className="w-4 h-4" /> Add Product
        </button>
      </div>

      <Table data={products} columns={columns} />

      {/* Add Product Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create New Product">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Product Name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Wrixty Triphala Digest" />
          <Input label="Base Price (Amount)" type="number" value={amount || ""} onChange={(e) => setAmount(Number(e.target.value))} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="COD Discount (%)" type="number" value={codDiscount || ""} onChange={(e) => setCodDiscount(Number(e.target.value))} required />
            <Input label="Prepaid Discount (%)" type="number" value={prepaidDiscount || ""} onChange={(e) => setPrepaidDiscount(Number(e.target.value))} required />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase tracking-wider text-xs rounded-md shadow transition-all"
          >
            Create Product
          </button>
        </form>
      </Modal>

      {/* Edit Product Modal */}
      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Edit Product details">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <Input label="Product Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Base Price (Amount)" type="number" value={amount || ""} onChange={(e) => setAmount(Number(e.target.value))} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="COD Discount (%)" type="number" value={codDiscount || ""} onChange={(e) => setCodDiscount(Number(e.target.value))} required />
            <Input label="Prepaid Discount (%)" type="number" value={prepaidDiscount || ""} onChange={(e) => setPrepaidDiscount(Number(e.target.value))} required />
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
