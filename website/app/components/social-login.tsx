"use client";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react";
import { connect, disconnect } from "starknetkit";
import { provider } from "../../utils/constants";

interface IWalletConnection {
  wallet?: any;
  address?: string;
  email?: string;
}

interface SocialLoginProps {
  simpleStyle?: boolean;
}

export default function SocialLogin({ simpleStyle = false }: SocialLoginProps) {
  const router = useRouter()
  const { login, logout, loginWithWallet } = useAuth()
  const [walletConnection, setWalletConnection] = useState<IWalletConnection | null>(null);
  const { setAccount, setWallet } = useAuth();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedAddress = localStorage.getItem("walletAddress");
      if (storedAddress) {
        setWalletConnection({ address: storedAddress });
      }
    }
  }, []);

  const handleConnect = async (event: any) => {
    event.preventDefault();
    try {
      const result = await connect({
        modalMode: "alwaysAsk",
        modalTheme: "light",
        dappName: "StarknetKit",
        resultType: "wallet",
      });
      if (result.wallet && result.connectorData) {
        const address = result.connectorData.account;
        setWalletConnection({
          wallet: result.wallet,
          address: address,
        });
        localStorage.setItem("walletAddress", address || '');
        console.log("Wallet connected:", result, "Address:", address);

        // login({
        //   walletAddress: address
        // })

        if (address) {
          loginWithWallet(address)
        }

        let account = await result.connector?.account(provider);
        setAccount(account);
        setWallet(result.wallet);
        

        // if (true) {
        //   router.push(`/signup?address=${address}`)
        // } else {
        //   router.push("/dashboard")
        // }

      } else {
        console.error("No wallet found in connection result.");
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const handleDisconnect = async (event: any) => {
    event.preventDefault();
    try {
      await disconnect();
      setWalletConnection(null);
      localStorage.removeItem("walletAddress");
      localStorage.removeItem("nftSrc");
      logout();
      console.log("Wallet disconnected");
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    }
  };

  return (
    <>
      {walletConnection?.address ? (
        <button
          className={`self-center ${simpleStyle ? 'w-full h-full' : 'bg-darkblue text-white py-2 px-6 md:py-3 md:px-10 rounded-md text-xs md:text-sm shadow-xl hover:bg-starkorange active:bg-darkblue ease-in-out duration-500 active:duration-0 shadow-gray-400'}`}
          onClick={handleDisconnect}
        >
          Log out
        </button>
      ) : (
        <button
          className={`self-center ${simpleStyle ? 'w-full h-full' : 'bg-darkblue text-white py-2 px-6 md:py-3 md:px-10 rounded-md text-xs md:text-sm shadow-xl hover:bg-starkorange active:bg-darkblue ease-in-out duration-500 active:duration-0 shadow-gray-400'}`}
          onClick={handleConnect}
        >
          Sign In
        </button>
      )}
    </>
  );
}
