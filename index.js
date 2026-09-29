let selectedCountry = null;

(() => {
    document.querySelectorAll('.land').forEach((country) => {
        country.addEventListener('click', () => {
            if (country.classList.contains('active')) {
                country.classList.remove('active');
                selectedCountry = null;
                return;
            }
            if (selectedCountry) {
                selectedCountry.classList.remove('active');
            }
            country.classList.add('active');
            selectedCountry = country;
            console.log(selectedCountry.getAttribute('title'));
        })
    })
})();
