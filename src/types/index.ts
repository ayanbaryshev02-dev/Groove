export interface Artist {
  id: string;
  name: string;
  bio: string;
  image: string; 
  genres: Genre[];
}

export interface Album {
  id: string; 
  title: string;
  artistId: string;
  artistName: string;
  description: string;
  price: number;
  originalPrice?: number; 
  releaseDate: string; 
  originalReleaseYear: number;
  vinylColor: VinylColor;
  genre: Genre;
  numberOfDiscs: string; 
  catalogueNumber: string; 
  vinylWeight: string; 
  tracklist: TracklistSide[];
  spotifyAlbumId: string; 
  coverImage: string; 
  isFeatured: boolean;
  isNewArrival: boolean;
  isOnSale: boolean;
  isPreOrder: boolean;
  tags: string[]; 
}

export interface TracklistSide {
  side: string; 
  tracks: Track[];
}

export interface Track {
  number: number;
  title: string;
  duration: string; 
}

export type VinylColor =
  | "black"
  | "white"
  | "red"
  | "blue"
  | "green"
  | "orange"
  | "yellow"
  | "purple"
  | "pink"
  | "transparent"
  | "gold"
  | "marble-black-white"
  | "marble-red"
  | "marble-blue"
  | "splatter-rainbow";

export type Genre =
  | "rock"
  | "hip-hop"
  | "jazz"
  | "indie"
  | "classic"
  | "soul"
  | "electronic"
  | "reggae"
  | "pop"
  | "soundtrack"
  | "city-pop"
  | "bossa-nova"
  | "funk"
  | "post-punk"
  | "metal";

export interface CartItem {
  album: Album;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  customer: CustomerInfo;
  createdAt: string;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
}

export interface FeaturedSection {
  albumOfTheMonth: string; 
  outThisWeek: string[]; 
  onSale: string[]; 
  newArrivals: string[]; 
}