import {StyleSheet,SafeAreaView, ScrollView, StatusBar, Image, View, Text } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

export default function Travels() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <StatusBar barStyle="dark-content" backgroundColor="#fff" />
          <Text>Minhas viagens</Text>
        </View>

        <View>
          <Text>Barra de busca</Text>
        </View>

        <View>
          <Text>
            Card
          </Text>
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

});
