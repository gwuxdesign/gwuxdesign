(function () {
  const container = document.getElementById("post-content");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");

  if (!slug) {
    container.innerHTML = "<p>No post specified.</p>";
    return;
  }

  fetch("/assets/data/posts.json")
    .then((response) => response.json())
    .then((posts) => {
      const post = posts.find((p) => p.slug === slug);

      if (!post) {
        container.innerHTML = "<p>Post not found.</p>";
        return;
      }

      const formattedDate = formatDate(post.date);

      const imageMarkup = post.image
        ? `<img class="post-hero-image" src="${post.image}" alt="" />`
        : "";

      container.dataset.postSlug = post.slug;
      container.innerHTML = `
        ${imageMarkup}
        <h1>${post.title}</h1>
        <p class="post-date">${formattedDate}</p>
        <div class="post-body">${marked.parse(post.content)}</div>
      `;

      document.title = `${post.title} | GW UX Design`;
    })
    .catch((error) => {
      container.innerHTML = "<p>Unable to load this post right now.</p>";
      console.error("Failed to load post:", error);
    });
})();
