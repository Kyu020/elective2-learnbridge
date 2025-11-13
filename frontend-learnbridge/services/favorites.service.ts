import { FavoriteItem, FavoritesResponse, RemoveFavoriteRequest } from '@/interfaces/favorites.interfaces';

class FavoritesService {
  private baseUrl = 'http://localhost:5000/api';

  private getToken(): string {
    if (typeof window === 'undefined') {
      throw new Error("Cannot access localStorage on server side");
    }

    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("No authentication token found");
    }

    return token;
  }

  private async fetchWithAuth<T>(url: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();

    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getFavorites(): Promise<FavoriteItem[]> {
    const data = await this.fetchWithAuth<FavoritesResponse>(`${this.baseUrl}/favorites/getfave`);
    return data.favorites || [];
  }

  async removeFavorite(request: RemoveFavoriteRequest): Promise<void> {
    await this.fetchWithAuth(`${this.baseUrl}/favorites/removefave`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }
}

export const favoritesService = new FavoritesService();