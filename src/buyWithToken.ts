import { createTransferInstruction, createAssociatedTokenAccountInstruction, getAssociatedTokenAddress, getAccount } from "@solana/spl-token"
import { WalletNotConnectedError, SignerWalletAdapterProps } from "@solana/wallet-adapter-base"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { PublicKey, Transaction, Connection, TransactionInstruction, VersionedTransaction } from "@solana/web3.js"
import React from "react"

export const configureAndSendCurrentTransaction = async (
  transaction: Transaction,
  connection: Connection,
  feePayer: PublicKey,
  signTransaction: SignerWalletAdapterProps["signTransaction"]
) => {
  const blockHash = await connection.getLatestBlockhash()
  transaction.feePayer = feePayer
  transaction.recentBlockhash = blockHash.blockhash
  const signed = await signTransaction(transaction)
  const signature = await connection.sendRawTransaction(signed.serialize())
  await connection.confirmTransaction({
    blockhash: blockHash.blockhash,
    lastValidBlockHeight: blockHash.lastValidBlockHeight,
    signature,
  })
  return signature
}

export default async function buyWithToken(
  connection: Connection,
  publicKey: PublicKey,
  signTransaction: <T extends Transaction | VersionedTransaction>(transaction: T) => Promise<T>,
  amount: number,
  token: string,
  token_recipient: string
) {
  return new Promise(async (resolve, reject) => {
    try {
      const mintToken = new PublicKey(token)
      const recipientAddress = new PublicKey(token_recipient)

      const transactionInstructions: TransactionInstruction[] = []
      const associatedTokenFrom = await getAssociatedTokenAddress(mintToken, publicKey)
      const fromAccount = await getAccount(connection, associatedTokenFrom)
      const associatedTokenTo = await getAssociatedTokenAddress(mintToken, recipientAddress)
      if (!(await connection.getAccountInfo(associatedTokenTo))) {
        transactionInstructions.push(createAssociatedTokenAccountInstruction(publicKey, associatedTokenTo, recipientAddress, mintToken))
      }
      transactionInstructions.push(
        createTransferInstruction(
          fromAccount.address, // source
          associatedTokenTo, // dest
          publicKey,
          amount * 100000 // BONK has 6 decimals
        )
      )
      const transaction = new Transaction().add(...transactionInstructions)
      const signature = await configureAndSendCurrentTransaction(transaction, connection, publicKey, signTransaction)
      resolve(signature)
    } catch (error) {
      reject(error)
    }
  })
}
