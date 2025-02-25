'use client'
import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import { ethers } from 'ethers'
import Toast from './base/toast'

export default function SocketListener() {
    const socketRef = useRef<any>(null)
    const [isWalletConnected, setIsWalletConnected] = useState(false)
    const { notify } = Toast

    const connectWallet = async () => {
        if (typeof window.ethereum === 'undefined') {
            notify({
                type: 'error',
                message: 'MetaMask not detected! Please install MetaMask to use this feature.'
            })
            return false
        }

        try {
            const provider = new ethers.BrowserProvider(window.ethereum)
            const accounts = await provider.send('eth_requestAccounts', [])

            if (accounts.length > 0) {
                setIsWalletConnected(true)
                return provider
            }
            return false
        } catch (error) {
            console.error('Error connecting to wallet:', error)
            notify({
                type: 'error',
                message: 'Failed to connect to wallet. Please try again.'
            })
            return false
        }
    }

    const signMessage = async (message: string) => {
        try {
            const provider = await connectWallet()
            if (!provider) return

            const signer = await provider.getSigner()
            const signature = await signer.signMessage(message)

            console.log('Message signed successfully:', signature)
            notify({
                type: 'success',
                message: 'Message signed successfully!'
            })

            return signature
        } catch (error) {
            console.error('Error signing message:', error)
            notify({
                type: 'error',
                message: 'Failed to sign message. User may have rejected the request.'
            })
            return null
        }
    }

    useEffect(() => {
        console.log('Connecting to socket...')
        socketRef.current = io()

        socketRef.current.on('connect', () => {
            console.log('Socket connected with ID:', socketRef.current.id)
        })

        socketRef.current.on('tokens', async (data: any) => {
            console.log('Received tokens event:', data)

            // Determine what message to sign - you can customize this based on the data
            const messageToSign = JSON.stringify(data)

            // Prompt user to sign the message
            const signature = await signMessage(messageToSign)

            // If signature was successful, you can emit a response back to the server
            if (signature) {
                socketRef.current.emit('signature', {
                    originalData: data,
                    signature,
                    messageToSign,
                    timestamp: Date.now()
                })
            }
        })

        socketRef.current.on('disconnect', () => {
            console.log('Socket disconnected')
        })

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect()
            }
        }
    }, [])

    return null // This component doesn't render anything
} 