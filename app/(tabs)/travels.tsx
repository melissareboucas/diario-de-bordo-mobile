import { useEffect, useState } from 'react';
import {
  StyleSheet, SafeAreaView, ScrollView, StatusBar,
  Image, View, Text, FlatList, TouchableOpacity, Modal,
  TextInput,
  ListRenderItem
} from 'react-native';
import { getTravelsByUser } from '../../data/retrieveData.js'

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Timestamp } from 'firebase/firestore';

interface travelData {
  id: string,
  user_id: string,
  origincity: string,
  origincountry: string,
  originlatitude: number,
  originlongitude: number,
  destinycity: string,
  destinycountry: string,
  destinylatitude: number,
  destinylongitude: number,
  distanceinmeters: number,
  modal: string,
  travel_image: string,
  date: Timestamp,
  description: string
}


export default function Travels() {
  const [travels, setTravels] = useState<any[]>([]);
  const [modalCreateTravelVisible, setModalCreateTravelVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchTravels = async () => {
      const travelsList = await getTravelsByUser("ayXVaqgFJZ4sBgoLKW29");
      setTravels(travelsList || []);
    };

    fetchTravels();
  }, []);

  const handleSearch = (text: string) => {
    setSearchText(text);
  };

  const renderTravelCard: ListRenderItem<travelData> = ({ item }) => (
    <View key={item.id} style={styles.cardContainer}>
      <View style={styles.card}>

        <View style={styles.cardHeader}>
          <View style={styles.cardLocation}>
            <MaterialIcons size={28} name='location-pin' color={'#45B3AF'} />
            <Text style={styles.cardHeaderText}>
              {item.origincity}, {item.origincountry}
            </Text>
          </View>
          <TouchableOpacity style={styles.cardOptions}>
            <MaterialIcons size={28} name='keyboard-control' color={'#45B3AF'} />
          </TouchableOpacity>
        </View>

        <View style={styles.cardLocation}>
          <MaterialIcons size={28} name='airplanemode-on' color={'#45B3AF'} />
          <Text style={styles.cardHeaderText}>
            {item.destinycity}, {item.destinycountry}
          </Text>
        </View>

        <Text style={styles.cardDate}>{item.date.toDate().toLocaleDateString()}</Text>

        <Text style={styles.cardDescription}>
          {item.description}
        </Text>

        <Image
          source={{ uri: item.travel_image }}
          style={styles.cardImage}
        />

      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View>
          <StatusBar barStyle="dark-content" backgroundColor="#fff" />
          <Image
            source={require('../../assets/images/travelCard.png')}
            style={styles.headerImage}
          />
          <View style={styles.header}>
            <Text style={styles.headerText}>Minhas viagens</Text>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => setModalCreateTravelVisible(true)}
            >
              <Text style={styles.headerButtonText}>
                Criar viagem
              </Text>
            </TouchableOpacity>
            <Modal
              animationType="fade"
              transparent={true}
              visible={modalCreateTravelVisible}
              onRequestClose={() => setModalCreateTravelVisible(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalText}>Este é o conteúdo do modal!</Text>
                  <TouchableOpacity
                    style={styles.headerButton}
                    onPress={() => setModalCreateTravelVisible(false)}>
                    <Text style={styles.headerButtonText}>
                      Cancelar
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

          </View>

        </View>

        <View style={styles.searchContainer}>
          <MaterialIcons size={28} name='search' color={'#45B3AF'} />
          <TextInput
            style={styles.searchBar}
            placeholder='Buscar viagem'
            placeholderTextColor='#45B3AF'
            value={searchText}
            onChangeText={handleSearch}
          />
        </View>

        <FlatList
          data={travels}
          renderItem={renderTravelCard}
          keyExtractor={item => item.id}
        />
      </ScrollView>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 0,
    backgroundColor: "white",
  },
  headerImage: {
    marginTop: 10,
    width: '100%',
    height: 50,
    borderRadius: 30,
    resizeMode: 'cover',
  },
  header: {
    flexDirection: 'row',
    margin: 10,
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 25,
    fontWeight: '500',
    color: '#196966',
  },
  headerButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#45B3AF',
    borderRadius: 7,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'center'
  },
  headerButtonText: {
    color: '#196966',
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    marginBottom: 15,
    fontSize: 18,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#196966',
    backgroundColor: '#E0F4F6',
    borderRadius: 7,
    marginTop: 5,
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 10
  },
  searchBar: {
    color: '#196966'
  },
  cardContainer: {
    margin: 5,
  },
  card: {
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: 'white',
    elevation: 5,
    // Shadow iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    margin: 10,
    padding: 5,

  },
  cardOptions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 3,
    paddingTop: 3
  },
  cardContent: {
    justifyContent: 'flex-start'
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  cardLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardHeaderText: {
    fontSize: 15,
    color: '#196966',
    fontWeight: '500'
  },
  cardDate: {
    fontSize: 15,
    color: '#196966',
    marginLeft: 28,
    marginTop: 5
  },
  cardDescription: {
    fontSize: 20,
    color: '#45B3AF',
    margin: 10,
    textAlign: 'justify'
  },
  cardImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain'
  }

});
