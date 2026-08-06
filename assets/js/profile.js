(function () {
  const container = document.getElementById("skills-list");
  if (!container) return;

  fetch("/assets/data/skills.json")
    .then((response) => response.json())
    .then((skills) => {
      skills.forEach((item) => {
        const row = document.createElement("li");
        row.className = "skill-bar";
        row.dataset.skill = item.skill;

        row.innerHTML = `
          <span class="skill-label">${item.skill}</span>
          <span class="skill-track">
            <span class="skill-fill" style="width: ${item.level}%"></span>
          </span>
        `;

        container.appendChild(row);
      });
    })
    .catch((error) => {
      container.innerHTML = "<p>Unable to load skills right now.</p>";
      console.error("Failed to load skills:", error);
    });
})();