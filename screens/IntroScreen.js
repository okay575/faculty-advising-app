import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function IntroScreen({ onFinish }) {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.5);
  const slideAnim = new Animated.Value(50);
  const dot1Anim = new Animated.Value(0.3);
  const dot2Anim = new Animated.Value(0.3);
  const dot3Anim = new Animated.Value(0.3);

  useEffect(() => {
    // Animate logo entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 10,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate loading dots
    const animateDots = () => {
      const createDotAnimation = (animValue, delay) => {
        return Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(animValue, {
              toValue: 1,
              duration: 600,
              useNativeDriver: true,
            }),
            Animated.timing(animValue, {
              toValue: 0.3,
              duration: 600,
              useNativeDriver: true,
            }),
          ])
        );
      };

      Animated.parallel([
        createDotAnimation(dot1Anim, 0),
        createDotAnimation(dot2Anim, 200),
        createDotAnimation(dot3Anim, 400),
      ]).start();
    };

    animateDots();

    // Auto navigate after 3 seconds
    const timer = setTimeout(() => {
      onFinish();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: slideAnim }
            ],
          },
        ]}
      >
        {/* Logo Design - Calendar/Schedule Icon */}
        <View style={styles.logo}>
          <View style={styles.calendarBase}>
            {/* Calendar rings */}
            <View style={styles.ring1} />
            <View style={styles.ring2} />
            <View style={styles.ring3} />
            
            {/* Calendar pages */}
            <View style={styles.page1}>
              <View style={styles.pageLines}>
                <View style={styles.line} />
                <View style={styles.line} />
                <View style={styles.lineShort} />
              </View>
            </View>
            <View style={styles.page2}>
              <View style={styles.pageLines}>
                <View style={styles.line} />
                <View style={styles.line} />
                <View style={styles.lineShort} />
              </View>
            </View>
            
            {/* Calendar binding */}
            <View style={styles.binding} />
          </View>
          
          {/* Clock icon overlay */}
          <View style={styles.clockContainer}>
            <View style={styles.clockFace}>
              <View style={styles.clockHand1} />
              <View style={styles.clockHand2} />
              <View style={styles.clockCenter} />
            </View>
          </View>
        </View>
      </Animated.View>

      <Animated.View
        style={[
          styles.textContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.appName}>Faculty Schedule</Text>
        <Text style={styles.tagline}>Consultation Planner</Text>
        <Text style={styles.subtitle}>Manage schedules & consultations</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.loadingContainer,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <Animated.View style={[styles.loadingDot, { opacity: dot1Anim }]} />
        <Animated.View style={[styles.loadingDot, { opacity: dot2Anim }]} />
        <Animated.View style={[styles.loadingDot, { opacity: dot3Anim }]} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2b6cb0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarBase: {
    width: 100,
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 8,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  ring1: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    height: 2,
    backgroundColor: '#2b6cb0',
    borderRadius: 1,
  },
  ring2: {
    position: 'absolute',
    top: 12,
    left: 8,
    right: 8,
    height: 2,
    backgroundColor: '#4299e1',
    borderRadius: 1,
  },
  ring3: {
    position: 'absolute',
    top: 16,
    left: 8,
    right: 8,
    height: 2,
    backgroundColor: '#63b3ed',
    borderRadius: 1,
  },
  page1: {
    position: 'absolute',
    top: 20,
    left: 10,
    right: 10,
    bottom: 20,
    backgroundColor: '#f7fafc',
    borderRadius: 4,
  },
  page2: {
    position: 'absolute',
    top: 22,
    left: 12,
    right: 12,
    bottom: 22,
    backgroundColor: '#edf2f7',
    borderRadius: 4,
  },
  pageLines: {
    padding: 8,
    flex: 1,
    justifyContent: 'space-around',
  },
  line: {
    height: 2,
    backgroundColor: '#cbd5e1',
    borderRadius: 1,
    marginVertical: 2,
  },
  lineShort: {
    height: 2,
    width: '60%',
    backgroundColor: '#cbd5e1',
    borderRadius: 1,
    marginVertical: 2,
  },
  binding: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 20,
    backgroundColor: '#1e40af',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  clockContainer: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 50,
    height: 50,
    backgroundColor: '#38a169',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  clockFace: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  clockHand1: {
    position: 'absolute',
    width: 2,
    height: 12,
    backgroundColor: '#2d3748',
    top: 8,
    left: 19,
    transform: [{ rotate: '45deg' }],
  },
  clockHand2: {
    position: 'absolute',
    width: 2,
    height: 10,
    backgroundColor: '#4a5568',
    top: 10,
    left: 19,
    transform: [{ rotate: '-30deg' }],
  },
  clockCenter: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#2d3748',
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  appName: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 20,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#cbd5e1',
    fontWeight: '400',
  },
  loadingContainer: {
    flexDirection: 'row',
    marginTop: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginHorizontal: 4,
    opacity: 0.7,
  },
});

