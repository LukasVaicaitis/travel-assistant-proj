import React, { useEffect, useState } from "react";
import { Card, Text, Loader, Group, ScrollArea, Skeleton, Badge, } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { fetchCoordinates, fetchCurrentWeather, fetchWeatherForecast, } from "@/pages/api/weather";

const WeatherWidget = ({ city }) => {
    const [currentWeather, setCurrentWeather] = useState(null);
    const [forecast, setForecast] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchWeatherData = async () => {
        setLoading(true);
        setCurrentWeather(null);
        setForecast(null);

        try {
            const coords = await fetchCoordinates(city);
            if (!coords) {

                showNotification({
                    title: "Klaida",
                    message: "Miestas nerastas. Patikrinkite pavadinimą.",
                    color: "red",
                });
                return;
            }

            const { lat, lon } = coords;

            const current = await fetchCurrentWeather(lat, lon);
            setCurrentWeather(current);

            const forecastData = await fetchWeatherForecast(lat, lon);
            setForecast(forecastData);
        } catch (error) {
            //console.error("Klaida gaunant orų duomenis:", error);

            showNotification({
                title: "Klaida",
                message: "Nepavyko gauti orų duomenų. Bandykite dar kartą vėliau.",
                color: "red",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (city) {
            fetchWeatherData();
        }
    }, [city]);

    return (
        <Card
            shadow="sm"
            padding="lg"
            style={{
                maxWidth: "500px",
                margin: "0 auto",
                background: "#f8f9fa",
                borderRadius: "8px",
            }}
        >
            {loading ? (
                <>
                    <Skeleton height={30} width="80%" style={{ marginTop: 20 }} />
                    <Skeleton height={20} width="60%" style={{ marginTop: 10 }} />
                    <Skeleton height={20} width="60%" style={{ marginTop: 10 }} />
                    <Skeleton height={20} width="60%" style={{ marginTop: 10 }} />
                    <Skeleton height={20} width="60%" style={{ marginTop: 10 }} />
                    <Skeleton height={30} width="80%" style={{ marginTop: 20 }} />
                    <Skeleton height={20} width="60%" style={{ marginTop: 10 }} />
                </>
            ) : (
                <>
                    {currentWeather && (
                        <div style={{ marginTop: 20 }}>
                            <Text size="lg" weight={700} color="#4C5952">
                                Dabartiniai orai: {currentWeather.name}
                            </Text>
                            <Badge color="#4C5952" style={{ marginTop: 10 }}>
                                Temperatūra: {currentWeather.main.temp}°C
                            </Badge>
                            <Text style={{ marginTop: 5 }}>
                                Sąlygos:{" "}
                                <span style={{ color: "#4C5952", fontWeight: "bold" }}>
                                    {currentWeather.weather[0].description}
                                </span>
                            </Text>
                            <Text style={{ marginTop: 5 }}>
                                Drėgnumas: {currentWeather.main.humidity}%
                            </Text>
                            <Text style={{ marginTop: 5 }}>
                                Vėjo greitis: {currentWeather.wind.speed} m/s
                            </Text>
                        </div>
                    )}

                    {forecast && (
                        <ScrollArea style={{ marginTop: 20, height: 200 }}>
                            <Text size="lg" weight={700} color="#4C5952">
                                5 dienų prognozė
                            </Text>
                            {forecast.list.map((entry, index) => (
                                <Card
                                    key={index}
                                    shadow="sm"
                                    padding="sm"
                                    style={{
                                        marginBottom: 10,
                                    }}
                                >
                                    <Text>
                                        <strong>Data:</strong>{" "}
                                        {new Date(entry.dt * 1000).toLocaleString("lt-LT")}
                                    </Text>
                                    <Text>
                                        <strong>Temperatūra:</strong> {entry.main.temp}°C
                                    </Text>
                                    <Text>
                                        <strong>Būklė:</strong> {entry.weather[0].description}
                                    </Text>
                                </Card>
                            ))}
                        </ScrollArea>
                    )}
                </>
            )}
        </Card>
    );
};

export default WeatherWidget;