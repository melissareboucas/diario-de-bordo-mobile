
import { useState } from "react";
import { StyleSheet, SafeAreaView, TouchableOpacity, View, Text, Modal, Button } from "react-native";
import { GooglePlaceData, GooglePlaceDetail, GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

export default function Community() {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<string>('');

  const handleLocationSelect = (location: string): void => {
    setSelectedLocation(location);
    console.log('Localização selecionada:', location);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button 
        title="Selecionar Localização" 
        onPress={() => setModalVisible(true)} 
      />
      
      
    </View>
  );
}


