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

        // status omzetten naar tekst
        const statusText = medewerker.status?.actief ? "Actief" : "Inactief";

        // trainingen tellen
        const geslaagd = countStatus(medewerker, "geslaagd");
        const open = countStatus(medewerker, "open");
        const gezakt = countStatus(medewerker, "gezakt");

        tr.innerHTML = `
            <td>${medewerker.id}</td>
            <td>${medewerker.rang}</td>
            <td>${medewerker.naam}</td>
            <td class="status-${statusText.toLowerCase()}">${statusText}</td>
            <td>${geslaagd}</td>
            <td>${open}</td>
            <td>${gezakt}</td>
            <td>-</td>
        `;

        tr.onclick = () => {
            window.location.href = `medewerker.html?id=${medewerker.id}`;
        };

        tbody.appendChild(tr);
    });
}

function countStatus(medewerker, type) {
    let count = 0;
    for (const training of Object.values(medewerker.trainingen || {})) {
        if (training.praktijk === type || training.theorie === type) {
            count++;
        }
    }
    return count;
}

loadData();
