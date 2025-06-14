# MTN MoMo Dashboard

A dashboard that shows MTN Mobile Money transactions. Made for our Summative Assignment.

## What This Project Does

This dashboard helps you see:

- How many transactions happened
- How much money moved
- What types of transactions happened
- Charts showing transaction trends

## How to Run

1. Download all the files
2. Open `index.html` in your browser
3. That's it! The dashboard will load

## Main Features

### 1. Transaction Types

You can look at different types of transactions:

- Money coming in
- Payments to code holders
- Mobile money transfers
- Bank deposits
- Airtime payments
- Cash power payments
- Third-party transactions
- Money taken out from agents
- Bank transfers
- Internet and voice bundles

### 2. Dashboard Parts

- Three cards at the top showing total numbers
- A table showing all transactions
- A chart showing transaction trends
- A sidebar to switch between transaction types

### 3. How to Use

- Click on any transaction type in the sidebar to see only those transactions
- Use the dropdown to filter transactions
- Use the Previous/Next buttons to see more transactions
- The chart will update to show the trends for the selected type

## Files in the Project

- `index.html` - The main page
- `css/style.css` - All the styling
- `js/api.js` - Code that talks to the server
- `js/script.js` - Other JavaScript code

## What We Used to Build This

- HTML for the structure
- CSS for making it look nice
- JavaScript for making it work
- Chart.js for the charts
- Font Awesome for the icons

## How the Code Works

1. When you open the page:

   - It loads all transactions
   - Shows the total numbers
   - Makes a chart

2. When you click a transaction type:

   - It updates the URL
   - Shows only those transactions
   - Updates the chart
   - Updates the total numbers

3. The chart shows:
   - For a single type: just that type's data
   - For all types: incoming vs outgoing money
