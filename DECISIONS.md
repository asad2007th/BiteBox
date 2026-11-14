# Frontend Decisions – BiteBox

## Decision 1: Product Information Display

**Problem:** Customers may find it difficult to compare food items when important product information is separated across different pages.

**Decision:** Display food images, names, prices, categories, descriptions, and vegetarian labels together in organized product cards.

**Alternative:** Display only product names and prices in a simple list.

**Reason:** Product cards allow customers to view and compare important information quickly before selecting an item.

**Trade-off:** Product cards require more screen space, especially on mobile devices.

**Code Location:** `src/App.jsx`, `src/data/food.js`, and `src/App.css`

**Evidence:** Screenshot of the BiteBox menu page showing product cards.

---

## Decision 2: Shared Cart State Using React Context

**Problem:** Customers may lose their selected items or see inconsistent cart information when navigating between different pages.

**Decision:** Use React Context to maintain shared cart and inventory state across the application. Use localStorage to persist the cart and updated inventory after refreshing the browser.

**Alternative:** Store cart and inventory state separately inside individual pages.

**Reason:** Shared state keeps cart information consistent throughout the application. LocalStorage allows saved cart selections and updated stock quantities to remain available after a page refresh.

**Trade-off:** Context requires additional setup and careful state management. LocalStorage only stores information in the current browser and does not provide shared server-side storage.

**Code Location:** `src/context/CartContext.jsx`, `src/context/cart-context.js`, `src/context/useCart.js`, and `src/utils/cartUtils.js`

**Evidence:** Screenshots showing an item added to the cart, the same item retained after navigation, and updated inventory after refreshing the browser.

---

## Decision 3: Dietary Information and Responsive Design

**Problem:** Customers may have difficulty identifying suitable food items and using the website on smaller screens.

**Decision:** Display vegetarian labels with food items, provide a vegetarian-only order preference, and use responsive CSS to adjust the website layout for mobile devices.

**Alternative:** Display dietary information only on a separate page and use a fixed desktop layout.

**Reason:** Customers can identify suitable food items more easily, while responsive styling provides a better experience across different screen sizes.

**Trade-off:** Additional dietary labels and responsive layouts require extra interface space and CSS styling.

**Code Location:** `src/App.jsx`, `src/data/food.js`, and `src/App.css`



