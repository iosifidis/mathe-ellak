export interface Topic {
  id: string;
  title: string;
  description: string;
  url: string;
  subcategories?: Topic[];
}

export interface NavigationState {
  currentPath: number[]; // Indices of selected topics/subcategories
  topLevelIndex: number; // Index in the main array
}
