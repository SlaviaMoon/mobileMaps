export interface MarkerType {
  id: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  images: string[];
}
