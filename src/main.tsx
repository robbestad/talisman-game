import {
  SolanaMobileWalletAdapter,
  createDefaultAddressSelector,
  createDefaultAuthorizationResultCache,
  createDefaultWalletNotFoundHandler,
} from "@solana-mobile/wallet-adapter-mobile"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import {
  WalletModalProvider,
  WalletMultiButton
} from "@solana/wallet-adapter-react-ui"
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare"
import React, { FC, useMemo, useState } from "react"
import ReactDOM from "react-dom"
import { HelmetProvider } from "react-helmet-async"
import { BrowserRouter, Link } from "react-router-dom"
import App from "./App"
import "./tailwind.css"

// Default styles that can be overridden by your app
//require('@solana/wallet-adapter-react-ui/styles.css');

const Wallet: FC = ({ children }) => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Devnet
  const [menuOpen, setMenuOpen] = useState(false)

  let RPCD =
    "ADD_YOUR_RPC"

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => RPCD, [network])

  const wallets = useMemo(
    () => [
      /**
       * Select the wallets you wish to support, by instantiating wallet adapters here.
       *
       * Common adapters can be found in the npm package `@solana/wallet-adapter-wallets`.
       * That package supports tree shaking and lazy loading -- only the wallets you import
       * will be compiled into your application, and only the dependencies of wallets that
       * your users connect to will be loaded.
       */
      new SolflareWalletAdapter(),
      new PhantomWalletAdapter(),
      new SolanaMobileWalletAdapter({
        addressSelector: createDefaultAddressSelector(),
        appIdentity: {
          name: "Talisman Game",
          uri: "https://talismangame.xyz",
          icon: "/icon.png",
        },
        authorizationResultCache: createDefaultAuthorizationResultCache(),
        cluster: WalletAdapterNetwork.Mainnet,
        onWalletNotFound: createDefaultWalletNotFoundHandler(),
      }),
    ],
    []
  )

  return (
    <ConnectionProvider config={{ commitment: "confirmed" }} endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="flex justify-around w-full p-2">
            <div className="flex gap-2">
              <Link
                to={"/"}
                className="flex justify-center items-center 
                      gap-2 px-2 pt-1 break-none h-14"
                style={{ textDecoration: "none" }}
              >
                <h1 className="logo text-4xl pl-4">The Talisman</h1>
              </Link>
            </div>

            <div className="flex gap-2 px-2 pt-1 break-none h-14">
              <WalletMultiButton />
            </div>
          </div>
          <div
            className={`w-full z-10 ${
              menuOpen ? "opacity-50 pointer-events-none overflow-hidden" : ""
            }`}
          >
            <>{children}</>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Wallet>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </Wallet>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
)
