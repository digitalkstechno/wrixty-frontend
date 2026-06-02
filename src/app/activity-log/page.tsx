"use client";

import React, { useState, useEffect } from "react";
import { fetchUsers } from "../../services/userService";
import { fetchActivityLogs, ActivityLog } from "../../services/activityLogService";
import { Table, Column } from "../../components/common/Table";
import { Select } from "../../components/common/Select";
import { Button } from "../../components/common/Button";

export default function ActivityLogPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [filterUser, setFilterUser] = useState("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("wrixty_authenticated_user");
    if (userStr) {
      try {
        setCurrentUser(JSON.parse(userStr));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const isAdmin = currentUser && (
    currentUser.roles?.some((r: string) => r.toLowerCase() === 'admin' || r.toLowerCase() === 'superadmin') ||
    currentUser.email?.toLowerCase() === 'superadmin@gmail.com'
  );

  // Load users (only needed for Admin to filter)
  useEffect(() => {
    if (isAdmin) {
      const loadUsers = async () => {
        try {
          const res = await fetchUsers({ page: 1, limit: 100 });
          setUsers(res.data);
        } catch (err) {
          console.error(err);
        }
      };
      loadUsers();
    }
  }, [isAdmin]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const params: any = { page: 1, limit: 200 };
      if (filterUser !== "all") {
        params.userId = filterUser;
      }
      const res = await fetchActivityLogs(params);
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Load logs on mount, when filterUser changes, or when currentUser is loaded
  useEffect(() => {
    if (currentUser) {
      loadLogs();
    }
  }, [currentUser, filterUser]);

  const formattedLogs = React.useMemo(() => {
    return logs.map((log) => {
      const dateObj = new Date(log.createdAt);
      const formattedDate = isNaN(dateObj.getTime())
        ? "N/A"
        : dateObj.toLocaleDateString("en-IN") + " " + dateObj.toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit', hour12: true });

      const leadName = log.lead && typeof log.lead === 'object' && (log.lead as any).customer
        ? (log.lead as any).customer.name
        : "N/A";

      return {
        id: log._id,
        date: formattedDate,
        user: log.user?.name || "System",
        lead: leadName,
        message: log.message
      };
    });
  }, [logs]);

  const columns: Column<typeof formattedLogs[0]>[] = [
    { key: "date", header: "Date" },
    { key: "user", header: "User" },
    { key: "lead", header: "Lead" },
    { key: "message", header: "Message" }
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-[#1f2f3e]">
          Activity Log
        </h2>
        <p className="text-sm text-text-secondary font-medium tracking-wide">
          Track all lead and order activities across the system
        </p>
      </div>
    
      <div className="bg-white p-6 border border-border-ui rounded-lg shadow-sm space-y-6">
        
        <div className="flex flex-wrap items-center justify-end gap-3 border-b border-border-ui pb-4">
          <div className="w-full sm:w-auto min-w-[160px]">
            <Select
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
              options={[
                { value: "all", label: "Select Assign" },
                ...users.map(u => ({ value: u.name, label: u.name })),
                { value: "Dhruvi Dhameliya", label: "Dhruvi Dhameliya" },
                { value: "Dhara patel", label: "Dhara patel" },
                { value: "Dipali", label: "Dipali" }
              ]}
            />
          </div>
          
          <Button variant="primary" onClick={loadLogs}>
            Apply Filter
          </Button>
          <Button variant="outline" onClick={() => setFilterUser("all")}>
            Clear Filter
          </Button>
          
          <div className="flex items-center gap-3 ml-2">
            <span className="text-sm font-semibold text-text-secondary bg-background px-4 py-2 rounded-lg border border-border-ui ">
              📅 May 30, 2026 - May 30, 2526
            </span>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-6 text-zinc-500">Loading activity logs...</div>
        ) : (
          <Table data={formattedLogs} columns={columns} selectable={false} />
        )}
      </div>
    </div>
  );
}
