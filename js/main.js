async function loadData() {
    const response = await fetch("data/medewerkers.json");
    const data = await response.json();
    buildTable(data);
}

function buildTable(data) {
    const tbody = document.querySelector("#medewerkersTable tbody");
    tbody.innerHTML = "";

    data.forEach(medewerker => {
        const tr = document.createElement("tr");

        const geslaagd = countStatus(medewerker, "geslaagd");
        const open = countStatus(medewerker, "open");
        const gezakt = countStatus(medewerker, "gezakt");

        tr.innerHTML = `
            <td>${medewerker.roepnummer}</td>
            <td>${medewerker.rang}</td>
            <td>${medewerker.naam}</td>
            <td class="status-${medewerker.status.toLowerCase()}">${medewerker.status}</td>
            <td class="cell-geslaagd">${geslaagd}</td>
            <td class="cell-open">${open}</td>
            <td class="cell-gezakt">${gezakt}</td>
            <td>${new Date(medewerker.laatsteUpdate).toLocaleDateString()}</td>
        `;

        tr.onclick = () => {
            window.location.href = `medewerker.html?id=${medewerker.discordId}`;
        };

        tbody.appendChild(tr);
    });
}

function countStatus(medewerker, type) {
    let count = 0;
    for (const training of Object.values(medewerker.trainingen)) {
        if (training.praktijk === type || training.theorie === type) {
            count++;
        }
    }
    return count;
}

loadData();
