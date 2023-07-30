import Button from "../components/Button"
import createFileList from "../components/create-file-list"
import { VARIANT } from "../components/enums"
import idl from "../nft_mint.json"
import baseNft from "../nftbase.json"
import { init } from "@paralleldrive/cuid2"
import * as anchor from "@project-serum/anchor"
import { AnchorWallet, useAnchorWallet, useConnection } from "@solana/wallet-adapter-react"
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js"
import axios from "axios"
import React, { useCallback, useEffect, useState } from "react"
import toast from "react-hot-toast"
import { ThreeDots } from "react-loader-spinner"
import * as mime from "react-native-mime-types"
import { useNavigate } from "react-router-dom"
import useMint, { MintProps } from "react-solana-nftmint"

const cuid = init({ length: 12 })

const RPCD =
  "ADD_YOUR_RPC"

function getAnchorEnvironment(RPC: string, idl: any, wallet: AnchorWallet, programId: PublicKey) {
  const connection = new Connection(RPC, {
    commitment: "finalized",
  })
  const provider = new anchor.AnchorProvider(connection, wallet, {})
  anchor.setProvider(provider)
  //@ts-ignore
  const programClient = new anchor.Program(idl, programId)
  return [programClient, provider, connection]
}

enum CHARACTER_CLASS {
  WARRIOR = "Warrior",
  MAGE = "Mage",
  ROGUE = "Rogue",
  PRIEST = "Priest",
  PALADIN = "Paladin",
  HUNTER = "Hunter",
  DRUID = "Druid",
  WARLOCK = "Warlock",
  SHAMAN = "Shaman",
}

type NFT = {
  name: string
  symbol: string
  description: string
  seller_fee_basis_points: number
  image: string
  external_url: string
  collection: {
    name: string
    family: string
  }
  attributes: {
    trait_type: string
    value: string | number
  }[]
  edition: number
  properties: {
    files: {
      uri: string
      type: string
    }[]
    category: string
    creators: {
      address: string
      share: number
    }[]
  }
}

