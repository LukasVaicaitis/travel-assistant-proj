import React from 'react';
import { Box } from '@mantine/core';
import { signOut } from 'next-auth/react';

export default function LogoutButton() {

    return (
        <Box
            style={{
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
            }}
            onClick={() => signOut()}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#f0f0f0')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '')}
        >
            Atsijungti
        </Box>
    );
};