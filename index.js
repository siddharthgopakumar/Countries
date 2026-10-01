let selectedCountry = null;

const countrySearch = async (countryName) => {
    const rawCountryData = await fetch(
        `https://api.restcountries.com/countries/v5?q=${countryName}`,
        { headers: {  } }
    )
    const data = await rawCountryData.json();
    let countryData = data.objects;
    let card = "";
    countryData.forEach((country) => {
        card += createHTMLCard(country);
    });
    document.getElementById('card-container').innerHTML = card;
}

// add cards
const createHTMLCard = (countryData) => {
    return `<a href="\search?${countryData.names.official}" class="text-decoration-none d-block col-sx-12 col-sm-6 col-md-4 col-xxl-3">
    <div>
        <div class="individual-card card">
            <img src="${countryData.flag.url_svg}" class="card-img-top h-50" alt="...">
            <div class="card-body">
                <h5 class="card-title">${countryData.names.official}</h5>
                <p class="card-text">${countryData.descriptions.short}</p>
            </div>
        </div>
    </div>
</a>`
}

const addToURL = query => {
    const url = new URL(window.location.href);
    url.search = '';
    url.searchParams.set('country', query);
    window.history.pushState({}, '', url);
    countrySearch(query);
}

// initiator function
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

    document.getElementById('search-input').addEventListener('keyup', (e) => {
        e.preventDefault();
        let countryName = document.getElementById('search-input').value;
        if (countryName) {
            addToURL(countryName);
        }
        selectedCountry.classList.remove('active');
        selectedCountry = null;
    });
})();
