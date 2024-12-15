import { Group, Box, Text, rem } from '@mantine/core';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

import LogoutButton from './LogoutButton';

export function Header() {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <Box
      style={{
        height: rem(60),
        padding: '0 16px',
        borderBottom: `1px solid rgba(0, 0, 0, 0.1)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f5f5f5',
      }}
    >

      <Group spacing="md" style={{ display: 'flex', alignItems: 'center' }}>
        <Text style={{ fontWeight: 500, marginRight: 10 }}>Sveiki, {session?.user?.name}!</Text>
      </Group>

      <Group style={{ display: 'flex', alignItems: 'center' }}>

        <LogoutButton />
      </Group>
    </Box>
  );
}