export interface Client {
    id: number;
    name: string;
}
  
export interface Category {
    id: number;
    name: string;
}
  
export interface Note {
    id: number;
    clientId: number;
    categoryId: number;
    text: string;
}

  