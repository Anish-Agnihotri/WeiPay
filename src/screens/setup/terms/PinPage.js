import React, { Component } from 'react';
import {
  View, TouchableWithoutFeedback, StyleSheet, Text, Keyboard, Dimensions, SafeAreaView,
} from 'react-native';
import RF from 'react-native-responsive-fontsize';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { FormInput } from 'react-native-elements';
import * as actions from '../../../actions/actionCreators/AppConfig';
import LinearButton from '../../../components/LinearGradient/LinearButton';
import BoxShadowCard from '../../../components/ShadowCards/BoxShadowCard';
import BackWithMenuNav from '../../../components/customPageNavs/BackWithMenuNav';

const ethers = require('ethers');

/**
 * Initial pin screen. encrypts a new wallet
 * 
 * By default the hotWallet will reference this wallet
 */
class PinPage extends Component {
  /**
   * A new wallet is created, the wallet name is passed in along with usersWallets, which will be an 
   * empty array when user initially creates a wallet in setup.
   */
  constructor(props) {
    super(props);
    this.state = {
      walletObjecet: {},
      password: '',
      isValidLength: false,
    };
  }

  /**
 * this.props.isInSetupScreens will be false if the user has not entered the main page and completed
 * the app setup. This will be an indication on whether we are going to be decrypting wallet from the
 * state or will be passed a unencrypted wallet from the previous page.
 * After the user initializes the app, set isInSetupScreen to false - this will persist
 * If true -> take wallet from nav param & encrypt with password from state, initiali wallets with this
 *  - setHotWallet with unencrypted wallet, public key in action creator, and wallet name
 *  - set isInSetupScreens to false so we dont repeat this process when app loads again
 * If false -> need to get wallet & decrypt & save to hot wallet
 */
  navigate = async () => {
    if(this.state.password.length >= 4) {
      const userWallets = this.props.wallets;
      let walletNameCheck;
      if(this.props.debugMode) {
        walletNameCheck = this.props.testWalletName;
      } else {
        walletNameCheck = this.props.tempWalletName;
      }    
      if(this.props.isInSetupScreens) {
        const { nextScreenToNavigate, wallet } = this.props.navigation.state.params;
        await this.setState({walletObjecet: wallet});
        const encryptedWallet = await wallet.encrypt(this.state.password);
        const walletInHotReducer = { wallet, name: walletNameCheck };
        this.props.setHotWallet(walletInHotReducer);
        this.props.initializeAppWallet(encryptedWallet, walletNameCheck, userWallets);
        this.props.exitSetup(false);
        const navigateToNextScreen = NavigationActions.navigate({
          routeName: nextScreenToNavigate,
        });
        this.props.navigation.dispatch(navigateToNextScreen);
      } else {
        let encryptedWallet = this.props.wallets[0].hdWallet;      
        const decryptedWallet = await ethers.Wallet.fromEncryptedWallet(encryptedWallet, this.state.password);
        if(Object.prototype.hasOwnProperty.call(decryptedWallet, 'privateKey')){        
          const walletInHotReducerDecrypted = { wallet: decryptedWallet, name: walletNameCheck };
          this.props.setHotWallet(walletInHotReducerDecrypted);          
          const navigateToMain = NavigationActions.navigate({
            routeName: 'mainStack',
          });
          this.props.navigation.dispatch(navigateToMain);
        } else {
          console.log('your password is not correct');        
        }
      } 
    } 
  };

  /**
   * The wallet name is stored in a temporary state.
   */
  setPassword(password) {
  
    this.setState({ password: password });

  }

  render() {
    return (
        <SafeAreaView style={styles.safeAreaView}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.mainContainer} >
              <View style={styles.navContainer}>
                <BackWithMenuNav
                  showMenu={false}
                  showBack={false}
                  navigation={this.props.navigation}
                  backPage={'createOrRestore'}
                />
              </View>
              <Text style={styles.textHeader} >Set Wallet Password</Text>
              <View style={styles.boxShadowContainer}>
                <View style={styles.contentContainer}>
                  <BoxShadowCard>
                    <Text style={styles.cardText}>
                      Create a password for wallet, minimum length of 4.
                    </Text>
                    <View style={styles.formInputContainer}>
                      <FormInput
                        placeholder={'1234'}
                        onChangeText={this.setPassword.bind(this)}
                        inputStyle={styles.txtWalletName}
                        secureTextEntry={true}
                      />
                    </View>
                  </BoxShadowCard>
                </View>
              </View>
              <View style={styles.btnContainer}>
                <LinearButton
                  onClickFunction={this.navigate}
                  buttonText="Next"
                  customStyles={styles.button}
                  buttonStateEnabled= { this.props.testWalletName === null && this.props.tempWalletName === null }
                />
                <View style={styles.footerGrandparentContainer} >
                  <View style={styles.footerParentContainer} >
                    <Text style={styles.textFooter} >Powered by ChainSafe </Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: '#fafbfe',
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fafbfe',
    width: '100%',
  },
  navContainer: {
    flex: 0.65,
  },
  boxShadowContainer: {
    alignItems: 'center',
    flex: 2.5,
  },
  textHeader: {
    fontFamily: 'Cairo-Light',
    fontSize: RF(4),
    letterSpacing: 0.8,
    paddingLeft: '9%',
    color: '#1a1f3e',
    flex: 0.75,
  },
  contentContainer: {
    flex: 1,
    width: '82%',
  },
  cardText: {
    paddingBottom: '15%',
    paddingTop: '10%',
    paddingLeft: '10%',
    paddingRight: '10%',
    fontFamily: 'WorkSans-Light',
    letterSpacing: 0.4,
    lineHeight: RF(3.9),
    color: '#000000',
    fontSize: RF(2.4),
  },
  txtWalletName: {
    width: '100%',
    flexWrap: 'wrap',
    color: '#12c1a2',
    letterSpacing: 0.4,
    fontSize: 16,
    fontFamily: 'WorkSans-Regular',
    borderBottomWidth: 0.001,
  },
  formInputContainer: {
    width: '90%',
    marginLeft: '5%',
  },
  btnContainer: {
    flex: 2.5,
    alignItems: 'stretch',
    justifyContent: 'flex-end',
    width: '100%',
  },
  button: {
    width: '82%',
    height: Dimensions.get('window').height * 0.082,
  },
  footerGrandparentContainer: {
    alignItems: 'center',
    marginBottom: '5%',
    marginTop: '5%',
  },
  footerParentContainer: {
    alignItems: 'center',
  },
  textFooter: {
    fontFamily: 'WorkSans-Regular',
    fontSize: RF(1.7),
    color: '#c0c0c0',
    letterSpacing: 0.5,
  },
  defaultGreenColor: {
    color: '#12c1a2',
  },
});

/**
 * This method is not being used here
 * @param {Object} param
 */
const mapStateToProps = ({ Debug, Wallet }) => {
  const { debugMode, testWalletName } = Debug;
  const { wallets, tempWalletName, isInSetupScreens } = Wallet;
  return { debugMode, wallets, tempWalletName, testWalletName, isInSetupScreens };
};

export default connect(mapStateToProps, actions)(PinPage);
