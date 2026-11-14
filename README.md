# BiteBox – Online Fast-Food Restaurant

BiteBox is a React-based frontend website for a fictional online fast-food restaurant serving university students and young professionals in Islamabad.

The website allows customers to browse food items, view product details, search and filter the menu, manage their shopping cart, and place simulated food orders.

## 1. Project Overview

- **Business Name:** BiteBox
- **Business Type:** Online Fast-Food Restaurant
- **Course:** CS4032 – Web Programming
- **University:** FAST-NUCES, Islamabad
- **Semester:** Fall 2026
- **Technology:** React and Vite

## 2. Main Features

### Home Page
- Introduces the BiteBox restaurant.
- Provides navigation to the menu and ordering pages.

### Food Menu
- Displays food items using product cards.
- Shows food images, names, prices, categories, and vegetarian labels.
- Supports searching for food items.
- Allows filtering by category.
- Supports sorting products by price.

### Food Details
- Displays product descriptions and ingredients.
- Shows prices and available stock.
- Allows customers to select quantities.
- Restricts individual food quantities to a maximum of five units, subject to available stock.

### Shopping Cart
- Allows customers to add and remove food items.
- Supports increasing and decreasing quantities.
- Calculates the cart subtotal and delivery charges.
- Preserves cart information using browser localStorage.

### Checkout
- Collects customer and delivery information.
- Validates customer input.
- Supports a vegetarian-only order preference.
- Prevents incompatible orders containing non-vegetarian items when that preference is selected.

### Delivery Charges
- Orders below Rs. 1,500 have a delivery fee of Rs. 150.
- Orders of Rs. 1,500 or above receive free delivery.

### Inventory Management
- Reduces available stock after a successful simulated order.
- Prevents customers from ordering more than the available stock.
- Saves updated inventory using browser localStorage.

### Order Confirmation
- Displays the order confirmation and order summary.
- Shows the customer's order details and calculated total.

### Responsive Design
- Adjusts the website layout for desktop, tablet, and mobile screens.

## 3. Technologies Used

- React
- JavaScript
- Vite
- React Router DOM
- HTML
- CSS
- Browser localStorage
- Node.js built-in test runner
- ESLint

## 4. Project Structure

```text
BiteBox/
│
├── public/
├── src/
│   ├── components/
│   ├── context/
│   │   ├── CartContext.jsx
│   │   ├── cart-context.js
│   │   └── useCart.js
│   ├── data/
│   │   └── food.js
│   ├── utils/
│   │   └── cartUtils.js
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
│
├── tests/
├── index.html
├── package.json
├── DECISIONS.md
└── README.md
```

## 5. Installation and Setup

Make sure Node.js and npm are installed.

Clone the repository:

```bash
git clone https://github.com/asad2007th/BiteBox.git
```

Navigate to the project folder:

```bash
cd BiteBox
```

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL displayed in the terminal, usually:

```text
http://localhost:5173/
```

## 6. Testing and Validation

The project includes automated tests for cart calculations and business rules.

Run ESLint:

```bash
npm run lint
```

Run automated tests:

```bash
npm test
```

Create a production build:

```bash
npm run build
```

### Latest Test Results

- ESLint: Passed
- Automated tests: 7 passed, 0 failed
- Production build: Successful

## 7. Data Storage and Limitations

BiteBox is a frontend demonstration project.

- No real backend or database is connected.
- Orders are simulated within the React application.
- No real payment gateway is integrated.
- Cart and inventory information are stored in the browser's localStorage.
- Updated stock is preserved after refreshing the same browser.
- Data is not synchronized between different users, browsers, or devices.

## 8. Repository

GitHub: https://github.com/asad2007th/BiteBox

## 9. Author

**Asad Ali**

BS Cyber Security  
FAST-NUCES, Islamabad

CS4032 – Web Programming  
Fall 2026