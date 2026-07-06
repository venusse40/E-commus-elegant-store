import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { placeOrder } from "../api/ordersApi";
import Loader from "../components/ui/Loader";
import ErrorMessage from "../components/ui/ErrorMessage";
import EmptyState from "../components/ui/EmptyState";

export default function Cart() {
  const { items, total, loading, error, updateQuantity, removeFromCart, refreshCart } =
    useCart();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(null);

  const handleCheckout = async () => {
    setPlacing(true);
    setOrderError(null);
    try {
      const res = await placeOrder();
      setOrderSuccess(res.order || res);
      await refreshCart();
    } catch (err) {
      setOrderError(
        err.response?.data?.message || "Could not place your order."
      );
    } finally {
      setPlacing(false);
    }
  };

  if (loading) return <Loader label="Loading your cart..." />;
  if (error) return <ErrorMessage message={error} onRetry={refreshCart} />;

  if (orderSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Order placed! 🎉
        </h2>
        <p className="text-gray-500 mb-6">
          Thank you for shopping with Elegant Store. Order #{orderSuccess.id || "—"} is confirmed.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-5 py-2.5 bg-rose-500 text-white rounded-lg font-medium hover:bg-rose-600 transition"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <EmptyState
          title="Your cart is empty"
          subtitle="Browse our products and add something you love."
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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Cart</h1>

      <div className="space-y-4">
        {items.map((item) => {
          const name = item.variant?.product?.name || item.product?.name || item.name;
          const price = item.variant?.price ?? item.price ?? 0;
          const image =
            item.variant?.product?.images?.[0]?.url ||
            item.product?.images?.[0]?.url ||
            "https://placehold.co/100x100?text=Elegant+Store";

          return (
            <div
              key={item.id}
              className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl p-3"
            >
              <img
                src={image}
                alt={name}
                className="w-20 h-20 rounded-lg object-cover bg-gray-50"
                onError={(e) => {
                  e.target.src = "https://placehold.co/100x100?text=Elegant+Store";
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 truncate">{name}</p>
                <p className="text-rose-500 text-sm font-semibold">
                  RWF {Number(price).toLocaleString()}
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() =>
                      updateQuantity(item.id, Math.max(1, item.quantity - 1))
                    }
                    className="w-7 h-7 border border-gray-200 rounded-md text-sm hover:bg-gray-50"
                  >
                    −
                  </button>
                  <span className="text-sm w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-7 h-7 border border-gray-200 rounded-md text-sm hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={() => removeFromCart(item.id)}
                className="text-xs text-gray-400 hover:text-rose-500 transition"
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-8 border-t border-gray-100 pt-6 flex items-center justify-between">
        <span className="text-lg font-semibold text-gray-800">Total</span>
        <span className="text-lg font-bold text-rose-500">
          RWF {total.toLocaleString()}
        </span>
      </div>

      {orderError && (
        <p className="text-rose-600 text-sm mt-3">{orderError}</p>
      )}

      <button
        onClick={handleCheckout}
        disabled={placing}
        className="mt-6 w-full py-3 bg-rose-500 text-white rounded-lg font-medium hover:bg-rose-600 transition disabled:opacity-60"
      >
        {placing ? "Placing order..." : "Checkout"}
      </button>
    </div>
  );
}