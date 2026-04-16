async function loadData() {
    const response = await fetch("data/medewerkers.json");
    const data = await response.json();

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const m = data.find(x => x.id === id);
    if (!m) return;

    buildPage(m);
}

function buildPage(m) {
    document.querySelector("#naam").textContent = m.naam;
    document.querySelector("#rang").textContent = m.rang;
    document.querySelector("#roepnummer").textContent = m.roepnummer;
    document.querySelector("#status").textContent = m.status?.actief ? "Actief" : "Inactief";
    document.querySelector("#laatsteUpdate").textContent = "-";

    const tbody = document.querySelector("#trainingTable tbody");
    tbody.innerHTML = "";

    for (const [naam, t] of Object.entries(m.trainingen || {})) {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${naam}</td>
            <td>${t.theorie || "-"}</td>
            <td>${t.praktijk || "-"}</td>
            <td>-</td>
        `;
        tbody.appendChild(tr);
    }
}

loadData();
