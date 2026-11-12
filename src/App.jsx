
import { useState } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useParams
} from "react-router-dom";

import foods from "./data/food.js";
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

// Navigation bar
function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        BiteBox 🍔
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/menu">Menu</Link>
        <Link to="/cart">Cart</Link>
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
            <span>🍔</span>
            <h3>Fresh Food</h3>
            <p>Enjoy delicious food prepared fresh.</p>
          </div>

          <div className="feature-card">
            <span>🚚</span>
            <h3>Convenient Ordering</h3>
            <p>Browse our menu and place your order easily.</p>
          </div>

          <div className="feature-card">
            <span>💰</span>
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

  // Get unique categories from the food dataset
  const categories = [
    "All",
    ...new Set(foods.map((food) => food.category))
  ];

  // Search and filter products
  let filteredFoods = foods.filter((food) => {
    const matchesSearch = food.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || food.category === category;

    return matchesSearch && matchesCategory;
  });

  // Sort products by price
  if (sort === "low-high") {
    filteredFoods.sort((a, b) => a.price - b.price);
  } else if (sort === "high-low") {
    filteredFoods.sort((a, b) => b.price - a.price);
  }

  return (
    <div className="container">
      <div className="menu-heading">
        <h1>Our Menu</h1>
        <p>Find your favourite food at BiteBox.</p>
      </div>

      {/* Search, category and sorting controls */}
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

      <p className="results-count">
        Showing {filteredFoods.length} of {foods.length} products
      </p>

      {/* Food products */}
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

                <div className="food-card-bottom">
                  <h4>Rs. {food.price}</h4>

                  <Link
                    to={`/menu/${food.id}`}
                    className="btn"
                  >
                    View Details
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="no-results">
          <h2>No food found!</h2>
          <p>Try another search or select a different category.</p>

          <button
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

// Individual food details page
function FoodDetails() {
  const { id } = useParams();

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

          <Link to="/menu" className="btn">
            Back to Menu
          </Link>
        </div>

      </div>
    </div>
  );
}

// Temporary cart page
function Cart() {
  return (
    <div className="container">
      <h1>Your Cart</h1>
      <p>Shopping cart functionality will be implemented on Day 2.</p>
      <Link to="/menu" className="btn">
        Continue Shopping
      </Link>
    </div>
  );
}

// Temporary checkout page
function Checkout() {
  return (
    <div className="container">
      <h1>Checkout</h1>
      <p>Checkout functionality will be implemented on Day 2.</p>
    </div>
  );
}

// Temporary confirmation page
function Confirmation() {
  return (
    <div className="container">
      <h1>Order Confirmation</h1>
      <p>Order confirmation will be implemented on Day 2.</p>
    </div>
  );
}

// Main application
function App() {
  return (
    <BrowserRouter>
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
              <Link to="/" className="btn">Go Home</Link>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
