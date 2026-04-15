document.getElementById("searchInput").addEventListener("input", function () {
    const filter = this.value.toLowerCase();
    const rows = document.querySelectorAll("#medewerkersTable tbody tr");

    rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(filter) ? "" : "none";
    });
});
