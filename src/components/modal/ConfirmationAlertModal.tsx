import React from 'react';

interface ConfirmationAlertModalProps {
  header: string;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmationAlertModal: React.FC<ConfirmationAlertModalProps> = ({
  header,
  message,
  onConfirm,
  onClose
}) => {
  return (
    <div className="fixed inset-0 flex items-center font-normal text-sm justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl text-gray-600 font-semibold text-center mb-4">{header}</h2>
        <p className="text-center text-gray-700 mb-6">{message}</p>

        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="flex-1 mr-2 border border-red-500 text-red-500 rounded-xl px-4 py-2 hover:bg-red-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 ml-2 bg-red-500 text-white rounded-xl px-4 py-2 hover:bg-red-600"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationAlertModal;