import React from 'react';
import { Upload } from 'lucide-react';

interface AddHealthRecordModalProps {
  onClose: () => void;
  onSave: () => void;
}

const AddHealthRecordModal: React.FC<AddHealthRecordModalProps> = ({ onClose, onSave }) => {
  return (
    <div className="fixed inset-0 flex text-sm font-normal items-center justify-center bg-black bg-opacity-50 z-50 text-gray-500">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg">
        <h2 className="text-xl font-semibold text-center text-gray-700 mb-4">Add New Health Record</h2>
        
        <div className="flex flex-col gap-3">
          {/* First Row */}
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="date"
              className="flex-1 border border-gray-300 rounded-xl px-3 py-2"
              placeholder="Test Date"
            />
            <select className="flex-1 border border-gray-300 rounded-xl px-3">
              <option>Service Type</option>
            </select>
          </div>

          {/* Second Row */}
          <div className="flex flex-col sm:flex-row gap-3">
            <select className="flex-1 border border-gray-300 rounded-xl px-3 py-2">
              <option>Record Type</option>
            </select>
            <input
              type="text"
              placeholder="Result"
              className="flex-1 border border-gray-300 rounded-xl px-3"
            />
            <button className="flex items-center justify-center gap-2 border border-gray-300 rounded-xl px-3">
              <span>Upload Result</span>
              <Upload className="w-3 h-3 font-normal"/>
            </button>
          </div>

          {/* Third Row */}
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Clinician/Staff Name"
              className="flex-1 border border-gray-300 rounded-xl px-3 py-2"
            />
            <input
              type="text"
              placeholder="Encoder Name"
              className="flex-1 border border-gray-300 rounded-xl px-3 py-2"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={onClose}
            className="flex-1 mr-2 border border-red-500 text-red-500 rounded-xl px-4 py-2 hover:bg-red-50"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="flex-1 ml-2 bg-red-500 text-white rounded-xl px-4 py-2 hover:bg-red-600"
          >
            Add Record
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddHealthRecordModal;