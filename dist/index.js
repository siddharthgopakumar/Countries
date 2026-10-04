const searchInput = document.getElementById('search-input');
const searchForm = document.getElementById('search-form');
let selectedCountry = null;

const searchCountry = async (countryName) => {
    const rawData = await fetch(`/.netlify/functions/getCountries?countryName=${countryName}`, {
        method: "GET",
        headers: { accept: "application/json" }
    });
    const rawCountryData = await rawData.json();
    let countryData = rawCountryData.data.objects;
    let cards = "";
    countryData?.forEach((country) => {
        cards += createHTMLCard(country);
    });
    document.getElementById('card-container').innerHTML = cards;
}


const getCountryFromUrl = () => {
    const parameters = new URLSearchParams(window.location.search);
    const namedCountry = parameters.get('country');
    if (namedCountry) return namedCountry.trim();
}

const initialCountryName = getCountryFromUrl();
if (initialCountryName) {
    searchInput.value = initialCountryName;
    searchCountry(initialCountryName);
}

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const countryName = searchInput.value.trim();
    if (countryName) {
        addToURL(countryName);
        searchCountry(countryName);
    }
    selectedCountry.classList.remove('active');
    selectedCountry = null;
});

document.querySelectorAll('.land').forEach((country) => {
    let selectedCountryName = "";
    country.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (country.classList.contains('active')) {
            country.classList.remove('active');
            searchInput.value = "";
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
        addToURL(selectedCountryName);
        searchCountry(selectedCountryName);
    })
})

const addToURL = query => {
    const url = new URL(window.location.href);
    url.search = '';
    url.searchParams.set('country', query);
    window.history.pushState({}, '', url);
}

const createHTMLCard = (countryData) => {
    return `<a href="\description?country=${countryData.names.official}" class="text-decoration-none d-block col-sx-12 col-sm-6 col-md-4 col-xxl-3">
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
