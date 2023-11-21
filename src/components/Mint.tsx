import { IonButton, IonCard, IonChip, IonImg, IonProgressBar, IonTitle } from '@ionic/react';
import './ExploreContainer.css';
import { Chain, useChainId, useContractRead, useContractWrite, useNetwork, useSwitchNetwork} from 'wagmi';
import { homeChain, mintContract } from '../config';
import { useEffect, useState } from 'react';
import { formatEther} from 'viem';
import logoTransparent from '../assets/logo_transparent.png'
import leftImage from '../assets/leftImage.png'
import rightImage from '../assets/rightImage.png'
import MintButtonPack from './MintButtonPack';
import MintButtonIndividual from './MintButtonIndividual';
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


const Mint: React.FC<ContainerProps> = () => {
  const [hash, setHash] = useState<string | null>(null);
 

  // useEffect(() => {
  //   homeChain && addNetworkToMetaMask(homeChain);
  //   switchNetwork && switchNetwork(homeChain.id)
  // }, [chainId, switchNetwork, chain])
  // const { data: pricePack } = useContractRead({ ...mintContract as any, functionName: "packPrice" });
  const { data: name } = useContractRead({ ...mintContract as any, functionName: "name" });
  // const { write: mintPack } = useContractWrite({
  //   ...mintContract,
  //   functionName: "mintPack",
  //   // args: [1n],
  //   // value: pricePack as any
  // })

  // const { write: mint} = useContractWrite({
  //   ...mintContract,
  //   functionName: "mint",
  //   // args: [1n],
  //   // value: individualPrice as any
  // })

  const { data: totalSupplyData } = useContractRead({
    address: mintContract.address,
    abi: mintContract.abi,
    functionName: 'maxSupply',
    watch: true,
  });

  const { data: currentSupplyData } = useContractRead({
    address: mintContract.address,
    abi: mintContract.abi,
    functionName: 'totalSupply',
    watch: true,
  });


  return (

    <div className="App">
      <header className="App-header">
        <img src={logoTransparent} alt="logo" style={{ width: '650px', height: '250px' }}  />
        
        <div className="minting-container">
          <img src={leftImage} alt="Left Image" className="side-image emboss-effect" />
          <div className="minting-content">
            <div className="button-container">
            <MintButtonPack/>

            <IonCard>
              <IonTitle>
                <span style={{ color: '#fff' }}> Progress: { currentSupplyData ? (currentSupplyData as BigInt).toString() : '0'} / { totalSupplyData ? (totalSupplyData as BigInt).toString() : '0'} </span>
                </IonTitle>
            </IonCard>

            </div>
            <div className="button-container">
              <MintButtonIndividual/>
            </div>
          </div>
          
          <img src={rightImage} alt="Right Image" className="side-image emboss-effect" />
        </div>
        
      </header>

    
    </div>

  );
};

export default Mint;
