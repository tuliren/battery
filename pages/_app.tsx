import { Container, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import PlausibleProvider from 'next-plausible';
import type { AppProps } from 'next/app';
import Head from 'next/head';

export default function MyApp({ Component, pageProps }: AppProps) {
  // Uses NEXT_PUBLIC_VERCEL_ENV instead of NODE_ENV so we can exclude previews from analytics collection.
  // see https://vercel.com/docs/concepts/projects/environment-variables#system-environment-variables
  const enableAnalytics = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';

  return (
    <>
      <Head>
        <title>⚡Battery⚡</title>
        <meta name="description" content="A battery" />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <link rel="icon" href="/battery.svg" />
      </Head>

      <PlausibleProvider domain="battery.plux.dev" enabled={enableAnalytics}>
        <MantineProvider>
          <Container size="xl">
            <Component {...pageProps} />
          </Container>
        </MantineProvider>
      </PlausibleProvider>
    </>
  );
}
