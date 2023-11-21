import { IonButton, IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useParams } from 'react-router';
import { useAccount, useBalance, useConnect } from 'wagmi';
import ConnectButton from '../components/ConnectButton';
import './Page.css';

import { InjectedConnector } from 'wagmi/connectors/injected';
import Mint from '../components/Mint';

// const connector = new InjectedConnector()
const Page: React.FC = () => {

  const { name } = useParams<{ name: string; }>();
  // const { connect } = useConnect()
  // const account = useAccount()
  // const balance = useBalance()
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{name}</IonTitle>
          <IonButtons slot='end'>
            {/* {typeof account.address === 'undefined' ?
              <IonButton onClick={() => connect({ connector })}>
                Login
              </IonButton> : <IonButton>
                {account.address} */}
              {/* </IonButton>} */}
              <ConnectButton />
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{name}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <Mint name={name} />
      </IonContent>
    </IonPage>
  );
};

export default Page;
