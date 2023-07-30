import axios from "axios"
import Layout from "../Layout"
import Button from "../components/Button"
import { VARIANT } from "../components/enums"
import { MINTS } from "../components/mints"
import CreateNFT from "./CreateNFT"
import Footer from "./Footer"
import { TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react"
import {
  Connection,
  clusterApiUrl,
  Keypair,
  PublicKey,
  GetProgramAccountsFilter,
} from "@solana/web3.js"
import React, { ReactElement, useCallback, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"

const initBalance = {
  scoin: { exists: false, balance: 0 },
  nft: { exists: false, keys: [], balance: 0 },
}

type BALANCE = {
  scoin: { exists: boolean; balance: number }
  nft: { exists: boolean; keys: { address: string, url: string }[]; balance: number }
}

export default function Game({ isDark }: { isDark: boolean }): ReactElement {
  const [loading, setLoading] = React.useState(true)
  const [signedIn, setSignedin] = React.useState(false)
  const wallet = useAnchorWallet()
  const connection = useConnection()
  const [balance, setBalance] = React.useState<BALANCE>(initBalance)

  const handleSignIn = useCallback(async () => {
    if (wallet?.publicKey) {
      setSignedin(true)
      sessionStorage.setItem("signedIn", "true")
      sessionStorage.setItem("wallet", wallet?.publicKey.toString())
    }
  }, [wallet?.publicKey])


  useEffect(() => {
    if (sessionStorage.getItem("signedIn") === "true") {
      setSignedin(true)
    }
  }, [wallet?.publicKey])

  useEffect(() => {
    const solanaConnection = new Connection(
      "ADD_YOUR_RPC",
      "confirmed"
    )

    async function getTokenAccounts(wallet: string, solanaConnection: Connection) {
      const filters: GetProgramAccountsFilter[] = [
        {
          dataSize: 165, //size of account (bytes)
        },
        {
          memcmp: {
            offset: 32, //location of our query in the account (bytes)
            bytes: wallet, //our search criteria, a base58 encoded string
          },
        },
      ]
      const accounts = await solanaConnection.getParsedProgramAccounts(
        TOKEN_PROGRAM_ID, //new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
        { filters: filters }
      )
      //console.log(`Found ${accounts.length} token account(s) for wallet ${wallet}.`)
      let hasScoin = false
      let scoinBalance = 0
      let hasNFT = false
      let nfts: { address: string, url: string }[] = []
      const nftmints = localStorage.getItem("talisman/nftmints")
      let nftmintsArray: { address: string, url: string }[] = []
      if (nftmints) {
        nftmintsArray = JSON.parse(nftmints)
      }

      accounts.forEach((account, i) => {
        //Parse the account data
        const parsedAccountInfo: any = account.account.data
        const mintAddress: string = parsedAccountInfo["parsed"]["info"]["mint"]
        const tokenBalance: number = parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"]
        //Log results

        if (mintAddress === "5qKDWkBejLtRh1UGFV7e58QEkdn2fRyH5ehVXqUYujNW") hasScoin = true
        if (mintAddress === "5qKDWkBejLtRh1UGFV7e58QEkdn2fRyH5ehVXqUYujNW")
          scoinBalance = tokenBalance
        let mint = nftmintsArray.find((mint) => mint.address === account.pubkey.toString())
        console.log({mint})
        if (mint) {
          mint.url = mint.url.toString()
          nfts.push(mint)
          hasNFT = true
        }
      })
      setBalance({
        scoin: { exists: hasScoin, balance: scoinBalance },
        nft: { exists: hasNFT, keys: nfts, balance: nfts.length },
      })
      console.group("NFT")
      console.log(`Has NFT: ${hasNFT}, Balance: ${nfts.length}`)
      console.groupEnd()
      console.groupEnd()
      console.group("scoin")
      console.log(`Has scoin: ${hasScoin}`)
      console.log(`scoin Balance: ${scoinBalance}`)
      console.groupEnd()
      setLoading(false)
    }
    if (wallet?.publicKey && signedIn)
      getTokenAccounts(wallet.publicKey.toBase58(), solanaConnection)
  }, [signedIn, wallet?.publicKey, connection])

  return (
    <Layout footer={<Footer />}>
      {!signedIn ? (
        <div className="flex items-center justify-center w-full h-full">
          <div
            className="flex 
                          max-w-[600px] w-full h-full max-h-[450px]
                          bg-slate-50 dark:bg-slate-700
                          border dark:border-slate-700 rounded-md shadow-2xl"
          >
            <div
              className="flex 
                            bg-slate-200 
                            border border-8 border-double dark:border-slate-700 rounded-md shadow-2xl
                            flex-col gap-4 justify-center h-full align-center items-center w-full"
            >
              {!wallet?.publicKey ? (
                <h1 className="text-3xl text-slate-900">Connect wallet to play</h1>
              ) : null}
              {wallet?.publicKey ? (
                <div className="text-3xl text-slate-900">
                  {!signedIn ? (
                    <Button variant={VARIANT.LARGE} onClick={handleSignIn} text="Sign in" />
                  ) : loading ? (
                    "Loading..."
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {wallet?.publicKey && signedIn && !loading ? (
        <div className="flex items-center justify-center w-full h-full">
          <div
            className="flex 
                         max-w-[600px] w-full h-full max-h-[450px]
                          max-w-[600px] m-auto
                          bg-slate-50 dark:bg-slate-700
                          border dark:border-slate-700 rounded-md shadow-2xl"
          >
            <div
              className=" 
                            bg-slate-600 
                            border border-8 border-double dark:border-slate-700 rounded-md shadow-2xl
                            flex-col gap-4 justify-center h-full align-center items-center w-full"
            >
              <div className="h-full">
                {balance.nft.exists ? <ChooseNFT {...balance} /> : <CreateNFT />}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </Layout>
  )
}
function ChooseNFT(balance: BALANCE) {
  const navigate = useNavigate()
  const handlePlay = useCallback(async (e: React.MouseEvent, nftData: any) => {
    e.preventDefault();
    localStorage.setItem("talisman/nftData", JSON.stringify(nftData))
    navigate("/play")
  }, [balance])
  const [nftData, setNftData] = React.useState<any[]>([])
  useEffect(() => {
    async function getNftData(){
      for(let nft in balance.nft.keys) {
        await axios.get(balance.nft.keys[nft].url).then((res) => {
          setNftData((nftData) => [...nftData, {token: balance.nft.keys[nft], meta:res.data}]);
        })
      }
    }
    getNftData()
  }, [balance])
      
  return (
    <div>
      <h1 className="text-3xl">Choose NFT and play</h1>
      <div className="flex flex-col gap-4">
        {nftData.map((nft) => (
          <Button
            key={nft.token.address}
            variant={VARIANT.LARGE}
            onClick={(e: React.MouseEvent) => handlePlay(e, nft)}
            text={`${nft.meta.name} - The ${nft.meta.attributes[1].value}`}
          />
        ))}
        <Link to={"/createnft"}>
          <Button variant={VARIANT.SMALL} text="Mint new NFT" />
        </Link>
      </div>
    </div>
  )
}
