
import { useState, useEffect, useCallback } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useParams,
  useNavigate,
  useLocation
} from "react-router-dom";

import { CartProvider } from "./context/CartContext.jsx";
import { useCart } from "./context/useCart.js";
import "./App.css";

// Food images
const foodImages = {
  1: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700",
  2: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=700",
  3: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=700",
  4: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=700",
  5: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=700",
  6: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=700",
  7: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=700",
  8: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=700",
  9: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=700",
  10: "https://images.unsplash.com/photo-1562967914-608f82629710?w=700",
  11: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=700",
  12: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=700"
};

// Supported delivery areas
const deliveryAreas = [
  "F-6", "F-7", "F-8", "F-10", "F-11",
  "G-6", "G-7", "G-8", "G-9", "G-10", "G-11",
  "I-8", "I-9", "I-10"
];

// Navigation bar
function Navbar() {
  const { cartCount } = useCart();

  return (
    <nav className="navbar" aria-label="Main navigation">
      <Link to="/" className="logo" aria-label="BiteBox home">
        BiteBox <span aria-hidden="true">🍔</span>
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/menu">Menu</Link>
        <Link to="/cart">Cart ({cartCount})</Link>
      </div>
    </nav>
  );
}

// Home page
function Home() {
  return (
    <div>
      <section className="hero">
        <div className="hero-content">
          <span className="hero-label">WELCOME TO BITEBOX</span>

          <h1>
            Delicious Food.
            <br />
            Delivered Fresh.
          </h1>

          <p>
            Discover delicious burgers, pizzas, sandwiches,
            sides and desserts at BiteBox.
          </p>

          <Link to="/menu" className="btn">
            Explore Our Menu
          </Link>
        </div>
      </section>

      <section className="home-features">
        <h2>Why Choose BiteBox?</h2>

        <div className="feature-grid">
          <div className="feature-card">
            <span aria-hidden="true">🍔</span>
            <h3>Fresh Food</h3>
            <p>Enjoy delicious food prepared fresh.</p>
          </div>

          <div className="feature-card">
            <span aria-hidden="true">🚚</span>
            <h3>Convenient Ordering</h3>
            <p>Browse our menu and place your order easily.</p>
          </div>

          <div className="feature-card">
            <span aria-hidden="true">💰</span>
            <h3>Affordable Prices</h3>
            <p>Enjoy tasty meals at student-friendly prices.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

// Menu page
function Menu() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");

  const {
    addToCart,
    foods: availableFoods
  } = useCart();

  const [menuFoods, setMenuFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load menu data
  const loadMenu = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      // Simulate an asynchronous request
      const data = await new Promise((resolve) => {
        setTimeout(() => {
          resolve(availableFoods);
        }, 700);
      });

      if (!Array.isArray(data)) {
        throw new Error("Invalid menu data");
      }

      setMenuFoods(data);
    } catch {
      setError("Unable to load the menu. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [availableFoods]);

  // Load menu when page opens or stock changes
  useEffect(() => {
    const timer = setTimeout(() => {
      loadMenu();
    }, 0);

    return () => clearTimeout(timer);
  }, [loadMenu]);

  // Loading screen
  if (loading) {
    return (
      <div
        className="container"
        aria-live="polite"
        aria-busy="true"
      >
        <h1>Our Menu</h1>
        <p>Loading delicious food... Please wait.</p>
      </div>
    );
  }

  // Error screen with Retry button
  if (error) {
    return (
      <div className="container">
        <h1>Oops! Something went wrong.</h1>

        <p className="error-message" role="alert">
          {error}
        </p>

        <button
          type="button"
          className="btn"
          onClick={loadMenu}
        >
          Retry
        </button>
      </div>
    );
  }

  const categories = [
    "All",
    ...new Set(menuFoods.map((food) => food.category))
  ];

  let filteredFoods = menuFoods.filter((food) => {
    const matchesSearch = food.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || food.category === category;

    return matchesSearch && matchesCategory;
  });

  if (sort === "low-high") {
    filteredFoods.sort((a, b) => a.price - b.price);
  } else if (sort === "high-low") {
    filteredFoods.sort((a, b) => b.price - a.price);
  }

  function handleAddToCart(foodId) {
    const result = addToCart(foodId);
    alert(result.message);
  }

  return (
    <div className="container">
      <div className="menu-heading">
        <h1>Our Menu</h1>
        <p>Find your favourite food at BiteBox.</p>
      </div>

      <div className="menu-controls">
        <input
          type="text"
          placeholder="Search food by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search food by name"
          className="search-input"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Filter by category"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "All" ? "All Categories" : cat}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          aria-label="Sort by price"
        >
          <option value="default">Default Order</option>
          <option value="low-high">Price: Low to High</option>
          <option value="high-low">Price: High to Low</option>
        </select>
      </div>

      <p className="results-count" aria-live="polite">
        Showing {filteredFoods.length} of {menuFoods.length} products
      </p>

      {filteredFoods.length > 0 ? (
        <div className="food-grid">
          {filteredFoods.map((food) => (
            <div className="food-card" key={food.id}>
              <img
                src={foodImages[food.id]}
                alt={food.name}
                className="food-image"
                loading="lazy"
              />

              <div className="food-card-content">
                <span className="category-label">
                  {food.category}
                </span>

                <h3>{food.name}</h3>
                <p>{food.description}</p>

                <p>
                  <strong>Available stock:</strong> {food.stock}
                </p>

                <div className="food-card-bottom">
                  <h4>Rs. {food.price}</h4>

                  <Link
                    to={`/menu/${food.id}`}
                    className="btn"
                  >
                    View Details
                  </Link>
                </div>

                <button
                  type="button"
                  className="btn add-cart-btn"
                  onClick={() => handleAddToCart(food.id)}
                  disabled={food.stock === 0}
                >
                  {food.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-results">
          <h2>No food found!</h2>
          <p>Try another search or select a different category.</p>

          <button
            type="button"
            className="btn"
            onClick={() => {
              setSearch("");
              setCategory("All");
              setSort("default");
            }}
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}

// Food details page
function FoodDetails() {
  const { id } = useParams();

  const {
    addToCart,
    foods
  } = useCart();

  const food = foods.find(
    (item) => item.id === Number(id)
  );

  if (!food) {
    return (
      <div className="container">
        <h1>Food item not found!</h1>
        <Link to="/menu" className="btn">
          Back to Menu
        </Link>
      </div>
    );
  }

  function handleAddToCart() {
    const result = addToCart(food.id);
    alert(result.message);
  }

  return (
    <div className="container">
      <div className="details-card">
        <img
          src={foodImages[food.id]}
          alt={food.name}
          className="details-image"
        />

        <div className="details-content">
          <span className="category-label">
            {food.category}
          </span>

          <h1>{food.name}</h1>
          <p>{food.description}</p>
          <h2>Rs. {food.price}</h2>

          <h3>Ingredients</h3>

          <ul>
            {food.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>

          <p>
            <strong>Vegetarian:</strong>{" "}
            {food.vegetarian ? "Yes" : "No"}
          </p>

          <p>
            <strong>Available stock:</strong> {food.stock}
          </p>

          <button
            type="button"
            className="btn add-cart-btn"
            onClick={handleAddToCart}
            disabled={food.stock === 0}
          >
            {food.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>

          <Link to="/menu" className="btn back-btn">
            Back to Menu
          </Link>
        </div>
      </div>
    </div>
  );
}

// Cart page
function Cart() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    subtotal,
    deliveryFee,
    total,
    vegetarianOnly,
    setVegetarianOnly,
    hasNonVegetarianItems
  } = useCart();

  function handleQuantityChange(foodId, quantity) {
    const result = updateQuantity(foodId, quantity);

    if (result && !result.success) {
      alert(result.message);
    }
  }

  return (
    <div className="container">
      <h1>Your Shopping Cart 🛒</h1>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <h2>Your cart is empty!</h2>
          <p>Add some delicious food from our menu.</p>

          <Link to="/menu" className="btn">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="cart-list">
            {cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <img
                  src={foodImages[item.id]}
                  alt={item.name}
                />

                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <p>Rs. {item.price} each</p>

                  <p>
                    Item total: Rs. {item.price * item.quantity}
                  </p>

                  <p>Available stock: {item.stock}</p>

                  <div className="quantity-controls">
                    <button
                      type="button"
                      onClick={() =>
                        handleQuantityChange(
                          item.id,
                          item.quantity - 1
                        )
                      }
                      aria-label={`Decrease ${item.name} quantity`}
                    >
                      −
                    </button>

                    <strong>{item.quantity}</strong>

                    <button
                      type="button"
                      onClick={() =>
                        handleQuantityChange(
                          item.id,
                          item.quantity + 1
                        )
                      }
                      disabled={
                        item.quantity >= Math.min(5, item.stock)
                      }
                      aria-label={`Increase ${item.name} quantity`}
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="vegetarian-option">
            <label>
              <input
                type="checkbox"
                checked={vegetarianOnly}
                onChange={(e) =>
                  setVegetarianOnly(e.target.checked)
                }
              />
              I want a vegetarian-only order
            </label>

            {vegetarianOnly && hasNonVegetarianItems && (
              <p className="error-message" role="alert">
                Your cart contains non-vegetarian items.
                Remove them before checkout.
              </p>
            )}
          </div>

          <div className="order-summary">
            <h2>Order Summary</h2>

            <p>
              Subtotal: <strong>Rs. {subtotal}</strong>
            </p>

            <p>
              Delivery Fee: <strong>Rs. {deliveryFee}</strong>
            </p>

            <h3>Total: Rs. {total}</h3>

            {subtotal < 1500 && (
              <p className="delivery-note">
                Add Rs. {1500 - subtotal} more to get free delivery!
              </p>
            )}

            <Link to="/menu" className="btn back-btn">
              Continue Shopping
            </Link>

            <Link to="/checkout" className="btn">
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

// Checkout page
function Checkout() {
  const {
    cart,
    subtotal,
    deliveryFee,
    total,
    vegetarianOnly,
    hasNonVegetarianItems,
    placeOrder
  } = useCart();

  const navigate = useNavigate();

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    sector: ""
  });

  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;

    setCustomer((previous) => ({
      ...previous,
      [name]: value
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (cart.length === 0) {
      setError("Your cart is empty. Please add food first.");
      return;
    }

    if (vegetarianOnly && hasNonVegetarianItems) {
      setError(
        "Remove non-vegetarian items because you selected vegetarian-only order."
      );
      return;
    }

    if (
      !customer.name.trim() ||
      !customer.phone.trim() ||
      !customer.address.trim() ||
      !customer.sector
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (!/^03\d{9}$/.test(customer.phone.trim())) {
      setError(
        "Enter a valid Pakistani mobile number, e.g. 03001234567."
      );
      return;
    }

    const result = placeOrder({
      ...customer,
      name: customer.name.trim(),
      phone: customer.phone.trim(),
      address: customer.address.trim()
    });

    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate("/confirmation", {
      state: { order: result.order }
    });
  }

  if (cart.length === 0) {
    return (
      <div className="container">
        <h1>Your cart is empty.</h1>
        <Link to="/menu" className="btn">
          Go to Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="container checkout-container">
      <h1>Checkout</h1>
      <p>Enter your details to place your BiteBox order.</p>

      <form className="checkout-form" onSubmit={handleSubmit}>
        <label>
          Full Name
          <input
            type="text"
            name="name"
            value={customer.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            autoComplete="name"
            required
          />
        </label>

        <label>
          Mobile Number
          <input
            type="tel"
            name="phone"
            value={customer.phone}
            onChange={handleChange}
            placeholder="03001234567"
            pattern="03[0-9]{9}"
            title="Enter a Pakistani mobile number starting with 03"
            autoComplete="tel"
            required
          />
        </label>

        <label>
          Delivery Address
          <textarea
            name="address"
            value={customer.address}
            onChange={handleChange}
            placeholder="House number, street and other details"
            autoComplete="street-address"
            required
          />
        </label>

        <label>
          Select Islamabad Sector
          <select
            name="sector"
            value={customer.sector}
            onChange={handleChange}
            required
          >
            <option value="">Choose your sector</option>

            {deliveryAreas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </label>

        <div className="checkout-summary">
          <h2>Order Summary</h2>
          <p>Subtotal: Rs. {subtotal}</p>
          <p>Delivery Fee: Rs. {deliveryFee}</p>
          <h3>Total: Rs. {total}</h3>
        </div>

        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="btn">
          Place Order
        </button>
      </form>
    </div>
  );
}

// Order confirmation page
function Confirmation() {
  const { lastOrder } = useCart();

  const location = useLocation();
  const order = location.state?.order || lastOrder;

  if (!order) {
    return (
      <div className="container">
        <h1>No order found.</h1>
        <Link to="/menu" className="btn">
          Go to Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="container confirmation-container">
      <div className="confirmation-card">
        <h1>🎉 Order Placed Successfully!</h1>

        <p>Thank you for ordering from BiteBox.</p>

        <h3>Order ID: {order.id}</h3>
        <p>Order Date: {order.date}</p>

        <h2>Customer Details</h2>
        <p>Name: {order.customer.name}</p>
        <p>Phone: {order.customer.phone}</p>
        <p>Address: {order.customer.address}</p>
        <p>Sector: {order.customer.sector}</p>

        <h2>Ordered Items</h2>

        {order.items.map((item) => (
          <p key={item.id}>
            {item.name} × {item.quantity} = Rs.{" "}
            {item.price * item.quantity}
          </p>
        ))}

        <hr />

        <p>Subtotal: Rs. {order.subtotal}</p>
        <p>Delivery Fee: Rs. {order.deliveryFee}</p>
        <h2>Grand Total: Rs. {order.total}</h2>

        <p>This is a simulated order. No real payment was taken.</p>

        <Link to="/menu" className="btn">
          Order More Food
        </Link>
      </div>
    </div>
  );
}

// Main application
function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/menu/:id" element={<FoodDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/confirmation" element={<Confirmation />} />

          <Route
            path="*"
            element={
              <div className="container">
                <h1>404 - Page Not Found</h1>
                <Link to="/" className="btn">
                  Go Home
                </Link>
              </div>
            }
          />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
