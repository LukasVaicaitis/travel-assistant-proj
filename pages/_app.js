import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { SessionProvider } from "next-auth/react"
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import 'leaflet/dist/leaflet.css';


export default function MyApp({ Component, pageProps: { session, ...pageProps }, }) {
    return (
        <SessionProvider session={session}>
            <MantineProvider withGlobalStyles withNormalizeCSS>
                <Notifications />
                <Component {...pageProps} />
            </MantineProvider>
        </SessionProvider >
    );
}