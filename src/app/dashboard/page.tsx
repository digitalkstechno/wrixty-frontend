"use client";

import React from "react";
import { useMockDb } from "../../context/MockDbContext";
import { Table, Column } from "../../components/common/Table";
import {
  TrendingUp,
  PeopleAlt,
  ShoppingBag,
  AssignmentReturn,
  MonetizationOn
} from "@mui/icons-material";

export default function DashboardPage() {
  const { products, leads, orders, returnOrders, users } = useMockDb();

  // 1. Calculations
  const totalLeads = leads.filter(l => !l.isDeleted).length;
  const totalOrders = orders.length;
  const totalReturns = returnOrders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.grandTotal, 0);

  // Return rate percentage
  const returnRate = totalOrders > 0 ? ((totalReturns / totalOrders) * 100).toFixed(1) : "0.0";

  // Metrics list
  const metrics = [
    { name: "Total Leads", value: totalLeads, icon: <PeopleAlt className="w-5 h-5 text-indigo-500" />, desc: "Active inquiries in CRM" },
    { name: "Total Orders", value: totalOrders, icon: <ShoppingBag className="w-5 h-5 text-teal-500" />, desc: "Successfully converted orders" },
    { name: "Total Returns", value: totalReturns, icon: <AssignmentReturn className="w-5 h-5 text-red-500" />, desc: "Returned/Rejected orders" },
    { name: "Total Revenue", value: `₹${totalRevenue.toLocaleString("en-IN")}`, icon: <MonetizationOn className="w-5 h-5 text-amber-500" />, desc: "Delivered sales value" }
  ];

  // Best Selling Products data
  const bestSellers = React.useMemo(() => {
    const counts: Record<string, { count: number; amt: number }> = {};
    orders.forEach(o => {
      if (!counts[o.product]) {
        counts[o.product] = { count: 0, amt: 0 };
      }
      counts[o.product].count += o.quantity;
      counts[o.product].amt += o.grandTotal;
    });

    return Object.entries(counts).map(([name, stat]) => ({
      name,
      count: stat.count,
      amount: `₹${stat.amt.toLocaleString("en-IN")}`
    }));
  }, [orders]);

  // Columns for Best Selling Table
  const productColumns: Column<typeof bestSellers[0]>[] = [
    { key: "name", header: "Product Name" },
    { key: "count", header: "Selling Count" },
    { key: "amount", header: "Amount" }
  ];

  // Staff order statistics
  const staffStats = React.useMemo(() => {
    const stats: Record<string, { total: number; returned: number; delivered: number; qty: number; retQty: number; subtotal: number }> = {};
    
    // Initialize staff list
    users.forEach(u => {
      stats[u.name] = { total: 0, returned: 0, delivered: 0, qty: 0, retQty: 0, subtotal: 0 };
    });

    orders.forEach(o => {
      const staffName = o.assginTo || "Super Admin";
      if (!stats[staffName]) {
        stats[staffName] = { total: 0, returned: 0, delivered: 0, qty: 0, retQty: 0, subtotal: 0 };
      }
      stats[staffName].total += 1;
      stats[staffName].qty += o.quantity;
      stats[staffName].subtotal += o.grandTotal;
      if (o.status === "Delivered") {
        stats[staffName].delivered += 1;
      }
    });

    returnOrders.forEach(r => {
      const staffName = r.assginTo || "Super Admin";
      if (!stats[staffName]) {
        stats[staffName] = { total: 0, returned: 0, delivered: 0, qty: 0, retQty: 0, subtotal: 0 };
      }
      stats[staffName].returned += 1;
      stats[staffName].retQty += r.quantity;
    });

    return Object.entries(stats).map(([name, s]) => ({
      name,
      total: s.total,
      returned: s.returned,
      delivered: s.delivered,
      qty: s.qty,
      retQty: s.retQty,
      subtotal: `₹${s.subtotal.toLocaleString("en-IN")}`
    }));
  }, [users, orders, returnOrders]);

  // Columns for Staff Table
  const staffColumns: Column<typeof staffStats[0]>[] = [
    { key: "name", header: "Staff Name" },
    { key: "total", header: "Staff Total Order" },
    { key: "returned", header: "Staff Return Order" },
    { key: "delivered", header: "Staff Order" },
    { key: "qty", header: "Order Quantity" },
    { key: "retQty", header: "Order Return Quantity" },
    { key: "subtotal", header: "Subtotal" }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-black uppercase tracking-wider text-zinc-900 dark:text-zinc-50">
            Ayurvedic Dashboard
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">
            Real-time analytics and staff metrics overview
          </p>
        </div>
        <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1.5 rounded-md">
          <TrendingUp className="w-4 h-4 text-indigo-500" />
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            Return Rate: {returnRate}%
          </span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, i) => (
          <div
            key={i}
            className="p-5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-md shadow-sm flex items-center justify-between transition-all hover:border-zinc-300 dark:hover:border-zinc-800"
          >
            <div className="space-y-1.5 text-left">
              <span className="text-xs text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
                {metric.name}
              </span>
              <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
                {metric.value}
              </h3>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-600 font-medium">
                {metric.desc}
              </p>
            </div>
            <div className="p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-md">
              {metric.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Staff Stats */}
        <div className="lg:col-span-2 space-y-4">
          <h4 className="text-xs font-black uppercase tracking-wider text-zinc-500">
            👥 Staff Performance Matrix
          </h4>
          <Table data={staffStats} columns={staffColumns} searchable={false} />
        </div>

        {/* Right Side: Best Selling Products */}
        <div className="space-y-4">
          <h4 className="text-xs font-black uppercase tracking-wider text-zinc-500">
            📦 Best Selling Products
          </h4>
          <Table data={bestSellers} columns={productColumns} searchable={false} />
        </div>
      </div>
    </div>
  );
}
