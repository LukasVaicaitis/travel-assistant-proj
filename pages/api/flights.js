const axios = require('axios');

const apiKey = process.env.NEXT_PUBLIC_XRAPID_API_KEY;
const fetchAirportCodes = async (cityName) => {
    const options = {
        method: 'GET',
        url: 'https://tripadvisor16.p.rapidapi.com/api/v1/flights/searchAirport',
        params: { query: cityName },
        headers: {
            'x-rapidapi-host': 'tripadvisor16.p.rapidapi.com',
            'x-rapidapi-key': apiKey,
        },
    };

    try {
        const response = await axios.request(options);
        if (response.data && response.data.status && response.data.data) {
            // Visi kodai
            const airports = response.data.data.map(airport => ({
                name: airport.name,
                code: airport.airportCode,
            }));
            return airports;
        } else {
            throw new Error('No data returned from API');
        }
    } catch (error) {
        console.error('Error fetching airport codes:', error.message);
        return [];
    }
};

const fetchFlights = async (originAirport, destinationAirport, date) => {
    try {
      const response = await fetch(
        `https://tripadvisor16.p.rapidapi.com/api/v1/flights/searchFlights?sourceAirportCode=${originAirport}&destinationAirportCode=${destinationAirport}&date=${date}&itineraryType=ONE_WAY&sortOrder=ML_BEST_VALUE&numAdults=1&numSeniors=0&classOfService=ECONOMY&pageNumber=1&nearby=yes&nonstop=yes&currencyCode=USD&region=USA`,
        {
          method: "GET",
          headers: {
            "x-rapidapi-host": "tripadvisor16.p.rapidapi.com",
            "x-rapidapi-key": apiKey,
          },
        }
      );
  
      const data = await response.json();
      console.log("API Response:", data);
  
      if (data.status && data.data && data.data.flights && data.data.flights.length > 0) {
        return data.data.flights.map((flight) => {

          const purchaseLinks = flight.purchaseLinks || [];
          const cheapestPurchaseLink = purchaseLinks[0];//Pirma nuoroda i pirkima

          // Pirmas linkas
          const price = cheapestPurchaseLink?.totalPrice || "N/A";
          const purchaseUrl = cheapestPurchaseLink?.url || "#";

          return {
            airline: flight.segments[0].legs[0].marketingCarrier.displayName,
            departureAirport: flight.segments[0].legs[0].originStationCode,
            arrivalAirport: flight.segments[0].legs[0].destinationStationCode,
            departureTime: flight.segments[0].legs[0].departureDateTime,
            arrivalTime: flight.segments[0].legs[0].arrivalDateTime,
            stops: flight.segments[0].legs.length - 1,
            price: price,
            provider: cheapestPurchaseLink?.providerId || "N/A",
            purchaseUrl: purchaseUrl,
          };
        });
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error fetching flights:", error);
      throw new Error("Failed to fetch flights.");
    }
  };

export { fetchFlights, fetchAirportCodes };