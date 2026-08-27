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
  const table = document.getElementById("software-table");
  if (!table) return;

  init();

  async function init() {
    try {
      const categories = await fetchJSON("/assets/data/software.json");

      categories.forEach((category) => {
        category.tools.forEach((tool, index) => {
          const row = document.createElement("tr");

          if (index === 0) {
            const th = document.createElement("th");
            th.rowSpan = category.tools.length;
            th.textContent = category.category;
            row.appendChild(th);
          }

          const td = document.createElement("td");
          td.textContent = tool;
          row.appendChild(td);

          table.appendChild(row);
        });
      });
    } catch (error) {
      table.innerHTML = "<tr><td>Unable to load software list right now.</td></tr>";
      console.error("Failed to load software list:", error);
    }
  }
})();
