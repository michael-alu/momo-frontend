const API_URL = "https://momo-backend-eu5x.onrender.com";
// const API_URL = "http://localhost:4000";

// Global transaction type
let currentTransactionType = "";

// Function to update URL with transaction type
function updateURL(type) {
  const url = new URL(window.location.href);
  if (type) {
    url.searchParams.set("type", type);
  } else {
    url.searchParams.delete("type");
  }
  window.history.pushState({}, "", url);
}

// Function to get transaction type from URL
function getTypeFromURL() {
  const url = new URL(window.location.href);
  return url.searchParams.get("type") || "";
}

/*
================== API CALLS =========================
*/

// Get Statistics
const getStatistics = async () => {
  try {
    const params = new URLSearchParams({ type: currentTransactionType });
    const response = await fetch(`${API_URL}/statistics?${params.toString()}`);

    const data = await response.json();

    if (!data.ok) {
      return alert(data.message);
    }

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

// Get Transactions
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
          transaction => `
                        <tr>
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

    totalPages = data?.data?.totalPages;

    // Update page info
    document.getElementById("pageInfo").textContent = `Page ${page}`;

    document.getElementById(
      "pageShowcase"
    ).textContent = `Showing Pages ${page} of ${
      data?.data?.totalPages || page
    }`;

    // Update dropdown to match current type
    const typeSelect = document.getElementById("typeSelect");
    if (typeSelect) {
      typeSelect.value = transactionType;
    }
  } catch (error) {
    console.error("Error fetching transactions:", error);
  }
};

// Get Analysis
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
      // Single type analysis
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
      // Dashboard view - show incoming vs outgoing
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

    // Create the chart with improved options
    new Chart("myChart", {
      type: "line",
      data: {
        labels,
        datasets,
      },
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

// Simple variables for pagination
let currentPage = 1;
let totalPages = 1;

// Filter by type
function filterByType(type) {
  currentTransactionType = type; // Update global type
  currentPage = 1; // Reset to first page when filtering
  getTransactions({ type, take: 10, page: currentPage });
  getStatistics(); // Update statistics with new type
}

// Pagination functions
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

// Function to handle sidebar clicks
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

// Initialize with URL parameter
document.addEventListener("DOMContentLoaded", () => {
  const type = getTypeFromURL();
  if (type) {
    setTransactionType(type);
  } else {
    setTransactionType(""); // Dashboard view
  }
});

getStatistics();
getTransactions({ take: 10, page: 1 });
getAnalysis({ days: 30 });
