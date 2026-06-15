import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { Button } from "../common/Button";
import { Select } from "../common/Select";
import { useToast } from "../../context/ToastContext";
import { reassignLeadsApi } from "../../services/leadService";
import { User } from "../../services/userService";

interface ReassignLeadsModalProps {
  isOpen: boolean;
  onClose: () => void;
  fromUser: User | null;
  users: User[];
  onSuccess: () => void;
}

export const ReassignLeadsModal: React.FC<ReassignLeadsModalProps> = ({
  isOpen,
  onClose,
  fromUser,
  users,
  onSuccess
}) => {
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromUser) return;
    if (selectedUserIds.length === 0) {
      toast.warning("Please select at least one staff member to receive the leads.");
      return;
    }

    setIsLoading(true);
    try {
      const fromId = fromUser._id || fromUser.id || "";
      const res = await reassignLeadsApi({
        fromUserId: fromId,
        toUserIds: selectedUserIds
      });
      toast.success(res?.message || "Leads reassigned successfully!");
      onSuccess();
      onClose();
      setSelectedUserIds([]);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to reassign leads");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter out the fromUser and users without valid IDs
  const availableUsers = users.filter(u => {
    const id = u._id || u.id;
    const fromId = fromUser?._id || fromUser?.id;
    return id && id !== fromId;
  });

  const userOptions = availableUsers.map(u => ({
    value: u._id || u.id || "",
    label: u.name
  }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reassign Staff Leads" isLoading={isLoading} sizeClass="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-6 text-left">
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-sm text-orange-800">
          <p className="font-semibold mb-1">Transferring Leads From: <span className="text-orange-900">{fromUser?.name}</span></p>
          <p>All active (open) leads assigned to this staff member will be equally distributed among the staff members you select below.</p>
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
            Select Staff Members to Receive Leads *
          </label>
          <Select
            label=""
            value={selectedUserIds}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedUserIds(Array.isArray(val) ? val : [val]);
            }}
            options={userOptions}
            multiple={true}
            menuPortalTarget={true}
            placeholder="Select staff members..."
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={selectedUserIds.length === 0 || isLoading}>
            Reassign Leads
          </Button>
        </div>
      </form>
    </Modal>
  );
};
