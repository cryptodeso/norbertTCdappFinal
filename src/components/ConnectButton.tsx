import { IonButton } from '@ionic/react';
import { useEffect, useState } from 'react';
import { Chain, useAccount, useBalance, useChainId, useConnect, useNetwork, useSwitchNetwork } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { homeChain } from '../config';
import './ExploreContainer.css';

interface ContainerProps {
    name: string;
}
async function addNetworkToMetaMask(chain: Chain) {
    if (!chain) {
        return;
    }
    const networkData = {
        chainId: `0x${chain.id.toString(16)}`, // Convert the chain ID to a hex string
        chainName: "Avalanche",
        nativeCurrency: chain.nativeCurrency,

        iconUrls: ["https://snowtrace.io/images/logo.svg?v=23.11.2.0"],
        rpcUrls: ["https://avax.meowrpc.com"],
        blockExplorerUrls: ["https://snowtrace.io/"], // Map block explorer objects to their URLs
    };
    // Check if MetaMask is installed
    const ethereum = (window as any).ethereum
    if (typeof ethereum !== 'undefined') {
        try {
            // Try to switch to the network (by its chain ID)
            await ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: networkData.chainId }],
            });
        } catch (switchError: any) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code === 4902) {
                try {
                    // Try to add the new network
                    await ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [networkData],
                    });
                } catch (addError) {
                    // Handle any errors that occur when trying to add the new network
                    console.error('Could not add network to MetaMask', addError);
                }
            } else {
                // Handle other errors
                console.error('Could not switch to the network in MetaMask', switchError);
            }
        }
    } else {
        console.log('MetaMask is not installed!');
    }
}

const ConnectButton: React.FC = () => {
    const chainId = useChainId();
    const { switchNetwork } = useSwitchNetwork({ chainId: homeChain.id })
    const { chain, chains } = useNetwork()
    const { address } = useAccount();
    const [hash, setHash] = useState<string | null>(null);
    const connector = new InjectedConnector()
    const { connect } = useConnect()
    const account = useAccount()
    const balance = useBalance()

    useEffect(() => {
        homeChain && addNetworkToMetaMask(homeChain);
        switchNetwork && switchNetwork(homeChain.id)
    }, [chainId, switchNetwork, chain])

    return typeof address === 'undefined' ?
        <IonButton onClick={() => connect({ connector })}>
            Login
        </IonButton> : <IonButton>
            {address.slice(0, 6) + "..." + address.slice(35, 42)}
        </IonButton>;
}
export default ConnectButton;