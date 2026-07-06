import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const image =
    product.images?.[0]?.url || product.image || "https://placehold.co/400x400?text=Elegant+Store";
  const price = product.variants?.[0]?.price ?? product.price ?? "-";

  return (
    <Link
      to={`/products/${product.id}`}
      className="group block bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition"
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
      </div>
    </Link>
  );
}