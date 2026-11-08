/**
 * Advanced Alchemy System for Tu Tiên Game
 * Hỏa nhiệt, chất lượng đan, và các phức tạp hóa học
 */

export interface AlchemyRecipe {
  id: string;
  name: string;
  requiredItems: string[]; // Item IDs
  requiredLevel: number;
  baseSuccessRate: number; // 0-100
  baseQuality: number; // 1-5
  productionTime: number; // ticks
  resultItem: string;
  description: string;
}

export interface AlchemyResult {
  success: boolean;
  quality: number; // 1-5
  itemId: string;
  bonusStats?: {
    ngocTinh?: number;
    phucDuyen?: number;
    thanThu?: number;
  };
  sideEffects?: 'karma' | 'none';
}

export class AlchemyLab {
  private recipes: Map<string, AlchemyRecipe>;
  private activeSessions: Map<string, { startTime: number; recipe: AlchemyRecipe }>;
  private readonly labLevel: number;

  constructor(labLevel: number = 1) {
    this.labLevel = labLevel;
    this.recipes = new Map();
    this.activeSessions = new Map();
    this.initRecipes();
  }

  private initRecipes(): void {
    // Basic recipes unlocked at lab level 1
    this.recipes.set('huyet-dan', {
      id: 'huyet-dan',
      name: 'Huyết Đan',
      requiredItems: ['linh-thach-5', 'linh-thach-3'],
      requiredLevel: 1,
      baseSuccessRate: 80,
      baseQuality: 1,
      productionTime: 30, // 30 ticks = 30 seconds
      resultItem: 'huyet-dan',
      description: 'Đan huyết để phục hồi máu và tăng tu vi cơ bản'
    });

    // Advanced recipes unlock at higher levels
    if (this.labLevel >= 3) {
      this.recipes.set('kim-dan', {
        id: 'kim-dan',
        name: 'Kim Đan',
        requiredItems: ['linh-thach-10', 'linh-thach-5', 'thuoc-tu-thien-1'],
        requiredLevel: 3,
        baseSuccessRate: 65,
        baseQuality: 2,
        productionTime: 60,
        resultItem: 'kim-dan',
        description: 'Đan kim để tăng linh lực và khả năng tu vi'
      });
    }

    if (this.labLevel >= 5) {
      this.recipes.set('nguyen-anh', {
        id: 'nguyen-anh',
        name: 'Nguyên Anh',
        requiredItems: ['linh-thach-20', 'linh-thach-10', 'thuoc-tu-thien-2', 'huyet-dan'],
        requiredLevel: 5,
        baseSuccessRate: 45,
        baseQuality: 3,
        productionTime: 120,
        resultItem: 'nguyen-anh',
        description: 'Đan nguyên anh tiên đạo - cao cấp'
      });
    }
  }

  /** Start an alchemy crafting session */
  startCraft(player: any, recipeId: string): boolean {
    const recipe = this.recipes.get(recipeId);
    if (!recipe) {
      console.log('Công thức không tồn tại:', recipeId);
      return false;
    }

    // Check player requirements
    if (player.level < recipe.requiredLevel) {
      console.log(`Cấp tu vi không đủ: cần cấp ${recipe.requiredLevel}`);
      return false;
    }

    // Check required items in inventory
    const hasAllItems = recipe.requiredItems.every((itemId) => {
      const item = player.inventory.items.find((i: any) => i.id === itemId);
      return item && item.qty >= 1;
    });

    if (!hasAllItems) {
      console.log('Thiếu nguyên liệu cần thiết');
      return false;
    }

    // Start crafting session
    this.activeSessions.set(player.id, {
      startTime: Date.now(),
      recipe,
    });

    // Remove initial ingredients
    recipe.requiredItems.forEach((itemId) => {
      const idx = player.inventory.items.findIndex((i: any) => i.id === itemId);
      if (idx >= 0) {
        player.inventory.items[idx].qty -= 1;
        if (player.inventory.items[idx].qty <= 0) {
          player.inventory.items.splice(idx, 1);
        }
      }
    });

    console.log(`Bắt đầu đan: ${recipe.name} - ${recipe.productionTime} ticks`);
    return true;
  }

  /** Check if crafting is complete and return result */
  checkCompletion(player: any): AlchemyResult | null {
    const session = this.activeSessions.get(player.id);
    if (!session) return null;

    const elapsedTicks = Math.floor((Date.now() - session.startTime) / 1000); // ticks per second
    const recipe = session.recipe;

    if (elapsedTicks < recipe.productionTime) return null; // Not ready yet

    // Calculate success rate with modifications
    const levelBonus = Math.floor((player.level - recipe.requiredLevel) * 0.5);
    const ngocTinhBonus = player.ngocTinh * 0.5;
    const modifiedSuccessRate = Math.min(95, recipe.baseSuccessRate + levelBonus + ngocTinhBonus);

    // Roll for success
    const success = Math.random() * 100 < modifiedSuccessRate;

    // Calculate quality
    const qualityBonus = Math.floor(player.ngocTinh / 2);
    const quality = Math.min(5, recipe.baseQuality + qualityBonus);

    // Clear session
    this.activeSessions.delete(player.id);

    if (success) {
      return {
        success: true,
        quality,
        itemId: recipe.resultItem,
        bonusStats: {
          ngocTinh: ngocTinhBonus,
          phucDuyen: Math.floor(player.phucDuyen * 0.1),
          thanThu: Math.floor(player.thanThu * 0.1),
        },
        sideEffects: 'none',
      };
    } else {
      // Failed alchemy - karma penalty
      return {
        success: false,
        quality: 0,
        itemId: '',
        sideEffects: 'karma',
      };
    }
  }

  /** Get available recipes for player level */
  getAvailableRecipes(playerLevel: number): AlchemyRecipe[] {
    const available: AlchemyRecipe[] = [];
    this.recipes.forEach((recipe) => {
      if (playerLevel >= recipe.requiredLevel) {
        available.push(recipe);
      }
    });
    return available;
  }
}

/** Export singleton for use in game */
export const alchemyLab = new AlchemyLab();