import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyOrders } from "../api/ordersApi";
import Loader from "../components/ui/Loader";
import ErrorMessage from "../components/ui/ErrorMessage";
import EmptyState from "../components/ui/EmptyState";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getMyOrders();
      setOrders(res.data || res.orders || res || []);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load your orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  if (loading) return <Loader label="Loading your orders..." />;
  if (error) return <ErrorMessage message={error} onRetry={loadOrders} />;

  if (!orders || orders.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <EmptyState
          title="No orders yet"
          subtitle="Your past purchases will show up here."
        />
        <div className="text-center mt-4">
          <button
            onClick={() => navigate("/")}
            className="text-rose-500 font-medium hover:underline"
          >
            Go to shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white border border-gray-100 rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-gray-800">
                Order #{order.id?.slice(-8) || order.id}
              </p>
              <span className="text-xs px-2 py-1 rounded-full bg-amber-50 text-amber-600 font-medium">
                {order.status || "PENDING"}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-2">
              {order.createdAt
                ? new Date(order.createdAt).toLocaleDateString()
                : ""}
            </p>
            <p className="text-rose-500 font-semibold">
              RWF {Number(order.total || 0).toLocaleString()}
            </p>
            {order.items && order.items.length > 0 && (
              <p className="text-xs text-gray-400 mt-1">
                {order.items.length} item{order.items.length > 1 ? "s" : ""}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}