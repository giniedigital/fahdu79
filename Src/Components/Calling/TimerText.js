import React, {useEffect, useState, useRef} from 'react';
import {Text, StyleSheet} from 'react-native';
import { FONT_SIZES } from '../../../DesiginData/Utility';

const TimerText = () => {

  const [countup, setCountup] = useState('00');

  useEffect(() => {
    const startTime = new Date().getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const elapsedTime = now - startTime;

      const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
      const minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);

      // Format the timer based on elapsed time
      let countupStr = '';
      if (hours > 0) {
        countupStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      } else if (minutes > 0) {
        countupStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      } else {
        countupStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      }

      setCountup(countupStr);
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  
  return (
    <Text style={styles.coinTimerText}>{countup}</Text>
  );
};

const styles = StyleSheet.create({
  coinTimerText: {
    fontFamily: 'Rubik-Medium',
    fontSize: FONT_SIZES['10'],
    color: '#1e1e1e',
  },
});

export default TimerText;
