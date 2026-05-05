async function loadData() {
    const response = await fetch("data/medewerkers.json");
    const data = await response.json();
    buildTable(data);
}

function getRoepnummerFromName(naam) {
    const match = naam && naam.toString().match(/21-\d{2}/);
    return match ? match[0] : "";
}

function extractRoepnummer(rawRoepnummer) {
    if (!rawRoepnummer) {
        return "";
    }

    const value = rawRoepnummer.toString();
    const bracketMatch = value.match(/^\[([^\]]+)\]/);
    if (bracketMatch) {
        const inside = bracketMatch[1];
        return inside.split("|")[0].trim();
    }

    const simpleMatch = value.match(/21-\d{2}/);
    return simpleMatch ? simpleMatch[0] : value.trim();
}

function extractNameFromRoepnummer(rawRoepnummer, existingName) {
    if (existingName) {
        return existingName;
    }

    const value = rawRoepnummer && rawRoepnummer.toString();
    if (!value) {
        return "";
    }

    const match = value.match(/^\[[^\]]+\]\s*(.+)$/);
    return match ? match[1].trim() : existingName || "";
}

function normalizeStatus(status) {
    if (typeof status === "string") {
        return status;
    }
    if (status && typeof status === "object") {
        if (status.actief === true || status.actief === "true") {
            return "Actief";
        }
        if (status.actief === false || status.actief === "false") {
            return "Non-actief";
        }
    }
    return "";
}

function normalizeKey(key) {
    return key ? key.toString().toLowerCase().replace(/\s+/g, " ").trim() : "";
}

function getTrainingSource(medewerker) {
    if (medewerker.trainingen && Object.keys(medewerker.trainingen).length > 0) {
        return medewerker.trainingen;
    }

    if (medewerker.dienst && medewerker[medewerker.dienst] && typeof medewerker[medewerker.dienst] === "object") {
        return medewerker[medewerker.dienst];
    }

    if (medewerker.Politie && typeof medewerker.Politie === "object") {
        return medewerker.Politie;
    }

    return {};
}

function getTrainingForColumn(medewerker, column) {
    const trainingen = getTrainingSource(medewerker);
    const normalizedColumn = normalizeKey(column);
    for (const [key, value] of Object.entries(trainingen)) {
        if (normalizeKey(key) === normalizedColumn) {
            return value;
        }
    }
    return null;
}

const TABLE_COLUMNS = [
    "roepnummer",
    "Rang",
    "Naam",
    "Discord ID",
    "Basis",
    "Vuurwapen",
    "Offroad",
    "Afhandelen verdachte",
    "pit manoeuvre basis",
    "SIV",
    "Motor",
    "Water",
    "Luchtvaart politie basis",
    "OVD",
    "Unmarked",
    "Luchtvaart politie",
    "Opco",
    "IBT",
    "Recherche",
    "Leidinggevende",
    "Mobile eenheid",
    "TPE",
    "Hoofd IBT",
    "Hulp OVJ",
    "Status",
    "Waarschuwingen",
    "Opmerkingen"
];

const TABLE_COLUMN_WIDTHS = [
    95, 211, 166, 164, 90, 90, 90, 107, 90, 90, 90, 90,
    113, 113, 113, 113, 113, 113, 113, 113, 113,
    113, 113, 113, 206, 148, 557
];

function normalizeMedewerker(rawMedewerker) {
    if (!rawMedewerker || typeof rawMedewerker !== "object") {
        return rawMedewerker;
    }

    const medewerker = { ...rawMedewerker };
    medewerker.roepnummer = extractRoepnummer(rawMedewerker.roepnummer || rawMedewerker.name || "");
    medewerker.naam = extractNameFromRoepnummer(rawMedewerker.roepnummer || "", rawMedewerker.naam || rawMedewerker.name || "");
    medewerker.status = normalizeStatus(rawMedewerker.status);
    medewerker.discordId = rawMedewerker.discordId || rawMedewerker.id || "";

    if (!medewerker.trainingen || Object.keys(medewerker.trainingen).length === 0) {
        medewerker.trainingen = getTrainingSource(rawMedewerker);
    }

    return medewerker;
}

function buildTable(data) {
    const tbody = document.querySelector("#medewerkersTable tbody");
    const thead = document.getElementById("tableHead");
    const colgroup = document.getElementById("tableColumns");

    colgroup.innerHTML = TABLE_COLUMN_WIDTHS
        .map(width => `<col style="width: ${width}px;">`)
        .join("");

    thead.innerHTML = `
        <tr>
            ${TABLE_COLUMNS.map(column => `<th>${column}</th>`).join("")}
        </tr>
    `;

    tbody.innerHTML = "";

    const medewerkers = Array.isArray(data)
        ? data.map(normalizeMedewerker)
        : [normalizeMedewerker(data)];

    medewerkers.forEach(medewerker => {
        const tr = document.createElement("tr");
        const roepnummer = medewerker.roepnummer || getRoepnummerFromName(medewerker.naam);

        const cells = TABLE_COLUMNS.map(column => {
            switch (column.toLowerCase()) {
                case "roepnummer":
                    return `<td>${roepnummer}</td>`;
                case "rang":
                    return `<td>${medewerker.rang || ""}</td>`;
                case "naam":
                    return `<td>${medewerker.naam || ""}</td>`;
                case "discord id":
                    return `<td>${medewerker.discordId || ""}</td>`;
                case "status":
                    return `<td class="status-${(medewerker.status || "").toString().toLowerCase()}">${medewerker.status || ""}</td>`;
                case "waarschuwingen":
                    return `<td>${medewerker.waarschuwingen || ""}</td>`;
                case "opmerkingen":
                    return `<td>${medewerker.opmerkingen || ""}</td>`;
                default: {
                    const training = getTrainingForColumn(medewerker, column);
                    if (!training) {
                        return "<td></td>";
                    }
                    const theorieStatus = (training.theorie || "").toString().toLowerCase();
                    const praktijkStatus = (training.praktijk || "").toString().toLowerCase();
                    const isFullyGeslaagd = theorieStatus === "geslaagd" && praktijkStatus === "geslaagd";
                    const cellClass = isFullyGeslaagd ? "cell-geslaagd" : "";
                    const text = isFullyGeslaagd ? "geslaagd" : `${training.theorie || ""}${training.theorie && training.praktijk ? " / " : ""}${training.praktijk || ""}`;
                    return `<td class="${cellClass}">${text}</td>`;
                }
            }
        }).join("");

        tr.innerHTML = cells;
        tbody.appendChild(tr);
    });
}

loadData();
