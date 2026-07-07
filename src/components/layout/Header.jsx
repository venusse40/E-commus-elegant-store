import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 glass shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-rose-500 tracking-tight">
          Elegant Store
        </Link>

        <nav className="flex items-center gap-4 sm:gap-6">
          <Link
            to="/cart"
            className="relative text-gray-600 hover:text-rose-500 transition text-sm font-medium"
          >
            Cart
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-rose-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
          {isAuthenticated && (
  <Link
    to="/orders"
    className="text-sm font-medium text-gray-600 hover:text-rose-500 transition"
  >
    Orders
  </Link>
)}

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-sm text-gray-500">
                {user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-gray-600 hover:text-rose-500 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-medium text-gray-600 hover:text-rose-500 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium bg-rose-500 text-white px-3 py-1.5 rounded-lg hover:bg-rose-600 transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}