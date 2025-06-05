// src/components/modal/ConfirmationAlertModal.tsx
import React from "react";

interface ConfirmationAlertModalProps {
  header: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmationAlertModal: React.FC<ConfirmationAlertModalProps> = ({
  header,
  message,
  onClose,
  onConfirm,
}) => {
  return (
    <div className="fixed inset-0 flex h-screen items-center justify-center bg-black bg-opacity-50 z-50 text-gray-700">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">{header}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="flex-1 mr-2 border border-gray-400 text-gray-600 rounded-xl px-4 py-2 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 ml-2 bg-red-500 text-white rounded-xl px-4 py-2 hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationAlertModal;