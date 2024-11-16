
import { getUserById } from '@/data/retrieveData';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, StatusBar, Image, View, Text, ActivityIndicator, ListRenderItem, TouchableOpacity, Modal, TextInput } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import * as ImagePicker from 'expo-image-picker';
import { updateUser } from '@/data/updateData';
import { useIsFocused } from '@react-navigation/native';


interface userData {
  user_id: string,
  name: string,
  username: string,
  profile_image: string,
  background_image: string,
}

interface insertUserData {
  name: string,
  username: string,
  profile_image: string,
  background_image: string,
}

export default function ProfileSetup() {
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [background_image, setBackground_image] = useState("");
  const [profile_image, setProfile_image] = useState("");

  const [editProfileModal, seteEditProfileModal] = useState(false);

  const [localImageBackground, setLocalImageBackground] = useState('');
  const [localImageProfile, setLocalImageProfile] = useState('');

  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const userDb = await getUserById("ayXVaqgFJZ4sBgoLKW29");
      setUser(userDb || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditName = (text: string) => {
    setName(text);
  };

  const handleEditUserName = (text: string) => {
    setUserName(text);
  };

  const pickImageBackground = async () => {
    // Solicitar permissão para acessar a galeria
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      console.log("sem acesso")
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setLocalImageBackground(result.assets[0].uri);
      setBackground_image(result.assets[0].uri);
    }

  }

  const pickImageProfile = async () => {
    // Solicitar permissão para acessar a galeria
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      console.log("sem acesso")
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setLocalImageProfile(result.assets[0].uri);
      setProfile_image(result.assets[0].uri);
    }

  }

  const handleEditProfile = (user_id: string) => {
    const updatedUser: insertUserData = {
      name: name,
      username: userName,
      background_image: background_image,
      profile_image: profile_image,
    };

    updateUser(updatedUser, user_id);
    fetchData();
    seteEditProfileModal(false)
  }

  const renderUser: ListRenderItem<userData> = ({ item }) => (
    <View key={item.user_id}>
      <View>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <Image
          source={{ uri: item.background_image }}
          style={styles.mapImage}
        />
      </View>

      <View style={styles.profileArea}>
        <Image
          source={{ uri: item.profile_image }}
          style={styles.profileImage}
        />
        <View style={styles.profileAreaText}>
          <Text style={styles.profileNameText}>
            {item.name}
          </Text>
          <Text style={styles.profileUserNameText}>
            {item.username}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.headerButton}
        onPress={() => {
          setName(item.name),
          setUserName(item.username)
          setBackground_image(item.background_image)
          setProfile_image(item.profile_image)
          seteEditProfileModal(true)
        }}
      >
        <Text style={styles.headerButtonText}>
          Editar perfil
        </Text>
      </TouchableOpacity>
      <Modal
        animationType="fade"
        transparent={true}
        visible={editProfileModal}
        onRequestClose={() => {
          seteEditProfileModal(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Editar perfil
            </Text>

            <TextInput
              style={styles.modalInputText}
              placeholder='Nome'
              placeholderTextColor='#45B3AF'
              value={name}
              onChangeText={handleEditName}
            />

            <TextInput
              style={styles.modalInputText}
              placeholder='Username'
              placeholderTextColor='#45B3AF'
              value={userName}
              onChangeText={handleEditUserName}
            />

            <TouchableOpacity
              onPress={pickImageBackground}
            >
              {localImageBackground && <Image source={{ uri: localImageBackground }} style={styles.modalImage} />}
              {!localImageBackground && <Image
                style={styles.modalImage}
                source={{ uri: item.background_image }}
              />}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={pickImageProfile}
            >
              {localImageProfile && <Image source={{ uri: localImageProfile }} style={styles.profileImage} />}
              {!localImageProfile && <Image
                style={styles.profileImage}
                source={{ uri: item.profile_image }}
              />}
            </TouchableOpacity>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => {
                  setLocalImageBackground('');
                  setLocalImageProfile('');
                  seteEditProfileModal(false);
                }}>
                <Text style={styles.modalCancelButtonText}>
                  Cancelar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalAddButton}
                onPress={() => handleEditProfile(item.user_id)}>
                <Text style={styles.modalAddButtonText}>
                  Salvar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

      </Modal>

      <TouchableOpacity
        style={styles.headerButton}
        onPress={() =>
          router.push({
            pathname: '/(tabs)',
          })
        }
      >
        <Text style={styles.headerButtonText}>
          Logout
        </Text>
      </TouchableOpacity>

    </View>

  )


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>

        {loading && (
          <View style={styles.container}>
            <ActivityIndicator size="large" color="#196966" />
          </View>)
        }

        {!loading && (
          <FlatList
            data={user}
            renderItem={renderUser}
            keyExtractor={item => item.user_id}
            showsVerticalScrollIndicator={false}
          />
        )}

      </SafeAreaView >
    </GestureHandlerRootView>
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
    resizeMode: 'cover',
  },
  profileArea: {
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
  headerButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#45B3AF',
    borderRadius: 7,
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 55,
    marginRight: 55,
    marginTop: 20
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
  modalImage: {
    width: 200,
    height: 150,
    resizeMode: 'contain'
  },

});
