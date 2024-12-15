import axios from "axios";

//category tipo vietos pagal nurodytas koordinates 5km spinduliu
const fetchPlaces = async (category, lat, lon, radius = 5000) => {
  const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;

  try {
    const { data } = await axios.get(
      `https://api.geoapify.com/v2/places?categories=${category}&filter=circle:${lon},${lat},${radius}&limit=10&apiKey=${apiKey}`
    );
    return data.features; // GeoJSON
  } catch (error) {
    console.error("Error fetching places from Geoapify:", error);
    return [];
  }
};

export default fetchPlaces;