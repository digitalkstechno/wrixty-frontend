"use client";

import React, { useState } from "react";
import { useMockDb, Lead } from "../../context/MockDbContext";
import { useToast } from "../../context/ToastContext";
import { Table, Column } from "../../components/common/Table";
import { Modal } from "../../components/common/Modal";
import { Input } from "../../components/common/Input";
import { Select } from "../../components/common/Select";
import { Button } from "../../components/common/Button";
import { Add, SwapHoriz, Delete, Edit, Assignment, Note } from "@mui/icons-material";

interface SelectedProductRow {
  id: string;
  name: string;
  amount: number;
  quantity: number;
}

export default function LeadListPage() {
  const { leads, products, users, statuses, couriers, addLead, updateLead, deleteLead, convertToOrder } = useMockDb();
  const toast = useToast();

  // Selected Leads for bulk options
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Modals state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [convertModalOpen, setConvertModalOpen] = useState(false);
  const [activeLead, setActiveLead] = useState<Lead | null>(null);

  // Loading states
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [isAddingLead, setIsAddingLead] = useState(false);
  const [isUpdatingLead, setIsUpdatingLead] = useState(false);
  const [isConvertingLead, setIsConvertingLead] = useState(false);
  const [isDeletingLead, setIsDeletingLead] = useState(false);

  // Form states for Add / Edit
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("Open");
  const [statusTwo, setStatusTwo] = useState("CNR");
  const [noteText, setNoteText] = useState("");
  const [assignee, setAssignee] = useState("");
  const [orderStatus, setOrderStatus] = useState(false);
  const [reminder, setReminder] = useState("");

  // Product Selection Table States for Modal
  const [modalSelectedProducts, setModalSelectedProducts] = useState<SelectedProductRow[]>([]);
  const [currentSelectedProduct, setCurrentSelectedProduct] = useState("");

  // Form states for Convert to Order
  const [paymentType, setPaymentType] = useState<"COD" | "Prepaid">("COD");
  const [selectedCourier, setSelectedCourier] = useState("");
  const [transactionId, setTransactionId] = useState("");

  // Filters State
  const [filterProduct, setFilterProduct] = useState("all");
  const [filterAssignee, setFilterAssignee] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterReason, setFilterReason] = useState("all");

  // 1. Filtering logic
  const filteredLeads = React.useMemo(() => {
    return leads
      .filter(l => !l.isDeleted)
      .filter(l => filterProduct === "all" || l.product === filterProduct)
      .filter(l => filterAssignee === "all" || l.assgin === filterAssignee)
      .filter(l => filterStatus === "all" || l.status === filterStatus)
      .filter(l => filterReason === "all" || l.reason_call === filterReason);
  }, [leads, filterProduct, filterAssignee, filterStatus, filterReason]);

  const openAddModal = () => {
    setName("");
    setPhone("");
    setStatus("Open");
    setStatusTwo("CNR");
    setNoteText("");
    setAssignee(users[0]?.name || "");
    setOrderStatus(false);
    setReminder("");
    setModalSelectedProducts([]);
    setCurrentSelectedProduct(products[0]?.name || "");
    setAddModalOpen(true);
  };

  const handleAddProduct = () => {
    if (!currentSelectedProduct) return;
    const prod = products.find(p => p.name === currentSelectedProduct);
    if (!prod) return;

    // Check if already added
    if (modalSelectedProducts.some(p => p.name === prod.name)) {
      toast.warning("Product already added to list!");
      return;
    }

    setModalSelectedProducts([
      ...modalSelectedProducts,
      { id: prod.id, name: prod.name, amount: prod.amount, quantity: 1 }
    ]);
  };

  const handleRemoveProduct = (id: string) => {
    setModalSelectedProducts(modalSelectedProducts.filter(p => p.id !== id));
  };

  const handleQtyChange = (id: string, qty: number) => {
    setModalSelectedProducts(
      modalSelectedProducts.map(p => p.id === id ? { ...p, quantity: Math.max(1, qty) } : p)
    );
  };

  const totalAmount = modalSelectedProducts.reduce((sum, p) => sum + p.amount * p.quantity, 0);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (modalSelectedProducts.length === 0) {
      toast.warning("Please add at least one product!");
      return;
    }

    setIsAddingLead(true);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Combine products names
    const productNames = modalSelectedProducts.map(p => p.name).join(", ");
    
    // 1. Add Lead
    addLead({
      name,
      phone_number: phone,
      product: productNames,
      amount: totalAmount,
      quantity: modalSelectedProducts.reduce((sum, p) => sum + p.quantity, 0),
      assgin: assignee,
      status,
      reason_call: statusTwo,
      note: noteText
    });

    // 2. Conditionally Convert to Order if checked
    if (orderStatus) {
      setTimeout(() => {
        const lastLead = leads[leads.length - 1];
        if (lastLead) {
          convertToOrder(lastLead.id, {
            paymentType: paymentType,
            courier: selectedCourier || "Shiprocket",
            transactionId: transactionId || "TXN-AUTO"
          });
        }
      }, 100);
    }

    toast.success(`Lead created successfully for ${name || "Customer"}!`);
    setIsAddingLead(false);
    setAddModalOpen(false);
  };

  const openEditModal = (lead: Lead) => {
    setActiveLead(lead);
    setName(lead.name);
    setPhone(lead.phone_number);
    setStatus(lead.status);
    setStatusTwo(lead.reason_call || "CNR");
    setNoteText(lead.note);
    setAssignee(lead.assgin);
    setOrderStatus(false);
    setReminder(lead.reminderDate || "");
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLead) return;

    setIsUpdatingLead(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    updateLead(activeLead.id, {
      name,
      phone_number: phone,
      assgin: assignee,
      status,
      reason_call: statusTwo,
      note: noteText,
      reminderDate: reminder
    });
    toast.info(`Lead configuration updated.`);
    setIsUpdatingLead(false);
    setEditModalOpen(false);
  };

  const openConvertModal = (lead: Lead) => {
    setActiveLead(lead);
    setPaymentType("COD");
    setSelectedCourier(couriers[0]?.name || "Shiprocket");
    setTransactionId("");
    setConvertModalOpen(true);
  };

  const handleConvertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLead) return;
    
    setIsConvertingLead(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    convertToOrder(activeLead.id, {
      paymentType,
      courier: selectedCourier,
      transactionId
    });
    toast.success(`Successfully converted ${activeLead.name || "Customer"} to order!`);
    setIsConvertingLead(false);
    setConvertModalOpen(false);
  };

  const handleBulkDelete = async () => {
    setIsDeletingLead(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    selectedIds.forEach(id => deleteLead(id));
    toast.warning(`Soft-deleted ${selectedIds.length} lead records.`);
    setSelectedIds([]);
    setIsDeletingLead(false);
  };

  // Columns matching screenshot exactly
  const columns: Column<Lead>[] = [
    { key: "id", header: "No", render: (_, __, i) => i + 1, sortable: false },
    { key: "name", header: "Customer Name", render: (val) => val || "-" },
    { key: "phone_number", header: "Phone Number" },
    { key: "product", header: "Product Name" },
    { key: "subtotal", header: "Total", render: (val) => `₹${val}` },
    { key: "assgin", header: "Assign By" },
    { key: "date", header: "Date" },
    {
      key: "status",
      header: "Status",
      render: (val) => {
        let badgeColor = "bg-yellow-500"; // Open
        if (val === "Inprogress" || val === "In-Progress") badgeColor = "bg-emerald-500";
        if (val === "Close" || val === "Closed") badgeColor = "bg-rose-500";
        
        return (
          <span className={`px-3 py-1.5 text-xs font-bold text-white rounded-md ${badgeColor}`}>
            {val}
          </span>
        );
      }
    },
    {
      key: "reason_call",
      header: "Reason Call",
      render: (val) => (
        <span className="px-2.5 py-1.5 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 rounded font-semibold text-xs">
          {val || "CNR"}
        </span>
      )
    },
    {
      key: "convert",
      header: "Convert Order",
      sortable: false,
      render: (_, row) => (
        <Button
          onClick={() => openConvertModal(row)}
          variant="primary"
          size="sm"
          className="text-[11px]"
        >
          Convert To Order
        </Button>
      )
    },
    {
      key: "note",
      header: "Note",
      sortable: false,
      render: (_, row) => (
        <button
          onClick={() => row.note ? toast.info(`Note: ${row.note}`) : toast.warning("No note available for this lead.")}
          className="p-2 bg-amber-700 hover:bg-amber-600 text-white rounded-sm shadow-sm transition-all"
          title={row.note || "No note"}
        >
          <Note className="w-4 h-4" />
        </button>
      )
    },
    {
      key: "actions",
      header: "Action",
      sortable: false,
      render: (_, row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => openEditModal(row)}
            className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded transition-all"
            title="Edit Lead"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => deleteLead(row.id)}
            className="p-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded transition-all"
            title="Delete Lead"
          >
            <Delete className="w-3.5 h-3.5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Lead List Main White Card matching screenshots */}
      <div className="bg-white dark:bg-zinc-950 p-6 border border-zinc-200 dark:border-zinc-900 rounded-md shadow-sm space-y-6">
        
        {/* Card Header title and Add button */}
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-4">
          <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">
            Lead List
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-zinc-500 bg-zinc-100 dark:bg-zinc-900 px-3 py-1.5 rounded border border-zinc-200/50 dark:border-zinc-800">
              📅 May 30, 2026 - May 30, 2026
            </span>
            <Button
              onClick={openAddModal}
              variant="primary"
            >
              Add Lead
            </Button>
          </div>
        </div>

        {/* Inline Filters & Action Buttons exactly matching first screenshot layout */}
        <div className="flex flex-wrap items-center gap-3 border-b border-zinc-100 dark:border-zinc-900 pb-4">
          <div className="w-full sm:w-auto sm:flex-1 min-w-[160px]">
            <Select
              value={filterProduct}
              onChange={(e) => setFilterProduct(e.target.value)}
              options={[
                { value: "all", label: "Select Product" },
                ...products.map(p => ({ value: p.name, label: p.name }))
              ]}
            />
          </div>
          <div className="w-full sm:w-auto sm:flex-1 min-w-[160px]">
            <Select
              value={filterAssignee}
              onChange={(e) => setFilterAssignee(e.target.value)}
              options={[
                { value: "all", label: "Select Assign" },
                ...users.map(u => ({ value: u.name, label: u.name }))
              ]}
            />
          </div>
          <div className="w-full sm:w-auto sm:flex-1 min-w-[160px]">
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              options={[
                { value: "all", label: "Select Status" },
                ...statuses.map(s => ({ value: s.name, label: s.name }))
              ]}
            />
          </div>
          <div className="w-full sm:w-auto sm:flex-1 min-w-[160px]">
            <Select
              value={filterReason}
              onChange={(e) => setFilterReason(e.target.value)}
              options={[
                { value: "all", label: "Select Reason Call" },
                { value: "CNR", label: "CNR" },
                { value: "Call Busy", label: "Call Busy" },
                { value: "Number off", label: "Number off" },
                { value: " vichari ne kese", label: " vichari ne kese" }
              ]}
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              onClick={() => toast.info("Filter parameters applied successfully.")}
            >
              Apply Filter
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setFilterProduct("all");
                setFilterAssignee("all");
                setFilterStatus("all");
                setFilterReason("all");
                toast.info("Filters cleared.");
              }}
            >
              Clear Filter
            </Button>
            <Button
              variant="primary"
              onClick={() => toast.info("Assigned lead workflow initiated.")}
            >
              Assign Lead
            </Button>
            <Button
              variant="success"
              onClick={() => toast.success("Lead data successfully exported to Excel!")}
            >
              Export
            </Button>
          </div>
        </div>

        {/* Selected ids bulk deletes */}
        {selectedIds.length > 0 && (
          <div className="flex justify-end">
            <Button
              variant="danger"
              onClick={handleBulkDelete}
              isLoading={isDeletingLead}
            >
              Bulk Delete ({selectedIds.length})
            </Button>
          </div>
        )}

        {/* Entries & Search row */}
        <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-900 pt-4 mt-2">
          <div className="text-xs text-zinc-500 flex items-center gap-1.5 font-medium">
            Show
            <select className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded py-1 px-1 text-xs">
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            entries
          </div>
          <div className="text-xs text-zinc-500 flex items-center gap-1.5 font-medium">
            Search:
            <input
              type="text"
              placeholder=""
              className="bg-zinc-55 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded py-1 px-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* Table database */}
        <Table
          data={filteredLeads}
          columns={columns}
          selectable
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          searchable={false}
          isLoading={isFetchingData}
        />
      </div>

      {/* Add Lead Modal Revamped completely to match screenshot 2 */}
      <Modal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} title="Add Lead" sizeClass="max-w-4xl" isLoading={isAddingLead}>
        <form onSubmit={handleAddSubmit} className="space-y-6 text-left">
          
          {/* Row 1: Name, Phone Number, Reason Call */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter Name"
            />
            <Input
              label="Phone Number"
              type="number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="Enter Phone Number"
            />
            <Select
              label="Reason Call"
              value={statusTwo}
              onChange={(e) => setStatusTwo(e.target.value)}
              options={[
                { value: "CNR", label: "CNR" },
                { value: "Call Busy", label: "Call Busy" },
                { value: "Number off", label: "Number off" },
                { value: "vichari ne kese", label: "vichari ne kese" },
                { value: "Soch k Batyge", label: "Soch k Batyge" },
                { value: "Friends k liye tha", label: "Friends k liye tha" },
                { value: "Bija mate Hatu", label: "Bija mate Hatu" },
                { value: "Thodi var pachi call back kare", label: "Thodi var pachi call back kare" }
              ]}
            />
          </div>

          {/* Row 2: Status, Assign By, Note */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={[
                { value: "Select Status", label: "Select Status" },
                { value: "Open", label: "Open" },
                { value: "Inprogress", label: "Inprogress" },
                { value: "Close", label: "Close" },
                { value: "Reject", label: "Reject" }
              ]}
            />
            <Select
              label="Assgin By"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              options={users.map(u => ({ value: u.name, label: u.name }))}
            />
            <Input
              label="Note"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Enter Note"
            />
          </div>

          {/* Row 3: Convert to Order and Reminder */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <label className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer mt-5">
              <input
                type="checkbox"
                checked={orderStatus}
                onChange={(e) => setOrderStatus(e.target.checked)}
                className="w-4 h-4 text-indigo-650 rounded border-zinc-300"
              />
              Convert to Order
            </label>
            <Input
              label="Reminder"
              type="date"
              value={reminder}
              onChange={(e) => setReminder(e.target.value)}
            />
          </div>

          {/* Dynamic Select Products Section inline matching screenshot */}
          <div className="border-t border-zinc-150 dark:border-zinc-800 pt-4 space-y-3 text-left">
            <h4 className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
              Select Products
            </h4>
            <div className="flex gap-2.5 items-end">
              <div className="flex-1">
                <Select
                  value={currentSelectedProduct}
                  onChange={(e) => setCurrentSelectedProduct(e.target.value)}
                  options={products.map(p => ({ value: p.name, label: `${p.name} (₹${p.amount})` }))}
                />
              </div>
              <Button
                type="button"
                variant="success"
                onClick={handleAddProduct}
              >
                Add Product
              </Button>
            </div>
          </div>

          {/* Selected Products Table Grid */}
          <div className="space-y-3 text-left">
            <h4 className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
              Selected Products
            </h4>
            <div className="border border-zinc-200 dark:border-zinc-850 rounded overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 font-semibold text-zinc-500 uppercase">
                    <th className="p-3">Product Name</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Quantity</th>
                    <th className="p-3">Subtotal</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-150 dark:divide-zinc-800">
                  {modalSelectedProducts.length > 0 ? (
                    modalSelectedProducts.map((row) => (
                      <tr key={row.id}>
                        <td className="p-3 font-medium text-zinc-800 dark:text-zinc-200">{row.name}</td>
                        <td className="p-3 font-medium text-zinc-700 dark:text-zinc-300">₹{row.amount}</td>
                        <td className="p-3 w-24">
                          <input
                            type="number"
                            min="1"
                            value={row.quantity}
                            onChange={(e) => handleQtyChange(row.id, Number(e.target.value))}
                            className="w-16 px-2 py-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded focus:ring-1 focus:ring-indigo-500 outline-none text-center"
                          />
                        </td>
                        <td className="p-3 font-black text-zinc-800 dark:text-zinc-200">₹{row.amount * row.quantity}</td>
                        <td className="p-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveProduct(row.id)}
                            className="p-1 hover:bg-red-50 text-red-500 hover:text-red-600 rounded transition-colors"
                          >
                            <Delete className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-zinc-400 font-medium">
                        No products selected
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal Footer sum and Save button */}
          <div className="flex items-center justify-between border-t border-zinc-150 dark:border-zinc-800 pt-4 mt-2">
            <span className="text-sm font-black text-zinc-700 dark:text-zinc-300">
              Total Amount: ₹{totalAmount}
            </span>
            <Button
              type="submit"
              variant="primary"
              isLoading={isAddingLead}
            >
              Save
            </Button>
          </div>

        </form>
      </Modal>

      {/* Edit Lead Modal */}
      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Lead Details" isLoading={isUpdatingLead}>
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <Input label="Customer Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Assign Staff"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              options={users.map(u => ({ value: u.name, label: u.name }))}
            />
            <Select
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={statuses.map(s => ({ value: s.name, label: s.name }))}
            />
          </div>
          <Input label="Reason Call" value={statusTwo} onChange={(e) => setStatusTwo(e.target.value)} />
          <Input label="Note" value={noteText} onChange={(e) => setNoteText(e.target.value)} />
          <Input label="Reminder" type="date" value={reminder} onChange={(e) => setReminder(e.target.value)} />
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isUpdatingLead}
          >
            Save Changes
          </Button>
        </form>
      </Modal>

      {/* Convert to Order Modal */}
      <Modal isOpen={convertModalOpen} onClose={() => setConvertModalOpen(false)} title="Convert Lead to Order" isLoading={isConvertingLead}>
        <form onSubmit={handleConvertSubmit} className="space-y-4">
          <p className="text-xs text-zinc-500 font-medium">
            You are converting <span className="font-bold text-zinc-700 dark:text-zinc-300">{activeLead?.name || "Customer"}</span>'s lead into a final dispatched order.
          </p>
          <Select
            label="Payment Type"
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value as any)}
            options={[
              { value: "COD", label: "Cash on Delivery (COD)" },
              { value: "Prepaid", label: "Prepaid Online" }
            ]}
          />
          <Select
            label="Courier Partner"
            value={selectedCourier}
            onChange={(e) => setSelectedCourier(e.target.value)}
            options={couriers.map(c => ({ value: c.name, label: c.name }))}
          />
          <Input
            label="Transaction / Tracking ID"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            required
            placeholder="e.g. TXN90283019"
          />
          <Button
            type="submit"
            variant="success"
            fullWidth
            isLoading={isConvertingLead}
          >
            Approve & Dispatch Order
          </Button>
        </form>
      </Modal>
    </div>
  );
}
