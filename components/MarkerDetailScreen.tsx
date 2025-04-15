import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Button, Alert, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { MarkerType } from '../types';
import { useMarkers } from '../components/MarkersContext';

interface MarkerDetailScreenProps {
  fetchedMarker: MarkerType;
}

const MarkerDetailScreen: React.FC<MarkerDetailScreenProps> = ({ fetchedMarker }) => {
  const router = useRouter();
  const { markers, setMarkers } = useMarkers();
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    // Обновляем локальное состояние изображений при изменении fetchedMarker
    setImages(fetchedMarker.images || []);
  }, [fetchedMarker]);


  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const newImages = [...images, result.assets[0].uri];
      console.log('Добавлено новое изображение:', result.assets[0].uri);
      setImages(newImages);

      const updatedMarkers = markers.map((m) =>
        m.id === fetchedMarker.id ? { ...m, images: newImages } : m
      );
      setMarkers(updatedMarkers);
    }
  };

  const handleDeleteMarker = () => {
    Alert.alert(
      'Удалить маркер',
      'Вы уверены, что хотите удалить этот маркер?',
      [
        {
          text: 'Отмена',
          style: 'cancel',
        },
        {
          text: 'Удалить',
          onPress: () => {
            if (markers.length === 0) {
              Alert.alert('Ошибка', 'Нет маркеров для удаления.');
              return;
            }
            const updatedMarkers = markers.filter((m) => m.id !== fetchedMarker.id);
            setMarkers(updatedMarkers);
            router.back();
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleDeleteImage = (imageUri: string) => {
    setSelectedImage(imageUri);
    Alert.alert(
      'Удалить фото',
      'Вы уверены, что хотите удалить это фото?',
      [
        {
          text: 'Отмена',
          style: 'cancel',
          onPress: () => setSelectedImage(null),
        },
        {
          text: 'Удалить',
          onPress: () => {
            if (markers.length === 0) {
              Alert.alert('Ошибка', 'Нет фото для удаления.');
              return;
            }
            const newImages = images.filter((image) => image !== imageUri);
            setImages(newImages);
            setSelectedImage(null);

            const updatedMarkers = markers.map((m) =>
              m.id === fetchedMarker.id ? { ...m, images: newImages } : m
            );
            setMarkers(updatedMarkers);
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.p}>
        Координаты:{"\n"}
        {fetchedMarker.coordinate.latitude}, {fetchedMarker.coordinate.longitude}
      </Text>
      <Text style={styles.p}>
        {images.length === 0 ? 'Пока нет фото' : 'Фотографии на этом маркере'}
      </Text>
      <ScrollView>
        {images.map((image, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.imageWrapper,
              selectedImage === image && styles.selectedImageWrapper,
            ]}
            onPress={() => setSelectedImage(image)}
          >
            <Image source={{ uri: image }} style={styles.image} />
            <Button
              title="Удалить"
              onPress={() => handleDeleteImage(image)}
              color="red"
              style={styles.deleteButton}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Button title="Добавить изображение" onPress={pickImage} />
      <Button title="Удалить маркер" onPress={handleDeleteMarker} color="red" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  p: {
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 10,
  },
  imageWrapper: {
    marginBottom: 20,
    borderWidth: 3,
    borderColor: 'transparent',
    borderRadius: 8,
    padding: 5,
  },
  selectedImageWrapper: {
    borderColor: 'blue',
  },
  deleteButton: {
    marginTop: 10,
  },
});

export default MarkerDetailScreen;