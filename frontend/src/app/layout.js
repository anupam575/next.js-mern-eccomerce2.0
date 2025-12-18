"use client";

import "./globals.css";
import ButtonAppBar from "./components/Header/Header";
import Panel from "./components/Header/Panel";
import Providers from "./providers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SocketListener from "./components/Section/SocketListener";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ButtonAppBar />
          <Panel />

          {/* 🔔 SocketListener handles userId internally */}
          <SocketListener />

          <main>{children}</main>

          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            draggable
            theme="colored"
          />
        </Providers>
      </body>
    </html>
  );
}