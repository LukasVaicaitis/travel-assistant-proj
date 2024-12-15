import React, { useEffect, useState } from "react";
import { Card, Button, Group, Loader, ScrollArea, Text, Select, Badge, } from "@mantine/core";
import { fetchCoordinates } from "@/pages/api/weather";
import fetchPlaces from "@/pages/api/places";
import { showNotification } from "@mantine/notifications";

import dynamic from "next/dynamic";
const DynamicMap = dynamic(() => import("./Map"), { ssr: false });

const PlacesWidget = ({ city }) => {
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(false);
    const [center, setCenter] = useState([]);
    const [category, setCategory] = useState("accommodation.hotel");

    const categoryOptions = [
        { value: "accommodation.hotel", label: "Nakvynė" },
        { value: "commercial.shopping_mall", label: "Parduotuvės" },
        { value: "catering.restaurant", label: "Restoranai" },
    ];

    const searchPlaces = async (selectedCity) => {
        setLoading(true);
        setPlaces([]);
        try {
            const coords = await fetchCoordinates(selectedCity);
            if (!coords) {
                showNotification({
                    title: "Klaida",
                    message: "Miestas nerastas. Patikrinkite pavadinimą.",
                    color: "red",
                });
                setLoading(false);
                return;
            }
            const { lat, lon } = coords;
            setCenter([lat, lon]);

            const fetchedPlaces = await fetchPlaces(category, lat, lon);
            if (fetchedPlaces.length === 0) {
                showNotification({
                    title: "Rezultatų nėra",
                    message: "Pagal pasirinktą kategoriją vietų nerasta.",
                    color: "yellow",
                });
            }
            setPlaces(fetchedPlaces);
        } catch (error) {
            console.error("Klaida ieškant vietų:", error);
            showNotification({
                title: "Klaida",
                message: "Nepavyko gauti vietų duomenų. Bandykite vėliau.",
                color: "red",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (city) {
            searchPlaces(city);
        }
    }, [city, category]);

    return (
        <Card
            shadow="sm"
            padding="lg"
            style={{
                maxWidth: "800px",
                margin: "0 auto",
                background: "#f8f9fa",
                borderRadius: "8px",
            }}
        >
            <Select
                label="Ko ieškote?"
                placeholder="Pasirinkite kategoriją"
                value={category}
                onChange={setCategory}
                data={categoryOptions}
                style={{
                    marginBottom: "10px",
                    borderRadius: "5px",
                }}
            />

            {loading ? (
                <Loader style={{ marginTop: 20 }} />
            ) : (
                <>
                    {places.length > 0 && (
                        <ScrollArea style={{ marginTop: 20, marginBottom: 40, height: 200 }}>
                            {places.map((place) => (
                                <Card
                                    key={place.properties.place_id}
                                    shadow="sm"
                                    padding="sm"
                                    style={{
                                        marginBottom: 10,
                                    }}
                                >
                                    <Text size="lg" weight={700} color="#4C5952">
                                        {place.properties.name || "Nežinomas pavadinimas"}
                                    </Text>

                                    <Text color="#4C5952">
                                        Miestas: {place.properties.city || "Nežinomas miestas"}
                                    </Text>
                                </Card>
                            ))}
                        </ScrollArea>
                    )}

                    {places.length > 0 && (
                        <DynamicMap places={places} center={center} />
                    )}
                </>
            )}
        </Card>
    );
};

export default PlacesWidget;