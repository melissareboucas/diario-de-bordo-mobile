import { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet, SafeAreaView, ScrollView, StatusBar,
  Image, View, Text, FlatList, TouchableOpacity, Modal,
  TextInput, ListRenderItem, RefreshControl,
  ActivityIndicator,
  Pressable
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

import { getTravelsByUser, searchTravels } from '../../data/retrieveData'
import { addTravel } from '../../data/insertData'

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Timestamp } from 'firebase/firestore';
import { Link } from 'expo-router';

import { useIsFocused } from '@react-navigation/native';


interface travelData {
  travel_id: string,
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

interface insertTravelData {
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

  const isFocused = useIsFocused();

  const [travels, setTravels] = useState<any[]>([]);
  const [modalCreateTravelVisible, setModalCreateTravelVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: 'Avião', value: 'Avião' },
    { label: 'Navio', value: 'Navio' },
    { label: 'Trem', value: 'Trem' },
    { label: 'Ônibus', value: 'Ônibus' },
    { label: 'Carro', value: 'Carro' },
    { label: 'Moto', value: 'Moto' },
    { label: 'Bicicleta', value: 'Bicicleta' },
    { label: 'Caminhando', value: 'Caminhando' },
    { label: 'Outros', value: 'Outros' }
  ]);
  const [origincity, setOriginCity] = useState('');
  const [destinycity, setDestinyCity] = useState('');
  const [description, setDescription] = useState('');

  const [deleteSearchIcon, setDeleteSearchIcon] = useState(false);



  useEffect(() => {
    if (isFocused) {
      const fetchTravels = async () => {
        try {
          setLoading(true);
          const travelsList = await getTravelsByUser("ayXVaqgFJZ4sBgoLKW29");
          setTravels(travelsList || []);
        } catch (error) {
          console.error('Error fetching travels:', error);
        } finally {
          setLoading(false);
        }

      };

      fetchTravels();
    }
  }, [isFocused]);

  const handleSearchText = (text: string) => {
    setSearchText(text);
    setDeleteSearchIcon(true)
  }

  const handleSearch = (text: string) => {
    const fetchFilteredTravels = async () => {
      try {
        setLoading(true);
        const travelsList = await searchTravels('ayXVaqgFJZ4sBgoLKW29', text);
        setTravels(travelsList || []);
      } catch (error) {
        console.error('Error fetching travels:', error);
      } finally {
        setLoading(false);
      }

    };

    fetchFilteredTravels();
  };

  const deleteSearch = () => {
    setSearchText("");
    setDeleteSearchIcon(false)
    onRefresh();
  }


  const handleOriginCity = (text: string) => {
    setOriginCity(text);
  };

  const handleDetinyCity = (text: string) => {
    setDestinyCity(text);
  };

  const handleDescription = (text: string) => {
    setDescription(text);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    setTimeout(() => {
      const fetchTravels = async () => {
        const travelsList = await getTravelsByUser("ayXVaqgFJZ4sBgoLKW29");
        setTravels(travelsList || []);
      };

      fetchTravels();
      setSearchText('')
      setRefreshing(false);
    }, 2000);
  }, [travels]);


  const renderTravelCard: ListRenderItem<travelData> = ({ item }) => (
    <View key={item.travel_id} style={styles.cardContainer}>
      <View style={styles.card}>

        <View style={styles.cardHeader}>
          <View style={styles.cardLocation}>
            <MaterialIcons size={28} name='location-pin' color={'#45B3AF'} />
            <Text style={styles.cardHeaderText}>
              {item.origincity}, {item.origincountry}
            </Text>
          </View>

          <Link
            style={styles.cardOptions}
            href={{
              pathname: '/(tabs)/posts',
              params: { id: item.travel_id }
            }}>
            <MaterialIcons size={28} name='keyboard-arrow-right' color={'#45B3AF'} />
          </Link>




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

  const handleCreateTravel = () => {
    const newTravel: insertTravelData = {
      user_id: 'ayXVaqgFJZ4sBgoLKW29',
      origincity: origincity,
      origincountry: 'Brasil',
      originlatitude: -23.5505,
      originlongitude: -46.6333,
      destinycity: destinycity,
      destinycountry: 'Brasil',
      destinylatitude: -22.9068,
      destinylongitude: -43.1729,
      distanceinmeters: 429000,
      modal: value ?? 'avião',
      travel_image: 'https://static.mundoeducacao.uol.com.br/mundoeducacao/2021/03/1-cristo-redentor.jpg',
      date: Timestamp.fromDate(new Date()), // Data atual
      description: description,
    };

    addTravel(newTravel);
    setOriginCity("")
    setDestinyCity("")
    setDescription("")
    onRefresh();
    setModalCreateTravelVisible(false)
  };



  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
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
                  <Text style={styles.modalText}>
                    Como foi sua viagem?
                  </Text>

                  <TextInput
                    style={styles.modalInputText}
                    placeholder='Cidade de origem da viagem'
                    placeholderTextColor='#45B3AF'
                    value={origincity}
                    onChangeText={handleOriginCity}
                  />

                  <TextInput
                    style={styles.modalInputText}
                    placeholder='Cidade de destino da viagem'
                    placeholderTextColor='#45B3AF'
                    value={destinycity}
                    onChangeText={handleDetinyCity}
                  />

                  <DropDownPicker
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                    placeholder="Modalidade"
                    style={styles.modalPicker}
                    textStyle={styles.modalDropdownText}
                    dropDownContainerStyle={styles.mdoalDropDownContainer}
                    ArrowUpIconComponent={() => (
                      <MaterialIcons size={28} name='keyboard-arrow-up' color='#45B3AF' />
                    )}
                    ArrowDownIconComponent={() => (
                      <MaterialIcons size={28} name='keyboard-arrow-down' color='#45B3AF' />
                    )}
                  />

                  <TextInput
                    style={styles.modalInputDescriptionText}
                    placeholder='Descrição'
                    placeholderTextColor='#45B3AF'
                    multiline
                    textAlignVertical="top"
                    value={description}
                    onChangeText={handleDescription}
                  />

                  <TouchableOpacity>
                    <Image
                      style={styles.modalImage}
                      source={require('../../assets/images/addImage.png')}
                    />
                  </TouchableOpacity>

                  <View style={styles.modalButtons}>

                    <TouchableOpacity
                      style={styles.modalCancelButton}
                      onPress={() => setModalCreateTravelVisible(false)}>
                      <Text style={styles.modalCancelButtonText}>
                        Cancelar
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.modalAddButton}
                      onPress={() => handleCreateTravel()}>
                      <Text style={styles.modalAddButtonText}>
                        Adicionar
                      </Text>
                    </TouchableOpacity>

                  </View>

                </View>
              </View>
            </Modal>

          </View>

        </View>

        <View style={styles.searchContainer}>

          <TextInput
            style={styles.searchBar}
            placeholder='Buscar por cidade de destino'
            placeholderTextColor='#45B3AF'
            value={searchText}
            onChangeText={handleSearchText}
          />
          <View style={styles.searchItem}>
            {deleteSearchIcon && 
            <TouchableOpacity
              onPress={() => deleteSearch()}>
              <MaterialIcons size={28} name='close' color={'#45B3AF'} />
            </TouchableOpacity>
            }
            <TouchableOpacity
              onPress={() => handleSearch(searchText)}>
              <MaterialIcons size={28} name='search' color={'#45B3AF'} />
            </TouchableOpacity>
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
          />
        )}


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
