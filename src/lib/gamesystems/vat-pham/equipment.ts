/**
 * Equipment System for Tu Tiên Game
 * Vũ khí, đồng phục, tác phẩm, nhẫn và các loại trang bị
 */

export interface EquipmentSlot {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'accessory' | 'artifact';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  levelReq: number;
  durability: number; // current/max
  maxDurability: number;
  stats: {
    ngocTinh?: number;
    phucDuyen?: number;
    thanThu?: number;
    canCo?: number;
    arrayLevel?: number;
  };
  setBonus?: string;
  description: string;
}

export interface EquipmentSet {
  name: string;
  pieces: string[]; // Equipment slot IDs
  bonus: {
    type: 'stat' | 'resistance' | 'regeneration';
    value: number;
    stat?: 'ngocTinh' | 'phucDuyen' | 'thanThu' | 'canCo';
  };
}

export class EquipmentManager {
  private slots: Map<string, EquipmentSlot>;
  private sets: Map<string, EquipmentSet>;
  private player: any;

  constructor(player: any) {
    this.player = player;
    this.slots = new Map();
    this.sets = new Map();
    this.initDefaultEquipment();
    this.initSets();
  }

  private initDefaultEquipment(): void {
    // Starting equipment for new players
    this.slots.set('weapon', {
      id: 'weapon-starter',
      name: 'Kiếm Nguyên Đức',
      type: 'weapon',
      rarity: 'common',
      levelReq: 1,
      durability: 100,
      maxDurability: 100,
      stats: {
        ngocTinh: 2,
        canCo: 1,
      },
      description: 'Kiếm cơ bản cho hành trình tu luyện khởi đầu'
    });

    this.slots.set('armor', {
      id: 'armor-starter',
      name: 'Đầm Trạng Nguyên',
      type: 'armor',
      rarity: 'common',
      levelReq: 1,
      durability: 100,
      maxDurability: 100,
      stats: {
        phucDuyen: 2,
      },
      description: 'Đầm cơ bản bảo vệ cơ thể trong phách đầu'
    });

    this.slots.set('accessory-1', {
      id: 'accessory-1',
      name: 'Viên Ngọc Tiên',
      type: 'accessory',
      rarity: 'common',
      levelReq: 1,
      durability: 100,
      maxDurability: 100,
      stats: {
        ngocTinh: 1,
      },
      description: 'Viên ngọc tinh yêu one luck tu luyện'
    });

    this.slots.set('accessory-2', {
      id: 'accessory-2',
      name: 'Vòng Bảo Mật',
      type: 'accessory',
      rarity: 'common',
      levelReq: 1,
      durability: 100,
      maxDurability: 100,
      stats: {
        thanThu: 1,
      },
      description: 'Vòng bảo vệ chống lại sát khí'
    });
  }

  private initSets(): void {
    // Equipment sets with bonuses
    this.sets.set 'tu-than-set', {
      name: 'Set Tu Thân',
      pieces: ['weapon', 'armor'],
      bonus: {
        type: 'stat',
        value: 10,
        stat: 'thanThu',
      },
    };

    this.sets.set 'linh-dan-set', {
      name: 'Set Linh Đan',
      pieces: ['accessory-1', 'accessory-2'],
      bonus: {
        type: 'stat',
        value: 5,
        stat: 'ngocTinh',
      },
    };
  }

  /** Equip an item to a slot */
  equipItem(slotId: string, itemData: Partial<EquipmentSlot>): EquipmentSlot | null {
    const slot = this.slots.get(slotId);
    if (!slot) {
      console.log('Không tìm thấy slot:', slotId);
      return null;
    }

    // Merge existing slot data with new item data
    const newSlot: EquipmentSlot = {
      ...slot,
      ...itemData,
      durability: itemData.durability ?? slot.maxDurability,
    };

    this.slots.set(slotId, newSlot);

    // Check for set bonuses
    this.checkSetBonuses();

    console.log('Đã trang bị:', newSlot.name, ' vào slot', slotId);
    return newSlot;
  }

  /** Unequip item from slot */
  unequipItem(slotId: string): EquipmentSlot | null {
    const slot = this.slots.get(slotId);
    if (!slot) {
      console.log('Không tìm thấy slot đểUnequip:', slotId);
      return null;
    }

    // Return item to inventory or mark as unequipped
    const unequipped = this.slots.delete(slotId);
    
    // Remove set bonus effects
    this.removeSetBonuses();

    console.log('Đã tháo bỏ:', slot.name);
    return slot;
  }

  /** Check and apply set bonuses */
  private checkSetBonuses(): void {
    this.sets.forEach((set, setName) => {
      const equippedPieces = set.pieces.filter((pieceId) => this.slots.has(pieceId));
      if (equippedPieces.length === set.pieces.length) {
        // Apply set bonus
        console.log('Áp dụng set bonus:', setName, set.bonus);
        // Would apply bonus to player stats
      }
    });
  }

  /** Remove set bonuses */
  private removeSetBonuses(): void {
    // Would remove previous set bonus effects
    console.log('Đã bỏ qua set bonuses');
  }

  /** Get all equipped items */
  getEquippedItems(): EquipmentSlot[] {
    return Array.from(this.slots.values());
  }

  /** Get a specific slot */
  getSlot(slotId: string): EquipmentSlot | undefined {
    return this.slots.get(slotId);
  }

  /** Repair an item */
  repairItem(slotId: string, amount?: number): boolean {
    const slot = this.slots.get(slotId);
    if (!slot) return false;

    const repairAmount = amount ?? slot.maxDurability;
    slot.durability = Math.min(slot.maxDurability, slot.durability + repairAmount);

    console.log('Đã sửa chữa', slot.name, '-耐久+' , repairAmount);
    return true;
  }
}

/** Export singleton for use in game */
export const equipmentManager = (player: any) => new EquipmentManager(player);