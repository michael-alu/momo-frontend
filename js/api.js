/**
 * MTN MOMO Frontend API Integration
 *
 * This module handles all API interactions for the MTN MOMO dashboard.
 * It manages transaction data fetching, statistics, and analysis visualization.
 *
 * @author MTN MOMO Team (Group 7) - Enterprise Web Development May 2025 
 * @version 1.0.0
 */

// API Configuration
const API_URL = "https://momo-backend-eu5x.onrender.com";
// const API_URL = "http://localhost:4000"; // Development environment

/**
 * Global state management
 * @type {string} currentTransactionType - Currently selected transaction type filter
 */
let currentTransactionType = "";

/**
 * Updates the URL with the current transaction type for bookmarking and sharing
 * @param {string} type - Transaction type to set in URL
 */
function updateURL(type) {
  const url = new URL(window.location.href);
  if (type) {
    url.searchParams.set("type", type);
  } else {
    url.searchParams.delete("type");
  }
  window.history.pushState({}, "", url);
}

/**
 * Retrieves transaction type from URL parameters
 * @returns {string} Transaction type from URL or empty string
 */
function getTypeFromURL() {
  const url = new URL(window.location.href);
  return url.searchParams.get("type") || "";
}

/**
 * Fetches and updates dashboard statistics
 * Updates total count, total amount, and average transaction amount
 */
const getStatistics = async () => {
  try {
    const params = new URLSearchParams({ type: currentTransactionType });

    const response = await fetch(`${API_URL}/statistics?${params.toString()}`);

    const data = await response.json();

    if (!data.ok) {
      return alert(data.message);
    }

    // Update UI elements with statistics
    const totalCountElement = document.querySelector(".total-count");
    const totalAmountElement = document.querySelector(".total-amount");
    const averageAmountElement = document.querySelector(".average-amount");

    totalCountElement.textContent = shortNumber(data?.data?.totalCount || 0);
    totalAmountElement.textContent = shortNumber(data?.data?.totalAmount || 0);
    averageAmountElement.textContent = shortNumber(
      data?.data?.averageAmount || 0
    );
  } catch (error) {
    console.error("Error fetching statistics:", error);
  }
};

/**
 * Fetches and displays transaction data with pagination
 * @param {Object} options - Query parameters
 * @param {string} options.type - Transaction type filter
 * @param {number} options.take - Number of records per page
 * @param {number} options.page - Current page number
 */
const getTransactions = async ({ type = "", take = 10, page = 1 }) => {
  try {
    // Use the global type if no specific type is provided
    const transactionType = type || currentTransactionType;
    const params = new URLSearchParams({ type: transactionType, take, page });

    const response = await fetch(
      `${API_URL}/transactions?${params.toString()}`
    );

    const data = await response.json();

    if (!data.ok) {
      return alert(data.message);
    }

    const table = document.querySelector(".transaction-table-body");

    if (!table) {
      return;
    }

    // Clear table before adding new data
    table.innerHTML = "";

    const transactions = data?.data?.list || [];

    table.insertAdjacentHTML(
      "beforeend",
      transactions
        .map(
          (transaction, index) => `
            <tr onclick="showTransactionDetails(${index})" data-transaction='${JSON.stringify(
            transaction
          )}'>
              <td>${new Date(
                transaction?.sms_date || new Date().getTime()
              ).toDateString()}</td>
              <td>${transaction?.sender || "-"}</td>
              <td>${transaction?.receiver || "-"}</td>
              <td>${toCurrency(transaction?.amount || 0)}</td>
              <td>${toCurrency(transaction?.balance || 0)}</td>
            </tr>
          `
        )
        .join("")
    );

    // Update pagination state
    totalPages = data?.data?.totalPages;
    document.getElementById("pageInfo").textContent = `Page ${page}`;

    document.getElementById(
      "pageShowcase"
    ).textContent = `Showing Pages ${page} of ${
      data?.data?.totalPages || page
    }`;

    // Sync dropdown with current type
    const typeSelect = document.getElementById("typeSelect");
    if (typeSelect) {
      typeSelect.value = transactionType;
    }
  } catch (error) {
    console.error("Error fetching transactions:", error);
  }
};

/**
 * Fetches and visualizes transaction analysis data
 * Creates a line chart showing transaction trends
 * @param {Object} options - Query parameters
 * @param {string} options.type - Transaction type filter
 * @param {number} options.days - Number of days to analyze
 */
