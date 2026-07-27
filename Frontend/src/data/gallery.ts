export interface GalleryItem {
  id: string;
  thumbnail: string;
  fullSize: string;
  alt: string;
  title: string;
  description: string;
  detailedDescription: string;
  category: string;
  year: number;
  size?: "small" | "medium" | "large" | "wide" | "tall";
}
