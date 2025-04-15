import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import MarkerDetailScreen from '../../components/MarkerDetailScreen';
import { useMarkers } from '../../components/MarkersContext';

const MarkerPage: React.FC = () => {
  const { id } = useLocalSearchParams();
  const markerId = Array.isArray(id) ? id[0] : id;
  const { markers } = useMarkers();
  const fetchedMarker = markers.find((m) => m.id === markerId);

  if (!fetchedMarker) {
    return <Text>Маркер не найден</Text>;
  } else {
    return <MarkerDetailScreen fetchedMarker={fetchedMarker} />
  }
};

export default MarkerPage;