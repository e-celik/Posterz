const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS0azddmwdz4vt1HL7zuh1Fw9jnDQOKhMCHfZFmln3Nmkrk7zUfijnrOWZxHrPGaJtCY44CSVZnpNPV/pub?output=csv';

async function fetchData() {
    try {
        const response = await fetch(`${SHEET_URL}&cachebust=${new Date().getTime()}`);
        const data = await response.text();
        const parsedData = parseCSV(data);
        renderCards(parsedData);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function parseCSV(data) {
    const rows = data.split('\n').slice(1); // Remove header row
    return rows.map(row => {
        const [posterName, posterUrl, ignore, date, time, address] = row.split(',');

        return { posterName, posterUrl, date, time, address };
    });
}

function getID(input) {
    const parts = input.split('/');
    return parts[parts.length - 1];
}

function renderCards(cards) {
    const container = document.getElementById('cardContainer');
    container.innerHTML = ''; // Clear any existing cards

    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.innerHTML = `
            <img class="poster" src="https://drive.google.com/thumbnail?id=${getID(card.posterUrl.trim())}&sz=w1000" alt="${card.posterName}">
            <div class="cardInfo">
                <h4 class="date">${card.date.trim()}</h4>
                <p class="time">${card.time.trim()}</p>
                <p class="address">${card.address.trim()}</p>
            </div>
        `;
        container.appendChild(cardElement);
    });
}

// Fetch and render data on page load
fetchData();