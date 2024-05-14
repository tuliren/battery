import { ColorSchemeScript } from '@mantine/core';
import Document, { Head, Html, Main, NextScript } from 'next/document';

export default class _Document extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <ColorSchemeScript defaultColorScheme="auto" />
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
