"use client";

import React from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { FiTrash2 } from "react-icons/fi";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  itemName?: string;
  itemType?: string;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Deletion",
  itemName = "this item",
  itemType = "item",
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} sizeClass="max-w-md">
      <div className="space-y-6 text-center py-2">
        <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <FiTrash2 className="w-8 h-8 text-rose-600" />
        </div>
        <div className="space-y-2">
          <h4 className="text-base font-bold text-text-primary uppercase tracking-wide">
            Delete {itemName ? `"${itemName}"` : `this ${itemType}`}?
          </h4>
          <p className="text-xs text-text-secondary">
            Are you absolutely sure you want to delete this {itemType}? This action is permanent and cannot be undone.
          </p>
        </div>
        <div className="flex items-center gap-3 justify-center pt-2">
          <Button
            onClick={onClose}
            variant="secondary"
            className="px-6 rounded-lg"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              onConfirm();
            }}
            variant="primary"
            className="bg-rose-600 hover:bg-rose-500 text-white px-6 rounded-lg font-bold shadow-md hover:shadow-lg transition-all"
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};
