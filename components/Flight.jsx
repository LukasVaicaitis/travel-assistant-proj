import React, { useState } from "react";
import { fetchAirportCodes, fetchFlights } from "@/pages/api/flights";
import { Card, TextInput, Button, Stack, Text, Notification, Title, Select, Center, Badge, Switch } from "@mantine/core";
import { DatePicker } from "@mantine/dates";

const FlightWidget = () => {
    const [originCity, setOriginCity] = useState("");
    const [originAirports, setOriginAirports] = useState([]);
    const [selectedOriginAirport, setSelectedOriginAirport] = useState("");
    const [isAscending, setIsAscending] = useState(true);

    const [destinationCity, setDestinationCity] = useState("");
    const [destinationAirports, setDestinationAirports] = useState([]);
    const [selectedDestinationAirport, setSelectedDestinationAirport] = useState("");

    const [departureDate, setDepartureDate] = useState(null);
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFetchAirports = async (city, setAirports) => {
        try {
            setLoading(true);
            const airports = await fetchAirportCodes(city);
            if (!airports || airports.length === 0) {
                throw new Error(`Nepavyko rasti oro uostų mieste: ${city}`);
            }
            setAirports(airports);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatList = () => {
        const sortedFlights = flights.sort((a, b) => { isAscending ? a.price - b.price : b.price - a.price; });
        setFlights(sortedFlights);
        setIsAscending(!isAscending);
    };

    const handleSearchFlights = async () => {
        setLoading(true);
        setError(null);
        setFlights([]);

        try {
            if (!selectedOriginAirport || !selectedDestinationAirport || !departureDate) {
                throw new Error("Prašome pasirinkti tiek pradinį, tiek galutinį oro uostą ir išvykimo datą.");
            }

            const adjustedDate = new Date(departureDate.getTime() - departureDate.getTimezoneOffset() * 60000);

            const flightResults = await fetchFlights(
                selectedOriginAirport,
                selectedDestinationAirport,
                adjustedDate.toISOString().split("T")[0] // YYYY-MM-DD
            );

            if (!flightResults || flightResults.length === 0) {
                throw new Error("Nepavyko rasti skrydžių pagal pasirinktą maršrutą ir datą.");
            }

            setFlights(flightResults);
            formatList(flights);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card
            shadow="sm"
            padding="lg"
            style={{
                maxWidth: "1200px",
                margin: "0 auto",
                background: "#f8f9fa",
                borderRadius: "8px",
            }}
        >
            <Stack spacing="md">
                <Title align="center" order={2} style={{ color: "#4C5952" }}>
                    Skrydžių Paieška
                </Title>

                <TextInput
                    label="Pradinis miestas"
                    placeholder="Įveskite pradinį miestą"
                    value={originCity}
                    onChange={(e) => {
                        setOriginCity(e.target.value);
                        setSelectedOriginAirport("");
                        setOriginAirports([]);
                    }}
                    onBlur={() => handleFetchAirports(originCity, setOriginAirports)}
                    required
                    style={{ borderRadius: "5px" }}
                />

                {originAirports.length > 0 && (
                    <Select
                        label="Pasirinkite pradinį oro uostą"
                        placeholder="Pasirinkite oro uostą"
                        data={originAirports.map((airport) => ({
                            value: airport.code,
                            label: `${airport.name} (${airport.code})`,
                        }))}
                        value={selectedOriginAirport}
                        onChange={setSelectedOriginAirport}
                        required
                    />
                )}

                <TextInput
                    label="Galutinis miestas"
                    placeholder="Įveskite galutinį miestą"
                    value={destinationCity}
                    onChange={(e) => {
                        setDestinationCity(e.target.value);
                        setSelectedDestinationAirport("");
                        setDestinationAirports([]);
                    }}
                    onBlur={() => handleFetchAirports(destinationCity, setDestinationAirports)}
                    required
                    style={{ borderRadius: "5px" }}
                />

                {destinationAirports.length > 0 && (
                    <Select
                        label="Pasirinkite galutinį oro uostą"
                        placeholder="Pasirinkite oro uostą"
                        data={destinationAirports.map((airport) => ({
                            value: airport.code,
                            label: `${airport.name} (${airport.code})`,
                        }))}
                        value={selectedDestinationAirport}
                        onChange={setSelectedDestinationAirport}
                        required
                    />
                )}

                <Center>
                    <div>
                        <Text align="center" mb="sm">
                            Pasirinkite išvykimo datą:
                        </Text>
                        <DatePicker
                            label="Išvykimo data"
                            placeholder="Pasirinkite išvykimo datą"
                            value={departureDate}
                            onChange={setDepartureDate}
                            required
                            minDate={new Date()}
                            style={{ borderRadius: "5px" }}
                        />
                    </div>
                </Center>

                <Button
                    onClick={handleSearchFlights}
                    loading={loading}
                    disabled={loading}
                    style={{
                        backgroundColor: "#4C5952",
                        color: "#fff",
                        borderRadius: "5px",
                    }}
                >
                    Ieškoti Skrydžių
                </Button>

                {error && (
                    <Notification
                        color="red"
                        title="Klaida"
                        onClose={() => setError(null)}
                        style={{ background: "#ffe8e8", color: "#d32f2f" }}
                    >
                        {error}
                    </Notification>
                )}



                {flights.length > 0 && (
                    <Stack spacing="sm">
                        <Title order={3} style={{ color: "#4C5952" }}>
                            Rasti Skrydžiai
                        </Title>

                        <Switch
                            label={isAscending ? "Brangiausi viršuje" : "Pigiausi viršuje"}
                            checked={isAscending}
                            onChange={(event) => {
                                setIsAscending(event.currentTarget.checked);
                                formatList();
                            }}
                            size="md"
                            color="teal"
                        />

                        {flights.map((flight, index) => (
                            <Card
                                key={index}
                                shadow="sm"
                                padding="lg"
                                radius="md"
                                withBorder
                                style={{ border: "1px solid #4C5952" }}
                            >
                                <Text size="lg" weight={500} style={{ color: "#4C5952" }}>
                                    Oro linijos: {flight.airline}
                                </Text>
                                <Text>
                                    <Badge color="#B8D9C7">Išvykimo oro uostas:</Badge> {flight.departureAirport}
                                </Text>
                                <Text>
                                    <Badge color="#B8D9C7">Išvykimo laikas:</Badge>{" "}
                                    {new Date(flight.departureTime).toLocaleString()}
                                </Text>
                                <Text>
                                    <Badge color="#9BB7A8">Atvykimo oro uostas:</Badge> {flight.arrivalAirport}
                                </Text>
                                <Text>
                                    <Badge color="#9BB7A8">Atvykimo laikas:</Badge>{" "}
                                    {new Date(flight.arrivalTime).toLocaleString()}
                                </Text>
                                <Text>
                                    <Badge color="#7E9589">Persėdimai:</Badge> {flight.stops}
                                </Text>
                                <Text>
                                    <Badge color="#45514A">Kaina nuo:</Badge> {flight.price || "N/A"} &#8364;
                                </Text>
                                <Text>
                                    <Badge color="#4C5952">Paslaugų teikėjas:</Badge> {flight.provider || "N/A"}
                                </Text>
                                <Button
                                    component="a"
                                    href={flight.purchaseUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ marginTop: "10px", backgroundColor: "#4C5952" }}
                                >
                                    Pirkti Bilietus
                                </Button>
                            </Card>
                        ))}
                    </Stack>
                )}
            </Stack>
        </Card>
    );
};

export default FlightWidget;