const getAnalysis = async ({ type = "", days = 30 }) => {
  try {
    // Use the global type if no specific type is provided
    const transactionType = type || currentTransactionType;
    const params = new URLSearchParams({ type: transactionType, days });

    const response = await fetch(`${API_URL}/analysis?${params.toString()}`);

    const data = await response.json();

    if (!data.ok) {
      return alert(data.message);
    }

    // Clear any existing chart
    const existingChart = Chart.getChart("myChart");
    if (existingChart) {
      existingChart.destroy();
    }

    let datasets = [];
    let labels = [];

    // Handle data based on whether we have a specific type or not
    if (transactionType) {
      // Single transaction type analysis
      labels = data?.data?.data?.map(info => info?.date) || [];
      datasets = [
        {
          label: `${transactionType} Volume`,
          backgroundColor: "rgb(20, 74, 108)",
          data: data?.data?.data?.map(info => info?.amount) || [],
          fill: true,
          tension: 0.3,
        },
      ];
    } else {
      // Dashboard view - compare incoming vs outgoing
      labels = data?.data?.data?.incoming?.map(info => info?.date) || [];
      datasets = [
        {
          label: "Incoming Amount",
          backgroundColor: "rgb(20, 74, 108)",
          data: data?.data?.data?.incoming?.map(info => info?.amount) || [],
          fill: true,
          tension: 0.3,
        },
        {
          label: "Outgoing Amount",
          backgroundColor: "rgb(251, 206, 0)",
          data: data?.data?.data?.outgoing?.map(info => info?.amount) || [],
          fill: true,
          tension: 0.3,
        },
      ];
    }

    // Initialize chart with configuration
    new Chart("myChart", {
      type: "line",
      data: { labels, datasets },
      options: {
        responsive: true,
        datasets: {
          line: {
            tension: 0.3,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching chart data:", error);
    alert("Error loading chart data. Please try again.");
  }
};

/**
 * Pagination state management
 */
let currentPage = 1;
let totalPages = 1;

/**
 * Filters transactions by type and resets pagination
 * @param {string} type - Transaction type to filter by
 */
function filterByType(type) {
  currentTransactionType = type; // Update global type
  currentPage = 1; // Reset to first page when filtering
  getTransactions({ type, take: 10, page: currentPage });
  getStatistics();
}

/**
 * Handles pagination navigation
 */
function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    getTransactions({ take: 10, page: currentPage });
  }
}

function nextPage() {
  if (currentPage + 1 > totalPages) {
    return alert("You have reached the end of this data list");
  }

  currentPage++;
  getTransactions({ take: 10, page: currentPage });
}

/**
 * Sets the current transaction type and updates all related views
 * @param {string} type - Transaction type to set
 */
function setTransactionType(type) {
  currentTransactionType = type;
  currentPage = 1;

  // Update URL
  updateURL(type);

  // Update UI
  getTransactions({ type, take: 10, page: 1 });
  getStatistics();
  getAnalysis({ type, days: 30 });

  if (type) {
    // Update active state in sidebar
    document.querySelectorAll(".sidebar-link").forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("onclick").includes(type)) {
        link.classList.add("active");
      }
    });
  } else {
    document.querySelectorAll(".sidebar-link").forEach(link => {
      link.classList.remove("active");
    });

    document.querySelector(".sidebar-link").classList.add("active");
  }
}

/**
 * Modal functionality for transaction details
 * @param {number} index - Index of the transaction in the current view
 */
function showTransactionDetails(index) {
  const row = document.querySelector(
    `.transaction-table-body tr:nth-child(${index + 1})`
  );
  const transaction = JSON.parse(row.getAttribute("data-transaction"));

  // Fill modal with transaction details
  document.getElementById("modalDate").textContent = new Date(
    transaction?.sms_date || new Date().getTime()
  ).toDateString();
  document.getElementById("modalSender").textContent =
    transaction?.sender || "-";
  document.getElementById("modalReceiver").textContent =
    transaction?.receiver || "-";
  document.getElementById("modalAmount").textContent = toCurrency(
    transaction?.amount || 0
  );
  document.getElementById("modalBalance").textContent = toCurrency(
    transaction?.balance || 0
  );

  // Show modal
  document.getElementById("transactionModal").style.display = "block";
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  const type = getTypeFromURL();
  setTransactionType(type || ""); // Initialize with URL parameter or default to dashboard
});

document.querySelector(".close-modal").onclick = function () {
  document.getElementById("transactionModal").style.display = "none";
};

// Initial data load
getStatistics();
getTransactions({ take: 10, page: 1 });
getAnalysis({ days: 30 });

// Modal functions
function showTransactionDetails(index) {
  const row = document.querySelector(
    `.transaction-table-body tr:nth-child(${index + 1})`
  );
  const transaction = JSON.parse(row.getAttribute("data-transaction"));

  // Fill modal with transaction details
  document.getElementById("modalDate").textContent = new Date(
    transaction?.sms_date || new Date().getTime()
  ).toDateString();
  document.getElementById("modalSender").textContent =
    transaction?.sender || "-";
  document.getElementById("modalReceiver").textContent =
    transaction?.receiver || "-";
  document.getElementById("modalAmount").textContent = toCurrency(
    transaction?.amount || 0
  );
  document.getElementById("modalBalance").textContent = toCurrency(
    transaction?.balance || 0
  );

  // Show modal
  document.getElementById("transactionModal").style.display = "block";
}

// Close modal when clicking the X
document.querySelector(".close-modal").onclick = function () {
  document.getElementById("transactionModal").style.display = "none";
};
