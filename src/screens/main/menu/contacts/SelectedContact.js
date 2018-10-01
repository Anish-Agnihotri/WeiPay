import React, { Component } from 'react';
import {
  Text, View, ListView, StyleSheet, Dimensions, ScrollView, Image, TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import RF from 'react-native-responsive-fontsize';
import * as actions from '../../../../actions/ActionCreator';
import { packageTransactionTokenData } from '../../../../actions/actionCreators/AppConfig';
import BoxShadowCard from '../../../../components/ShadowCards/BoxShadowCard';
import LinearButton from '../../../../components/LinearGradient/LinearButton';
import ClearButton from '../../../../components/LinearGradient/ClearButton';
import EditContact from './add/EditContact';


class ContactAddresses extends Component {
  state = {
    editContact: false,
  }

  componentWillMount() {
    const address = this.props.selectedContact.address;
    const tokens = this.props.selectedContact.tokenList;
    console.log('in selected contact page', this.props.selectedContact);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => { return r1 !== r2; },
    });
    this.dataSource = ds.cloneWithRows(tokens);
  }

  /**
   * Because we assume all tokens for a contact share the same ethereum address, you can just search for the address
   * of the selected token name you have selected with reference to your tokens in you wallet.
   * You save all this relevant information into state and will be retrieved when you are in the coin transaction page.
   */
  navigateToCoinSend = (tokenName) => {
    let tokenObject = {};
    for( let i = 0; i < this.props.tokens.length; i++) {
      if(tokenName === this.props.tokens[i].name) {
        tokenObject.name = tokenName;
        tokenObject.symbol = this.props.tokens[i].symbol;
        tokenObject.contractAddress = this.props.tokens[i].address;
        tokenObject.toAddress = this.props.selectedContact.address;
        tokenObject.toName = this.props.selectedContact.name;       
      }
    } 
    this.props.packageTransactionTokenData(tokenObject);
    const navigateToTransaction = NavigationActions.navigate({
      routeName: 'TokenFunctionality',
    });
    this.props.navigation.dispatch(navigateToTransaction);
  };

  navigateToEditContact = () => {
    // const navigateToCreateOrRestore = NavigationActions.navigate({
    //   routeName: 'editContact',
    //   params: { contact: this.props.contact },
    // });
    // this.props.navigation.dispatch(navigateToCreateOrRestore);
  };

  renderRow(tokenName) {
   return (
      <View style={styles.listItemContainer}>
        <TouchableOpacity onPress={() => { return this.navigateToCoinSend(tokenName); }}>
          <BoxShadowCard>
            <View style={styles.mainListItemContentContainter}>
              <View style={styles.mainListItemTextContainer}>
                <Text style={styles.CoinTypeText}> { tokenName } </Text>
              </View>
            </View>
          </BoxShadowCard>
        </TouchableOpacity>
      </View>
    );
  }

  renderSelectedContactOrEditedContact = () => {
    // if (this.state.editContact === true) {
    //   //this.props.updateSavedContactInputs(this.props.contact);
    //   return (
    //     <EditContact navigation={this.props.navigation} contact={this.props.contact} setSelectedContactFalse={this.props.setSelectedContactFalse}/>
    //   );
    // }

    return (
      <View style={styles.mainContainer}>
        <View style={styles.scrollViewContainer}>
          <Text style={styles.contactName}>{this.props.selectedContact.name}</Text>
          <ScrollView style={styles.scrollView} >
            <ListView dataSource={this.dataSource} renderRow={this.renderRow.bind(this)} removeClippedSubviews={false} />
          </ScrollView>
        </View>
        <View style={styles.btnContainer}>
          <View style={styles.btnFlex}>
            <ClearButton
              buttonText='Delete Contact'
              onClickFunction={this.deleteContact.bind(this)}
              customStyles={styles.deleteButton}
            />
          </View>
          <View style={styles.btnFlex}>
            <LinearButton
              buttonText='Edit Contact'
              onClickFunction={() => this.setState({ editContact: true })}
              customStyles={styles.addButton}
            />
          </View>
        </View>
      </View>
    );
  }

  deleteContact() {
    //this.props.deleteContact(this.props.contact.name)
    //this.props.setSelectedContactFalse()
  }

  render() {
    return (
      this.renderSelectedContactOrEditedContact()
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 0.95,
    alignItems: 'center'
  },
  scrollViewContainer: {
    marginTop: '5%',
    alignItems: 'stretch',
    width: '100%',
    paddingLeft: '9%',
    paddingRight: '9%',
    flex: 6,
  },
  contactName: {
    fontSize: RF(2.8),
    fontFamily: 'Cairo-Regular',
    letterSpacing: 0.6,
    paddingLeft: '1%',
  },
  listItemContainer: {
    flex: 1,
    alignItems: 'stretch',
    height: Dimensions.get('window').height * 0.095,
  },
  scrollView: {
    flex: 1,
  },
  mainListItemContentContainter: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  mainListItemIconContainer: {
    flex: 1.25,
    alignContent: 'center',
    marginTop: 0,
    marginLeft: '7.5%',
  },
  mainListItemTextContainer: {
    flex: 5,
    flexDirection: 'column',
    paddingLeft: '2.5%',
    paddingRight: '2.5%',
    paddingBottom: '2%',
    paddingTop: '2%',
  },
  iconImage: {
    height: Dimensions.get('window').height * 0.04,
    width: Dimensions.get('window').width * 0.07,
    alignItems: 'center',
  },
  CoinTypeText: {
    fontSize: RF(2.4),
    letterSpacing: 0.5,
    fontFamily: 'Cairo-Regular',
    marginBottom: 0,
    paddingBottom: 0,
  },
  textAddressText: {
    fontSize: RF(1.7),
    letterSpacing: 0.4,
    fontFamily: 'Cairo-Light',
    flexWrap: 'wrap',
  },
  btnContainer: {
    flex: 1.2,
    width: '100%',
  },
  button: {
    width: '82%',
    height: Dimensions.get('window').height * 0.082,
  },
  coinType: {
    fontSize: 14,
    fontFamily: 'WorkSans-Regular',
  },
  textAddress: {
    fontSize: 10,
    fontFamily: 'WorkSans-Regular',
    marginTop: '5%',
  },
  barcodeImageContainer: {
    flex: 0.3,
  },
  barcodeImg: {
    flex: 1,
    width: Dimensions.get('window').height * 0.07,
    resizeMode: 'contain',
    marginBottom: '15%',
    marginLeft: '0%',
  },
  deleteButton: {
    marginLeft: '0%',
    marginRight: '1.75%',
    height: Dimensions.get('window').height * 0.082,
  },
  addButton: {
    marginLeft: '0%',
    marginRight: '1.75%',
    height: Dimensions.get('window').height * 0.082,
  },
  btnContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'flex-end',
    width: '85%',
    marginLeft: '0.5%',
    marginBottom: '2.5%',
    marginTop: '2.5%',
  },
  btnFlex: {
    flex:1,
  },
});

function mapStateToProps({ Wallet }) {
  const { selectedContact, tokens } = Wallet;
  return { selectedContact, tokens };
}

export default connect(mapStateToProps, {
  actions,
  packageTransactionTokenData,
})(ContactAddresses);
