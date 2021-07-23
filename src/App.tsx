import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import { useEffect } from 'react';

var enc = new TextEncoder();

const cose_alg_ECDSA_w_SHA256 = -7;

const createPublicKeyCrendential = () => {
  // should get from server
  const options: CredentialCreationOptions = {
    publicKey: {
      rp: { name: 'localhost' },
      user: {
        name: 'John Wick',
        id: enc.encode('1'),
        displayName: 'John W.',
      },
      pubKeyCredParams: [
        { type: 'public-key', alg: cose_alg_ECDSA_w_SHA256 }
      ],
      challenge: enc.encode('challenge'),
      authenticatorSelection: { authenticatorAttachment: 'platform' },
      attestation: 'direct'
    }
  }

  return navigator.credentials.create(options);
};

const getPublicKeyCrendential = () => {
  const options: CredentialRequestOptions = {
    publicKey: {
      challenge: enc.encode('challenge'),
      allowCredentials: [{
        type: 'public-key',
        id: enc.encode("OEX-QOVWLA59Z2Rfrcnby9Fg9h8"),
        transports: ['internal']
      }]
    }
  }

  return navigator.credentials.get(options);
}

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [asked, setAsked] = useState(false);
  const [touchIDAvailable, setTouchIDAvailable] = useState(false);

  const acceptTouchID = async () => {
    const publicKeyCrendential = await createPublicKeyCrendential();
    console.log({ publicKeyCrendential });

    // TODO: implement call to server to register

    setAsked(true);

    return publicKeyCrendential;
  }

  const dismissTouchID = () => {
    setAsked(true);
  }

  const onSubmit: React.FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();
    setLoggedIn(true);
  }

  const signInAsJohn = async () => {
    const publicKeyCrendential = await getPublicKeyCrendential();
    console.log({ publicKeyCrendential });

    // TODO: implement call to check with server-side

    setLoggedIn(true);
  }

  useEffect(() => {
    PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable().then(available => {
      setTouchIDAvailable(available);
    });
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Daytech Land</h1>
        {!loggedIn && (
          <form className="App-LoginForm" onSubmit={onSubmit}>
            <input placeholder="username" />
            <input placeholder="password" />
            <button type="submit" >Login</button>
          </form>
        )}
        {loggedIn && !asked && touchIDAvailable && (
          <div>
            <p>Would you like to use TouchID to bypass login for the next time?</p>
            <button onClick={acceptTouchID}>OK</button>
            <button onClick={dismissTouchID}>Cancel</button>
          </div>
        )}
        {!loggedIn && touchIDAvailable && (
          <button onClick={signInAsJohn}>Sign as John</button>
        )}
        {loggedIn && asked && (
          <p>You're logged in.</p>
        )}
      </header>
    </div>
  );
}

export default App;
