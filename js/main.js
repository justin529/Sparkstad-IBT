async function loadData() {
    const response = await fetch("data/medewerkers.json");
    let data = await response.json();

    data.sort((a, b) => (a.roepnummer || "").localeCompare(b.roepnummer || ""));

    buildTable(data);
}

function buildTable(data) {
    const tbody = document.querySelector("#medewerkersTable tbody");
    tbody.innerHTML = "";

    data.forEach(m => {
        const statusText = m.status?.actief ? "Actief" : "Inactief";

        const geslaagd = countStatus(m, "geslaagd");
        const open = countStatus(m, "open");
        const gezakt = countStatus(m, "gezakt");

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${m.roepnummer}</td>
            <td>${m.rang}</td>
            <td>${m.naam}</td>
            <td class="status-${statusText.toLowerCase()}">${statusText}</td>
            <td>${geslaagd}</td>
            <td>${open}</td>
            <td>${gezakt}</td>
            <td>-</td>
        `;

        tr.onclick = () => {
            window.location.href = `medewerker.html?id=${m.id}`;
        };

        tbody.appendChild(tr);
    });
}

function countStatus(m, type) {
    return Object.values(m.trainingen || {}).filter(t =>
        t.praktijk === type || t.theorie === type
    ).length;
}

loadData();
