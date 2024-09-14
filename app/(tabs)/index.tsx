import { Card } from '@/components/Card';
import {StyleSheet,SafeAreaView, ScrollView, StatusBar, Image, View, Text } from 'react-native';

export default function Home() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <StatusBar barStyle="dark-content" backgroundColor="#fff" />
          <Image 
            source={require('../../assets/images/blankMapLarge.png')} 
            style={styles.mapImage}
          />
        </View>

        <View style={styles.profileArea}>
          <Image 
            source={require('../../assets/images/profileExample.png')}
            style={styles.profileImage}
          />
          <View style={styles.profileAreaText}>
            <Text style={styles.profileNameText}>
              Melissa Viana
            </Text>
            <Text style={styles.profileUserNameText}>
              @melrvian
            </Text>
          </View>
        </View>

        <View>
          <Card title="Viagens" total='1,2M' text="Km" />
          <Card title="Países" total='2' text="países"/>
          <Card title="Cidades" total='4' text="cidades"/>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 0,
    backgroundColor: "white",
  },
  mapImage: {
    width: '100%',  
    height: 200, 
    resizeMode: 'center',  
  },
  profileArea:{
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',

  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,  
    borderColor: '#45B3AF',
  },
  profileAreaText: {
    marginLeft: 15,
  },
  profileNameText: {
    fontSize: 25,
    marginBottom: 10,
    color: '#196966'
  },
  profileUserNameText: {
    fontSize: 16,
    color: '#45B3AF'
  },

});
