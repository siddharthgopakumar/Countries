const searchForm = document.getElementById('country-search-form');
const searchInput = document.getElementById('country-search-input');
const countryStatus = document.getElementById('country-status');
const countryDetails = document.getElementById('country-details');
let currentRequest;

const formatNumber = (value, unit = '') => {
    if (typeof value !== 'number') return 'Not available';
    return `${new Intl.NumberFormat().format(value)}${unit}`;
};

const getCountryFromUrl = () => {
    const parameters = new URLSearchParams(window.location.search);
    const namedCountry = parameters.get('country');
    if (namedCountry) return namedCountry.trim();

    const legacyCountry = window.location.search.slice(1);
    return legacyCountry ? decodeURIComponent(legacyCountry.replaceAll('+', ' ')).trim() : '';
};

const makeFact = (label, value) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'country-fact';

    const term = document.createElement('dt');
    term.textContent = label;
    const description = document.createElement('dd');
    description.textContent = value || 'Not available';

    wrapper.append(term, description);
    return wrapper;
};

const renderCountry = (country) => {
    const article = document.createElement('article');
    article.className = 'country-layout';

    const flag = document.createElement('img');
    flag.className = 'country-flag';
    flag.src = country.flag?.url_svg || country.flag?.url_png || '';
    flag.alt = country.flags?.alt || `Flag of ${country.names?.common}`;
    flag.loading = 'lazy';

    const content = document.createElement('div');
    const heading = document.createElement('h1');
    content.className = 'country-content mb-4';
    heading.className = 'country-heading h2';
    heading.textContent = country.names.common;

    const officialName = document.createElement('p');
    officialName.className = 'country-official-name';
    officialName.textContent = country.names.official;

    const facts = document.createElement('dl');
    facts.className = 'country-facts';

    const description = document.createElement('p');
    description.className = 'country-description fs-6';
    description.textContent = country.descriptions.long || '';

    const currencies = Object.values(country.currencies || {})
        .map((currency) => `${currency.name}${currency.symbol ? ` (${currency.symbol})` : ''}`)
        .join(', ');
    const languages = country.languages ? country.languages?.map(language => language.name).join(', ') : 'Not available';
    const capitals = country.capitals?.map(capital => capital.name).join(', ') || 'Not available';
    facts.append(
        makeFact('Capital', capitals),
        makeFact('Region', country.subregion ? `${country.region}, ${country.subregion}` : country.region),
        makeFact('Population', formatNumber(country.population)),
        makeFact('Area', formatNumber(country.area.kilometers, ' km²')),
        makeFact('Languages', languages),
        makeFact('Currencies', currencies),
        makeFact('Bordering countries', country.borders?.join(', ') || 'None')
    );

    content.append(heading, officialName, facts);
    article.append(flag, content);
    countryDetails.replaceChildren(article);
    countryDetails.appendChild(description);
};

const loadCountry = async (countryName) => {
    if (currentRequest) currentRequest.abort();
    currentRequest = new AbortController();

    countryDetails.replaceChildren();
    countryStatus.textContent = `Loading ${countryName}...`;

    try {
        const response = await fetch(
            `/.netlify/functions/getCountries?countryName=${countryName}`, {
            method: "GET",
            headers: { accept: "application/json" }
        }
        );

        if (!response.ok) throw new Error('Country not found');
        const data = await response.json();
        countries = data.data.objects;
        if (!Array.isArray(countries) || countries.length === 0) throw new Error('Country not found');

        renderCountry(countries[0]);
        countryStatus.textContent = '';
    } catch (error) {
        console.log({ error });
    }
};

loadCountry();

window.addEventListener('popstate', () => {
    const countryName = getCountryFromUrl();
    searchInput.value = countryName;
    if (countryName) {
        loadCountry(countryName);
    }
});

const initialCountry = getCountryFromUrl();
if (initialCountry) {
    searchInput.value = initialCountry;
    loadCountry(initialCountry);
}
