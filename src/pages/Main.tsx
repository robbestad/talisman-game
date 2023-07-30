import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react"
import React, { ReactElement, useCallback } from "react"
import { Link } from "react-router-dom"
import Button from "../components/Button"
import axios from "axios"
import { TAB, VARIANT } from "../components/enums"
import createFileList from "../components/create-file-list"
import toast, { Toaster } from "react-hot-toast"
import buyWithToken from "../buyWithToken"
function Menu(setTab: (tab: TAB) => void): ReactElement {
    return (
        <>
            <Button
                variant={VARIANT.NORMAL}
                onClick={() => setTab(TAB.INSTRUCTIONS)}
                text="Instructions" />
            <Button
                variant={VARIANT.LARGE}
                onClick={() => setTab(TAB.SHOP)}
                text="Shop" />
            <Link to="/game">

                <Button
                    variant={VARIANT.LARGE}
                    text="Play Game" />
            </Link>
            <Button
                variant={VARIANT.NORMAL}
                onClick={() => setTab(TAB.CREDITS)}
                text="Credits" />
        </>)
}

function Credits(setTab: (tab: TAB) => void): ReactElement {
    return (
        <div className="h-full w-full">
            <Button
                variant={VARIANT.NORMAL}
                onClick={() => setTab(TAB.MAIN)}
                text="Back" />
            <div className="flex m-auto text-xl mt-4 justify-center align-center gap-4 flex-col w-96">
                <p>
                    Game by <a href="https://twitter.com/svenasol" className="text-slate-900 dark:text-slate-400 underline">svenasol</a></p>
            </div>
        </div>)
}

function Instructions(setTab: (tab: TAB) => void): ReactElement {
    return (
        <div className="h-full w-full">
            <Button
                variant={VARIANT.NORMAL}
                onClick={() => setTab(TAB.MAIN)}
                text="Back" />
            <div className="flex m-auto text-xl mt-4 justify-center align-center gap-4 flex-col w-96">

                <div className="text-xl">
                    <p>Instructions</p>
                    <div>
                        <p>1. Connect your wallet</p>
                        <p>2. Mint or choose your character</p>
                        <p>3. Click "Start Game"</p>
                        <p>4. Play </p>
                        <p>4. If you die, your progress is saved to your NFT and the game restarts </p>
                        <p>5. If you save and quit, your progress is saved to your NFT and you can restart where you left off </p>
                    </div>
                </div>
            </div>
        </div>)
}


function Shop(setTab: (tab: TAB) => void, handleSave: (e: React.MouseEvent, item: any, amount: number) => Promise<void>): ReactElement {

    return (
        <div className="h-full w-full">
            <Button
                variant={VARIANT.NORMAL}
                onClick={() => setTab(TAB.MAIN)}
                text="Back" />
            <div className="flex m-auto text-xl mt-4 justify-center align-center gap-4 flex-col w-96">
                <h1 className="text-center text-xl font-bold">Shop</h1>
                <div className="text-xl flex justify-center gap-4 justify-between">
                    <div className="text-xl inline-flex flex-col justify-center align-center items-center">
                        <img src="/assets/bolt.png" className="w-16 h-16" />
                        <button onClick={(e) => handleSave(e, { weapon: "bolt" }, 800_000)} className="hover:text-emerald-200">Buy Bolt (800K BONK)</button>
                    </div>
                    <div className="text-xl inline-flex flex-col justify-center align-center items-center">
                        <img src="/assets/lightning.png" className="w-16 h-16" />
                        <button onClick={(e) => handleSave(e, { weapon: "lightning" }, 400_000)} className="hover:text-emerald-200">Buy Lightning (400K BONK)</button>
                    </div>
                </div>
            </div>
        </div>)
}

export default function Main({ isDark }: { isDark: boolean }): ReactElement {
    const { connection } = useConnection()
    const wallet = useWallet()
    const [tab, setTab] = React.useState(TAB.MAIN)
    const { publicKey, signTransaction } = useWallet()

    const handleSave = useCallback(async (e: React.MouseEvent, item: any, amount: number) => {
        e.preventDefault();
        if (!publicKey) return
        if (!signTransaction) return

        const nftData = localStorage.getItem("talisman/nftData")
        const nftDataParsed = nftData ? JSON.parse(nftData) : null
        if (nftDataParsed) {
            nftDataParsed.meta.attributes[9] = { trait_type: "Weapon", value: item.weapon }
        }
        localStorage.setItem("talisman/nftData", JSON.stringify(nftDataParsed));
        localStorage.setItem("talisman/weapon", item.weapon);

        await buyWithToken(
            connection,
            publicKey,
            signTransaction,
            amount,
            "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263", //BOOnk
            "Code2raHfHLuM5RNepJwUc3ML16uAfvczm3k5FbjviNA"
        )
            .then(async (res) => {
                console.log(res);
                toast.success("Weapon bought");
                try {
                    let filename = nftDataParsed.token.url.split("/").pop()
                    const file = new File([JSON.stringify(nftDataParsed.meta)], filename, {
                        type: "application/json",
                    })
                    let files = createFileList([file]) as FileList
                    let formData = new FormData()
                    formData.append("filedit", files[0])
                    const response = await axios.post(`https://public.sdrive.app/editfile?apiKey=talismanmint`, formData)
                    console.log(response)
                    if (response.status === 200) {
                        axios.get(response.data).then((res) => console.log(res.data, JSON.stringify(res.data)))

                        return response.data
                    } else {
                        return ""
                    }
                } catch (e) {
                    console.log(e)
                }
            })
            .catch((e) => {
                console.log(e)
                toast.error("Something went wrong");
                localStorage.setItem("talisman/nftData", JSON.stringify(nftDataParsed));
                localStorage.setItem("talisman/weapon", item.weapon);
                console.log(nftDataParsed)
            }
            )

    }, [publicKey, wallet,signTransaction, connection])


    if (!wallet?.publicKey) {
        return (
            <div className="flex justify-center h-full align-center items-center w-full">
                <h1 className="text-3xl">Connect wallet to play</h1>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4 justify-center h-full align-center items-center w-full">
            <Toaster />
            {tab === TAB.MAIN && Menu(setTab)}
            {tab === TAB.CREDITS && Credits(setTab)}
            {tab === TAB.SHOP && Shop(setTab, handleSave)}
            {tab === TAB.INSTRUCTIONS && Instructions(setTab)}
        </div>
    )
}
