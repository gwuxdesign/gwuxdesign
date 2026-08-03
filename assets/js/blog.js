(function () {
  const POSTS_PER_PAGE = 5;

  const listContainer = document.getElementById("posts-list");
  const paginationContainer = document.getElementById("posts-pagination");
  if (!listContainer) return;

  const params = new URLSearchParams(window.location.search);
  const currentPage = Math.max(1, parseInt(params.get("page"), 10) || 1);

  fetch("/assets/data/posts.json")
    .then((response) => response.json())
    .then((posts) => {
      const sorted = posts.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
      const totalPages = Math.max(1, Math.ceil(sorted.length / POSTS_PER_PAGE));
      const start = (currentPage - 1) * POSTS_PER_PAGE;
      const pagePosts = sorted.slice(start, start + POSTS_PER_PAGE);

      renderPosts(pagePosts);
      renderPagination(currentPage, totalPages);
    })
    .catch((error) => {
      listContainer.innerHTML = "<p>Unable to load posts right now.</p>";
      console.error("Failed to load posts:", error);
    });

  function renderPosts(posts) {
    if (posts.length === 0) {
      listContainer.innerHTML = "<p>No posts yet.</p>";
      return;
    }

    posts.forEach((post) => {
      const article = document.createElement("article");
      article.className = "post-card";
      article.dataset.postSlug = post.slug;

      const formattedDate = new Date(post.date).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      article.innerHTML = `
        <h2><a href="/pages/blog/post.html?slug=${encodeURIComponent(post.slug)}">${post.title}</a></h2>
        <p class="post-date">${formattedDate}</p>
        <p>${post.summary}</p>
      `;

      listContainer.appendChild(article);
    });
  }

  function renderPagination(current, total) {
    if (!paginationContainer || total <= 1) return;

    paginationContainer.innerHTML = "";

    if (current > 1) {
      paginationContainer.appendChild(pageLink(current - 1, "Previous"));
    }
    if (current < total) {
      paginationContainer.appendChild(pageLink(current + 1, "Next"));
    }
  }

  function pageLink(page, label) {
    const link = document.createElement("a");
    link.href = `?page=${page}`;
    link.textContent = label;
    link.className = "pagination-link";
    return link;
  }
})();