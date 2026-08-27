(function () {
  const container = document.getElementById("projects-list");
  if (!container) return;

  init();

  async function init() {
    try {
      const projects = await fetchJSON("/assets/data/projects.json");

      projects
        .sort((a, b) => b.year - a.year)
        .forEach((project) => {
          const card = document.createElement("article");
          card.className = "project-card";
          card.dataset.projectId = project.id;

          const imageMarkup = project.image
            ? `<img class="project-card-image" src="${project.image}" alt="" loading="lazy" />`
            : "";

          card.innerHTML = `
            ${imageMarkup}
            <div class="project-card-body">
              <h2>${escapeHtml(project.title)}</h2>
              <p>${escapeHtml(project.description)}</p>
              <p class="project-tags">${escapeHtml(project.tags.join(", "))}</p>
              <a href="${project.link}" target="_blank" rel="noopener noreferrer">View project</a>
            </div>
          `;

          container.appendChild(card);
        });
    } catch (error) {
      container.innerHTML = "<p>Unable to load projects right now.</p>";
      console.error("Failed to load projects:", error);
    }
  }
})();
