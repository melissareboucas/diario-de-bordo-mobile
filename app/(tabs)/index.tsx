import { Card } from '@/components/Card';
import { getUserById } from '@/data/retrieveData';
import { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, ScrollView, StatusBar, Image, View, Text, ActivityIndicator, ListRenderItem } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

interface userData {
  user_id: string,
  name: string,
  username: string,
  profile_image: string,
  background_image: string,
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any[]>([]);

  useEffect(() => {

    const fetchUser = async () => {
      try {
        setLoading(true);
        const userDb = await getUserById("ayXVaqgFJZ4sBgoLKW29");
        setUser(userDb || []);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }

    };

    fetchUser();

  }, []);

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

      <View>
        <Card title="Viagens" total='1,2M' text="Km" />
        <Card title="Países" total='2' text="países" />
        <Card title="Cidades" total='4' text="cidades" />
      </View>
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
    resizeMode: 'center',
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

});
