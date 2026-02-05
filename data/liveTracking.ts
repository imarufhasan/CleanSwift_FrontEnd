export const liveTrackingData = {
  status: {
    label: "Live Tracking",
    etaMinutes: 12,
  },
   progressSteps: [
      { key: "requested", title: "Requested", time: "10:30 AM", status: "done" },
      { key: "assigned", title: "Driver Assigned", time: "10:35 AM", status: "done" },
      { key: "picked", title: "Picked Up", time: "11:15 AM", status: "done" },
      { key: "washing", title: "Washing", subtitle: "Currently in progress", status: "done" },
      { key: "delivery", title: "Out for Delivery", status: "done", icon: "truck" },
      { key: "delivered", title: "Delivered", status: "done", icon: "home" },
    ],
  order: {
    id: 1248,
    eta: "12 mins",
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
    pricing: {
      bags: 2,
      bagPrice: 45,
      tip: 5,
    },
  },
};
