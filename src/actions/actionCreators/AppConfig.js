import * as types from '../actionTypes/AppConfigTypes';

export function enterDebug() {
  const testData = { walletName: 'My Test Wallet Name' };
  return (dispatch) => {
    dispatch({ type: types.DEBUG_MODE, payload: testData });
  };
}

/**
 * This action is used to track if the user is in the setup screens.
 */
export function exitSetup(flag) {
  return (dispatch) => {
    dispatch({ type: types.EXIT_SETUP_SCREEN, payload: flag });
  };
}

/**
 * Initializes the app with the default token list
 */
export function initializeAppTokenState(initTokenData) {
  return (dispatch) => {
    dispatch({ type: types.INITIALIZE_APP_TOKEN_SETUP, payload: initTokenData });
  };
}

/**
 * Set temporary state wallet name until wallet is created/saved to async
 */
export function setTempWalletName(walletName) {
  return (dispatch) => {
    dispatch({ type: types.TEMP_WALLET_NAME, payload: walletName });
  };
}

/**
 * Initializes a wallet within the app.
 * If previosWalletState.length = 0 means its the users first wallet in the app.
 */
export function initializeAppWallet(currentWallet, walletName, previousWalletState) {
  let appWallets = [];  
  if (previousWalletState.length > 0) { 
    for (let i = 0; i < previousWalletState.length; i++) {
      let previousWallet = {};
      previousWallet.name = previousWalletState[i].name;
      previousWallet.hdWallet = previousWalletState[i].hdWallet;
      previousWallet.publicKey = previousWalletState[i].hdWallet.address;
      appWallets.push(previousWallet);
    }
  }
  let walletObject = {};
  walletObject.name = walletName;
  walletObject.hdWallet = currentWallet;
  walletObject.publicKey = currentWallet.address;
  appWallets.push(walletObject);
  return (dispatch) => {
    dispatch({ type: types.INITIALIZE_NEW_APP_WALLET, payload: appWallets });
  };
}

/**
 * Set temporary state wallet name until wallet is created/saved to async
 */
export function setWalletPassword(password) {
  return (dispatch) => {
    dispatch({ type: types.SET_APP_PASSWORD, payload: password });
  };
}

export function setHotWallet(walletObj) {
  const { name, wallet } = walletObj;
  const pKey = wallet.address;
  return (dispatch) => {
    dispatch({ type: types.CONFIG_HOT_WALLET, payload: { wallet, publicKey: pKey, name } });
  };
}
