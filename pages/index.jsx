import React from 'react';
import { Button, Container, Title, Group } from '@mantine/core';
import { signIn } from 'next-auth/react';

export default function Home() {

    return (
        <Container
            size="fullWidth"
            style={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                textAlign: 'center',
                backgroundColor: '#f5f5f5',
            }}
        >
            <Title order={1} style={{ marginBottom: '2rem', fontSize: '2.5rem', color: '#333' }}>
                Kelionių organizavimo sistema
            </Title>

            <Group position="center" spacing="lg">
                <Button size="lg" color="#4C5952" onClick={signIn}>
                    Prisijungti su Google
                </Button>
            </Group>
        </Container>
    );
};