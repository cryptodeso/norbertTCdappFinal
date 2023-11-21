import { IonButton, IonCard, IonChip, IonImg, IonItem, IonList, IonProgressBar, IonText, IonTitle } from '@ionic/react';
import './ExploreContainer.css';
import { Chain, useChainId, useContractRead, useContractWrite, useNetwork, useSwitchNetwork } from 'wagmi';
import { homeChain, mintContract } from '../config';
import { useEffect, useState } from 'react';
import { formatEther } from 'viem';
import './App.css'

interface ContainerProps {
    name: string;
}
async function addNetworkToMetaMask(chain: Chain) {
    if (!chain) {
        return;
    }
    const networkData = {
        chainId: `0x${chain.id.toString(16)}`, // Convert the chain ID to a hex string
        chainName: "Avalanche Testnet",
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

const individualPrice = 123000000000000000n

const MintButton: React.FC = () => {
    const chainId = useChainId();
    const { switchNetwork } = useSwitchNetwork({ chainId: homeChain.id })
    const { chain, chains } = useNetwork()
    const [hash, setHash] = useState<string | null>(null);
    const [sliderValue2, setSliderValue2] = useState(1);

    useEffect(() => {
        homeChain && addNetworkToMetaMask(homeChain);
        switchNetwork && switchNetwork(homeChain.id)
    }, [chainId, switchNetwork, chain])

    const { write: mintPack, isLoading, isSuccess, isError, error, status } = useContractWrite({
        ...mintContract,
        functionName: "mint",
    })

    return (
        <IonList >
            <IonButton color='tertiary'  className="my-class" fill='solid' disabled={!mintPack} onClick={() => mintPack({args: [sliderValue2], value: individualPrice*BigInt(sliderValue2)})}>
            mint ({sliderValue2}  {sliderValue2 === 1 ? 'card' : 'cards'}) [{(sliderValue2 * 0.123).toFixed(3)} $AVAX]
                <IonChip color='success'>
                    {/* {pricePack ? formatEther(pricePack as any) : <></>} {homeChain.nativeCurrency.symbol} */}
                </IonChip>
            </IonButton>

            <div className="slider-container">
                <input
                    type="range"
                    min="1"
                    max="10"
                    value={sliderValue2}
                    onChange={(event) => setSliderValue2(Number(event.target.value))}
                    step="1"
                    className="slider"
                />
            <div className="slider-labels">
                {[...Array(10)].map((_, index) => (<span key={index} className="label">{index + 1}</span>))}
                </div>
            </div>
        </IonList>
        
    );
};

export default MintButton;