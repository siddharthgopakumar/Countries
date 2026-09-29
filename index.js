let selectedCountry = null;

let countrySearch = (countryName) => {
    fetch(
        `https://api.restcountries.com/countries/v5?q=${countryName}`,
        { headers: { 'Authorization': 'Bearer rc_live_c97cb9f938134735b174f098c64585d7' } }
    )
        .then(function (response) { return response.json(); })
        .then(function ({ data }) {
            let countryData = data.objects;
            // console.log(data);
            let card = "";
            countryData.forEach((country) => {
                console.log(country);
                card += createHTMLCard(country);
            });
            document.getElementById('card-container').innerHTML = card;
        })
}

// add cards
let createHTMLCard = (countryData) => {
    console.log({ countryData });
    return `<div class="col-sx-12 col-sm-4 col-xxl-3">
            <div class="individual-card card">
                <img src="${countryData.flag.url_svg}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${countryData.names.official}</h5>
                    <p class="card-text">${countryData.descriptions.short}</p>
                </div>
            </div>
        </div>`
}

(() => {
    document.querySelectorAll('.land').forEach((country) => {
        let selectedCountryName = "";
        country.addEventListener('click', () => {
            if (country.classList.contains('active')) {
                country.classList.remove('active');
                document.getElementById('search-input').value = "";
                selectedCountry = null;
                return;
            }
            if (selectedCountry) {
                selectedCountry.classList.remove('active');
            }
            country.classList.add('active');
            selectedCountry = country;
            selectedCountryName = country.getAttribute('title');
            document.getElementById('search-input').value = selectedCountryName;
            countrySearch(selectedCountryName);

        })
    })

    document.getElementById('search-button').addEventListener('click', (e) => {
        e.preventDefault();
        let countryName = document.getElementById('search-input').value;
        if (countryName) {
            countrySearch(countryName);
        }
        selectedCountry.classList.remove('active');
        selectedCountry = null;
    });
})();
