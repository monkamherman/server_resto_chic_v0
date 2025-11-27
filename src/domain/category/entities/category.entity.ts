import { Dish } from "@domain/dish/entities/dish.entity";

export enum CategoryType {
  FOOD = 'FOOD',        // Plats principaux, entrées, desserts
  BEVERAGE = 'BEVERAGE', // Boissons
  WINE = 'WINE',        // Vins
  MENU = 'MENU',        // Menus spéciaux
  PROMOTION = 'PROMOTION' // Promotions
}

export interface CategoryImage {
  url: string;
  altText?: string;
  isPrimary: boolean;
  displayOrder: number;
}

export interface CategoryMetadata {
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string[];
  customFields?: Record<string, unknown>;
}

export class Category {
  id?: string;
  
  // Informations de base
  name!: string;
  slug?: string; // URL-friendly version du nom
  description?: string;
  
  // Type de catégorie
  type: CategoryType = CategoryType.FOOD;
  
  // Hiérarchie
  parentId?: string; // Pour les sous-catégories
  parent?: Category;
  children?: Category[];
  
  // Affichage
  displayOrder: number = 0;
  isFeatured: boolean = false;
  isActive: boolean = true;
  
  // Images
  imageUrl?: string; // Image principale (rétrocompatibilité)
  images?: CategoryImage[];
  
  // Métadonnées
  metadata?: CategoryMetadata;
  
  // Relations
  dishes?: Dish[];
  
  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;
  publishedAt?: Date;
  
  // Pour les promotions
  validFrom?: Date;
  validUntil?: Date;
  
  constructor(partial: Partial<Category> = {}) {
    Object.assign(this, {
      isActive: true,
      displayOrder: 0,
      isFeatured: false,
      type: CategoryType.FOOD,
      ...partial
    });
    
    // Générer un slug à partir du nom si non fourni
    if (this.name && !this.slug) {
      this.slug = this.generateSlug(this.name);
    }
    
    // Initialiser les images si nécessaire
    if (this.imageUrl && (!this.images || this.images.length === 0)) {
      this.images = [{
        url: this.imageUrl,
        isPrimary: true,
        displayOrder: 0
      }];
    }
  }
  
  /**
   * Génère un slug à partir du nom de la catégorie
   */
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Supprime les caractères spéciaux
      .replace(/\s+/g, '-')      // Remplace les espaces par des tirets
      .replace(/-+/g, '-')       // Supprime les tirets multiples
      .trim();
  }
  
  /**
   * Vérifie si la catégorie est actuellement valide
   */
  isValid(): boolean {
    if (!this.isActive) return false;
    
    const now = new Date();
    
    if (this.validFrom && new Date(this.validFrom) > now) {
      return false;
    }
    
    if (this.validUntil && new Date(this.validUntil) < now) {
      return false;
    }
    
    return true;
  }
  
  /**
   * Ajoute une image à la catégorie
   */
  addImage(url: string, altText: string = '', isPrimary: boolean = false): void {
    const newImage: CategoryImage = {
      url,
      altText,
      isPrimary,
      displayOrder: this.images?.length || 0
    };
    
    this.images = [...(this.images || []), newImage];
    
    // Mettre à jour l'image principale si nécessaire
    if (isPrimary) {
      this.images = this.images.map(img => ({
        ...img,
        isPrimary: img.url === url
      }));
    }
    
    // Mettre à jour l'image principale pour la rétrocompatibilité
    if (isPrimary) {
      this.imageUrl = url;
    }
  }
  
  /**
   * Marque une image comme principale
   */
  setPrimaryImage(imageUrl: string): boolean {
    if (!this.images?.some(img => img.url === imageUrl)) {
      return false;
    }
    
    this.images = this.images.map(img => ({
      ...img,
      isPrimary: img.url === imageUrl
    }));
    
    // Mettre à jour l'image principale pour la rétrocompatibilité
    this.imageUrl = imageUrl;
    
    return true;
  }
  
  /**
   * Supprime une image de la catégorie
   */
  removeImage(imageUrl: string): boolean {
    if (!this.images?.some(img => img.url === imageUrl)) {
      return false;
    }
    
    const wasPrimary = this.images.find(img => img.url === imageUrl)?.isPrimary;
    
    // Supprimer l'image
    this.images = this.images.filter(img => img.url !== imageUrl);
    
    // Si on a supprimé l'image principale, en définir une nouvelle
    if (wasPrimary && this.images.length > 0) {
      this.setPrimaryImage(this.images[0].url);
    } else if (this.images.length === 0) {
      this.imageUrl = undefined;
    }
    
    return true;
  }
  
  /**
   * Vérifie si la catégorie a des sous-catégories
   */
  hasChildren(): boolean {
    return !!this.children && this.children.length > 0;
  }
  
  /**
   * Vérifie si la catégorie a des plats associés
   */
  hasDishes(): boolean {
    return !!this.dishes && this.dishes.length > 0;
  }
  
  /**
   * Ajoute un plat à la catégorie
   */
  addDish(dish: Dish): void {
    if (!this.dishes) {
      this.dishes = [];
    }
    
    if (!this.dishes.some(d => d.id === dish.id)) {
      this.dishes.push(dish);
    }
  }
  
  /**
   * Supprime un plat de la catégorie
   */
  removeDish(dishId: string): boolean {
    if (!this.dishes) return false;
    
    const initialLength = this.dishes.length;
    this.dishes = this.dishes.filter(dish => dish.id !== dishId);
    
    return this.dishes.length !== initialLength;
  }
}
