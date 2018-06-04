import React from 'react';
import { PropTypes } from 'prop-types';
import { Text } from 'react-native';
import moment from 'moment';
import styles from './styles';

const LastConverted = ({ base, quote, conversionRate, date }) => (
  <Text style={styles.smallText}>
    1 {base} = {conversionRate} {quote} as of {moment(date).format('MMMM D, YYYY')}
  </Text>
);

LastConverted.propTpyes = {
  date: PropTypes.object,
  base: PropTypes.string,
  quote: PropTypes.string,
  convsionRate: PropTypes.number,
};

export default LastConverted;
