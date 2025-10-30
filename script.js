const API_KEY = "989f117a67690fd7ecb5eb1545919e2d";
const BASE_URL = "https://gnews.io/api/v4/search";

const newsContainer = document.getElementById("newsContainer");
const searchInput = document.getElementById("searchInput");
const loadMoreBtn = document.getElementById("loadMoreBtn");
const statusMessage = document.getElementById("statusMessage");
const themeToggle = document.getElementById("themeToggle");
const categories = document.querySelectorAll(".category");

let query = "latest";
let category = "all";
let page = 1;

// fetch newa 
async function fetchNews() {
  statusMessage.textContent = "Loading...";
  try {
    const url = `${BASE_URL}?q=${query || category}&lang=en&max=9&page=${page}&token=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data.articles || data.articles.length === 0) {
      if (page === 1) statusMessage.textContent = "No articles found.";
      return;
    }

    renderNews(data.articles);
    statusMessage.textContent = "";
  } catch (err) {
    console.error(err);
    statusMessage.textContent = "Error fetching news.";
  }
}

function renderNews(articles) {
  articles.forEach(article => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <img src="${article.image || 'https://via.placeholder.com/400x200'}" alt="${article.title}">
      <div class="card-content">
        <h3>${article.title}</h3>
        <p>${article.description || "No description available."}</p>
        <a href="${article.url}" target="_blank">Read More →</a>
      </div>
    `;
    newsContainer.appendChild(card);
  });
}

// reset
function resetNews() {
  newsContainer.innerHTML = "";
  page = 1;
  fetchNews();
}

// search any article 
searchInput.addEventListener("input", e => {
  query = e.target.value || "latest";
  resetNews();
});

//choosing category
categories.forEach(btn => {
  btn.addEventListener("click", () => {
    categories.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    category = btn.dataset.category;
    query = category;
    resetNews();
  });
});

//load more butt0n
loadMoreBtn.addEventListener("click", () => {
  page++;
  fetchNews();
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeToggle.textContent = isDark ? "☀️ Light" : "🌙 Dark";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeToggle.textContent = "☀️ Light";
}

fetchNews();
