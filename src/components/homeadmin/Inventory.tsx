// src/components/Inventory.tsx
import React, { useState, useEffect, useMemo } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/firebase"; // adjust path as needed

import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Logs, PenBox, Trash } from "lucide-react";

import AddProductModal from "../modal/addProductModal";
import EditProductModal from "../modal/EditProductModal";
import ConfirmationAlertModal from "../modal/ConfirmationAlertModal";

interface Product {
  id: string;              // Firestore doc ID
  name: string;
  manufacturer: string;
  supply_type: string;
  unit: string;
  quantity: number;
  status: string;
  expiration_date: string; // e.g. "2027-10-04 at 12:00:00 AM UTC+8"
  cost_per_unit: string;
  reorder_level: number;
}

const Inventory: React.FC = () => {
  // ─── Firestore State ─────────────────────────────────────────────────────
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // ─── Filter Inputs ────────────────────────────────────────────────────────
  const [filterName, setFilterName] = useState("");
  const [filterManufacturer, setFilterManufacturer] = useState("");
  const [filterSupplyType, setFilterSupplyType] = useState<"" | "Medical Supply" | "Medication">(
    ""
  );

  // ─── “Cards” Computed Values ───────────────────────────────────────────────
  const totalSupplies = useMemo(() => {
    // Sum of quantity across all products
    return allProducts.reduce((sum, p) => sum + p.quantity, 0);
  }, [allProducts]);

  const lowStockCount = useMemo(() => {
    // Count of products whose quantity ≤ reorder_level
    return allProducts.filter((p) => p.quantity <= p.reorder_level && p.quantity > 0).length;
  }, [allProducts]);

  const outOfStockCount = useMemo(() => {
    // Count of products with quantity === 0
    return allProducts.filter((p) => p.quantity === 0).length;
  }, [allProducts]);

  // ─── Selected Product (for Edit/Delete) ───────────────────────────────────
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // ─── Modal State ──────────────────────────────────────────────────────────
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // ─── Effect: Fetch All Products on Mount & after any change ────────────────
  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const productsRef = collection(db, "products");
      const snapshot = await getDocs(productsRef);
      const fetched: Product[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          name: data.name,
          manufacturer: data.manufacturer,
          supply_type: data.supply_type,
          unit: data.unit,
          quantity: data.quantity,
          status: data.status,
          expiration_date: data.expiration_date,
          cost_per_unit: data.cost_per_unit,
          reorder_level: data.reorder_level,
        };
      });
      setAllProducts(fetched);
    } catch (err) {
      console.error(err);
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Computed: apply client‐side filtering based on inputs ────────────────
  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) => {
      const matchName =
        filterName.trim() === "" ||
        p.name.toLowerCase().includes(filterName.trim().toLowerCase());
      const matchManu =
        filterManufacturer.trim() === "" ||
        p.manufacturer.toLowerCase().includes(filterManufacturer.trim().toLowerCase());
      const matchType =
        filterSupplyType === "" || p.supply_type === filterSupplyType;
      return matchName && matchManu && matchType;
    });
  }, [allProducts, filterName, filterManufacturer, filterSupplyType]);

  // ─── Handler: Add New Product ──────────────────────────────────────────────
  const handleAddProduct = async (newProd: Omit<Product, "id">) => {
    try {
      const productsRef = collection(db, "products");
      await addDoc(productsRef, newProd);
      setIsAddModalOpen(false);
      fetchAllProducts();
    } catch (err) {
      console.error(err);
      alert("Failed to add product.");
    }
  };

  // ─── Handler: Save Edited Product ─────────────────────────────────────────
  const handleSaveEditedProduct = async (updatedProd: Product) => {
    try {
      const prodDocRef = doc(db, "products", updatedProd.id);
      await updateDoc(prodDocRef, {
        name: updatedProd.name,
        manufacturer: updatedProd.manufacturer,
        supply_type: updatedProd.supply_type,
        unit: updatedProd.unit,
        quantity: updatedProd.quantity,
        status: updatedProd.status,
        expiration_date: updatedProd.expiration_date,
        cost_per_unit: updatedProd.cost_per_unit,
        reorder_level: updatedProd.reorder_level,
      });
      setIsEditModalOpen(false);
      setSelectedProduct(null);
      fetchAllProducts();
    } catch (err) {
      console.error(err);
      alert("Failed to update product.");
    }
  };

  // ─── Handler: Confirm Delete ───────────────────────────────────────────────
  const handleConfirmDelete = async () => {
    if (!selectedProduct) return;
    try {
      await deleteDoc(doc(db, "products", selectedProduct.id));
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
      fetchAllProducts();
    } catch (err) {
      console.error(err);
      alert("Failed to delete product.");
    }
  };

  return (
    <div className="space-y-10">
      {/* ─── Top Cards ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <Card>
          <CardContent className="px-12 py-8">
            <h4 className="text-md font-semibold">Total Supplies in Inventory</h4>
            <p className="text-5xl font-semibold m-8">
              {totalSupplies.toLocaleString()}
            </p>
            <p className="text-md text-gray-500">
              Sum of all item quantities currently in stock
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="px-12 py-8">
            <h4 className="text-md font-semibold">Low Stock Supplies</h4>
            <p className="text-5xl font-semibold m-8">
              {lowStockCount}
            </p>
            <p className="text-md text-gray-500">
              Items at or below reorder level (but not zero)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="px-12 py-8">
            <h4 className="text-md font-semibold">Out Of Stock Supplies</h4>
            <p className="text-5xl font-semibold m-8">
              {outOfStockCount}
            </p>
            <p className="text-md text-gray-500">
              Items with zero quantity remaining
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ─── Search / Filter Bar ──────────────────────────────────────────────── */}
      <div className="px-12 py-8 overflow-auto bg-white shadow-[0_0_32px_4px_rgba(0,0,0,0.1)] rounded-2xl">
        <h4 className="text-md font-semibold mb-6">Search Product</h4>
        <div className="grid grid-cols-4 gap-4 mb-2">
          <input
            type="text"
            placeholder="Product Name"
            className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-300"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Manufacturer"
            className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-300"
            value={filterManufacturer}
            onChange={(e) => setFilterManufacturer(e.target.value)}
          />
          <Select
            value={filterSupplyType}
            onValueChange={(val: "Medical Supply" | "Medication" | "") =>
              setFilterSupplyType(val)
            }
          >
            <SelectTrigger className="w-full h-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-300 text-gray-500">
              <SelectValue placeholder="Supply Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">All Types</SelectItem>
              <SelectItem value="Medical Supply">Medical Supply</SelectItem>
              <SelectItem value="Medication">Medication</SelectItem>
            </SelectContent>
          </Select>
          <div className="w-full flex justify-start">
            <button
              onClick={() => {/* no‐op; we filter reactively */}}
              className="w-[50%] bg-red-500 text-white font-medium py-3 rounded-xl hover:bg-red-600 transition flex items-center justify-center"
            >
              <Search className="w-5 h-5 mr-2" /> Search
            </button>
          </div>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {/* ─── Products Table + Actions ────────────────────────────────────────── */}
      <div className="overflow-auto bg-white shadow-[0_0_32px_4px_rgba(0,0,0,0.1)] rounded-2xl">
        <div className="bg-red-500 text-white w-full rounded-t-md px-4 py-2 flex justify-between items-center">
          <div className="w-[33%]">
            {/* Empty left slot, could put icons/filters */}
          </div>

          <div className="w-[33%] text-center font-bold">Supply Tracking</div>

          <div className="w-[33%] flex justify-end items-center space-x-2">
            <Logs className="h-5 w-5" />
            <Select
              onValueChange={(action: string) => {
                if (action === "Add Product") {
                  setIsAddModalOpen(true);
                } else if (action === "Edit Product") {
                  if (!selectedProduct) {
                    alert("Click the pencil icon on a row to edit first.");
                    return;
                  }
                  setIsEditModalOpen(true);
                } else if (action === "Delete Product") {
                  if (!selectedProduct) {
                    alert("Click the trash icon on a row to delete first.");
                    return;
                  }
                  setIsDeleteModalOpen(true);
                }
              }}
            >
              <SelectTrigger className="w-[140px] text-md">
                <SelectValue placeholder="Actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Add Product">Add Product</SelectItem>
                {/* <SelectItem value="Edit Product">Edit Product</SelectItem>
                <SelectItem value="Delete Product">Delete Product</SelectItem> */}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-hidden rounded-b-md border border-gray-200">
          <div className="max-h-[700px] overflow-y-auto custom-scroll">
            <table className="w-full text-sm table-fixed">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="p-3 text-center w-[5%]"></th>
                  <th className="p-3 text-center w-[15%]">Product Name</th>
                  <th className="p-3 text-center w-[15%]">Manufacturer</th>
                  <th className="p-3 text-center w-[15%]">Supply Type</th>
                  <th className="p-3 text-center w-[10%]">Unit</th>
                  <th className="p-3 text-center w-[10%]">Quantity</th>
                  <th className="p-3 text-center w-[10%]">Status</th>
                  <th className="p-3 text-center w-[15%]">Expiration Date</th>
                  <th className="p-3 text-center w-[5%]"></th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={9} className="text-center py-4">
                      Loading…
                    </td>
                  </tr>
                )}
                {!loading && filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={9} className="text-center py-4 text-gray-500">
                      No products found.
                    </td>
                  </tr>
                )}
                {!loading &&
                  filteredProducts.map((prod) => (
                    <tr key={prod.id} className="hover:bg-gray-50">
                      <td className="px-2">
                        <div className="flex justify-center space-x-2">
                          <PenBox
                            className="w-4 h-4 text-gray-600 hover:text-blue-800 cursor-pointer"
                            onClick={() => {
                              setSelectedProduct(prod);
                              setIsEditModalOpen(true);
                            }}
                          />
                          <Trash
                            className="w-4 h-4 text-gray-600 hover:text-red-800 cursor-pointer"
                            onClick={() => {
                              setSelectedProduct(prod);
                              setIsDeleteModalOpen(true);
                            }}
                          />
                        </div>
                      </td>
                      <td className="p-3 text-center">{prod.name}</td>
                      <td className="p-3 text-center">{prod.manufacturer}</td>
                      <td className="p-3 text-center">{prod.supply_type}</td>
                      <td className="p-3 text-center">{prod.unit}</td>
                      <td className="p-3 text-center">{prod.quantity}</td>
                      <td className="p-3 text-center">{prod.status}</td>
                      <td className="p-3 text-center">{prod.expiration_date}</td>
                      <td className="p-3 text-center"></td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ─── Modals ──────────────────────────────────────────────────────────── */}
      {isAddModalOpen && (
        <AddProductModal
          onClose={() => setIsAddModalOpen(false)}
          onSave={(newProd) => handleAddProduct(newProd)}
        />
      )}
      {isEditModalOpen && selectedProduct && (
        <EditProductModal
          product={selectedProduct}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedProduct(null);
          }}
          onSave={(updatedProd) => handleSaveEditedProduct(updatedProd)}
        />
      )}
      {isDeleteModalOpen && selectedProduct && (
        <ConfirmationAlertModal
          header="Delete Product"
          message={`Are you sure you want to delete "${selectedProduct.name}"? This action cannot be undone.`}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedProduct(null);
          }}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default Inventory;