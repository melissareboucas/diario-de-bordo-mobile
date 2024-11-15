import React from 'react';
import { StyleSheet, Text, Image, View } from 'react-native';


interface CardProps {
  title: string;
  total: string
  text: string
}

const images = {
  Viagens: require('../assets/images/travelCard.png'),
  Destinos: require('../assets/images/countryCard.png'),
  Cidades: require('../assets/images/cityCard.png'),
};

export function Card({ title, total, text }: CardProps) {
  const imageSource = images[title as keyof typeof images];


  return (
    <View
      style={styles.container}

    >
      <Image
        source={imageSource}
        style={styles.cardImage}
      />
      <Text style={styles.text} >
        {title}
      </Text>

      <Text style={styles.valueText}>
        {total} {text}
      </Text>

    </View >

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
    color: '#FFFFFF',
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
    fontSize: 42,
    color: '#FFFFFF',
  },

});