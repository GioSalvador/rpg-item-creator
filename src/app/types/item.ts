export interface Affix {
  id: number;
  name: string;
  allowedTypes: string[];
  valueRange: [number, number];
}

export interface Suffix {
  name: string;
  allowedTypes: string[];
  valueRange: [number, number];
  description?: string;
}
export interface AffixValue {
  name: string;
  value: number;
}

export interface SuffixValue {
  name: string;
  value: number;
  description?: string;
}

export interface ItemValues {
  itemRarity: string;
  itemName: string;
  itemType: string;
  itemPower: number;
  selectedImage?: string;
  affixes: AffixValue[];
  suffix?: SuffixValue | null;
  itemQuote: string;
  itemAuthor: string;
  itemValue: number;
}

export interface ItemCreatorProps extends ItemValues {
  setItemRarity: React.Dispatch<React.SetStateAction<string>>;
  setItemName: React.Dispatch<React.SetStateAction<string>>;
  setItemType: React.Dispatch<React.SetStateAction<string>>;
  setItemPower: React.Dispatch<React.SetStateAction<number>>;
  setSelectedImage: React.Dispatch<React.SetStateAction<string | undefined>>;
  setAffixes: React.Dispatch<React.SetStateAction<AffixValue[]>>;
  setSuffix: React.Dispatch<React.SetStateAction<SuffixValue | null>>;
  setItemQuote: React.Dispatch<React.SetStateAction<string>>;
  setItemAuthor: React.Dispatch<React.SetStateAction<string>>;
  setItemValue: React.Dispatch<React.SetStateAction<number>>;
}
