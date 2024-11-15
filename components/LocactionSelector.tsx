import React, { useState } from 'react';
import { Modal, View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { GooglePlacesAutocomplete, GooglePlacesAutocompleteRef } from 'react-native-google-places-autocomplete';

interface LocationSelectorProps {
    isVisible: boolean;
    
    onSelectLocation: (location: string) => void;
}

interface GooglePlaceData {
    description: string;
    place_id: string;
    reference: string;
    structured_formatting: {
        main_text: string;
        secondary_text: string;
    };
}

interface GooglePlaceDetail {
    geometry: {
        location: {
            lat: number;
            lng: number;
        };
    };
    address_components: Array<{
        long_name: string;
        short_name: string;
        types: string[];
    }>;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const LocationSelector: React.FC<LocationSelectorProps> = ({
    isVisible,
 
    onSelectLocation
}) => {
    const [selectedLocation, setSelectedLocation] = useState<string>('');
    const [selectedLocation2, setSelectedLocation2] = useState<string>('');
    const autocompleteRef = React.useRef<GooglePlacesAutocompleteRef>(null);

    const handleLocationSelect = (
        data: GooglePlaceData,
        details: GooglePlaceDetail | null
    ): void => {
        const locationName = data.description;
        setSelectedLocation(locationName);
        onSelectLocation(locationName);
        //onClose();
    };

    const handleLocationSelect2 = (
        data: GooglePlaceData,
        details: GooglePlaceDetail | null
    ): void => {
        const locationName = data.description;
        setSelectedLocation2(locationName);
        //onSelectLocation(locationName);
        //onClose();
    };

    return (
        
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <TouchableOpacity
                        style={styles.closeButton}
                        //onPress={onClose}
                    >
                        <Text style={styles.closeButtonText}>✕</Text>
                    </TouchableOpacity>

                    <GooglePlacesAutocomplete
                        ref={autocompleteRef}
                        placeholder="Digite o nome da cidade"
                        onPress={handleLocationSelect}
                        query={{
                            key: 'AIzaSyAxGvRgKxnuMqI8pqg_1-yBfp4iQGCOjrk',
                            language: 'pt-BR',
                            types: '(cities)',
                        }}
                        styles={{
                            container: styles.googleAutoCompleteContainer,
                            textInput: styles.textInput,
                            listView: styles.listView,
                            row: styles.row,
                            separator: styles.separator,
                            description: styles.description,
                            powered: styles.powered,
                        }}
                        fetchDetails={true}
                        enablePoweredByContainer={false}
                        textInputProps={{
                            value: selectedLocation,
                            onChangeText: (text: string) => setSelectedLocation(text),
                        }}
                        minLength={2}
                        debounce={300}
                        numberOfLines={3}
                        listViewDisplayed="auto"
                        keyboardShouldPersistTaps="handled"
                    />

                    <GooglePlacesAutocomplete
                        ref={autocompleteRef}
                        placeholder="Digite o nome da cidade 2"
                        onPress={handleLocationSelect2}
                        query={{
                            key: 'AIzaSyAxGvRgKxnuMqI8pqg_1-yBfp4iQGCOjrk',
                            language: 'pt-BR',
                            types: '(cities)',
                        }}
                        styles={{
                            container: styles.googleAutoCompleteContainer,
                            textInput: styles.textInput,
                            listView: styles.listView,
                            row: styles.row,
                            separator: styles.separator,
                            description: styles.description,
                            powered: styles.powered,
                        }}
                        fetchDetails={true}
                        enablePoweredByContainer={false}
                        textInputProps={{
                            value: selectedLocation2,
                            onChangeText: (text: string) => setSelectedLocation2(text),
                        }}
                        minLength={2}
                        debounce={300}
                        numberOfLines={3}
                        listViewDisplayed="auto"
                        keyboardShouldPersistTaps="handled"
                    />
                </View>
            </View>
       
    );
};

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
    googleAutoCompleteContainer: {
        flex: 0,
        position: 'relative',
        width: '100%',
        marginTop: 30, // Espaço para o botão de fechar
        zIndex: 1,
    },
    textInput: {
        height: 46,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        paddingHorizontal: 10,
        fontSize: 16,
    },
    listView: {
        maxHeight: SCREEN_HEIGHT * 0.4, // Limita a altura da lista a 40% da tela
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        position: 'relative',
        zIndex: 9999,
    },
    row: {
        padding: 13,
        minHeight: 44,
        flexDirection: 'row',
    },
    separator: {
        height: 1,
        backgroundColor: '#ddd',
    },
    description: {
        fontSize: 15,
    },
    powered: {
        display: 'none', // Esconde o "Powered by Google"
    },
});

export default LocationSelector;