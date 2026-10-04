require("dotenv").config();

const axios = require("axios");

exports.handler = async (event, context) => {
    try {
        const countryName = event.queryStringParameters.countryName;
        let response = await axios.get(`https://api.restcountries.com/countries/v5?q=${countryName}`,
            {
                headers: { 'Authorization': 'Bearer ' + process.env.REST_COUNTRIES_API_KEY, Accept: "application/json", "Accept-Encoding": "identity" },
                params: { trophies: true },
            },

        );
        let data = response.data;
        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (error) {
        console.error("Error fetching country data:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to fetch country data" }),
        };
    }
};

