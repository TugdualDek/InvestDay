import "../styles/globals.css";

import type { AppProps } from "next/app";
import { ReactNode } from "react";
import { NextPage } from "next";
import { AuthProvider, ProtectRoute } from "../context/AuthContext";
import { FetchProvider } from "../context/FetchContext";
type Page<P = {}> = NextPage<P> & {
  getLayout?: (page: ReactNode) => ReactNode;
};

type Props = AppProps & {
  Component: Page;
};

const App = ({ Component, pageProps }: Props) => {
  const getLayout = Component.getLayout ?? ((page: ReactNode) => page);
  return (
    <AuthProvider>
      <FetchProvider>
        <ProtectRoute>{getLayout(<Component {...pageProps} />)}</ProtectRoute>
      </FetchProvider>
    </AuthProvider>
  );
};
export default App;
