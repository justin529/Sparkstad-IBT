async function loadData() {
    const response = await fetch("data/medewerkers.json");
    const data = await response.json();

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const medewerker = data.find(m => m.id === id);

    if (!medewerker) {
        document.querySelector("#naam").textContent = "Onbekend";
        return;
    }

    buildPage(medewerker);
}

function buildPage(m) {
    // Basisgegevens
    document.querySelector("#naam").textContent = m.naam;
    document.querySelector("#rang").textContent = m.rang;

    // Roepnummer bestaat niet → toon ID
    document.querySelector("#roepnummer").textContent = m.id;

    // Status omzetten
    const statusText = m.status?.actief ? "Actief" : "Inactief";
    document.querySelector("#status").textContent = statusText;

    // Laatste update bestaat niet → placeholder
    document.querySelector("#laatsteUpdate").textContent = "-";

    // Trainingen tabel
    const tbody = document.querySelector("#trainingTable tbody");
    tbody.innerHTML = "";

    for (const [naam, training] of Object.entries(m.trainingen || {})) {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${naam}</td>
            <td>${training.theorie || "-"}</td>
            <td>${training.praktijk || "-"}</td>
            <td>-</td>
        `;

        tbody.appendChild(tr);
    }
}

loadData();
