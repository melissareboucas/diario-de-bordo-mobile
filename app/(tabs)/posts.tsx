import {
  ActivityIndicator, FlatList, ListRenderItem, Modal, RefreshControl, SafeAreaView,
  ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View, Image
} from 'react-native';

import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { getPostsByTravel, getTravelById, getPostById } from '@/data/retrieveData';
import { Timestamp } from 'firebase/firestore';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { deletePostById, deleteTravelById } from '@/data/deleteData';

import { useNavigation } from '@react-navigation/native';
import { addPost } from '@/data/insertData';
import { updatePost, updateTravel } from '@/data/updateData';

import DateTimePicker from '@react-native-community/datetimepicker'; // Importando o DateTimePicker


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

  const [selectedPostId, setSelectedPostId] = useState<string>('000');
  const [selectedPost, setSelectedPost] = useState<any[]>([]);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);


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

  useEffect(() => {

    const fetchPost = async () => {
      try {
        const postDetails = await getPostById(selectedPostId);
        setSelectedPost(postDetails || []);

      } catch (error) {
        console.error('Error fetching post:', error);
      }

    };

    fetchPost();

  }, [selectedPostId])

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
      post_date: Timestamp.fromDate(selectedDate), // Data atual
    };

    addPost(newPost);
    onRefresh();
    setAddModal(false)
  };

  const handleTitle = (text: string) => {
    setTitle(text);
  };

  const handleEditTitle = (text: string) => {
    setSelectedPost(prevPosts => {
      if (prevPosts.length > 0) {

        const updatedPost = { ...prevPosts[0], title: text };
        setTitle(text);
        setPostText(prevPosts[0].post_text);
        return [updatedPost];
      }
      return prevPosts;
    });
  };

  const handleEditPostText = (text: string) => {
    setSelectedPost(prevPosts => {
      if (prevPosts.length > 0) {

        const updatedPost = { ...prevPosts[0], post_text: text };
        setPostText(text);
        setTitle(prevPosts[0].title);
        return [updatedPost];
      }
      return prevPosts;
    });
  };

  const handlePostText = (text: string) => {
    setPostText(text);
  };

  const handleDeletePost = (postId: string) => {
    deletePostById(postId);
    onRefresh();
    setDeletePostModal(false)
  };

  const handleEditPost = (postId: string) => {
    const updatedPost: insertPostData = {
      user_id: 'ayXVaqgFJZ4sBgoLKW29',
      travel_id: travel_id,
      post_date: Timestamp.fromDate(selectedDate),
      title: title,
      post_text: postText
    };

    updatePost(updatedPost, postId);
    setSelectedDate(new Date());
    onRefresh();
    setEditPostModal(false)
  }

  const handleEditOriginCity = (text: string) => {
    setTravel(prevPosts => {
      if (prevPosts.length > 0) {

        const updatedTravel = { ...prevPosts[0], origincity: text };
        return [updatedTravel];
      }
      return prevPosts;
    });
  };


  const handleEditDestinyCity = (text: string) => {
    setTravel(prevPosts => {
      if (prevPosts.length > 0) {

        const updatedTravel = { ...prevPosts[0], destinycity: text };
        return [updatedTravel];
      }
      return prevPosts;
    });
  };

  const handleEditDistance = (text: string) => {
    setTravel(prevPosts => {
      const numericValue = parseInt(text.replace(/[^0-9]/g, ''), 10);
      if (prevPosts.length > 0 && !isNaN(numericValue)) {

        const updatedTravel = { ...prevPosts[0], distanceinmeters: numericValue };
        return [updatedTravel];
      }
      return prevPosts;
    });
  };

  const handleTravelDateChange = (event: any, selectedDate: Date | undefined) => {
    setTravel(prevPosts => {
      const currentDate = selectedDate || new Date();
      if (prevPosts.length > 0) {

        const updatedTravel = { ...prevPosts[0], date: Timestamp.fromDate(currentDate) };
        setShowDatePicker(false);
        return [updatedTravel];
      }
      return prevPosts;
    });
    
  };

  const handleEditDescription = (text: string) => {
    setTravel(prevPosts => {
      if (prevPosts.length > 0) {

        const updatedTravel = { ...prevPosts[0], description: text };
        return [updatedTravel];
      }
      return prevPosts;
    });
  };

  const handleEditTravel = (travel_id: string) => {
    const updatedTravel: travelData = {
      travel_id: travel_id,
      user_id: travel[0].user_id,
      origincity: travel[0].origincity,
      destinycity: travel[0].destinycity,
      distanceinmeters: travel[0].distanceinmeters,
      travel_image: travel[0].travel_image,
      date: travel[0].date,
      description: travel[0].description
    };

    updateTravel(updatedTravel, travel_id);
    onRefresh();
    setEditModal(false)
  }

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || new Date();
    setShowDatePicker(false);
    setSelectedDate(currentDate);
  };




  const renderPostCard: ListRenderItem<postData> = ({ item }) => (
    <View key={item.post_id} style={styles.cardContainer}>
      <View style={styles.card}>

        <View style={styles.cardHeader}>
          <Text style={styles.cardHeaderText}>
            {item.title}
          </Text>

          <View style={styles.cardLocation}>

            {/*edit post */}
            <TouchableOpacity
              onPress={() => {
                setSelectedPostId(item.post_id);
                setEditPostModal(true);
              }}
            >
              <MaterialIcons size={24} name='edit' color={'#45B3AF'} />
            </TouchableOpacity>
            <Modal
              animationType="fade"
              transparent={true}
              visible={editPostModal}
              onRequestClose={() => {
                setSelectedPostId('000');
                setEditPostModal(false);
              }}
            >
              {selectedPost.length > 0 &&
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalText}>
                      Como foi seu dia?
                    </Text>

                    <TextInput
                      style={styles.modalInputText}
                      placeholder='Título'
                      placeholderTextColor='#45B3AF'
                      value={selectedPost[0].title}
                      onChangeText={handleEditTitle}
                    />

                    <View style={styles.inputContainer}>

                      <Text style={styles.inputLabel}>Data do diário</Text>

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
                      style={styles.modalInputPostText}
                      placeholder='Conta aí como foi seu dia...'
                      placeholderTextColor='#45B3AF'
                      multiline
                      textAlignVertical="top"
                      value={selectedPost[0].post_text}
                      onChangeText={handleEditPostText}
                    />

                    <View style={styles.modalButtons}>

                      <TouchableOpacity
                        style={styles.modalCancelButton}
                        onPress={() => {
                          setSelectedPostId('000');
                          setEditPostModal(false);
                        }}>
                        <Text style={styles.modalCancelButtonText}>
                          Cancelar
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.modalAddButton}
                        onPress={() => handleEditPost(selectedPostId)}>
                        <Text style={styles.modalAddButtonText}>
                          Salvar
                        </Text>
                      </TouchableOpacity>

                    </View>

                  </View>
                </View>
              }
            </Modal>

            {/*delete post */}
            <TouchableOpacity
              onPress={() => {
                setSelectedPostId(item.post_id);
                setDeletePostModal(true);
              }}
            >
              <MaterialIcons size={24} name='delete' color={'#45B3AF'} />
            </TouchableOpacity>
            <Modal
              animationType="fade"
              transparent={true}
              visible={deletePostModal}
              onRequestClose={() => {
                setSelectedPostId('000');
                setDeletePostModal(false);
              }}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalText}>
                    Deseja deletar esse diário?
                  </Text>

                  <View style={styles.modalButtons}>

                    <TouchableOpacity
                      style={styles.modalCancelButton}
                      onPress={() => {
                        setSelectedPostId('000');
                        setDeletePostModal(false);
                      }}>
                      <Text style={styles.modalCancelButtonText}>
                        Cancelar
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.modalAddButton}
                      onPress={() => handleDeletePost(selectedPostId)}>
                      <Text style={styles.modalAddButtonText}>
                        Deletar
                      </Text>
                    </TouchableOpacity>

                  </View>

                </View>
              </View>
            </Modal>

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
        <>
          <View>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            <View style={styles.header}>

              {travel.length > 0 &&
                <>
                  <View style={styles.headerDetails}>

                    <Text style={styles.headerText}>

                      {travel[0].destinycity}

                    </Text>

                    <Text style={styles.headerDate}>
                      {travel[0].date.toDate().toLocaleDateString()}
                    </Text>
                  </View>

                  {/*edit travel */}
                  <TouchableOpacity
                    onPress={() => setEditModal(true)}
                  >
                    <MaterialIcons size={28} name='edit' color={'#45B3AF'} />
                  </TouchableOpacity>
                  <Modal
                    animationType="fade"
                    transparent={true}
                    visible={editModal}
                    onRequestClose={() => setEditModal(false)}
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
                          value={travel[0].origincity}
                          onChangeText={handleEditOriginCity}
                        />

                        <TextInput
                          style={styles.modalInputText}
                          placeholder='Cidade de destino da viagem'
                          placeholderTextColor='#45B3AF'
                          value={travel[0].destinycity}
                          onChangeText={handleEditDestinyCity}
                        />

                        <View style={styles.inputContainer}>

                          <Text style={styles.inputLabel}>Distância (m)</Text>

                          <TextInput
                            style={styles.distanceText}
                            placeholder='0'
                            placeholderTextColor='#45B3AF'
                            value={travel[0].distanceinmeters}
                            keyboardType="numeric"
                            onChangeText={handleEditDistance}
                          />

                        </View>

                        <View style={styles.inputContainer}>

                          <Text style={styles.inputLabel}>Data da Viagem</Text>

                          {/* Campo de data */}
                          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateInput}>
                            <Text style={styles.dateText}>{(travel[0].date).toDate().toLocaleDateString()}</Text>
                          </TouchableOpacity>
                          {showDatePicker && (
                            <DateTimePicker
                              value={selectedDate}
                              mode="date"
                              display="calendar"
                              onChange={handleTravelDateChange}
                            />
                          )}

                        </View>

                        <TextInput
                          style={styles.modalInputDescriptionText}
                          placeholder='Descrição'
                          placeholderTextColor='#45B3AF'
                          multiline
                          textAlignVertical="top"
                          value={travel[0].description}
                          onChangeText={handleEditDescription}
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
                            onPress={() => setEditModal(false)}>
                            <Text style={styles.modalCancelButtonText}>
                              Cancelar
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={styles.modalAddButton}
                            onPress={() => handleEditTravel(travel_id)}>
                            <Text style={styles.modalAddButtonText}>
                              Salvar
                            </Text>
                          </TouchableOpacity>

                        </View>

                      </View>
                    </View>
                  </Modal>

                  {/*delete travel */}
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

                  {/*add a post */}
                  <TouchableOpacity
                    onPress={() => {
                      setTitle("")
                      setPostText("")
                      setAddModal(true)

                    }}
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

                        <View style={styles.inputContainer}>

                          <Text style={styles.inputLabel}>Data do Diário</Text>

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
                </>
              }
            </View>

          </View>

          <FlatList
            data={posts}
            renderItem={renderPostCard}
            keyExtractor={item => item.post_id}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
          />

        </>
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