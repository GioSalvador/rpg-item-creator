'use client';

import { ItemCreator } from './components/ItemCreator';
import ItemCard from './components/ItemCard';
import Footer from './components/Footer';
import { useState } from 'react';
import { AffixValue, SuffixValue } from './types/item';

export default function Home() {
  const [itemRarity, setItemRarity] = useState('Common');
  const [itemName, setItemName] = useState('');
  const [itemType, setItemType] = useState('Axe');
  const [itemPower, setItemPower] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [affixes, setAffixes] = useState<AffixValue[]>([
    { name: 'Damage to Bleeding Enemies', value: 1 },
    { name: 'Damage to Close Enemies', value: 1 },
    { name: '', value: 1 },
    { name: '', value: 1 },
    { name: '', value: 1 },
    { name: '', value: 1 },
  ]);
  const [suffix, setSuffix] = useState<SuffixValue | null>(null);
  const [itemQuote, setItemQuote] = useState('');
  const [itemAuthor, setItemAuthor] = useState('');
  const [itemValue, setItemValue] = useState(1);

  return (
    <>
      <main className="flex flex-col items-center justify-center md:flex-row md:gap-20 xl:justify-evenly 3xl:h-335">
        <ItemCreator
          itemRarity={itemRarity}
          setItemRarity={setItemRarity}
          itemName={itemName}
          setItemName={setItemName}
          itemType={itemType}
          setItemType={setItemType}
          itemPower={itemPower}
          setItemPower={setItemPower}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          affixes={affixes}
          setAffixes={setAffixes}
          suffix={suffix}
          setSuffix={setSuffix}
          itemQuote={itemQuote}
          setItemQuote={setItemQuote}
          itemAuthor={itemAuthor}
          setItemAuthor={setItemAuthor}
          itemValue={itemValue}
          setItemValue={setItemValue}
        />
        <ItemCard
          itemRarity={itemRarity}
          itemName={itemName}
          itemType={itemType}
          itemPower={itemPower}
          selectedImage={selectedImage}
          affixes={affixes}
          suffix={suffix}
          itemQuote={itemQuote}
          itemAuthor={itemAuthor}
          itemValue={itemValue}
        />
      </main>
      <Footer />
    </>
  );
}
