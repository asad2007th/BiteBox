# Frontend Decisions – BiteBox

## Decision 1: Product Information Display

**Problem:** Customers may find it difficult to compare food items when important product information is separated.

**Decision:** Display food images, names, prices, descriptions, and dietary labels together in product cards.

**Alternative:** Display only product names and prices in a simple list.

**Reason:** Product cards allow customers to compare important information quickly.

**Tradeoff:** Product cards require more screen space, especially on mobile devices.

**Code Location:** `src/components/FoodCard.jsx` and `src/pages/Menu.jsx`

**Evidence:** Screenshot of the BiteBox menu page.

## Decision 2: Shared Cart State

**Problem:** Customers may lose their selected items when moving between different pages.

**Decision:** Use React Context to maintain shared cart state across the application.

**Alternative:** Store cart state separately inside each page.

**Reason:** Shared state keeps the cart consistent across the menu, details, and cart pages.

**Tradeoff:** Context requires additional setup and careful state management.

**Code Location:** `src/context/CartContext.jsx`

**Evidence:** Screenshot showing an item added from the details page and retained in the cart page.

## Decision 3: Dietary Information and Mobile Layout

**Problem:** Customers may have difficulty finding dietary information when selecting food items.

**Decision:** Display vegetarian labels directly on food cards and provide a vegetarian-only filter. Use a responsive layout that rearranges product cards on smaller screens.

**Alternative:** Display dietary information only on a separate information page.

**Reason:** Customers can identify suitable food items before opening their details pages.

**Tradeoff:** Additional labels and filters require more interface space and responsive styling.

**Code Location:** `src/components/FoodCard.jsx`, `src/pages/Menu.jsx`, and `src/styles/global.css`

**Evidence:** Screenshots of the menu and mobile layout.