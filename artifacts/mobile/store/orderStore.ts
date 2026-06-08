import { create } from "zustand";

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
  available?: boolean;
  confirmedPrice?: number;
}

export interface Shop {
  id: string;
  name: string;
  address: string;
  phone: string;
  distance: string;
  rating: number;
  category: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  landmark?: string;
  lat?: number;
  lng?: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  shop: Shop;
  customer: Customer;
  items: OrderItem[];
  totalAmount: number;
  deliveryFee: number;
  distance: string;
  estimatedTime: string;
  pickupOtp?: string;
  deliveryOtp?: string;
  createdAt: string;
  acceptedAt?: string;
  pickedAt?: string;
  deliveredAt?: string;
  instructions?: string;
  paymentMode: "prepaid" | "cod";
  codAmount?: number;
}

const MOCK_ORDERS: Order[] = [
  {
    id: "1",
    orderNumber: "BRG-2024-001",
    status: "new",
    shop: {
      id: "s1",
      name: "Green Mart",
      address: "12 MG Road, Bangalore",
      phone: "+91 98765 43210",
      distance: "0.8 km",
      rating: 4.5,
      category: "Grocery",
    },
    customer: {
      id: "c1",
      name: "Priya Sharma",
      phone: "+91 87654 32109",
      address: "45 Indiranagar, 1st Cross, Bangalore",
      landmark: "Near HDFC Bank",
      lat: 12.9783,
      lng: 77.6408,
    },
    items: [
      { id: "i1", name: "Organic Tomatoes", quantity: 1, price: 80, unit: "500g" },
      { id: "i2", name: "Fresh Milk", quantity: 2, price: 60, unit: "500ml" },
      { id: "i3", name: "Whole Wheat Bread", quantity: 1, price: 45, unit: "pkt" },
    ],
    totalAmount: 245,
    deliveryFee: 35,
    distance: "2.3 km",
    estimatedTime: "25 min",
    pickupOtp: "4521",
    deliveryOtp: "7893",
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
    instructions: "Please call before coming",
    paymentMode: "prepaid",
  },
  {
    id: "2",
    orderNumber: "BRG-2024-002",
    status: "accepted",
    shop: {
      id: "s2",
      name: "MedPlus Pharmacy",
      address: "34 Koramangala, Bangalore",
      phone: "+91 97654 32100",
      distance: "1.2 km",
      rating: 4.8,
      category: "Pharmacy",
    },
    customer: {
      id: "c2",
      name: "Rahul Verma",
      phone: "+91 76543 21098",
      address: "78 Koramangala 5th Block, Bangalore",
      lat: 12.9352,
      lng: 77.6245,
    },
    items: [
      { id: "i4", name: "Paracetamol 500mg", quantity: 2, price: 28, unit: "strip" },
      { id: "i5", name: "Vitamin C Tablets", quantity: 1, price: 149, unit: "bottle" },
    ],
    totalAmount: 205,
    deliveryFee: 30,
    distance: "1.8 km",
    estimatedTime: "15 min",
    deliveryOtp: "3421",
    createdAt: new Date(Date.now() - 12 * 60000).toISOString(),
    paymentMode: "cod",
    codAmount: 235,
  },
  {
    id: "3",
    orderNumber: "BRG-2024-003",
    status: "delivered",
    shop: {
      id: "s3",
      name: "Bake Studio",
      address: "22 HSR Layout, Bangalore",
      phone: "+91 96543 21009",
      distance: "2.1 km",
      rating: 4.9,
      category: "Bakery",
    },
    customer: {
      id: "c3",
      name: "Anjali Singh",
      phone: "+91 65432 10987",
      address: "90 HSR Layout Sector 2, Bangalore",
      lat: 12.9116,
      lng: 77.6474,
    },
    items: [
      { id: "i6", name: "Chocolate Cake", quantity: 1, price: 550, unit: "pcs" },
      { id: "i7", name: "Croissant", quantity: 4, price: 60, unit: "pcs" },
    ],
    totalAmount: 790,
    deliveryFee: 50,
    distance: "3.5 km",
    estimatedTime: "30 min",
    deliveryOtp: "9012",
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    deliveredAt: new Date(Date.now() - 90 * 60000).toISOString(),
    paymentMode: "prepaid",
  },
];

interface OrderState {
  orders: Order[];
  activeOrderId: string | null;
  pendingOrderId: string | null;

  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  setActiveOrderId: (id: string | null) => void;
  setPendingOrderId: (id: string | null) => void;
  getOrder: (id: string) => Order | undefined;
  getOrdersByStatus: (status: OrderStatus) => Order[];
  acceptOrder: (id: string) => void;
  rejectOrder: (id: string) => void;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: MOCK_ORDERS,
  activeOrderId: "2",
  pendingOrderId: "1",

  setOrders: (orders) => set({ orders }),
  addOrder: (order) => set((s) => ({ orders: [order, ...s.orders] })),
  updateOrderStatus: (id, status) =>
    set((s) => ({
      orders: s.orders.map((o) =>
        o.id === id ? { ...o, status } : o
      ),
    })),
  setActiveOrderId: (id) => set({ activeOrderId: id }),
  setPendingOrderId: (id) => set({ pendingOrderId: id }),
  getOrder: (id) => get().orders.find((o) => o.id === id),
  getOrdersByStatus: (status) => get().orders.filter((o) => o.status === status),
  acceptOrder: (id) => {
    set((s) => ({
      orders: s.orders.map((o) =>
        o.id === id
          ? { ...o, status: "accepted", acceptedAt: new Date().toISOString() }
          : o
      ),
      activeOrderId: id,
      pendingOrderId: null,
    }));
  },
  rejectOrder: (id) => {
    set((s) => ({
      orders: s.orders.map((o) =>
        o.id === id ? { ...o, status: "cancelled" } : o
      ),
      pendingOrderId: null,
    }));
  },
}));
