// src/components/modal/AddProductModal.tsx
import React, { useState } from "react";
import { Upload } from "lucide-react";

interface AddProductModalProps {
  onClose: () => void;
  onSave: (newProd: {
    name: string;
    manufacturer: string;
    supply_type: string;
    unit: string;
    quantity: number;
    status: string;
    expiration_date: string;
    cost_per_unit: string;
    reorder_level: number;
  }) => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ onClose, onSave }) => {
  const [name, setName] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [supplyType, setSupplyType] = useState<"Medical Supply" | "Medication" | "">("");
  const [unit, setUnit] = useState("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [status, setStatus] = useState<"In Stock" | "Out of Stock" | "">("");
  const [expirationDate, setExpirationDate] = useState(""); // e.g. "2027-10-04"
  const [expirationTime, setExpirationTime] = useState("00:00"); // e.g. "00:00"
  const [costPerUnit, setCostPerUnit] = useState("");
  const [reorderLevel, setReorderLevel] = useState<number | "">("");

  const handleSubmit = () => {
    // Basic validation
    if (
      !name ||
      !manufacturer ||
      !supplyType ||
      !unit ||
      quantity === "" ||
      status === "" ||
      !expirationDate ||
      !costPerUnit ||
      reorderLevel === ""
    ) {
      alert("Please fill out all required fields.");
      return;
    }

    // Compose expiration_date string in the same format: "YYYY-MM-DD at hh:mm:ss AM/PM UTC+8"
    const [hours24, minutes24] = expirationTime.split(":").map((v) => parseInt(v, 10));
    const period = hours24 >= 12 ? "PM" : "AM";
    const twelveHour = hours24 % 12 === 0 ? 12 : hours24 % 12;
    const hhmmss = `${twelveHour.toString().padStart(2, "0")}:` +
                   `${minutes24.toString().padStart(2, "0")}:00 ${period}`;
    const composedExpDate = `${expirationDate} at ${hhmmss} UTC+8`;

    onSave({
      name: name.trim(),
      manufacturer: manufacturer.trim(),
      supply_type: supplyType,
      unit: unit.trim(),
      quantity: Number(quantity),
      status,
      expiration_date: composedExpDate,
      cost_per_unit: costPerUnit.trim(),
      reorder_level: Number(reorderLevel),
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 text-gray-700">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg">
        <h2 className="text-xl font-semibold text-center mb-4">Add New Product</h2>

        <div className="space-y-4">
          {/* Product Name  */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Product Name
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-xl px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Manufacturer  */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Manufacturer
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-xl px-3 py-2"
              value={manufacturer}
              onChange={(e) => setManufacturer(e.target.value)}
            />
          </div>

          {/* Supply Type & Unit */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Supply Type
              </label>
              <select
                className="w-full border border-gray-300 rounded-xl px-3 py-2"
                value={supplyType}
                onChange={(e) =>
                  setSupplyType(e.target.value as "Medical Supply" | "Medication" | "")
                }
              >
                <option value="">Select Supply Type</option>
                <option value="Medical Supply">Medical Supply</option>
                <option value="Medication">Medication</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Unit
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-xl px-3 py-2"
                placeholder="e.g. boxes"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              />
            </div>
          </div>

          {/* Quantity & Reorder Level */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Quantity
              </label>
              <input
                type="number"
                min="0"
                className="w-full border border-gray-300 rounded-xl px-3 py-2"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value === "" ? "" : Number(e.target.value))}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Reorder Level
              </label>
              <input
                type="number"
                min="0"
                className="w-full border border-gray-300 rounded-xl px-3 py-2"
                value={reorderLevel}
                onChange={(e) =>
                  setReorderLevel(e.target.value === "" ? "" : Number(e.target.value))
                }
              />
            </div>
          </div>

          {/* Status & Cost Per Unit */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Status
              </label>
              <select
                className="w-full border border-gray-300 rounded-xl px-3 py-2"
                value={status}
                onChange={(e) => setStatus(e.target.value as "In Stock" | "Out of Stock" | "")}
              >
                <option value="">Select Status</option>
                <option value="In Stock">In Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Cost per Unit
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-xl px-3 py-2"
                placeholder="e.g. 118.62"
                value={costPerUnit}
                onChange={(e) => setCostPerUnit(e.target.value)}
              />
            </div>
          </div>

          {/* Expiration Date & Time */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Expiration Date
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-xl px-3 py-2"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Expiration Time
              </label>
              <input
                type="time"
                className="w-full border border-gray-300 rounded-xl px-3 py-2"
                value={expirationTime}
                onChange={(e) => setExpirationTime(e.target.value)}
              />
            </div>
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
            onClick={handleSubmit}
            className="flex-1 ml-2 bg-red-500 text-white rounded-xl px-4 py-2 hover:bg-red-600"
          >
            Add Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
