const API_URL = "https://momo-backend-eu5x.onrender.com";
// const API_URL = "http://localhost:4000";

/*
================== API CALLS =========================
*/

// Get Statistics
const getStatistics = async () => {
  try {
    const response = await fetch(`${API_URL}/statistics`);

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
    const params = new URLSearchParams({ type, take, page });

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
  } catch (error) {
    console.error("Error fetching transactions:", error);
  }
};

// Simple variables for pagination
let currentPage = 1;

let totalPages = 1;

// Filter by type
function filterByType(type) {
  currentPage = 1; // Reset to first page when filtering

  getTransactions({ type, take: 10, page: currentPage });
}

// Pagination functions
function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    const type = document.getElementById("typeSelect").value;
    getTransactions({ type, take: 10, page: currentPage });
  }
}

function nextPage() {
  if (currentPage + 1 > totalPages) {
    return alert("You have reached the end of this data list");
  }

  currentPage++;
  const type = document.getElementById("typeSelect").value;
  getTransactions({ type, take: 10, page: currentPage });
}

getStatistics();
getTransactions({ take: 10, page: 1 });
