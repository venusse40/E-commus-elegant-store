import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const image =
    product.images?.[0]?.url || product.image || "https://placehold.co/400x400?text=Elegant+Store";
  const price = product.variants?.[0]?.price ?? product.price ?? 0;

  const handleAddToCart = async (e) => {
    e.preventDefault(); // stop the card's Link navigation from firing
    e.stopPropagation();
    await addToCart(
      { id: product.id, name: product.name, price, image },
      1
    );
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className="group block glass rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      <div className="aspect-square overflow-hidden bg-gray-50">
        <img
          src={image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          onError={(e) => {
            e.target.src = "https://placehold.co/400x400?text=Elegant+Store";
          }}
        />
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium text-gray-800 truncate">
          {product.name}
        </h3>
        <p className="text-rose-500 font-semibold mt-1">
          {typeof price === "number" ? `RWF ${price.toLocaleString()}` : price}
        </p>
        <button
          onClick={handleAddToCart}
          className="mt-2 w-full py-1.5 bg-gray-800 text-white text-xs font-medium rounded-md hover:bg-gray-900 transition"
        >
          Add to Cart
        </button>
      </div>
    </Link>
  );
}