import React, { useState, useRef } from 'react';
import { View, StyleSheet, TextInput, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import {  useRouter } from 'expo-router';
import { MarkerType } from '../types';
import { useMarkers } from '../components/MarkersContext';

const generateId = () => {
  return Math.random().toString(36).substring(2, 15);
};


const MapScreen: React.FC = () => {
  const router = useRouter();
  const { markers, setMarkers } = useMarkers();
  const mapRef = useRef<MapView>(null);

  const handleMapPress = (event: any) => {
    const newMarker: MarkerType = {
      id: generateId(),
      coordinate: event.nativeEvent.coordinate,
      images: [],
    };
    console.log('Новый маркер создан:', newMarker);
    setMarkers([...markers, newMarker]);
  };
  

  const handleMarkerPress = (marker: MarkerType) => {
    console.log('Нажат маркер:', marker);
    router.push(`/marker/${marker.id}`);
    return true;
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 58.00758,
          longitude: 56.18743,
          latitudeDelta: 0.005,
          longitudeDelta: 0.02,
        }}
        onLongPress={handleMapPress}
      >
        {
          markers.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={marker.coordinate}
              onPress={() => handleMarkerPress(marker)}
            >
            </Marker>
          ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  inputContainer: {
    backgroundColor: '#fff',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 5,
    width: '30%',
    marginRight: 10,
  },
});

export default MapScreen;