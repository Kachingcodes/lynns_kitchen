"use client";

import { useEffect, useState } from "react";

import WaiterHeader from "./components/WaiterHeader";
import WaiterStats from "./components/WaiterStats";
import IncomingOrders from "./components/IncomingOrders";
import TakeOrderModal from "./components/TakeOrderModal";
import ComplaintModal from "./components/ComplaintModal";
import RatingModal from "./components/RatingModal";


export default function WaiterInterface() {
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [selectedOrder, setSelectedOrder] =
    useState(null);

  const [isTakeOrderOpen, setIsTakeOrderOpen] =
    useState(false);

const [selectedComplaintOrder, setSelectedComplaintOrder] =
  useState(null);

const [isComplaintModalOpen, setIsComplaintModalOpen] =
  useState(false);

  const [selectedRatingOrder, setSelectedRatingOrder] =
  useState(null);

const [isRatingModalOpen, setIsRatingModalOpen] =
  useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/waiter/orders"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to fetch orders"
        );
      }

      setOrders(data);

    } catch (error) {
      console.error(error);

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchOrders();
  }, []);


  // Open Take Order Modal
  const handleTakeOrder = (order) => {
    setSelectedOrder(order);

    setIsTakeOrderOpen(true);
  };


  // Close Take Order Modal
  const closeTakeOrderModal = () => {
    setIsTakeOrderOpen(false);

    setSelectedOrder(null);
  };

const handleViewComplaint = (order) => {
  setSelectedComplaintOrder(order);

  setIsComplaintModalOpen(true);
};

const closeComplaintModal = () => {
  setIsComplaintModalOpen(false);

  setSelectedComplaintOrder(null);
};

const handleViewRating = (order) => {

  setSelectedRatingOrder(order);

  setIsRatingModalOpen(true);

};

const closeRatingModal = () => {

  setIsRatingModalOpen(false);

  setSelectedRatingOrder(null);

};

  return (
    <main className="min-h-screen bg-background">

      <WaiterHeader />

      <div className="mx-auto max-w-7xl px-6 py-8">

        <WaiterStats orders={orders} />

        <IncomingOrders
          orders={orders}
          loading={loading}
          onTakeOrder={handleTakeOrder}
          onViewComplaint={handleViewComplaint}
          onViewRating={handleViewRating}
        />

      </div>


      <TakeOrderModal
        isOpen={isTakeOrderOpen}
        order={selectedOrder}
        onClose={closeTakeOrderModal}
        onSuccess={() => {
          closeTakeOrderModal();

          fetchOrders();
        }}
      />

      <ComplaintModal
        isOpen={isComplaintModalOpen}
        order={selectedComplaintOrder}
        onClose={closeComplaintModal}
        onSuccess={() => {
          closeComplaintModal();

          fetchOrders();
        }}
      />

      <RatingModal
        isOpen={isRatingModalOpen}
        order={selectedRatingOrder}
        onClose={closeRatingModal}
      />

    </main>
  );
}