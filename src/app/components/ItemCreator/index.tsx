'use client';

import './style.css';
import itemDB from '../../data/itemDB.json';
import { ItemCreatorProps } from '@/app/types/item';
import { PT_Serif, Cinzel_Decorative } from 'next/font/google';
import { useState, useEffect } from 'react';

const cinzeldecorativeFontBold = Cinzel_Decorative({
  subsets: ['latin'],
  weight: '700',
});
const ptserifFontRegular = PT_Serif({
  subsets: ['latin'],
  weight: '400',
});
const ptserifFontRegularItalic = PT_Serif({
  subsets: ['latin'],
  weight: '400',
  style: 'italic',
});

export const ItemCreator = ({
  itemRarity,
  setItemRarity,
  itemName,
  setItemName,
  itemType,
  setItemType,
  itemPower,
  setItemPower,
  selectedImage,
  setSelectedImage,
  affixes,
  setAffixes,
  suffix,
  setSuffix,
  itemQuote,
  setItemQuote,
  itemAuthor,
  setItemAuthor,
  itemValue,
  setItemValue,
}: ItemCreatorProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const rarityRanges: Record<string, { min: number; max: number }> = {
    Common: { min: 1, max: 99 },
    Magic: { min: 100, max: 199 },
    Mysthic: { min: 200, max: 299 },
    Rare: { min: 300, max: 499 },
    Unique: { min: 500, max: 999 },
  };
  const getRarityFromPower = (power: number) => {
    for (const [rarityName, range] of Object.entries(rarityRanges)) {
      if (power >= range.min && power <= range.max) return rarityName;
    }
    return 'Common';
  };

  useEffect(() => {
    const range = rarityRanges[itemRarity];
    if (!range) return;
    if (itemPower < range.min || itemPower > range.max) {
      setItemPower(range.min);
    }
  }, [itemRarity]);

  const rarityConfig = itemDB.rarities.find((r) => r.name === itemRarity);
  const maxAffixesAllowed = rarityConfig?.maxAffixes ?? 2;
  const [minAffix, maxAffix] = rarityConfig?.affixValueRange ?? [1, 50];
  const affixOptions = itemDB.affixes.filter((a: any) => a.allowedTypes.includes(itemType));

  const handleAffixNameChange = (index: number, newName: string) => {
    setAffixes((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], name: newName };
      return copy;
    });
  };

  const handleAffixValueChange = (index: number, newValue: number) => {
    setAffixes((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], value: newValue };
      return copy;
    });
  };

  const usingUnique = !!rarityConfig?.uniqueSuffixAllowed;
  const suffixAllowed = !!rarityConfig?.suffixesAllowed || usingUnique;
  const suffixValueRange = rarityConfig?.suffixValueRange ?? [0, 0];

  const baseSuffixes = usingUnique ? itemDB.uniqueSuffixes : itemDB.suffixes;
  const availableSuffixes = (baseSuffixes ?? []).filter((s: any) =>
    s.allowedTypes?.includes(itemType)
  );
  useEffect(() => {
    if (!suffixAllowed) {
      setSuffix(null);
      return;
    }

    const first = availableSuffixes[0];

    const invalidCurrent =
      !suffix || !suffix.name || !availableSuffixes.some((s: any) => s.name === suffix.name);

    if (invalidCurrent) {
      if (first) {
        setSuffix({
          name: first.name,
          value: minSuffix,
          description: first.description ?? '',
        });
      }
      return;
    }

    if (suffix.value < minSuffix) {
      const found = availableSuffixes.find((s: any) => s.name === suffix.name);
      setSuffix({
        name: suffix.name,
        value: minSuffix,
        description: found?.description ?? '',
      });
    }
  }, [itemRarity, itemType]);

  const handleSuffixSelect = (name: string) => {
    if (!name) {
      setSuffix(null);
      return;
    }

    const source = usingUnique ? itemDB.uniqueSuffixes : itemDB.suffixes;
    const found = source.find((s: any) => s.name === name);

    if (!found) {
      setSuffix(null);
      return;
    }

    setSuffix({
      name: found.name,
      value: suffix?.value ?? suffixValueRange[0],
      description: found.description ?? '',
    });
  };

  const handleSuffixValueChange = (val: number) => {
    setSuffix((prev) => (prev ? { ...prev, value: val } : null));
  };

  const [minSuffix, maxSuffix] = rarityConfig?.suffixValueRange ?? [1, 50];

  const typeData = itemDB.itemType.find(
    (t) => t.name.toLowerCase() === (itemType || '').toLowerCase()
  );
  const images = typeData?.images ?? [];

  useEffect(() => {
    if (images.length === 0) {
      setSelectedImage(undefined);
      return;
    }
    setSelectedImage((prev) => {
      if (prev && images.includes(prev)) return prev;
      return images[0];
    });
  }, [itemType]);

  function formatValue(n: number | string) {
    let str = String(n).replace(/\D/g, '');
    str = str.slice(0, 8);

    if (str.length > 6) {
      return `${str.slice(0, 3)},${str.slice(3, 6)},${str.slice(6)}`;
    }
    if (str.length > 3) {
      return `${str.slice(0, 3)},${str.slice(3)}`;
    }
    return str;
  }

  return (
    <div className={`creator-container ${ptserifFontRegular.className} mb-8 xl:mb-1 xl:mt-5`}>
      <div
        className="
        creator-box 
        w-80 
        xl:w-130 
        3xl:w-165 
        h-255 
        xl:h-215 
        3xl:h-300"
      >
        <div className="creator-background w-75 h-250 xl:w-125 xl:h-210 3xl:w-160 3xl:h-295">
          <div className="flex justify-center items-center mt-2 mb-5 xl:mb-1 3xl:mb-4 3xl:mt-4">
            <h1
              className={`${cinzeldecorativeFontBold.className} text-[1.8rem] 3xl:text-[2.2rem] text-red-800`}
            >
              Item Creator
            </h1>
          </div>
          <div className="">
            <form className="flex flex-col gap-2 xl:text-[0.8rem] 3xl:text-[1.2rem] " action="">
              <label>Item Rarity</label>
              <select
                className="bg-black cursor-pointer"
                value={itemRarity}
                onChange={(e) => setItemRarity(e.target.value)}
              >
                {itemDB.rarities.map((r) => (
                  <option key={r.name} value={r.name}>
                    {r.name}
                  </option>
                ))}
              </select>

              <label>Item Name</label>
              <input
                className="bg-black"
                type="text"
                placeholder="Fields of Crimson"
                value={itemName}
                onChange={(e) => {
                  setItemName(e.target.value);
                }}
              />

              <label>Item Type</label>
              <select
                className="bg-black cursor-pointer"
                value={itemType}
                onChange={(e) => setItemType(e.target.value)}
              >
                {itemDB.itemType.map((t) => (
                  <option key={t.name} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>

              <label>Item Image</label>
              <div className="flex flex-col gap-2">
                <button
                  className="  bg-black cursor-pointer h-6 text-[0.8rem]"
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  disabled={images.length === 0}
                >
                  {selectedImage
                    ? 'Change Image'
                    : images.length > 0
                    ? 'Select an Image...'
                    : 'No images for this type'}
                </button>
              </div>

              {isModalOpen && (
                <div className="fixed w-73 xl:w-125 top-76 xl:top-70 z-50">
                  <div className="bg-black shadow-lg w-[90%] max-w-md relative">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="absolute top-2 right-3 text-white hover:text-red text-lg cursor-pointer"
                    >
                      ✕
                    </button>

                    <h2 className="text-lg font-semibold text-center mb-4">Select an Image</h2>

                    {images.length === 0 ? (
                      <p className="text-center text-gray-300">
                        No images available for selected Item Type.
                      </p>
                    ) : (
                      <div className="grid grid-cols-3 gap-3">
                        {images.map((imgPath) => (
                          <img
                            key={imgPath}
                            src={imgPath}
                            alt={imgPath}
                            onClick={() => {
                              setSelectedImage(imgPath);
                              setIsModalOpen(false);
                            }}
                            className="w-20 h-20 object-contain cursor-pointer border border-white hover:border-red-600 transition"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <label>
                Item Power
                <span
                  className={`${ptserifFontRegularItalic.className} ml-2 text-[0.7rem] text-gray-400`}
                >
                  ({rarityRanges[itemRarity]?.min ?? 1}-{rarityRanges[itemRarity]?.max ?? 99})
                </span>
              </label>
              <input
                className="bg-black"
                type="number"
                min={1}
                max={999}
                value={itemPower === 0 ? '' : itemPower}
                onChange={(e) => {
                  const raw = e.target.value;
                  if (raw === '') {
                    setItemPower(0);
                    return;
                  }
                  let value = Number(raw);
                  if (Number.isNaN(value)) return;
                  if (value < 1) value = 1;
                  if (value > 999) value = 999;
                  setItemPower(value);
                  const newRarity = getRarityFromPower(value);
                  if (newRarity !== itemRarity) {
                    setItemRarity(newRarity);
                  }
                }}
                onBlur={(e) => {
                  const raw = e.target.value;
                  if (raw === '') {
                    setItemPower(1);
                    const newRarity = getRarityFromPower(1);
                    setItemRarity(newRarity);
                  } else {
                    let value = Number(raw);
                    if (value < 1) value = 1;
                    if (value > 999) value = 999;
                    setItemPower(value);
                    const newRarity = getRarityFromPower(value);
                    setItemRarity(newRarity);
                  }
                }}
                onKeyDown={(e) => {
                  if (['e', 'E', '+', '-'].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
              <>
                {Array.from({ length: 6 }).map((_, i) => {
                  const disabled = i + 1 > maxAffixesAllowed;
                  const slot = affixes[i] ?? { name: '', value: 0 };

                  return (
                    <div key={i} className={disabled ? 'opacity-30 pointer-events-none' : ''}>
                      <div>
                        <label>
                          Affix {i + 1}
                          <span
                            className={`${ptserifFontRegularItalic.className} ml-2 text-[0.7rem] text-gray-400`}
                          >
                            (1-50)
                          </span>
                        </label>
                      </div>
                      <div className="flex">
                        <input
                          type="number"
                          min={minAffix}
                          max={maxAffix}
                          placeholder={`${minAffix}-${maxAffix}`}
                          className="w-10 xl:w-12"
                          value={slot.value || ''}
                          onChange={(e) => {
                            let value = Number(e.target.value);

                            if (Number.isNaN(value)) value = minAffix;
                            if (value < minAffix) value = minAffix;
                            if (value > maxAffix) value = maxAffix;

                            handleAffixValueChange(i, value);
                          }}
                          onKeyDown={(e) => {
                            if (['e', 'E', '+', '-', '.'].includes(e.key)) {
                              e.preventDefault();
                            }
                          }}
                          disabled={disabled}
                        />
                        <select
                          className="bg-black w-55 xl:w-full"
                          value={slot.name}
                          onChange={(e) => handleAffixNameChange(i, e.target.value)}
                          disabled={disabled}
                        >
                          <option value="">None</option>

                          {affixOptions
                            .filter((a: any) => {
                              const alreadyUsed = affixes.some(
                                (af, idx) => idx !== i && af.name === a.name
                              );
                              return !alreadyUsed || slot.name === a.name;
                            })
                            .map((a: any) => (
                              <option key={a.id} value={a.name}>
                                {a.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  );
                })}
              </>
              <div className={suffixAllowed ? '' : 'opacity-30 pointer-events-none'}>
                <div>
                  <label>
                    Suffix
                    <span
                      className={`${ptserifFontRegularItalic.className} ml-2 text-[0.7rem] text-gray-400`}
                    >
                      ({minSuffix}-{maxSuffix})
                    </span>
                  </label>{' '}
                </div>
                <div className="flex">
                  <input
                    type="number"
                    min={suffixValueRange[0]}
                    max={suffixValueRange[1]}
                    placeholder={`${suffixValueRange[0]}-${suffixValueRange[1]}`}
                    className="w-10 xl:w-12"
                    value={suffix?.value ?? ''}
                    onChange={(e) => handleSuffixValueChange(Number(e.target.value || 0))}
                    disabled={!suffixAllowed}
                  />
                  <select
                    className="bg-black w-55 xl:w-full"
                    value={suffix?.name ?? ''}
                    onChange={(e) => handleSuffixSelect(e.target.value)}
                    disabled={!suffixAllowed}
                  >
                    <option value="">None</option>
                    {availableSuffixes.map((s: any) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <label>Impactful Quote</label>
              <textarea
                className="overflow-auto scrollbar-hide resize-none"
                placeholder={`"We've been fighting these flesh-eaters for so long, been soaked in so much blood, that after a while it's difficult to tell what side you're truly on."`}
                value={itemQuote}
                maxLength={190}
                onChange={(e) => {
                  setItemQuote(e.target.value);
                }}
              />

              <label>Author</label>
              <input
                type="text"
                placeholder="Daelyr, Crane Tribe warrior"
                value={itemAuthor}
                maxLength={36}
                onChange={(e) => {
                  setItemAuthor(e.target.value);
                }}
              />

              <label>
                Value
                <span
                  className={`${ptserifFontRegularItalic.className} ml-2 text-[0.7rem] text-gray-400`}
                >
                  (1-999,999,99)
                </span>
              </label>

              <input
                type="text"
                placeholder="1"
                value={formatValue(itemValue)}
                onChange={(e) => {
                  const onlyDigits = e.target.value.replace(/\D/g, '').slice(0, 8);
                  const numeric = Number(onlyDigits);
                  setItemValue(numeric);
                }}
                onKeyDown={(e) => {
                  if (['e', 'E', '+', '-', '.'].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
