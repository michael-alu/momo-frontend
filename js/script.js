// Highlight active sidebar link
const menuLinks = document.querySelectorAll(".sidebar ul li a");
menuLinks.forEach(link => {
    link.addEventListener("click", () => {
        menuLinks.forEach(l => l.classList.remove("active"));
        link.classList.add("active");
    });
});

// Search filter for cards (simple demo for now)
const searchInput = document.getElementById("search");
searchInput.addEventListener("keyup", function () {
    const query = this.value.toLowerCase();
    document.querySelectorAll(".card").forEach(card => {
        const content = card.textContent.toLowerCase();
        card.style.display = content.includes(query) ? "block" : "none";
    });
});

// Notification popup (simulated)
document.querySelector(".fa-bell").addEventListener("click", () => {
    alert("You have 3 new transactions today!");
});

// Chart.js example (replace with real data later)
const chartData = {
    labels: ["Incoming", "Payments", "Transfers", "Deposits", "Bundles"],
    datasets: [{
        label: 'Transaction Count',
        data: [450, 320, 180, 140, 220],
        backgroundColor: ['#075877', '#ffd600', '#f77f00', '#28a745', '#6f42c1'],
        borderRadius: 6
    }]
};

const ctx = document.getElementById("myChart").getContext("2d");
new Chart(ctx, {
    type: 'bar',
    data: chartData,
    options: {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: { display: true, text: 'Transactions by Type', font: { size: 16 } }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 50
                }
            }
        }
    }
});

// Sidebar collapse toggle 
const sidebar = document.querySelector('.sidebar');
const toggleSidebar = () => {
    if (window.innerWidth <= 768) {
        sidebar.style.width = '60px'; 
        document.querySelectorAll('.sidebar ul li a').forEach(link => {
            link.style.fontSize = '0'; 
            link.querySelector('i').style.fontSize = '20px'; 
        });
        document.querySelector('.main').style.marginLeft = '60px'; 
    } else {
        sidebar.style.width = '240px'; 
        document.querySelectorAll('.sidebar ul li a').forEach(link => {
            link.style.fontSize = '';
            link.querySelector('i').style.fontSize = ''; 
        });
        document.querySelector('.main').style.marginLeft = '240px'; 
    }
};

window.addEventListener('resize', toggleSidebar);

toggleSidebar();