import React, { Component } from 'react';
import { StatusBar, KeyboardAvoidingView } from 'react-native';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';

import { Container } from '../Components/Container';
import { Logo } from '../Components/Logo';
import { InputWithButton } from '../Components/TextInput';
import { ClearButton } from '../Components/Button';
import { LastConverted } from '../Components/Text';
import { Header } from '../Components/Header';
import { getInitialConversion, swapCurrency, changeCurrencyAmount } from '../actions/currencies';
import { connectAlert } from '../Components/Alert';

class Home extends Component {

  static propTypes = {
    navigation: PropTypes.object,
    dispatch: PropTypes.func,
    baseCurrency: PropTypes.string,
    quoteCurrency: PropTypes.string,
    amount: PropTypes.number,
    conversionRate: PropTypes.number,
    lastConvertedDate: PropTypes.object,
    primaryColor: PropTypes.string,
    alertWithType: PropTypes.func,
    currencyError: PropTypes.string,
  }

  componentWillMount(){
    this.props.dispatch(getInitialConversion());
  };

  componentWillReceiveProps(nextProps){
    if(nextProps.currencyError && nextProps.currencyError !==
     this.props.currencyError) {
       this.props.alertWithType('error', 'Error', nextProps.currencyError);
     }
  };

  handleChangeText = (text) => {
    this.props.dispatch(changeCurrencyAmount(text));
  };

  handlePressBaseCurrency = () => {
    this.props.navigation.navigate('CurrencyList', {title: 'Base Currency',
    type: 'base'});
  };

  handlePressQuoteCurrency = () => {
    this.props.navigation.navigate('CurrencyList', {title: 'Quote Currency',
    type: 'quote'});
  };

  handleSwapCurrency = () => {
    this.props.dispatch(swapCurrency());
  };

  handlOptionPress =() => {
    this.props.navigation.navigate('Options');
  };

  render() {

    let quotePrice = (this.props.amount * this.props.conversionRate).toFixed(2);
    if(this.props.isFetching){
      quotePrice = '...';
    }

    return (
      <Container backgroundColor={this.props.primaryColor}>
        <StatusBar translucent={false} barStyle="default" />
        <Header onPress={this.handlOptionPress} />
        <KeyboardAvoidingView behavior="padding">
          <Logo tintColor={this.props.primaryColor}/>
          <InputWithButton
            buttonText={this.props.baseCurrency}
            onPress={this.handlePressBaseCurrency}
            defaultValue={this.props.amount.toString()}
            keyboardType="numeric"
            onChangeText={this.handleChangeText}
            textColor={this.props.primaryColor}
          />
          <InputWithButton
            editable={false}
            buttonText={this.props.quoteCurrency}
            onPress={this.handlePressQuoteCurrency}
            value={quotePrice}
            textColor={this.props.primaryColor}
          />
          <LastConverted
            base={this.props.baseCurrency}
            quote={this.props.quoteCurrency}
            date={this.props.lastConvertedDate}
            conversionRate={this.props.conversionRate}
          />
          <ClearButton
            text="Reverse Currency"
            onPress={this.handleSwapCurrency}
          />
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  const baseCurrency = state.currencies.baseCurrency;
  const quoteCurrency = state.currencies.quoteCurrency;
  const conversionSelector = state.currencies.conversions[baseCurrency] || {};
  const rates = conversionSelector.rates || {};
  return {
    baseCurrency,
    quoteCurrency,
    amount: state.currencies.amount,
    conversionRate: rates[quoteCurrency] || 0,
    isFetching: conversionSelector.isFetching,
    lastConvertedDate: conversionSelector.date ?
      new Date(conversionSelector.date) : new Date(),
    primaryColor: state.theme.primaryColor,
    currencyError: state.currencies.error,
  };
}

export default connect(mapStateToProps)(connectAlert(Home));
