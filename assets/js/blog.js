(function () {
  const POSTS_PER_PAGE = 5;
  const listContainer = document.getElementById("posts-list");
  const paginationContainer = document.getElementById("posts-pagination");
  const sortSelect = document.getElementById("posts-sort");
  if (!listContainer) return;

  const params = new URLSearchParams(window.location.search);
  let sortDirection = params.get("sort") === "asc" ? "asc" : "desc";
  const currentPage = Math.max(1, parseInt(params.get("page"), 10) || 1);

  fetch("/assets/data/posts.json")
    .then((response) => response.json())
    .then((posts) => {
      if (sortSelect) {
        sortSelect.value = sortDirection;
      }

      renderForCurrentState(posts);

      if (sortSelect) {
        sortSelect.addEventListener("change", () => {
          sortDirection = sortSelect.value;
          updateUrl(1, sortDirection);
          renderForCurrentState(posts);
        });
      }
    })
    .catch((error) => {
      listContainer.innerHTML = "<p>Unable to load posts right now.</p>";
      console.error("Failed to load posts:", error);
    });

  function renderForCurrentState(posts) {
    const sorted = posts
      .slice()
      .sort((a, b) =>
        sortDirection === "desc"
          ? new Date(b.date) - new Date(a.date)
          : new Date(a.date) - new Date(b.date),
      );

    const totalPages = Math.max(1, Math.ceil(sorted.length / POSTS_PER_PAGE));
    const page = Math.min(currentPage, totalPages);
    const start = (page - 1) * POSTS_PER_PAGE;

    listContainer.innerHTML = "";
    renderPosts(sorted.slice(start, start + POSTS_PER_PAGE));
    renderPagination(page, totalPages, sortDirection);
  }

  function renderPosts(posts) {
    if (posts.length === 0) {
      listContainer.innerHTML = "<p>No posts yet.</p>";
      return;
    }

    posts.forEach((post) => {
      const article = document.createElement("article");
      article.className = "post-card";
      article.dataset.postSlug = post.slug;

      const formattedDate = formatDate(post.date);

      const imageMarkup = post.image
        ? `<img class="post-card-image" src="${post.image}" alt="" loading="lazy" />`
        : "";

      const backHref = encodeURIComponent(
        `${window.location.pathname}${window.location.search}`,
      );

      article.innerHTML = `
      ${imageMarkup}
      <div class="post-card-body">
        <h2><a href="/pages/blog/post.html?slug=${encodeURIComponent(post.slug)}&from=${backHref}">${post.title}</a></h2>
        <p class="post-date">${formattedDate}</p>
        <p>${post.summary}</p>
      </div>
    `;

      listContainer.appendChild(article);
    });
  }

  function updateUrl(page, sort) {
    const url = new URL(window.location);
    url.searchParams.set("page", page);
    url.searchParams.set("sort", sort);
    window.history.replaceState({}, "", url);
  }

  function renderPagination(current, total, sort) {
    if (!paginationContainer || total <= 1) return;

    paginationContainer.innerHTML = "";

    if (current > 1) {
      paginationContainer.appendChild(
        pageLink(current - 1, "‹ Previous", sort),
      );
    }

    for (let page = 1; page <= total; page++) {
      if (page === current) {
        const span = document.createElement("span");
        span.className = "pagination-current";
        span.textContent = page;
        span.setAttribute("aria-current", "page");
        paginationContainer.appendChild(span);
      } else {
        paginationContainer.appendChild(pageLink(page, page, sort));
      }
    }

    if (current < total) {
      paginationContainer.appendChild(pageLink(current + 1, "Next ›", sort));
    }
  }

  function pageLink(page, label, sort) {
    const link = document.createElement("a");
    link.href = `?page=${page}&sort=${sort}`;
    link.textContent = label;
    link.className = "pagination-link";
    return link;
  }
})();
