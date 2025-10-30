import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, Image, Animated, Platform} from 'react-native';
import {BlurView} from 'expo-blur';

const ChevronLoader = ({show = true}) => {
  const [activeCount, setActiveCount] = useState(1);
  const [label, setLabel] = useState('LIGHTS');
  const [step, setStep] = useState(1);
  const intervalRef = useRef(null);

  const opacityAnim = useRef(new Animated.Value(0)).current;

  const arrowImages = [
    require('../Assets/Images/vector/1.png'),
    require('../Assets/Images/vector/2.png'),
    require('../Assets/Images/vector/3.png'),
    require('../Assets/Images/vector/4.png'),
    require('../Assets/Images/vector/5.png'),
    require('../Assets/Images/vector/6.png'),
    require('../Assets/Images/vector/7.png'),
  ];

  const finalImages = [require('../Assets/Images/vector/final1.png'), require('../Assets/Images/vector/final2.png')];

  useEffect(() => {
    if (!show) return;

    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    if (intervalRef.current) clearInterval(intervalRef.current);

    if (step === 1) {
      setLabel('LIGHTS');
      setActiveCount(1);
      intervalRef.current = setInterval(() => {
        setActiveCount(prev => {
          if (prev < arrowImages.length) {
            return prev + 1;
          } else {
            clearInterval(intervalRef.current);
            setStep(2);
            return prev;
          }
        });
      }, 80);
    } else if (step === 2) {
      setLabel('CAMERA');
      setActiveCount(1);
      intervalRef.current = setInterval(() => {
        setActiveCount(prev => {
          if (prev < arrowImages.length) {
            return prev + 1;
          } else {
            clearInterval(intervalRef.current);
            setStep(3);
            return prev;
          }
        });
      }, 80);
    } else if (step === 3) {
      setActiveCount(1);
      setLabel('CAMERA');
      const timeout = setTimeout(() => setStep(4), 100);
      return () => clearTimeout(timeout);
    } else if (step === 4) {
      setActiveCount(1);
      setLabel('');
      const timeout = setTimeout(() => setStep(5), 100);
      return () => clearTimeout(timeout);
    } else if (step === 5) {
      setLabel('');
      const timeout = setTimeout(() => setStep(6), 100);
      return () => clearTimeout(timeout);
    } else if (step === 6) {
      setLabel('');
      const timeout = setTimeout(() => setStep(1), 100);
      return () => clearTimeout(timeout);
    }

    return () => clearInterval(intervalRef.current);
  }, [step, show]);

  const renderArrows = () => {
    if (step === 3 || step === 4) {
      return <Image source={arrowImages[0]} style={styles.arrowImage} resizeMode="contain" />;
    } else if (step === 5 || step === 6) {
      return <Image source={finalImages[step - 5]} style={styles.finalImage} resizeMode="contain" />;
    } else {
      return (
        <View style={styles.arrowRow}>
          {arrowImages.map((src, i) => (
            <Animated.Image
              key={i}
              source={src}
              style={[
                styles.arrowImage,
                {
                  opacity: i < activeCount ? opacityAnim : 0.3, // fade in active chevrons, faint others
                  transform: [{scale: i < activeCount ? 1 : 0.8}],
                },
              ]}
              resizeMode="contain"
            />
          ))}
        </View>
      );
    }
  };

  if (!show) return null;

  return (
    <View style={styles.wrapper}>
      {/* <BlurView intensity={30} style={styles.container}>
        <View style={{...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.2)'}} />
      </BlurView> */}

      {Platform.OS === 'ios' ? (
        <BlurView intensity={30} style={styles.container}>
          <View style={{...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.9)'}} />
        </BlurView>
      ) : (
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 10,
            elevation: 10,
          }}
        />
      )}

      <View style={styles.innerContainer}>
        {label ? <Text style={styles.title}>{label}</Text> : null}
        <View style={[step >= 3 ? styles.centerSingleChevron : styles.arrowRow]}>{renderArrows()}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999, // ensure on top
  },
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  innerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Rubik-SemiBold',
    marginBottom: 4,
    fontSize: 20,
    color: '#1e1e1e',
    width: '100%',
  },
  arrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  centerSingleChevron: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowImage: {
    width: 16,
    height: 16,
    marginHorizontal: 2,
  },
  finalImage: {
    width: 74,
    height: 83,
  },
});

export default ChevronLoader;
