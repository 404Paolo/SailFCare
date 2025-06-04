import React from 'react';

interface InfoAlertModalProps {
  message: string;
  onClose: () => void;
}

const InfoAlertModal: React.FC<InfoAlertModalProps> = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold text-center mb-4">Notification</h2>
        <p className="text-center text-gray-700 mb-6">{message}</p>

        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="bg-red-500 text-white rounded-lg px-4 py-2 hover:bg-red-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoAlertModal;
