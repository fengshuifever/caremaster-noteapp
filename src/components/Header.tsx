import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

const Header = () => {
  return (
    <View style={styles.header}>
      {/* Replace 'logo.svg' with the path to your SVG logo */}
      <Image source={require('../../assets/logo-7.svg')} style={styles.logo} />
      {/* Add any other header components or navigation elements here */}
      <Text style={styles.headingText}>Case Manager Note Taking Application</Text>
    </View>
  );
};

const styles = StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center', // Vertically center align items
      padding: 20,
      width: '100%', // Set the width to 100% of the container
    },
    logo: {
      width: 300, // Adjust the width of the logo as needed
      height: 65,
    },
    headingText: {
      fontSize: 24,
      fontWeight: 'bold', // Make the text bold
    },
  });

export default Header;