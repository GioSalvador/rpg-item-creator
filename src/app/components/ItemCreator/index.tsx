'use client';

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

  const getRarityFromPower = (power: number) => {
    for (const rarity of itemDB.rarities) {
      const [min, max] = rarity.itemPowerRange;
      if (power >= min && power <= max) {
        return rarity.name;
      }
    }
    return itemDB.rarities[0].name;
  };

  useEffect(() => {
    const rarity = itemDB.rarities.find((r) => r.name === itemRarity);
    if (!rarity) return;

    const [min, max] = rarity.itemPowerRange;

    if (itemPower < min || itemPower > max) {
      setItemPower(min);
    }
  }, [itemRarity]);

  const rarityConfig = itemDB.rarities.find((r) => r.name === itemRarity);
  const maxAffixesAllowed = rarityConfig?.maxAffixes ?? 2;
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
    <div className={`${ptserifFontRegular.className} mb-8 xl:mb-1 xl:mt-5`}>
      <div
        className="
        relative
        flex
        items-center
        justify-center
        w-80 
        xl:w-130 
        3xl:w-165 
        h-255 
        xl:h-215 
        3xl:h-300"
        style={{
          borderImageSource: 'url(/images/creator-border.png)',
          borderImageSlice: '50 fill',
          borderImageWidth: '40px',
          borderImageRepeat: 'repeat',
        }}
      >
        <div
          className="
            creator-background 
            w-75 
            h-250 
            xl:w-125 
            xl:h-210 
            3xl:w-160 
            3xl:h-295
            text-white 
            border-solid 
            px-[18px] 
            py-0"
          style={{
            borderImageSource: 'url(/images/creator-background.png)',
            borderImageSlice: '1 fill',
            borderImageRepeat: 'stretch',
          }}
        >
          <div className="flex justify-center items-center mt-2 mb-5 xl:mb-1 3xl:mb-4 3xl:mt-4">
            <h1
              className={`${cinzeldecorativeFontBold.className} text-[1.8rem] 3xl:text-[2.2rem] text-red-800`}
            >
              Item Creator
            </h1>
          </div>
          <div className="">
            <form className="flex flex-col gap-2 xl:text-[0.8rem] 3xl:text-[1.2rem] " action="">
              <label>Rarity</label>
              <select
                className="bg-black cursor-pointer"
                value={itemRarity}
                onChange={(e) => {
                  const newRarity = e.target.value;
                  setItemRarity(newRarity);

                  const rarityConfig = itemDB.rarities.find((r) => r.name === newRarity);
                  if (!rarityConfig) return;

                  setAffixes((prev) => {
                    const max = rarityConfig.maxAffixes ?? 0;
                    return prev.slice(0, max).map((a) => ({ ...a }));
                  });

                  if (!rarityConfig.suffixesAllowed) {
                    setSuffix(null);
                  } else {
                    setSuffix((prev) => {
                      if (!prev) return null;
                      const baseSuffixes = rarityConfig.uniqueSuffixAllowed
                        ? itemDB.uniqueSuffixes
                        : itemDB.suffixes;
                      const valid = baseSuffixes.find((s: any) => s.name === prev.name);
                      return valid
                        ? prev
                        : { name: '', value: valid?.valueRange ? valid.valueRange[0] : 0 };
                    });
                  }
                }}
              >
                {itemDB.rarities.map((r) => (
                  <option key={r.name} value={r.name} style={{ color: r.color }}>
                    {r.name}
                  </option>
                ))}
              </select>

              <label>Name</label>
              <input
                className="bg-black"
                type="text"
                maxLength={16}
                placeholder="Fields of Crimson"
                value={itemName}
                onChange={(e) => {
                  setItemName(e.target.value);
                }}
              />

              <label>Type</label>
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

              <label>Image</label>
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
                Power
                <span
                  className={`${ptserifFontRegularItalic.className} ml-2 text-[0.7rem] text-gray-400`}
                >
                  ({rarityConfig?.itemPowerRange[0]}-{rarityConfig?.itemPowerRange[1]}){' '}
                </span>
              </label>
              <input
                className="bg-black"
                type="number"
                min={1}
                max={999}
                value={itemPower === 0 ? '' : itemPower}
                onChange={(e) => {
                  let raw = e.target.value;

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
                  let value = Number(raw);

                  if (raw === '' || Number.isNaN(value)) {
                    value = 1;
                  }

                  if (value < 1) value = 1;
                  if (value > 999) value = 999;

                  setItemPower(value);

                  const newRarity = getRarityFromPower(value);
                  setItemRarity(newRarity);
                }}
                onKeyDown={(e) => {
                  if (['e', 'E', '+', '-'].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
              {/* {AFFIX} */}
              <>
                {Array.from({ length: 6 }).map((_, i) => {
                  const disabled = i + 1 > maxAffixesAllowed;
                  const slot = affixes[i] ?? { name: '', value: 0 };
                  const selectedAffix: Affix | undefined = itemDB.affixes.find(
                    (a: Affix) => a.name === slot.name
                  );
                  const [minAffix, maxAffix] = selectedAffix?.valueRange ?? [1, 50];

                  return (
                    <div key={i} className={disabled ? 'opacity-30 pointer-events-none' : ''}>
                      <div>
                        <label>
                          Affix {i + 1}
                          <span
                            className={`${ptserifFontRegularItalic.className} ml-2 text-[0.7rem] text-gray-400`}
                          >
                            ({minAffix}-{maxAffix})
                          </span>
                        </label>
                      </div>
                      <div className="flex">
                        <input
                          type="number"
                          min={minAffix}
                          max={maxAffix}
                          placeholder={'0%'}
                          className="w-10 xl:w-12"
                          value={slot.value === 0 ? '' : slot.value}
                          onChange={(e) => {
                            const raw = e.target.value.replace(/\D/g, '').slice(0, 3); // limita tamanho razoável
                            if (raw === '') {
                              handleAffixValueChange(i, 0);
                              return;
                            }
                            let value = Number(raw);
                            if (Number.isNaN(value)) {
                              handleAffixValueChange(i, 0);
                              return;
                            }
                            if (value > maxAffix) value = maxAffix;
                            handleAffixValueChange(i, value);
                          }}
                          onFocus={(e) => {
                            if (slot.value === minAffix) {
                              e.currentTarget.value = '';
                              handleAffixValueChange(i, 0);
                            }
                          }}
                          onBlur={(e) => {
                            const raw = e.target.value.replace(/\D/g, '');
                            let val = Number(raw);
                            if (Number.isNaN(val) || val < minAffix) val = minAffix;
                            if (val > maxAffix) val = maxAffix;
                            handleAffixValueChange(i, val);
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
                          onChange={(e) => {
                            const newName = e.target.value;
                            const newAffix = itemDB.affixes.find((a) => a.name === newName);
                            const [newMin, newMax] = newAffix?.valueRange ?? [1, 50];
                            handleAffixNameChange(i, newName);
                            handleAffixValueChange(i, newMin);
                          }}
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
              {/* {SUFFIX} */}
              <>
                {(() => {
                  const baseSuffixes = rarityConfig?.uniqueSuffixAllowed
                    ? itemDB.uniqueSuffixes
                    : itemDB.suffixes;

                  const slot = suffix ?? { name: '', value: 0 };
                  const selectedSuffix = baseSuffixes.find((s) => s.name === slot.name);
                  const [minSuffix, maxSuffix] = selectedSuffix?.valueRange ?? [1, 50];
                  const disabled = !rarityConfig?.suffixesAllowed;

                  return (
                    <div className={disabled ? 'opacity-30 pointer-events-none' : ''}>
                      <div>
                        <label>
                          Suffix
                          <span
                            className={`${ptserifFontRegularItalic.className} ml-2 text-[0.7rem] text-gray-400`}
                          >
                            ({minSuffix}-{maxSuffix})
                          </span>
                        </label>
                      </div>
                      <div className="flex">
                        <input
                          type="number"
                          className="w-10 xl:w-12"
                          min={minSuffix}
                          max={maxSuffix}
                          placeholder={'0%'}
                          value={slot.value === 0 ? '' : slot.value}
                          onChange={(e) => {
                            // Permitir digitação natural: só limpar não-dígitos e limitar tamanho
                            const raw = e.target.value.replace(/\D/g, '').slice(0, 3);
                            if (raw === '') {
                              setSuffix((prev) => (prev ? { ...prev, value: 0 } : null));
                              return;
                            }
                            setSuffix((prev) => (prev ? { ...prev, value: Number(raw) } : null));
                          }}
                          onFocus={(e) => {
                            // limpa visualmente se está no valor mínimo
                            if (slot.value === minSuffix) {
                              e.currentTarget.value = '';
                              setSuffix((prev) => (prev ? { ...prev, value: 0 } : null));
                            }
                          }}
                          onBlur={(e) => {
                            // aqui sim validamos o valor real
                            let value = Number(e.target.value);
                            if (Number.isNaN(value) || value < minSuffix) value = minSuffix;
                            if (value > maxSuffix) value = maxSuffix;
                            setSuffix((prev) => (prev ? { ...prev, value } : null));
                          }}
                          onKeyDown={(e) => {
                            if (['e', 'E', '+', '-', '.'].includes(e.key)) e.preventDefault();
                          }}
                          disabled={disabled}
                        />
                        <select
                          className="bg-black w-55 xl:w-full"
                          value={slot.name}
                          onChange={(e) => {
                            const selected = baseSuffixes.find((s) => s.name === e.target.value);
                            if (!selected) return;
                            setSuffix({ name: selected.name, value: selected.valueRange[0] });
                          }}
                          disabled={disabled}
                        >
                          <option value="">None</option>
                          {baseSuffixes
                            .filter((s) => s.allowedTypes.includes(itemType))
                            .map((s) => (
                              <option key={s.name} value={s.name}>
                                {s.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  );
                })()}
              </>

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
                placeholder="Gio, The Savior"
                value={itemAuthor}
                maxLength={35}
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
