import React, { useState } from 'react';
import { StyleSheet, Text, Image, TouchableOpacity  } from 'react-native';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface CardProps {
  title: string;
  total: string
  text: string
}

const images = {
  Viagens: require('../assets/images/travelCard.png'),
  Países: require('../assets/images/countryCard.png'),
  Cidades: require('../assets/images/cityCard.png'),
};

const colors = {
  Viagens: '#196966',
  Países: '#C0E5E4',
  Cidades: '#FFFFFF'
}

export function Card({ title, total, text }: CardProps) {
  const imageSource = images[title as keyof typeof images];
  const textColor = colors[title as keyof typeof images];
  const [showValue, setShowValue] = useState(false);

  return (
    <TouchableOpacity  
      style={styles.container}
      onPress={() => {
        if (showValue) {
          setShowValue(false)
        } else {
          setShowValue(true)
        }
      }}
    >
      <Image
        source={imageSource}
        style={styles.cardImage}
      />
      <Text style={[styles.text, { color: textColor }]} >
        {title}
      </Text>
      <MaterialIcons size={48} style={styles.arrow} name='keyboard-arrow-down' color={textColor} />
      { showValue && (
        
          <Text style={[styles.valueText, { color: textColor }]}>
            {total} {text}
          </Text>
        
      )}
      
    </TouchableOpacity >


  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    margin: 10
  },
  cardImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 30,
  },
  text: {
    position: 'absolute',
    marginLeft: 15,
    marginTop: 10,
    fontSize: 48,
    fontWeight: '500',
  },
  arrow: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  valueText: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    fontSize: 42
  },

});