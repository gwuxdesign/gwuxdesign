(function () {
  const container = document.getElementById("projects-list");
  if (!container) return;

  fetch("/assets/data/projects.json")
    .then((response) => response.json())
    .then((projects) => {
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
              <h2>${project.title}</h2>
              <p>${project.description}</p>
              <p class="project-tags">${project.tags.join(", ")}</p>
              <a href="${project.link}" target="_blank" rel="noopener noreferrer">View project</a>
            </div>
          `;

          container.appendChild(card);
        });
    })
    .catch((error) => {
      container.innerHTML = "<p>Unable to load projects right now.</p>";
      console.error("Failed to load projects:", error);
    });
})();
