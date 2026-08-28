(function () {
  const container = document.getElementById("skills-list");
  if (!container) return;

  init();

  async function init() {
    try {
      const skills = await fetchJSON("/assets/data/skills.json");

      skills.forEach((item) => {
        const row = document.createElement("li");
        row.className = "skill-bar";
        row.dataset.skill = item.skill;

        row.innerHTML = `
          <span class="skill-track">
            <span class="skill-fill" style="width: ${item.level}%">
              <span class="skill-label">${escapeHtml(item.skill)}</span>
            </span>
          </span>
        `;

        container.appendChild(row);
      });
    } catch (error) {
      container.innerHTML = "<p>Unable to load skills right now.</p>";
      console.error("Failed to load skills:", error);
    }
  }
})();

(function () {
  const container = document.getElementById("software-groups");
  if (!container) return;

  init();

  async function init() {
    try {
      const categories = await fetchJSON("/assets/data/software.json");

      categories.forEach((category) => {
        const group = document.createElement("div");
        group.className = "software-group";

        const title = document.createElement("h3");
        title.className = "software-group-title";
        title.textContent = category.category;
        group.appendChild(title);

        const tags = document.createElement("ul");
        tags.className = "software-tags";

        category.tools.forEach((tool) => {
          const tag = document.createElement("li");
          tag.className = "software-tag";
          tag.textContent = tool;
          tags.appendChild(tag);
        });

        group.appendChild(tags);
        container.appendChild(group);
      });
    } catch (error) {
      container.innerHTML = "<p>Unable to load software list right now.</p>";
      console.error("Failed to load software list:", error);
    }
  }
})();
