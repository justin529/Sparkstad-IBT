async function loadMedewerker() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const response = await fetch("data/medewerkers.json");
    const data = await response.json();

    const medewerker = data.find(m => m.discordId === id);
    if (!medewerker) {
        document.body.innerHTML = "<h2>Medewerker niet gevonden</h2>";
        return;
    }

    document.getElementById("naam").textContent = medewerker.naam;
    document.getElementById("roepnummer").textContent = medewerker.roepnummer;
    document.getElementById("rang").textContent = medewerker.rang;
    document.getElementById("status").textContent = medewerker.status;
    document.getElementById("laatsteUpdate").textContent =
        new Date(medewerker.laatsteUpdate).toLocaleString();

    const tbody = document.querySelector("#trainingTable tbody");
    tbody.innerHTML = "";

    for (const [trainingNaam, training] of Object.entries(medewerker.trainingen)) {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${trainingNaam}</td>
            <td class="cell-${training.theorie}">${training.theorie}</td>
            <td class="cell-${training.praktijk}">${training.praktijk}</td>
            <td>${new Date(training.laatsteUpdate).toLocaleDateString()}</td>
        `;

        tbody.appendChild(tr);
    }
}

loadMedewerker();
