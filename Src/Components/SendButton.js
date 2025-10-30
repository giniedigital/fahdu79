import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { responsiveWidth } from 'react-native-responsive-dimensions';

const SendButton = ({ handleOnclick, disableSendButton, userRole, secondUserRole }) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (disableSendButton) {
      const interval = setInterval(() => {
        setDots((prev) => (prev.length < 3 ? prev + '.' : ''));
      }, 200); // Faster animation (every 300ms)
      return () => clearInterval(interval);
    } else {
      setDots('');
    }
  }, [disableSendButton]);

  return (
    <TouchableOpacity 
      onPress={handleOnclick} 
      disabled={disableSendButton} 
      style={[
        userRole === 'creator' && secondUserRole !== 'creator' ? { marginLeft: responsiveWidth(5) } : null,
        disableSendButton && { opacity: 0.5 } // Slightly faded when disabled
      ]}
    >
      <Text style={{ 
        fontSize: 16, 
        color: '#1e1e1e', 
        fontFamily: 'Rubik-SemiBold',
        marginTop : 1
      }}>
        {disableSendButton ? `Send${dots}` : 'Send'}
      </Text>
    </TouchableOpacity>
  );
};

export default SendButton;