export default function CreateNFT() {
  const [name, setName] = useState("")
  const [points, setPoints] = useState(20)
  const [health, setHealth] = useState(5)
  const [stamina, setStamina] = useState(5)
  const [strength, setStrength] = useState(5)
  const [mana, setMana] = useState(0)
  const [mintPrice, setMintPrice] = useState<number>(0.001)
  const [attributes, setAttributes] = useState<{ trait_type: string; value: string }[]>([
    {
      trait_type: "Health",
      value: "5",
    },
    {
      trait_type: "Stamina",
      value: "5",
    },
    {
      trait_type: "Strength",
      value: "5",
    },
    {
      trait_type: "Mana",
      value: "0",
    },
    {
      trait_type: "Skill",
      value: "5",
    },
    {
      trait_type: "Intelligence",
      value: "5",
    },
    {
      trait_type: "Charisma",
      value: "5",
    },
    {
      trait_type: "Luck",
      value: "5",
    },
    {
      trait_type: "Class",
      value: "Warrior",
    },
  ])

  const [skill, setSkill] = useState(5)
  const [characterClass, setCharacterClass] = useState(CHARACTER_CLASS.WARRIOR)
  const [intelligence, setIntelligence] = useState(5)
  const [charisma, setCharisma] = useState(5)
  const [luck, setLuck] = useState(5)
  const [nft, setNft] = useState(JSON.stringify(baseNft))
  const wallet = useAnchorWallet()
  const [mintDescription, setMintDescription] = useState("Talisman The Game NFT")
  const [loading, setLoading] = useState(false)
  const [royalties, setRoyalties] = useState(500)
  const [royaltySplit, setRoyaltySplit] = useState(10)
  const [nftUrl, setNftUrl] = useState("https://talismangame.xyz")
  const [isMutable, setIsMutable] = useState(false)
  const [imgfile, setImgfile] = useState<string>(
    "https://shdw-drive.genesysgo.net/Aqn5ACrx2tsnnoKkJNoBnuBHX5nitSnaYA9h7tcK7iqg/00000_xv-nuQTuuixhbNkZ3j0_J.png"
  )
  const [tokenAccount, setTokenAccount] = useState<string>("")
  const [isUploading, setUploadLoading] = useState(false)
  const [signature, setSignature] = useState<string>("")

  const [collectionName, setCollectionName] = useState<string>("Talisman")
  const [collectionFamily, setCollectionFamily] = useState<string>("Rouge Games Inc")
  const [mintImageUrl, setMintImageUrl] = useState<string>("")
  const [mintJsonUrl, setMintJsonUrl] = useState<string>("")
  const anchorWallet = useAnchorWallet()
  const { connection } = useConnection()
  const navigate = useNavigate()

  const [nftProps, setNftProps] = useState<MintProps>({
    rpc: connection.rpcEndpoint,
    title: name,
    creators: [
      {
        address: anchorWallet?.publicKey,
        verified: false,
        share: 100, // sums must total 100 if you have more than one creator
      },
    ],
    mintPrice: new anchor.BN(mintPrice * LAMPORTS_PER_SOL),
    symbol: "TALISMAN",
    seller: new PublicKey("Code2raHfHLuM5RNepJwUc3ML16uAfvczm3k5FbjviNA"),
    royalty: royalties,
    tipRoyalty: royaltySplit,
    creatorRoyalty: 100 - royaltySplit,
    isMutable: isMutable,
  } as MintProps)
  const { mintNft, ready, uploading, error, mintSuccess } = useMint(nftProps, anchorWallet)

  const handleUploadNFT = useCallback(
    async (imageUrl: string) => {
      let filename = cuid() + ".json"
      let nftData = {
        name: name,
        image: imageUrl,
        symbol: "TALISMAN",
        description: mintDescription,
        seller_fee_basis_points: 500,
        external_url: nftUrl,
        collection: { name: collectionName || "", family: collectionFamily || "" },
        edition: 0,
        attributes: attributes.sort((a, b) => a.trait_type.localeCompare(b.trait_type)),
        properties: {
          category: "image",
          creators: [{ address: anchorWallet?.publicKey, share: 100 }],
          files: [{ uri: imageUrl, type: mime.lookup(imageUrl) }],
        },
      }
      const file = new File([JSON.stringify(nftData)], filename, {
        type: "application/json",
      })
      let files = createFileList([file]) as FileList
      let formData = new FormData()
      formData.append("fileupload", files[0])
      const response = await axios.post(`https://public.sdrive.app/secureupload?apiKey=talismanmint`, formData)
      console.log(response)
      if (response.status === 200) {
        axios.get(response.data).then((res) => console.log(res.data, JSON.stringify(res.data)))

        return response.data
      } else {
        return ""
      }
    },
    [
      anchorWallet,
      name,
      anchorWallet?.publicKey,
      mintDescription,
      collectionName,
      collectionFamily,
      attributes,
    ]
  )
  /*
  const handleUploadJpeg = useCallback(async () => {
    if (!imgfile) return
    let filename = cuid() + ".png"
    const file = new File([imgfile], filename, {
      type: imgfile.type,
    })
    let uploadfiles = createFileList([file]) as FileList
    let formData = new FormData()
    formData.append("fileupload", uploadfiles[0])
    const response = await axios.post(`/publicapi/secureupload`, formData)
    if (response.status === 200) {
      return response.data
    } else {
      return ""
    }
  }, [
    anchorWallet,
    name,
    imgfile,
    anchorWallet?.publicKey,
    mintDescription,
    collectionName,
    collectionFamily,
  ])*/

  const handleMint = useCallback(async () => {
    //make sure no stat has too many points
    if (
      health > 12 ||
      stamina > 12 ||
      strength > 12 ||
      skill > 12 ||
      intelligence > 12 ||
      charisma > 12 ||
      luck > 12
    ) {
      toast.error("Each stat must be between 1 and 12")
      return
    }
    //make sure name is not empty
    if (name === "") {
      toast.error("Give your character a name")
      return
    }
    //make sure name is not empty
    if (name.length < 2) {
      toast.error("Name must be no less than 2 characters")
      return
    }
    //make sure wallet is connected
    if (!anchorWallet) {
      toast.error("Wallet must be connected")
      return
    }
    setLoading(true)
    /*if(!imgfile) return;
    let imageUrl = await handleUploadJpeg().then(
      (url: string) => "https://files.sdrive.app/" + url.split("/")[url.split("/").length - 1]
    )
    */
    let imageUrl = imgfile
    console.log({ imageUrl })
    setMintImageUrl(imageUrl)
    let nftUrl: string = await handleUploadNFT(imageUrl).then(
      (url: string) => "https://files.sdrive.app/" + url.split("/")[url.split("/").length - 1]
    )
    console.log({ nftUrl })
    setMintJsonUrl(nftUrl)
    let result = await mintNft(nftUrl)
    setTokenAccount(result.token_account)
    setSignature(result.signature)
    setLoading(false)
    toast.success("Minting successful");
    const nftmints = localStorage.getItem("talisman/nftmints");
    if(nftmints){
        const nftmintsArray = JSON.parse(nftmints);
        nftmintsArray.push({address:result.token_account,url:nftUrl});
        localStorage.setItem("talisman/nftmints", JSON.stringify(nftmintsArray));    
    }else{
        localStorage.setItem("talisman/nftmints", JSON.stringify([{address:result.token_account,url:nftUrl}]));
    }
    navigate("/")
  }, [
    name,
    points,
    health,
    stamina,
    strength,
    skill,
    intelligence,
    charisma,
    luck,
    idl,
    anchorWallet,
  ])

  const handleChange = (stat: string, value: string) => {
    if (stat === "health") {
      let health = parseInt(value)
      if (health > 0 && health < 13) {
        let totalPoints =
          health + stamina + mana + strength + skill + intelligence + charisma + luck
        if (totalPoints <= 50) {
          setHealth(health)
          setPoints(50 - totalPoints)

          // Filter out the existing 'Health' attribute
          let updatedAttributes = attributes.filter((attr) => attr.trait_type !== "Health")

          // Add the new 'Health' attribute
          setAttributes([...updatedAttributes, { trait_type: "Health", value: value }])
        } else {
          if (points > 0) toast.error("Health must be between 2 and 12")
        }
      }
    }

    if (stat === "stamina") {
      let stamina = parseInt(value)
      if (stamina > 0 && stamina < 13) {
        let totalPoints =
          health + stamina + mana + strength + skill + intelligence + charisma + luck
        if (totalPoints <= 50) {
          setStamina(stamina)
          setPoints(50 - totalPoints)
        } else {
          if (points > 0) toast.error("Stamina must be between 2 and 12")
        }
        let updatedAttributes = attributes.filter((attr) => attr.trait_type !== "Stamina")
        setAttributes([...updatedAttributes, { trait_type: "Stamina", value: value }])
      }
    }
    if (stat === "mana") {
      let mana = parseInt(value)
      if (mana >= 0 && mana < 13) {
        let totalPoints =
          health + stamina + mana + strength + skill + intelligence + charisma + luck
        if (totalPoints <= 50) {
          setMana(mana)
          setPoints(50 - totalPoints)
        } else {
          if (points > 0) toast.error("Mana must be between 2 and 12")
        }
        let updatedAttributes = attributes.filter((attr) => attr.trait_type !== "Mana")
        setAttributes([...updatedAttributes, { trait_type: "Mana", value: value }])
      }
    }

    if (stat === "strength") {
      let strength = parseInt(value)
      if (strength > 0 && strength < 13) {
        let totalPoints =
          health + stamina + mana + strength + skill + intelligence + charisma + luck
        if (totalPoints <= 50) {
          setStrength(strength)
          setPoints(50 - totalPoints)
        } else {
          if (points > 0) toast.error("Strength must be between 2 and 12")
        }
        let updatedAttributes = attributes.filter((attr) => attr.trait_type !== "Strength")
        setAttributes([...updatedAttributes, { trait_type: "Strength", value: value }])
      }
    }
    if (stat === "skill") {
      let skill = parseInt(value)
      if (skill > 0 && skill < 13) {
        let totalPoints =
          health + stamina + mana + strength + skill + intelligence + charisma + luck
        if (totalPoints <= 50) {
          setSkill(skill)
          setPoints(50 - totalPoints)
        } else {
          if (points > 0) toast.error("Skill must be between 2 and 12")
        }
        let updatedAttributes = attributes.filter((attr) => attr.trait_type !== "Skill")
        setAttributes([...updatedAttributes, { trait_type: "Skill", value: value }])
      }
    }
    if (stat === "intelligence") {
      let intelligence = parseInt(value)
      if (intelligence > 0 && intelligence < 13) {
        let totalPoints =
          health + stamina + mana + strength + skill + intelligence + charisma + luck
        if (totalPoints <= 50) {
          setIntelligence(intelligence)
          setPoints(50 - totalPoints)
        } else {
          if (points > 0) toast.error("Intelligence must be between 2 and 12")
        }
        let updatedAttributes = attributes.filter((attr) => attr.trait_type !== "Intelligence")
        setAttributes([...updatedAttributes, { trait_type: "Intelligence", value: value }])
      }
    }
    if (stat === "charisma") {
      let charisma = parseInt(value)
      if (charisma > 0 && charisma < 13) {
        let totalPoints =
          health + stamina + mana + strength + skill + intelligence + charisma + luck
        if (totalPoints <= 50) {
          setCharisma(charisma)
          setPoints(50 - totalPoints)
        } else {
          if (points > 0) toast.error("Charisma must be between 2 and 12")
        }
        let updatedAttributes = attributes.filter((attr) => attr.trait_type !== "Charisma")
        setAttributes([...updatedAttributes, { trait_type: "Charisma", value: value }])
      }
    }
    if (stat === "luck") {
      let luck = parseInt(value)
      if (luck > 0 && luck < 13) {
        let totalPoints =
          health + stamina + mana + strength + skill + intelligence + charisma + luck
        if (totalPoints <= 50) {
          setLuck(luck)
          setPoints(50 - totalPoints)
        } else {
          if (points > 0) toast.error("Luck must be between 2 and 12")
        }
      }
      let updatedAttributes = attributes.filter((attr) => attr.trait_type !== "Luck")
      setAttributes([...updatedAttributes, { trait_type: "Luck", value: value }])
    }
  }

  const handleChangeClass = (e: { target: { value: string } }) => {
    setCharacterClass(CHARACTER_CLASS[e.target.value as unknown as keyof typeof CHARACTER_CLASS])
    let updatedAttributes = attributes.filter((attr) => attr.trait_type !== "Class")
    setAttributes((prev) => {
      return [
        ...updatedAttributes,
        {
          trait_type: "Class",
          value: e.target.value as string,
        },
      ]
    })
  }

  return (
    <div className="w-full h-full flex flex-col bg-slate-100 dark:bg-slate-700">
      <div className="h-full grow relative">
        <div className="left-2 top-3 absolute">
          <ThreeDots visible={loading} height="50" width="50" wrapperStyle={{}} />
        </div>
        <div className="flex justify-center p-2 text-3xl">Create your character</div>
        <div className="flex justify-center p-2 font-bold">Points left: {points}</div>

        <div className="grid grid-cols-2 gap-4 text-md p-2">
          <div className="grid grid-cols-[70px,1fr] items-center gap-2">
            <label htmlFor="name" className="">
              Name
            </label>
            <input
              className="py-1 px-2 border-slate-400 w-full border rounded bg-transparent"
              value={name}
              autoComplete="off"
              onChange={(e) => {
                setName(e.target.value)
              }}
              type="text"
              name="name"
              id="name"
              placeholder="Your hero's name"
            />
          </div>
          <div className="grid grid-cols-[70px,1fr] items-center gap-2">
            <label htmlFor="name" className="">
              Class
            </label>
            <select
              defaultValue={characterClass}
              onChange={(e) =>
                handleChangeClass(e as unknown as { target: { value: CHARACTER_CLASS } })
              }
              className="py-1 px-2 border-slate-400 w-full border rounded bg-transparent"
            >
              <option value={CHARACTER_CLASS.DRUID}>{CHARACTER_CLASS.DRUID}</option>
              <option value={CHARACTER_CLASS.MAGE}>{CHARACTER_CLASS.MAGE}</option>
              <option value={CHARACTER_CLASS.PALADIN}>{CHARACTER_CLASS.PALADIN}</option>
              <option value={CHARACTER_CLASS.ROGUE}>{CHARACTER_CLASS.ROGUE}</option>
              <option value={CHARACTER_CLASS.WARRIOR}>{CHARACTER_CLASS.WARRIOR}</option>
              <option value={CHARACTER_CLASS.PRIEST}>{CHARACTER_CLASS.PRIEST}</option>
              <option value={CHARACTER_CLASS.HUNTER}>{CHARACTER_CLASS.HUNTER}</option>
              <option value={CHARACTER_CLASS.WARLOCK}>{CHARACTER_CLASS.WARLOCK}</option>
              <option value={CHARACTER_CLASS.SHAMAN}>{CHARACTER_CLASS.SHAMAN}</option>
            </select>
          </div>

          <div className="grid grid-cols-[70px,1fr] items-center gap-2">
            <label htmlFor="health" className="">
              Health
            </label>
            <input
              className="py-1 px-2 border-slate-400 border rounded bg-transparent"
              value={health}
              min={2}
              max={12}
              type="number"
              onChange={(e) => handleChange("health", e.target.value)}
              name="health"
              placeholder="Health"
              id="health"
            />
          </div>
          <div className="grid grid-cols-[70px,1fr] items-center gap-2">
            <label htmlFor="stamina" className="">
              Stamina
            </label>
            <input
              className="py-1 px-2 border-slate-400 border rounded bg-transparent"
              value={stamina}
              min={2}
              max={12}
              type="number"
              onChange={(e) => handleChange("stamina", e.target.value)}
              name="stamina"
              id="stamina"
              placeholder="Stamina"
            />
          </div>
          <div className="grid grid-cols-[70px,1fr] items-center gap-2">
            <label htmlFor="strength" className="">
              Strength
            </label>
            <input
              className="py-1 px-2 border-slate-400 border rounded bg-transparent"
              value={strength}
              min={2}
              max={12}
              type="number"
              onChange={(e) => handleChange("strength", e.target.value)}
              name="strength"
              id="strength"
              placeholder="Strength"
            />
          </div>
          <div className="grid grid-cols-[70px,1fr] items-center gap-2">
            <label htmlFor="luck" className="">
              Luck
            </label>
            <input
              className="py-1 px-2 border-slate-400 border rounded bg-transparent"
              value={luck}
              min={2}
              max={12}
              type="number"
              onChange={(e) => handleChange("luck", e.target.value)}
              name="luck"
              id="luck"
              placeholder="Luck"
            />
          </div>
          <div className="grid grid-cols-[70px,1fr] items-center gap-2">
            <label htmlFor="skill" className="">
              Skill
            </label>
            <input
              className="py-1 px-2 border-slate-400 border rounded bg-transparent"
              value={skill}
              min={2}
              max={12}
              type="number"
              onChange={(e) => handleChange("skill", e.target.value)}
              name="skill"
              id="skill"
              placeholder="Skill"
            />
          </div>
          <div className="grid grid-cols-[70px,1fr] items-center gap-2">
            <label htmlFor="skill" className="">
              Mana
            </label>
            <input
              className="py-1 px-2 border-slate-400 border rounded bg-transparent"
              value={mana}
              min={0}
              max={12}
              type="number"
              onChange={(e) => handleChange("mana", e.target.value)}
              name="mana"
              id="mana"
              placeholder="Mana"
            />
          </div>
          <div className="grid grid-cols-[70px,1fr] items-center gap-2">
            <label htmlFor="skill" className="">
              Intelligence
            </label>
            <input
              className="py-1 px-2 border-slate-400 border rounded bg-transparent"
              value={intelligence}
              min={2}
              max={12}
              type="number"
              onChange={(e) => handleChange("intelligence", e.target.value)}
              name="intelligence"
              id="intelligence"
              placeholder="Intelligence"
            />
          </div>
          <div className="grid grid-cols-[70px,1fr] items-center gap-2">
            <label htmlFor="skill" className="">
              Charisma
            </label>
            <input
              className="py-1 px-2 border-slate-400 border rounded bg-transparent"
              value={charisma}
              min={2}
              max={12}
              type="number"
              onChange={(e) => handleChange("charisma", e.target.value)}
              name="charisma"
              id="charisma"
              placeholder="Charisma"
            />
          </div>
        </div>
      </div>

      <div className="p-2">
        <Button text="Mint" variant={VARIANT.SMALL} onClick={handleMint} />
      </div>

      <div className="hidden">
        {attributes.map((attribute) => (
          <div key={attribute.trait_type}>
            {attribute.trait_type}: {attribute.value}
          </div>
        ))}
      </div>
    </div>
  )
}
