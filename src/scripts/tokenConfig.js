import tokenListJson from '../constants/data/json/coins.json';
import Token from './classes/Token';

/**
 * tokenConfiguration handles the tokens configuration when adding them to state. When a new token is added in the
 * application if will pass in another flag and be delt with accordingly.
 * Create Token, and token lookup, and selected a token from a list will need to implement this.
 */
const tokenConfiguration = (configFlag) => {
  let tokenList;
  switch (configFlag) {
    case 'setup':
      tokenList = this.initialSetup();
      break;
    default:
      console.log('defaul triggered');
  }
  return tokenList;
};

/**
 * initialSetup() returns an array of default tokens objects when the app loads up for the first time.
 * This allows us to work with objects when adding tokens to state. .
 */
initialSetup = () => {
  let setupTokenList = [];
  let tokenLookupObjectSet = [];
  tokenListJson.forEach((tokenObject) => {
    let token = new Token(tokenObject.symbol, tokenObject.address);
    token.index = tokenObject.id;
    token.type = tokenObject.type;
    token.decimals = tokenObject.decimals;
    token.name = tokenObject.name;
    token.ens_address = tokenObject.ens_address;
    token.website = tokenObject.website;
    token.logo = tokenObject.logo.src;
    token.email = tokenObject.support.email;
    token.type = tokenObject.type;
    token.blog = tokenObject.social.blog;
    token.chat = tokenObject.social.chat;
    token.facebook = tokenObject.social.facebook;
    token.forum = tokenObject.social.forum;
    token.github = tokenObject.social.github;
    token.gitter = tokenObject.social.gitter;
    token.instagram = tokenObject.social.instagram;
    token.linkedin = tokenObject.social.linkedin;
    token.reddit = tokenObject.social.reddit;
    token.slack = tokenObject.social.slack;
    token.telegram = tokenObject.social.telegram;
    token.twitter = tokenObject.social.twitter;
    token.youtube = tokenObject.social.youtube;
    setupTokenList.push(token);
  });


  return setupTokenList;
};

export default tokenConfiguration;
