import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type OrderStatus =
  | "new"
  | "accepted"
  | "at_shop"
  | "picked_up"
  | "delivering"
  | "delivered"
  | "cancelled"
  | "failed";

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  unit?: string;
  imageUrl?: string;
  status?: "available" | "unavailable" | "substituted";
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  shop: {
    id: string;
    name: string;
    address: string;
    phone: string;
    lat?: number;
    lng?: number;
    type?: string;
    distance?: string;
  };
  customer: {
    name: string;
    phone: string;
    address: string;
    landmark?: string;
    lat?: number;
    lng?: number;
  };
  items: OrderItem[];
  totalAmount: number;
  deliveryFee: number;
  platformFee?: number;
  distance: string;
  estimatedTime: string;
  paymentMode: "cod" | "prepaid";
  codAmount?: number;
  instructions?: string;
  priority?: "standard" | "express" | "scheduled";
  scheduledTime?: string;
  createdAt: string;
  deliveredAt?: string;
}

const DEMO_ORDERS: Order[] = [
  {
    id: "ord-001",
    orderNumber: "BRG-2024-001",
    status: "new",
    shop: {
      id: "shop-001",
      name: "Green Mart Superstore",
      address: "12, MG Road, Koramangala, Bengaluru",
      phone: "+919876543210",
      lat: 12.9350,
      lng: 77.6249,
      type: "Grocery",
      distance: "0.8 km",
    },
    customer: {
      name: "Priya Sharma",
      phone: "+919123456789",
      address: "Flat 304, Sunshine Apartments, 5th Block, Koramangala",
      landmark: "Near Coffee Day",
      lat: 12.9352,
      lng: 77.6180,
    },
    items: [
      { id: "i1", name: "Amul Full Cream Milk", quantity: 2, price: 66, unit: "500ml each" },
      { id: "i2", name: "Brown Bread", quantity: 1, price: 45, unit: "Britannia" },
      { id: "i3", name: "Tata Salt", quantity: 1, price: 28, unit: "1kg" },
      { id: "i4", name: "Parle-G Biscuits", quantity: 3, price: 10, unit: "100g each" },
    ],
    totalAmount: 235,
    deliveryFee: 55,
    distance: "1.4 km",
    estimatedTime: "18 min",
    paymentMode: "prepaid",
    instructions: "Please ring the bell twice. Leave at door if not home.",
    priority: "express",
    createdAt: new Date().toISOString(),
  },
  {
    id: "ord-002",
    orderNumber: "BRG-2024-002",
    status: "accepted",
    shop: {
      id: "shop-002",
      name: "FreshKart Vegetables",
      address: "89, Sarjapur Road, BTM Layout, Bengaluru",
      phone: "+919876543211",
      lat: 12.9165,
      lng: 77.6101,
      type: "Vegetables & Fruits",
      distance: "0.6 km",
    },
    customer: {
      name: "Rahul Verma",
      phone: "+919234567890",
      address: "House 14, 2nd Cross, BTM 2nd Stage, Bengaluru",
      lat: 12.9140,
      lng: 77.6100,
    },
    items: [
      { id: "i5", name: "Tomatoes", quantity: 1, price: 40, unit: "500g" },
      { id: "i6", name: "Onions", quantity: 1, price: 35, unit: "1kg" },
      { id: "i7", name: "Potatoes", quantity: 2, price: 30, unit: "500g each" },
    ],
    totalAmount: 135,
    deliveryFee: 40,
    distance: "2.1 km",
    estimatedTime: "22 min",
    paymentMode: "cod",
    codAmount: 135,
    priority: "standard",
    createdAt: new Date(Date.now() - 300000).toISOString(),
  },
  {
    id: "ord-003",
    orderNumber: "BRG-2024-003",
    status: "delivered",
    shop: {
      id: "shop-003",
      name: "Quick Bites Restaurant",
      address: "45, Indiranagar 100ft Road, Bengaluru",
      phone: "+919876543212",
      lat: 12.9784,
      lng: 77.6408,
      type: "Restaurant",
      distance: "1.2 km",
    },
    customer: {
      name: "Ananya Patel",
      phone: "+919345678901",
      address: "402, Embassy Springs, Domlur, Bengaluru",
      landmark: "Opposite HDFC Bank",
    },
    items: [
      { id: "i8", name: "Veg Biryani", quantity: 2, price: 180, unit: "Full plate" },
      { id: "i9", name: "Raita", quantity: 1, price: 40 },
    ],
    totalAmount: 400,
    deliveryFee: 65,
    distance: "3.2 km",
    estimatedTime: "32 min",
    paymentMode: "prepaid",
    priority: "express",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    deliveredAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "ord-004",
    orderNumber: "BRG-2024-004",
    status: "delivered",
    shop: {
      id: "shop-001",
      name: "Green Mart Superstore",
      address: "12, MG Road, Koramangala, Bengaluru",
      phone: "+919876543210",
      type: "Grocery",
      distance: "1.5 km",
    },
    customer: {
      name: "Vikram Singh",
      phone: "+919456789012",
      address: "Villa 7, Palm Meadows, Whitefield, Bengaluru",
    },
    items: [
      { id: "i10", name: "Surf Excel Detergent", quantity: 1, price: 250, unit: "3kg" },
      { id: "i11", name: "Colgate Toothpaste", quantity: 2, price: 85, unit: "150g each" },
    ],
    totalAmount: 420,
    deliveryFee: 50,
    distance: "1.9 km",
    estimatedTime: "25 min",
    paymentMode: "prepaid",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    deliveredAt: new Date(Date.now() - 82800000).toISOString(),
  },
  {
    id: "ord-005",
    orderNumber: "BRG-2024-005",
    status: "cancelled",
    shop: {
      id: "shop-004",
      name: "MedPlus Pharmacy",
      address: "22, 80ft Road, Indiranagar, Bengaluru",
      phone: "+919876543213",
      type: "Pharmacy",
      distance: "2.0 km",
    },
    customer: {
      name: "Deepika Rao",
      phone: "+919567890123",
      address: "B-204, Godrej Garden City, Judicial Layout, Bengaluru",
    },
    items: [
      { id: "i12", name: "Dolo 650", quantity: 2, price: 33, unit: "Strip of 15" },
    ],
    totalAmount: 66,
    deliveryFee: 30,
    distance: "2.8 km",
    estimatedTime: "28 min",
    paymentMode: "prepaid",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

interface OrderState {
  orders: Order[];
  activeOrderId: string | null;

  addOrder: (order: Order) => void;
  acceptOrder: (id: string) => void;
  rejectOrder: (id: string) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  updateOrderItem: (orderId: string, itemId: string, status: OrderItem["status"]) => void;
  setActiveOrder: (id: string | null) => void;
  getOrder: (id: string) => Order | undefined;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: DEMO_ORDERS,
      activeOrderId: null,

      addOrder: (order) =>
        set((s) => ({ orders: [order, ...s.orders] })),

      acceptOrder: (id) =>
        set((s) => ({
          orders: s.orders.map((o) =>
            o.id === id ? { ...o, status: "accepted" } : o
          ),
          activeOrderId: id,
        })),

      rejectOrder: (id) =>
        set((s) => ({
          orders: s.orders.map((o) =>
            o.id === id ? { ...o, status: "cancelled" } : o
          ),
          activeOrderId: s.activeOrderId === id ? null : s.activeOrderId,
        })),

      updateOrderStatus: (id, status) =>
        set((s) => ({
          orders: s.orders.map((o) =>
            o.id === id
              ? { ...o, status, ...(status === "delivered" ? { deliveredAt: new Date().toISOString() } : {}) }
              : o
          ),
          activeOrderId:
            status === "delivered" || status === "cancelled" || status === "failed"
              ? null
              : s.activeOrderId,
        })),

      updateOrderItem: (orderId, itemId, status) =>
        set((s) => ({
          orders: s.orders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  items: o.items.map((item) =>
                    item.id === itemId ? { ...item, status } : item
                  ),
                }
              : o
          ),
        })),

      setActiveOrder: (id) => set({ activeOrderId: id }),
      getOrder: (id) => get().orders.find((o) => o.id === id),
    }),
    {
      name: "bringo-orders",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
