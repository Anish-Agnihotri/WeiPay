import React, { Component } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { connect } from 'react-redux';
import { FormInput, FormLabel, Button } from 'react-native-elements';
const ethers = require('ethers');
var utils = ethers.utils;
import provider from '../../../constants/Providers'; //this gives us access to the local test rpc network to test

class CoinSend extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      tabBarLabel: 'SEND'
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      toAddress: "",
      value: 0
    }


    provider.getBalance(this.props.wallet.address).then(function (balance) {
      var etherString = utils.formatEther(balance);
      console.log("Current Wallet Balance" + etherString);

      if (etherString == 0) {
        Alert.alert(
          'No Ether Alert',
          'You need to uncomment the code in the constructor and change the private key to one from your local testrpc to fund this account.',
          [
            { text: 'OK', onPress: () => console.log('OK Pressed') },
          ],
          { cancelable: false }
        )
      }
    });

    /*
      Send money from testrpc to current wallet just to make sure there are funds for transactions.
      If you have no money in your current wallet then you need to uncomment this and adjust privat key
    */

    // const privateKey = "0x1e1a9de3455f77edf5aaa0342766c9bcb65e8d6b6e868bda0f34fac118d1419f";
    // const walletToFundCurrentWallet = new ethers.Wallet(privateKey);
    // const currentWallet = this.props.wallet;

    // walletToFundCurrentWallet.provider = provider;
    // currentWallet.provider = provider;

    // var amount = ethers.utils.parseEther('5.0');
    // var sendPromise = walletToFundCurrentWallet.send(currentWallet.address, amount);

    // sendPromise.then(function (transactionHash) {
    //   console.log(transactionHash);
    //   provider.getBalance(walletToFundCurrentWallet.address).then(function (balance) {
    //     var etherString = utils.formatEther(balance);
    //     console.log("walletToFundCurrentWallet Balance: " + etherString);
    //   });
    //   provider.getBalance(currentWallet.address).then(function (balance) {
    //     var etherString = utils.formatEther(balance);
    //     console.log("currentWallet Balance: " + etherString);
    //   });
    // });
  }

  renderAddress(addressInput) {
    var add = addressInput.trim();
    console.log(add)
    this.setState({ toAddress: add });
  }

  renderValue(valueInput) {
    if (!isNaN(valueInput)) {
      console.log("is a number " + valueInput)
      this.setState({ value: valueInput });
      //is a number
    } else {
      //not a number
      console.log("not a number " + valueInput)
      this.setState({ value: 0 });
    }
  }


  sendTransaction = () => {
    /*
      this.props.wallet is either the recovered wallet or new wallet, in either case we have sent 5 ether in the constructor
      to this wallet by using a testrpc private key. If we are recvoering a wallet, this does nothing, but if we are creating
      a new wallet, we will never have funds in our test environemnt, so this is just a test setup.
    */
    const amountString = '' + this.state.value + '';
    const receivingAddress = this.state.toAddress;
    //var amount = ethers.utils.parseEther('2.0');
    var amount = ethers.utils.parseEther(amountString);

    const currentWallet = this.props.wallet;
    currentWallet.provider = provider;
    var sendPromise = currentWallet.send(receivingAddress, amount);

    sendPromise.then(function (transactionHash) {
      console.log(transactionHash);

      provider.getBalance(currentWallet.address).then(function (balance) {
        var etherString = utils.formatEther(balance);
        console.log("currentWallet Balance: " + etherString);
      });

      provider.getBalance(receivingAddress).then(function (balance) {
        var etherString = utils.formatEther(balance);
        console.log("receiving account Balance: " + etherString);
      });

    });
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.contentContainer} >
          <View style={styles.form} >
            <FormLabel> Send To </FormLabel>
            <FormInput style={styles.formInputElement}
              onChangeText={this.renderAddress.bind(this)}
            />
            <FormLabel> Amount </FormLabel>
            <FormInput style={styles.formInputElement}
              onChangeText={this.renderValue.bind(this)}
            />
            <FormLabel>
              Transaction Fee
              Total  0 BTC 0 USD
            </FormLabel>
          </View>
          <View style={styles.btnContainer} >
            <Button
              title='Reset'
              icon={{ size: 28 }}
              buttonStyle={{
                backgroundColor: 'blue', borderRadius: 10, width: 225, height: 40, alignItems: 'center',
                justifyContent: 'center', marginBottom: 5, marginTop: 5.5
              }}
              textStyle={{ textAlign: 'center' }}
              onPress={console.log('sdf')} />
            <Button
              title='Next'
              icon={{ size: 28 }}
              buttonStyle={{
                backgroundColor: 'blue', borderRadius: 10, width: 225, height: 40, alignItems: 'center',
                justifyContent: 'center', marginBottom: 30, marginTop: 5.5
              }}
              textStyle={{ textAlign: 'center' }}
              onPress={() => this.sendTransaction()}
            />
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1, alignItems: 'center', justifyContent: 'flex-start'
  },
  contentContainer: {
    marginTop: 25
  },
  form: {
    width: 340
  },
  btnContainer: {
    flex: 1, justifyContent: 'flex-end', alignItems: 'center'
  },
})

const mapStateToProps = state => {
  debugger
  return {
    wallet: state.newWallet.wallet
  }
}

export default connect(mapStateToProps, null)(CoinSend);
