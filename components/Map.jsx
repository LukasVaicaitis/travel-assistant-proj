import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const customIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [25, 25],
});

const Map = ({ places, center }) => {
    return (
        <MapContainer
            center={center}
            zoom={13}
            style={{ height: "400px", width: "100%" }}
        >
            {/* Zemelapis */}
            <TileLayer
                url={`https://maps.geoapify.com/v1/tile/osm-bright-grey/{z}/{x}/{y}.png?apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY}`}
                attribution='<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            
            {places.map((place) => (
                <Marker
                    key={place.properties.place_id}
                    position={[
                        place.properties.lat,
                        place.properties.lon,
                    ]}
                    icon={customIcon}
                >
                    <Popup>
                        <strong>{place.properties.name || "No Name"}</strong>
                        <br />
                        {place.properties.address_line1 || "No Address"}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default Map;