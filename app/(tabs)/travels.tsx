import React, { useCallback, useEffect, useState } from 'react';

import {
  StyleSheet, SafeAreaView, ScrollView, StatusBar,
  Image, View, Text, FlatList, TouchableOpacity, Modal,
  TextInput, ListRenderItem, RefreshControl,
  ActivityIndicator,
  Dimensions,
  Keyboard
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

import * as ImagePicker from 'expo-image-picker';

import { getTravelsByUser, getUserById, searchTravels } from '../../data/retrieveData'
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

interface insertTravelData {
  user_id: string,
  origincity: string,
  destinycity: string,
  distanceinmeters: number,
  travel_image: string,
  date: Timestamp,
  description: string
}

interface userData {
  user_id: string,
  name: string,
  username: string,
  profile_image: string,
  background_image: string,
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');


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
    { label: 'Sim', value: 'yes' },
    { label: 'Não', value: 'no' },
  ]);
  const [origincity, setOriginCity] = useState('');
  const [destinycity, setDestinyCity] = useState('');
  const [description, setDescription] = useState('');
  const [distanceinmeters, setDistanceInMeeters] = useState(0);
  const [localImage, setLocalImage] = useState('');
  const [travelImage, setTravelImage] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [originCityError, setOriginCityError] = useState('');
  const [destinyCityError, setDestinyCityError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [travelImageError, setTravelImageError] = useState('');

  const [deleteSearchIcon, setDeleteSearchIcon] = useState(false);

  const [user, setUser] = useState<userData[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const userDb = await getUserById("ayXVaqgFJZ4sBgoLKW29");
      setUser(userDb || []);


      const travelsList = await getTravelsByUser("ayXVaqgFJZ4sBgoLKW29");
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
    if (text) {
      setOriginCityError('');
    }
  };

  const handleDetinyCity = (text: string) => {
    setDestinyCity(text);
    if (text) {
      setDestinyCityError('');
    }
  };

  const handleDescription = (text: string) => {
    setDescription(text);
    if (text) {
      setDescriptionError('');
    }
  };

  const handleDistance = (text: string) => {
    const numericValue = parseInt(text.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(numericValue)) {
      setDistanceInMeeters(numericValue);
    }
  };

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || new Date();
    setShowDatePicker(false);
    setSelectedDate(currentDate);
  };

  // Função para abrir a galeria e selecionar a imagem
  const pickImage = async () => {
    // Solicitar permissão para acessar a galeria
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      console.log("sem acesso")
      return;
    }

    setTravelImageError('');

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setLocalImage(result.assets[0].uri);

    }

  }

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

  const handleCreateTravel = () => {

    if (!origincity) {
      setOriginCityError('A cidade de origem é obrigatória.');
      return;
    }

    if (!destinycity) {
      setDestinyCityError('A cidade de destino é obrigatória.');
      return;
    }

    if (!description) {
      setDescriptionError('A descrição é obrigatória.');
      return;
    }

    if (!localImage) {
      setTravelImageError('A imagem é obrigatória.');
      return;
    }

    const uploadImage = async (localImage: string) => {
      const response = await fetch(localImage);
      const blob = await response.blob();


      const storageRef = ref(storage, `images/${Date.now()}.jpg`);

      uploadBytes(storageRef, blob)
        .then(async (snapshot) => {
          const downloadURL = await getDownloadURL(snapshot.ref);
          return downloadURL; // Retornamos o downloadURL para o próximo .then
        })
        .then((downloadURL) => {
          setTravelImage(downloadURL)
          const newTravel: insertTravelData = {
            user_id: user[0].user_id,
            origincity: origincity,
            destinycity: destinycity,
            distanceinmeters: distanceinmeters,
            travel_image: downloadURL,
            date: Timestamp.fromDate(selectedDate),
            description: description,
          };
          addTravel(newTravel);
          setOriginCity("")
          setDestinyCity("")
          setDescription("")
          setDistanceInMeeters(0)
          setSelectedDate(new Date())
          setLocalImage("")
          setTravelImage("")
          setValue(null)
          onRefresh();
          setModalCreateTravelVisible(false)
        })
        .catch((error) => {
          console.error("Erro ao fazer upload:", error);
        });
    };

    uploadImage(localImage);


  };

  const renderTravelCard: ListRenderItem<travelData> = ({ item }) => (
    <View key={item.travel_id} style={styles.cardContainer}>
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: '/(tabs)/posts',
            params: { id: item.travel_id },
          })
        }
        activeOpacity={0.8} // Define a opacidade ao pressionar, se desejado
        style={styles.card} // Mantém o estilo fixo do card
      >

        <View style={styles.cardHeader}>
          <View style={styles.cardLocation}>
            <MaterialIcons size={28} name='location-pin' color={'#45B3AF'} />
            <Text style={styles.cardHeaderText}>
              {item.origincity}
            </Text>
          </View>

          <View
            style={styles.cardOptions}>
            <MaterialIcons size={28} name='keyboard-arrow-right' color={'#45B3AF'} />
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
      </TouchableOpacity>
    </View>
  )

  return (
    <>
      <SafeAreaView style={styles.container}>


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
                    placeholder='Cidade, País de origem'
                    placeholderTextColor='#45B3AF'
                    value={origincity}
                    onChangeText={handleOriginCity}
                  />
                  {originCityError ? <Text style={{ color: 'red' }}>{originCityError}</Text> : null}




                  <TextInput
                    style={styles.modalInputText}
                    placeholder='Cidade, País de destino'
                    placeholderTextColor='#45B3AF'
                    value={destinycity}
                    onChangeText={handleDetinyCity}
                  />
                  {destinyCityError ? <Text style={{ color: 'red' }}>{destinyCityError}</Text> : null}

                  <View style={styles.inputContainer}>

                    <Text style={styles.inputLabel}>Distância (m)</Text>

                    <TextInput
                      style={styles.distanceText}
                      placeholder='Distância (m)'
                      placeholderTextColor='#45B3AF'
                      value={distanceinmeters.toString()}
                      keyboardType="numeric"
                      onChangeText={handleDistance}
                    />

                  </View>

                  <View style={styles.inputContainer}>

                    <Text style={styles.inputLabel}>Data da Viagem</Text>

                    {/* Campo de data */}
                    <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateInput}>
                      <Text style={styles.dateText}>{selectedDate.toLocaleDateString()}</Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                      <DateTimePicker
                        value={selectedDate}
                        mode="date"
                        display="calendar"
                        onChange={handleDateChange}
                      />
                    )}

                  </View>


                  <TextInput
                    style={styles.modalInputDescriptionText}
                    placeholder='Descrição'
                    placeholderTextColor='#45B3AF'
                    multiline
                    textAlignVertical="top"
                    value={description}
                    onChangeText={handleDescription}
                  />
                  {descriptionError ? <Text style={{ color: 'red' }}>{descriptionError}</Text> : null}

                  <TouchableOpacity
                    onPress={pickImage}
                  >
                    {localImage && <Image source={{ uri: localImage }} style={styles.modalImage} />}
                    {!localImage && <Image
                      style={styles.modalImage}
                      source={require('../../assets/images/addImage.png')}
                    />}

                  </TouchableOpacity>
                  {travelImageError ? <Text style={{ color: 'red' }}>{travelImageError}</Text> : null}

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
