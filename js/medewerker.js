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
    document.querySelector("#naam").textContent = m.naam;
    document.querySelector("#rang").textContent = m.rang;
    document.querySelector("#status").textContent = m.status?.actief ? "Actief" : "Inactief";

    const tbody = document.querySelector("#trainingen tbody");
    tbody.innerHTML = "";

    for (const [naam, training] of Object.entries(m.trainingen || {})) {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${naam}</td>
            <td>${training.theorie || "-"}</td>
            <td>${training.praktijk || "-"}</td>
        `;

        tbody.appendChild(tr);
    }
}

loadData();
