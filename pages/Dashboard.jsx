'use client'

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Container, Button, Text, Group, Title, TextInput, Grid,  } from '@mantine/core';
import { useDebouncedValue } from "@mantine/hooks";

//Components
import { Header } from '@/components/Header';
import WeatherWidget from '@/components/Weather';
import PlacesWidget from '@/components/Places';
import FlightWidget from '@/components/Flight';

export default function Dashboard() {
    const [city, setCity] = useState("");
    const [debouncedCity] = useDebouncedValue(city, 1000);

    const router = useRouter();
    const { data: session, status } = useSession();

    // useEffect(() => {
    //     // Redirect if unauthenticated
    //     if (status === "unauthenticated") {
    //         router.push("/");
    //     }
    // }, [status, router]);

    if (status === "loading") {
        return <Text>Loading...</Text>;
    }

    return (
        <div>
            <Header/>
            <Container size="lg" style={{ paddingTop: "20px" }}>
                <Title order={1}>Kelionių planavimo sistema</Title>
            </Container>

            <Container size="lg" style={{ marginTop: "20px" }}>
                <TextInput
                    label="Miestas"
                    placeholder="Įveskite miesto pavadinimą (anglų k.)"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
            </Container>

            <Container size="lg" style={{ marginTop: "20px" }}>
                <Grid gutter="lg">
                    {/* 2/3 */}
                    <Grid.Col span={8}>
                        <PlacesWidget city={debouncedCity} />
                    </Grid.Col>

                    {/* 1/3 */}
                    <Grid.Col span={4}>
                        <WeatherWidget city={debouncedCity} />
                    </Grid.Col>

                    {/* Full */}
                    <Grid.Col span={12}>
                        <FlightWidget city={debouncedCity} />
                    </Grid.Col>
                </Grid>
            </Container>
        </div>
    );
};