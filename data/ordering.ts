export const orderTrackingData = {
  user: {
    name: "Ali Amin",
  },

  activeOrder: {
    id: 1248,
    status: "Washing",
    badgeColor: "orange",
    quantity: 2,
    bagPrice: 45,
    tip: 5,
    estimatedDelivery: "Today, 6:00 PM",
    progressSteps: [
      { key: "requested", title: "Requested", time: "10:30 AM", status: "done" },
      { key: "assigned", title: "Driver Assigned", time: "10:35 AM", status: "done" },
      { key: "picked", title: "Picked Up", time: "11:15 AM", status: "done" },
      { key: "washing", title: "Washing", subtitle: "Currently in progress", status: "active" },
      { key: "delivery", title: "Out for Delivery", status: "pending", icon: "truck" },
      { key: "delivered", title: "Delivered", status: "pending", icon: "home" },
    ],
  },

  driver: {
    name: "Michael Johnson",
    rating: 4.9,
    trips: 234,
    avatar: "https://i.pravatar.cc/150?img=12",
  },

  orderDetails: {
    service: "Washing & Drying",
    address: {
      street: "123 Main Street, Apt 4B",
      city: "San Francisco, CA 94102",
    },
    instructions: "Light wash–Gentle wash for delicate clothes",
  },

  pastOrders: [
    {
      id: 1247,
      quantity: 1,
      price: 45,
      rating: 5.0,
      status: "Delivered",
      date: "Jan 24, 2026",
    },
    {
      id: 1246,
      quantity: 2,
      price: 80,
      rating: 4.8,
      status: "Delivered",
      date: "Jan 18, 2026",
    },
    {
      id: 1245,
      quantity: 2,
      price: 90,
      rating: 5.0,
      status: "Delivered",
      date: "Today",
    },
  ],
};
