function getRoepnummerFromName(naam) {
    const match = naam && naam.toString().match(/21-\d{2}/);
    return match ? match[0] : "";
}

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

    const roepnummer = medewerker.roepnummer || getRoepnummerFromName(medewerker.naam);

    document.getElementById("naam").textContent = medewerker.naam;
    document.getElementById("roepnummer").textContent = roepnummer;
    document.getElementById("rang").textContent = medewerker.rang;
    document.getElementById("status").textContent = medewerker.status;
    document.getElementById("laatsteUpdate").textContent =
        new Date(medewerker.laatsteUpdate).toLocaleString();

    const tbody = document.querySelector("#trainingTable tbody");
    tbody.innerHTML = "";

    for (const [trainingNaam, training] of Object.entries(medewerker.trainingen)) {
        const tr = document.createElement("tr");

        const theorieStatus = (training.theorie || "").toString().toLowerCase();
        const praktijkStatus = (training.praktijk || "").toString().toLowerCase();
        const theorieClass = theorieStatus === "geslaagd" ? "cell-geslaagd" : `cell-${theorieStatus}`;
        const praktijkClass = praktijkStatus === "geslaagd" ? "cell-geslaagd" : `cell-${praktijkStatus}`;
        const isFullyGeslaagd = theorieStatus === "geslaagd" && praktijkStatus === "geslaagd";
        const theorieText = isFullyGeslaagd ? "geslaagd" : training.theorie;
        const praktijkText = isFullyGeslaagd ? "geslaagd" : training.praktijk;

        tr.innerHTML = `
            <td>${trainingNaam}</td>
            <td class="${theorieClass}">${theorieText}</td>
            <td class="${praktijkClass}">${praktijkText}</td>
            <td>${new Date(training.laatsteUpdate).toLocaleDateString()}</td>
        `;

        tbody.appendChild(tr);
    }
}

loadMedewerker();
