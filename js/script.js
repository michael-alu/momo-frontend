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

searchInput?.addEventListener("keyup", function () {
  const query = this.value.toLowerCase();
  document.querySelectorAll(".card").forEach(card => {
    const content = card.textContent.toLowerCase();
    card.style.display = content.includes(query) ? "block" : "none";
  });
});

// Sidebar collapse toggle
const sidebar = document.querySelector(".sidebar");

const toggleSidebar = () => {
  if (window.innerWidth <= 768) {
    sidebar.style.width = "60px";
    document.querySelectorAll(".sidebar ul li a").forEach(link => {
      link.style.fontSize = "0";
      link.querySelector("i").style.fontSize = "20px";
    });
    document.querySelector(".main").style.marginLeft = "60px";
  } else {
    sidebar.style.width = "240px";
    document.querySelectorAll(".sidebar ul li a").forEach(link => {
      link.style.fontSize = "";
      link.querySelector("i").style.fontSize = "";
    });
    document.querySelector(".main").style.marginLeft = "240px";
  }
};

window.addEventListener("resize", toggleSidebar);

toggleSidebar();
