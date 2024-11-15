
import { StyleSheet, SafeAreaView, StatusBar, ScrollView, RefreshControl, Text, View, ActivityIndicator, TouchableOpacity, Modal } from 'react-native';

import MapView from 'react-native-maps';

import { GooglePlacesAutocomplete, GooglePlaceData, GooglePlaceDetail } from 'react-native-google-places-autocomplete';

import 'react-native-get-random-values';
import { useCallback, useEffect, useState } from 'react';
import { getMostPopularOriginCityByUser } from '@/data/retrieveData';


interface CityInfo {
  count: number;
  originCity: string,
  originLatitude: number
  originLongitude: number
}

export default function ProfileSetup() {
  const [mostPopularOriginCity, setMostPopularOriginCity] = useState<CityInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialRegion, setInitialRegion] = useState({
    latitude: -23.5505,
    longitude: -46.6333,
    latitudeDelta: 20.0922,
    longitudeDelta: 20.0421,
  });
  const [isMapReady, setIsMapReady] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [region, setRegion] = useState(initialRegion);

  const fetchMostPopularOriginCityByUser = async () => {
    try {
      setLoading(true);
      const mostPopularOrigin = await getMostPopularOriginCityByUser("ayXVaqgFJZ4sBgoLKW29");
      setMostPopularOriginCity(mostPopularOrigin || null);
    } catch (error) {
      console.error('Error fetching most popular origin:', error);
    } finally {
      setLoading(false);
    }
  };

  // useEffect para buscar a cidade mais popular quando o componente monta
  useEffect(() => {
    fetchMostPopularOriginCityByUser();
  }, []);

  useEffect(() => {
    if (mostPopularOriginCity) {
      setRegion({
        latitude: mostPopularOriginCity.originLatitude,
        longitude: mostPopularOriginCity.originLongitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      setIsMapReady(true);
    }
  }, [mostPopularOriginCity]);






  const onRefresh = useCallback(() => {
    setRefreshing(true);

    setRegion(initialRegion)
    setRefreshing(false);

  }, [initialRegion]);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>

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

          {isMapReady ? (
            <MapView
              style={styles.map}
              region={region} // Usar region em vez de initialRegion
              onRegionChangeComplete={(newRegion) => {
                if (!refreshing) {
                  setRegion(newRegion);
                }
              }}
            >

            </MapView>) : (
            <View style={styles.container}>
              <ActivityIndicator size="large" color="#196966" />
            </View>
          )}

          <Text style={styles.title}>Comunidade</Text>
        </ScrollView>)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 0,
    backgroundColor: "white",
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  map: {
    width: '100%',
    height: 200
  },
});
