import { IonButton, IonCard, IonChip, IonImg, IonProgressBar, IonTitle } from '@ionic/react';
import './ExploreContainer.css';
import { Chain, useChainId, useContractRead, useContractWrite, useNetwork, useSwitchNetwork } from 'wagmi';
import { homeChain, mintContract } from '../config';
import { useEffect, useState } from 'react';
import { formatEther } from 'viem';

interface ContainerProps {
  name: string;
}
async function addNetworkToMetaMask(chain: Chain) {
  if (!chain) {
    return;
  }
  const networkData = {
    chainId: `0x${chain.id.toString(16)}`, // Convert the chain ID to a hex string
    chainName: "Avalanche Fuji Testnet",
    nativeCurrency: chain.nativeCurrency,

    iconUrls: ["https://snowtrace.io/images/logo.svg?v=23.11.2.0"],
    rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
    blockExplorerUrls: ["https://testnet.snowtrace.io/"], // Map block explorer objects to their URLs
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

const pricePack = 300000000000000000n
const individualPrice = 123000000000000000n

const Mint: React.FC<ContainerProps> = () => {
  const chainId = useChainId();
  const { switchNetwork } = useSwitchNetwork({ chainId: homeChain.id })
  const { chain, chains } = useNetwork()
  const [hash, setHash] = useState<string | null>(null);
  useEffect(() => {
    homeChain && addNetworkToMetaMask(homeChain);
    switchNetwork && switchNetwork(homeChain.id)
  }, [chainId, switchNetwork, chain])
  // const { data: pricePack } = useContractRead({ ...mintContract as any, functionName: "packPrice" });
  const { data: name } = useContractRead({ ...mintContract as any, functionName: "name" });
  const { write: mintPack, isLoadingPack, isSuccessPack, isErrorPack, errorPack, statusPack } = useContractWrite({
    ...mintContract,
    functionName: "mintPack",
    args: [1n],
    value: pricePack as any
  })

  const { write: mint, isLoading, isSuccess, isError, error, status } = useContractWrite({
    ...mintContract,
    functionName: "mint",
    args: [1n],
    value: individualPrice as any
  })

  return (
    <>
    <IonCard>
      <IonTitle>
        <IonButton color='tertiary' fill='solid' disabled={!mintPack} onClick={() => mintPack()}>
          mintPack
          <IonChip color='success'>
            {/* {formatEther(pricePack as any)} {homeChain.nativeCurrency.symbol} */}
          </IonChip>
        </IonButton>
        {statusPack}
        {isLoadingPack && <IonProgressBar type='indeterminate' />}
        {isErrorPack && <IonChip color='danger'>{errorPack?.message}</IonChip>}
        {isSuccessPack && <IonChip color='success'>Minted</IonChip>}

      </IonTitle>
    </IonCard>

    <IonCard>
    <IonTitle>
      <IonButton color='tertiary' fill='solid' disabled={!mint} onClick={() => mint()}>
        mint
        <IonChip color='success'>
          {/* {formatEther(pricePack as any)} {homeChain.nativeCurrency.symbol} */}
        </IonChip>
      </IonButton>
      {status}
      {isLoading && <IonProgressBar type='indeterminate' />}
      {isError && <IonChip color='danger'>{error?.message}</IonChip>}
      {isSuccess && <IonChip color='success'>Minted</IonChip>}

    </IonTitle>
    </IonCard>
    </>
  );
};

export default Mint;
