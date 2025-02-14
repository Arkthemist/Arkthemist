"use client";
import { ARGENT_WEBWALLET_URL, CHAIN_ID, provider } from "@/constants";
import { activeChainId } from "../../state/activeChain";
import { walletStarknetkitLatestAtom } from "@/state/connectedWallet";
import { useAtom } from "jotai";
import { connect, disconnect } from "starknetkit";

export default function WalletConnector() {
  const [wallet, setWallet] = useAtom(walletStarknetkitLatestAtom);
  const [activeChain, setActiveChain] = useAtom(activeChainId);

  const handleNetwork = (chainId?: string, accounts?: string[]) => {
    setActiveChain(chainId);
  };

  wallet?.on("networkChanged", handleNetwork);

  const handleConnect = async (event: any) => {
    try {
      const { wallet } = await connect({
        modalMode: "alwaysAsk",
        webWalletUrl: ARGENT_WEBWALLET_URL,
        argentMobileOptions: {
          dappName: "Starknetkit example dapp",
          url: window.location.hostname,
          chainId: CHAIN_ID,
          icons: [],
        },
      });

      setWallet(wallet);
      setActiveChain((wallet as any)?.chainId);
    } catch (e) {
      console.error(e);
      alert((e as any).message);
    }
  };

  const handleDisconnect = async (event: any) => {
    event.preventDefault();
    try {
      await disconnect();
      setWallet(undefined);
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    }
  };

  return (
    <div className="flex justify-center items-center">
      {wallet ? (
        <button
          className="text-sm hover:text-accent transition-colors px-8 py-3 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 transition-colors text-center"
          onClick={handleDisconnect}
        >
          Log Out
        </button>
      ) : (
        <button
          className="text-sm hover:text-accent transition-colors px-8 py-3 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 transition-colors text-center"
          onClick={handleConnect}
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}
