import { create } from "zustand";

export const useProductStore = create((set) => ({
  products: [],
  setProducts: (products) => set({ products }),

  createProduct: async (product) => {
    if (!product.name || !product.price || !product.image) {
      return { success: false, message: "Missing required fields" };
    }
    const response = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });
    const data = await response.json();
    // state is previous state
    set((state) => ({ products: [...state.products, data.data] }));
    return { success: true, message: "Product created successfully" };
  },

  getProducts: async () => {
    const response = await fetch("/api/products");
    const data = await response.json();
    console.log("data in zustand: ", data.data);
    set({ products: data.data });
  },

  deleteProduct: async (id) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (data.success) {
        set((state) => ({
          products: state.products.filter((p) => p._id !== id),
        }));
      }
      return data;
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  updateProduct: async (id, product) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });
      const data = await response.json();

      if (data.success) {
        set((state) => ({
          products: state.products.map((p) => (p._id === id ? data.data : p)),
        }));
      }
      return data;
    } catch (error) {
      return { success: false, message: error.message };
    }
  },
}));
