import { useEffect, useState, useMemo } from "react";
import { getAllProducts, getAllCategories, getProductsByCategory } from "../api/productsApi";
import ProductGrid from "../components/product/ProductGrid";
import Loader from "../components/ui/Loader";
import ErrorMessage from "../components/ui/ErrorMessage";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadInitial = async () => {
    setLoading(true);
    setError(null);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        getAllProducts(),
        getAllCategories(),
      ]);
      setProducts(productsRes.data?.all || []);
      setCategories(categoriesRes.categories || categoriesRes.data || categoriesRes);
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not load products. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitial();
  }, []);

  const handleCategoryChange = async (categoryId) => {
    setSelectedCategory(categoryId);
    setLoading(true);
    setError(null);
    try {
      if (categoryId === "all") {
        const res = await getAllProducts();
        setProducts(res.data?.all || []);
      } else {
        const res = await getProductsByCategory(categoryId);
        setProducts(res.data?.all || res.data || res.products || []);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not load this category."
      );
    } finally {
      setLoading(false);
    }
  };

  const visibleProducts = useMemo(() => {
    let list = Array.isArray(products) ? [...products] : [];

    if (search.trim()) {
      const term = search.trim().toLowerCase();
      list = list.filter((p) => p.name?.toLowerCase().includes(term));
    }

    if (sortBy === "price-asc") {
      list.sort(
        (a, b) => (a.variants?.[0]?.price ?? a.price ?? 0) - (b.variants?.[0]?.price ?? b.price ?? 0)
      );
    } else if (sortBy === "price-desc") {
      list.sort(
        (a, b) => (b.variants?.[0]?.price ?? b.price ?? 0) - (a.variants?.[0]?.price ?? a.price ?? 0)
      );
    } else if (sortBy === "name-asc") {
      list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    }

    return list;
  }, [products, search, sortBy]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Shop the latest at Elegant Store
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Thrifted fashion, curated for you.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
        />

        <select
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
        >
          <option value="default">Sort: Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A-Z</option>
        </select>
      </div>

      {loading && <Loader label="Loading products..." />}
      {!loading && error && <ErrorMessage message={error} onRetry={loadInitial} />}
      {!loading && !error && <ProductGrid products={visibleProducts} />}
    </div>
  );
}