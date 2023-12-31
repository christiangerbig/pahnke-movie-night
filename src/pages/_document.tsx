import Document, { Html, Head, Main, NextScript } from "next/document";
// mantine
import { createGetInitialProps } from "@mantine/next";

const getInitialProps = createGetInitialProps();

class _Document extends Document {
  static getInitialProps = getInitialProps;

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default _Document;
