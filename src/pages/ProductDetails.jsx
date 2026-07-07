import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../api/productsApi";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import Loader from "../components/ui/Loader";
import ErrorMessage from "../components/ui/ErrorMessage";
import axiosClient from "../api/axiosClient";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [adding, setAdding] = useState(false);
  const [addMessage, setAddMessage] = useState(null);

  const loadProduct = async () => {
    setLoading(true);
    setError(null);
    setNotFound(false);
    try {
      const res = await axiosClient.post("/api/auth/orders/buy", {
  productId: product.id,
  quantity: 1,
});
setAddMessage({
  type: "success",
  text: `Order placed! Order ID: ${res.data?.data?.id || res.data?.id || "confirmed"}`,
});
    } catch (err) {
      if (err.response?.status === 404) {
        setNotFound(true);
      } else {
        setError(
          err.response?.data?.message || "Could not load this product."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  const handleAddToCart = async () => {
  await addToCart(
    {
      id: product.id,
      name: product.name,
      price: displayPrice,
      image,
    },
    1
  );
  setAddMessage({ type: "success", text: "Added to cart (local demo cart)!" });
};
<button
  onClick={handleAddToCart}
  className="px-6 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition"
>
  Add to Cart
</button>

 const handleBuyNow = async () => {
  if (!isAuthenticated) {
    navigate("/login", { state: { from: { pathname: `/products/${id}` } } });
    return;
  }
  setAdding(true);
  setAddMessage(null);
  try {
    await axiosClient.post("/api/auth/orders/buy", {
      productId: product.id,
      quantity: 1,
    });
    setAddMessage({ type: "success", text: "Order placed successfully!" });
  } catch (err) {
    setAddMessage({
      type: "error",
      text: err.response?.data?.message || "Could not place order.",
    });
  } finally {
    setAdding(false);
  }
};
  if (loading) return <Loader label="Loading product..." />;

  if (notFound) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Product not found
        </h2>
        <p className="text-gray-500 mb-4">
          This product may have been removed or doesn't exist.
        </p>
        <button
          onClick={() => navigate("/")}
          className="text-rose-500 font-medium hover:underline"
        >
          Back to shop
        </button>
      </div>
    );
  }

  if (error) return <ErrorMessage message={error} onRetry={loadProduct} />;
  if (!product) return null;

  const image =
    product.images?.[0]?.url || product.image || "https://placehold.co/600x600?text=Elegant+Store";
  const displayPrice = selectedVariant?.price ?? product.price;
  const hasVariants = product.variants && product.variants.length > 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden">
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "https://placehold.co/600x600?text=Elegant+Store";
            }}
          />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
          <p className="text-rose-500 text-xl font-semibold mt-2">
            {typeof displayPrice === "number"
              ? `RWF ${displayPrice.toLocaleString()}`
              : displayPrice}
          </p>

          {product.description && (
            <p className="text-gray-600 mt-4 leading-relaxed">
              {product.description}
            </p>
          )}

          {product.variants && product.variants.length > 1 && (
            <div className="mt-5">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Choose an option:
              </p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-3 py-1.5 rounded-lg text-sm border transition ${
                      selectedVariant?.id === variant.id
                        ? "border-rose-500 bg-rose-50 text-rose-600"
                        : "border-gray-200 text-gray-600 hover:border-rose-300"
                    }`}
                  >
                    {variant.name || variant.size || variant.color || `Option ${variant.id}`}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
  <button
    onClick={handleAddToCart}
    disabled={true}
    className="px-6 py-3 bg-gray-200 text-gray-500 rounded-lg font-medium cursor-not-allowed"
  >
    Add to Cart (Unavailable)
  </button>

  <button
    onClick={handleBuyNow}
    disabled={adding}
    className="px-6 py-3 bg-rose-500 text-white rounded-lg font-medium hover:bg-rose-600 transition disabled:opacity-60"
  >
    {adding ? "Placing order..." : "Buy Now"}
  </button>
</div>

<p className="mt-3 text-sm text-amber-600">
  Add to Cart is disabled because this API's product data has no variants configured, which the cart endpoint requires.
  please Use "Buy Now" to purchase directly.
</p>
          {addMessage && (
            <p
              className={`mt-3 text-sm ${
                addMessage.type === "success" ? "text-green-600" : "text-rose-600"
              }`}
            >
              {addMessage.text}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}