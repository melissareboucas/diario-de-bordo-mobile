import { ActivityIndicator, FlatList, ListRenderItem, Modal, RefreshControl, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { getPostsByTravel, getTravelById } from '@/data/retrieveData';
import { Timestamp } from 'firebase/firestore';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { deleteTravelById } from '@/data/deleteData';

import { useNavigation } from '@react-navigation/native';
import { addPost } from '@/data/insertData';



interface postData {
  post_id: string,
  travel_id: string,
  user_id: string,
  title: string,
  post_text: string,
  post_date: Timestamp
}

interface insertPostData {
  user_id: string,
  travel_id: string,
  post_text: string,
  title: string,
  post_date: Timestamp,
}


export default function Posts() {
  const { id } = useLocalSearchParams();
  const travel_id = id as string;

  const [posts, setPosts] = useState<any[]>([]);
  const [travel, setTravel] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [postText, setPostText] = useState('');
  const [title, setTitle] = useState('');

  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editPostModal, setEditPostModal] = useState(false);
  const [deletePostModal, setDeletePostModal] = useState(false);
  const [addModal, setAddModal] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const postsList = await getPostsByTravel(travel_id);
        setPosts(postsList || []);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }

    };

    fetchPosts();


  }, [travel_id]);

  useEffect(() => {
    const fetchTravel = async () => {
      try {
        setLoading(true);
        const travelDetails = await getTravelById(travel_id);
        setTravel(travelDetails || []);

      } catch (error) {
        console.error('Error fetching travel:', error);
      } finally {
        setLoading(false);
      }

    };

    fetchTravel();

  }, [travel_id])

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    setTimeout(() => {
      const fetchPosts = async () => {
        const postsList = await getPostsByTravel(travel_id);
        setPosts(postsList || []);
      };

      const fetchTravel = async () => {
        const travelDetails = await getTravelById(travel_id);
        setTravel(travelDetails || []);
      }

      fetchPosts();
      fetchTravel();

      setRefreshing(false);
    }, 2000);
  }, [posts, travel_id]);

  const handleDeleteTravel = () => {
    deleteTravelById(travel_id);
    navigation.goBack();
    setDeleteModal(false)
  };

  const handleCreatePost = () => {
    const newPost: insertPostData = {
      user_id: 'ayXVaqgFJZ4sBgoLKW29',
      travel_id: travel_id,
      post_text: postText,
      title: title,
      post_date: Timestamp.fromDate(new Date()), // Data atual
    };

    addPost(newPost);
    onRefresh();
    setAddModal(false)
  };

  const handleTitle = (text: string) => {
    setTitle(text);
  };

  const handlePostText = (text: string) => {
    setPostText(text);
  };

  const renderPostCard: ListRenderItem<postData> = ({ item }) => (
    <View key={item.post_id} style={styles.cardContainer}>
      <View style={styles.card}>

        <View style={styles.cardHeader}>
          <Text style={styles.cardHeaderText}>
            {item.title}
          </Text>

          <View style={styles.cardLocation}>
            <TouchableOpacity
              onPress={() => setEditPostModal(true)}
            >
              <MaterialIcons size={24} name='edit' color={'#45B3AF'} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setDeletePostModal(true)}
            >
              <MaterialIcons size={24} name='delete' color={'#45B3AF'} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.cardDate}>{item.post_date.toDate().toLocaleDateString()}</Text>

        <Text style={styles.cardDescription}>
          {item.post_text}
        </Text>
      </View>
    </View>
  )


  return (
    <SafeAreaView style={styles.container}>
      {loading && (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#196966" />
        </View>)
      }
      {!loading && (
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

            <View style={styles.header}>

              {travel.length > 0 &&
                <View style={styles.headerDetails}>

                  <Text style={styles.headerText}>

                    {travel[0].destinycity}, {travel[0].destinycountry}

                  </Text>

                  <Text style={styles.headerDate}>
                    {travel[0].date.toDate().toLocaleDateString()}
                  </Text>
                </View>
              }
              <TouchableOpacity
                onPress={() => setEditModal(true)}
              >
                <MaterialIcons size={28} name='edit' color={'#45B3AF'} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setDeleteModal(true)}
              >
                <MaterialIcons size={28} name='delete' color={'#45B3AF'} />
              </TouchableOpacity>
              <Modal
                animationType="fade"
                transparent={true}
                visible={deleteModal}
                onRequestClose={() => setDeleteModal(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalText}>
                      Deseja deletar essa viagem?
                    </Text>

                    <View style={styles.modalButtons}>

                      <TouchableOpacity
                        style={styles.modalCancelButton}
                        onPress={() => setDeleteModal(false)}>
                        <Text style={styles.modalCancelButtonText}>
                          Cancelar
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.modalAddButton}
                        onPress={() => handleDeleteTravel()}>
                        <Text style={styles.modalAddButtonText}>
                          Deletar
                        </Text>
                      </TouchableOpacity>

                    </View>

                  </View>
                </View>
              </Modal>

              <TouchableOpacity
                onPress={() => setAddModal(true)}
              >
                <MaterialIcons size={28} name='add-circle' color={'#45B3AF'} />
              </TouchableOpacity>
              <Modal
                animationType="fade"
                transparent={true}
                visible={addModal}
                onRequestClose={() => setAddModal(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalText}>
                      Como foi seu dia?
                    </Text>

                    <TextInput
                      style={styles.modalInputText}
                      placeholder='Título'
                      placeholderTextColor='#45B3AF'
                      value={title}
                      onChangeText={handleTitle}
                    />

                    <TextInput
                      style={styles.modalInputPostText}
                      placeholder='Conta aí como foi seu dia...'
                      placeholderTextColor='#45B3AF'
                      multiline
                      textAlignVertical="top"
                      value={postText}
                      onChangeText={handlePostText}
                    />

                    <View style={styles.modalButtons}>

                      <TouchableOpacity
                        style={styles.modalCancelButton}
                        onPress={() => setAddModal(false)}>
                        <Text style={styles.modalCancelButtonText}>
                          Cancelar
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.modalAddButton}
                        onPress={() => handleCreatePost()}>
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




          <FlatList
            data={posts}
            renderItem={renderPostCard}
            keyExtractor={item => item.post_id}
          />



        </ScrollView>
      )}
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 0,
    backgroundColor: "white",
  },
  header: {
    flexDirection: 'row',
    margin: 10,
    justifyContent: 'space-between',
  },
  headerDetails: {
    flexDirection: 'column',
  },
  headerText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#196966',
  },
  headerDate: {
    fontSize: 15,
    color: '#196966',
    marginTop: 5
  },


  //MODAL
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
  modalInputPostText: {
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
    //justifyContent: 'flex-start'
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  cardLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3
  },
  cardHeaderText: {
    fontSize: 15,
    color: '#196966',
    fontWeight: '500'
  },
  cardDate: {
    fontSize: 15,
    color: '#196966',
    marginTop: 5
  },
  cardDescription: {
    fontSize: 20,
    color: '#45B3AF',
    marginTop: 10,
    textAlign: 'justify'
  },
  cardImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain'
  }

});