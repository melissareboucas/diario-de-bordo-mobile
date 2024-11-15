import React, { useCallback, useEffect, useState } from 'react';

import {
  StyleSheet, SafeAreaView, StatusBar,
  Image, View, Text, FlatList, TouchableOpacity, Modal,
  TextInput, ListRenderItem, RefreshControl,
  ActivityIndicator,
  Dimensions,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';

import { getTravels, getTravelsByUser, getUserById, searchTravels } from '../../data/retrieveData'
import { addTravel } from '../../data/insertData'

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Timestamp } from 'firebase/firestore';
import { router } from 'expo-router';

import { useIsFocused } from '@react-navigation/native';

import { storage } from '@/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import DateTimePicker from '@react-native-community/datetimepicker'; // Importando o DateTimePicker



interface travelData {
  travel_id: string,
  user_id: string,
  origincity: string,
  destinycity: string,
  distanceinmeters: number,
  travel_image: string,
  date: Timestamp,
  description: string
}
const { height: SCREEN_HEIGHT } = Dimensions.get('window');


export default function Community() {
  const isFocused = useIsFocused();

  const [travels, setTravels] = useState<any[]>([]);

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);


  const fetchData = async () => {
    try {
      setLoading(true);

      const travelsList = await getTravels();
      setTravels(travelsList || []);

    } catch (error) {
      console.error('Error fetching travels:', error);
    } finally {
      setLoading(false);
    }

  }

  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    setTimeout(() => {
      const fetchTravels = async () => {
        const travelsList = await getTravels();
        setTravels(travelsList || []);
      };

      fetchTravels();
      setRefreshing(false);
    }, 2000);
  }, [travels]);


  const renderTravelCard: ListRenderItem<travelData> = ({ item }) => (
    <View key={item.travel_id} style={styles.cardContainer}>
      <View
        style={styles.card} // Mantém o estilo fixo do card
      >

        <View style={styles.cardHeader}>
          <View style={styles.cardLocation}>
            <MaterialIcons size={28} name='location-pin' color={'#45B3AF'} />
            <Text style={styles.cardHeaderText}>
              {item.origincity}
            </Text>
          </View>

        </View>

        <View style={styles.cardLocation}>
          <MaterialIcons size={28} name='airplanemode-on' color={'#45B3AF'} />
          <Text style={styles.cardHeaderText}>
            {item.destinycity}
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
    <>
      <SafeAreaView style={styles.container}>


        <View>
          <StatusBar barStyle="dark-content" backgroundColor="#fff" />
          <Image
            source={require('../../assets/images/countryCard.png')}
            style={styles.headerImage}
          />
          <View style={styles.header}>
            <Text style={styles.headerText}>Comunidade</Text>
          </View>

        </View>


        {loading && (
          <View style={styles.container}>
            <ActivityIndicator size="large" color="#196966" />
          </View>)
        }

        {!loading && (
          <FlatList
            data={travels}
            renderItem={renderTravelCard}
            keyExtractor={item => item.travel_id}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
          />
        )}
      </SafeAreaView >
    </>


  );
}


const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.1, // Posiciona o modal a 10% do topo da tela
    width: '90%',
    maxHeight: SCREEN_HEIGHT * 0.8, // Limita a altura a 80% da tela
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 2,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: 16,
    color: '#45B3AF',
    marginBottom: 5,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#45B3AF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    justifyContent: 'center',
    width: 120,
    marginLeft: 10
  },
  dateText: {
    color: '#45B3AF',
    fontSize: 16,
  },
  distanceText: {
    borderWidth: 1,
    borderColor: '#45B3AF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    justifyContent: 'center',
    width: 100,
    marginLeft: 50,
    color: '#45B3AF'
  },
  suggestionRow: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionText: {
    fontSize: 16,
  },
  textInput: {
    height: 46,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  description: {
    fontSize: 15,
  },
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
  modalTravelOptionsContainer: {
    flex: 1
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
    borderColor: "#45B3AF",
    borderWidth: 1
  },
  modalText: {
    marginBottom: 15,
    fontSize: 24,
    textAlign: 'center',
    color: "#196966",
    fontWeight: 'bold'
  },
  modalInputText: {
    borderWidth: 1,
    borderColor: '#45B3AF',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingLeft: 10,
    paddingRight: 10,
    margin: 5,
    width: 250,
    height: 50,
    color: '#45B3AF'
  },
  modalPicker: {
    borderWidth: 1,
    borderColor: '#45B3AF',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingLeft: 10,
    paddingRight: 10,
    margin: 5,
    width: 250,
    height: 50,
  },
  modalDropdownText: {
    fontSize: 14,
    color: '#45B3AF'
  },
  mdoalDropDownContainer: {
    backgroundColor: 'white',
    borderColor: '#45B3AF',

  },
  modalInputDescriptionText: {
    borderWidth: 1,
    borderColor: '#45B3AF',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    margin: 5,
    width: 250,
    height: 150,
    color: '#45B3AF'
  },
  modalImage: {
    width: 200,
    height: 150,
    resizeMode: 'contain'
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly'

  },
  modalCancelButton: {
    backgroundColor: '#E5E5E5',
    borderRadius: 7,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 10,
    paddingRight: 10,
    marginRight: 10,
  },
  modalCancelButtonText: {
    color: 'black',
    padding: 5
  },
  modalAddButton: {
    backgroundColor: '#45B3AF',
    borderRadius: 7,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 10,
    paddingRight: 10,
    marginLeft: 10,
  },
  modalAddButtonText: {
    color: 'white',
    padding: 5
  },
  rowContainer: {
    // flexDirection: 'row', // Faz os elementos ficarem lado a lado
    //justifyContent: 'space-evenly', // Espaço entre os elementos
    //flexWrap: 'wrap',
    //alignItems: 'flex-end',
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
    marginBottom: 10,
    justifyContent: 'space-between'
  },
  searchBar: {
    color: '#196966',
    marginLeft: 10
  },
  searchItem: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
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
