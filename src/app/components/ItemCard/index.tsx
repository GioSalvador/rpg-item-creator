'use client';
import itemDB from '../../data/itemDB.json';
import { ItemValues } from '@/app/types/item';
import { useRef, useEffect } from 'react';

import { PT_Serif, Cinzel_Decorative } from 'next/font/google';

const ptserifFontRegular = PT_Serif({
  subsets: ['latin'],
  weight: '400',
});

const ptserifFontRegularItalic = PT_Serif({
  subsets: ['latin'],
  weight: '400',
  style: 'italic',
});

const ptserifFontBold = PT_Serif({
  subsets: ['latin'],
  weight: '700',
});

const cinzeldecorativeFontRegular = Cinzel_Decorative({
  subsets: ['latin'],
  weight: '400',
});

const cinzeldecorativeFontBold = Cinzel_Decorative({
  subsets: ['latin'],
  weight: '700',
});

export default function ItemCard({
  itemRarity,
  itemName,
  itemType,
  itemPower,
  selectedImage,
  affixes,
  suffix,
  itemQuote,
  itemAuthor,
  itemValue,
}: ItemValues) {
  const cardRef = useRef<HTMLDivElement>(null);

  const currentX = useRef(0);
  const currentY = useRef(0);
  const targetX = useRef(0);
  const targetY = useRef(0);
  const currentLift = useRef(0);
  const targetLift = useRef(0);
  const isHovered = useRef(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    targetX.current = ((y - centerY) / centerY) * 10;
    targetY.current = ((x - centerX) / centerX) * 10;
  };

  const handleMouseEnter = () => {
    isHovered.current = true;
    targetLift.current = 40;
  };

  const handleMouseLeave = () => {
    isHovered.current = false;
    targetX.current = 0;
    targetY.current = 0;
    targetLift.current = 0;
  };

  useEffect(() => {
    const animate = () => {
      const card = cardRef.current;
      if (!card) return;

      currentX.current += (targetX.current - currentX.current) * 0.1;
      currentY.current += (targetY.current - currentY.current) * 0.1;
      currentLift.current += (targetLift.current - currentLift.current) * 0.07;

      const light = Math.max(0.8, 1 - currentX.current / 18);
      const scale = 1 + currentLift.current / 600;

      card.style.transform = `
      rotateX(${-currentX.current}deg)
      rotateY(${currentY.current}deg)
      translateZ(${currentLift.current}px)
      scale(${scale})
    `;
      card.style.filter = `brightness(${light})`;

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  const rarityData = itemDB.rarities.find(
    (r) => r.name.toLowerCase() === itemRarity?.toLowerCase()
  );
  const typeData = itemDB.itemType.find(
    (t) => t.name.toLocaleLowerCase() === itemType?.toLocaleLowerCase()
  );

  const borderImage = rarityData?.frame || '/images/frames/commom-frame.png';
  const textColor = rarityData?.color || '#ffffff';
  const displayImage = selectedImage || '/images/weapons/axes/axe1.png';

  const suffixTextColor =
    itemRarity === 'Mythic'
      ? '#cda1d8'
      : itemRarity === 'Rare'
      ? '#ffff99'
      : itemRarity === 'Unique'
      ? '#db8114'
      : '#ffffff';

  const suffixValueColor =
    itemRarity === 'Mythic'
      ? '#ffff99'
      : itemRarity === 'Rare'
      ? '#db8114'
      : itemRarity === 'Unique'
      ? '#ffff99'
      : '#ffff99';

  const suffixBullet =
    itemRarity === 'Mythic' ? '/images/mythic-bullet.png' : '/images/star-bullet.png';

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
    <div className="inline-block" style={{ perspective: '1200px' }}>
      <div
        ref={cardRef}
        className="flex items-center justify-center w-[280px] shadow-[0_4px_20px_rgba(0,0,0,1)] hover:shadow-[0_20px_20px_rgba(0,0,0,0.85)] transition-shadow duration-400 ease-linear will-change-transform will-change-filter"
        style={{ transformStyle: 'preserve-3d' }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="w-[280px] 3xl:w-90 h-min text-white border-solid p-4 px-[18px]"
          style={{
            borderImageSource: `url(${borderImage})`,
            borderImageSlice: '96 fill',
            borderImageWidth: '40px',
            borderImageRepeat: 'stretch',
          }}
        >
          <div className="flex w-full h-35 3xl:h-40">
            <div className=" w-[120px] ">
              <h2
                className={`${cinzeldecorativeFontBold.className} text-[#db8114] pt-1 pl-1 text-[20px] 3xl:text-[30px] w-30`}
                style={{ color: textColor, wordBreak: 'break-word', overflow: 'hidden' }}
              >
                {itemName || 'Fields of Crimson'}
              </h2>
              <p
                className={`${cinzeldecorativeFontRegular.className} text-[#db8114] pt-1 pl-1 text-[12px] 3xl:text-[14px]`}
                style={{ color: textColor }}
              >
                <span>{itemRarity}</span> {itemType || 'Axe'}
              </p>
              <div>
                <p
                  className={`${ptserifFontRegularItalic.className} pt-1 pl-1 mt-3 text-[12px] 3xl:text-[16px]`}
                >
                  <span>{itemPower || '0'}</span> Item Power
                </p>
              </div>
            </div>
            <div className="w-[124px] ">
              <img src={displayImage} alt="item" className="h-35 w-full object-contain 3xl:h-40" />{' '}
            </div>
          </div>
          <div className="flex w-full ">
            <div className="w-full">
              <div className="flex w-full h-6 justify-center items-center mt-2 mb-2 3xl:h-10 3xl:mb-0">
                <img src="/images/breakline.png" alt="breakline" />
              </div>
              <div className="w-[244px]">
                <ul
                  className={`${ptserifFontRegular.className} w-[244px] pt-1 pl-1 text-[12px] 3xl:text-[18px]`}
                >
                  {affixes.map((a, idx) => {
                    if (!a || !a.name) {
                      return null;
                    }
                    return (
                      <li key={idx} className="flex items-start mb-3 3xl:items-center">
                        <img src="/images/bullet.png" alt="bullet" className="mr-1" />
                        {a.value}% {a.name}
                      </li>
                    );
                  })}
                  {suffix ? (
                    <li className="flex items-start mb-3" style={{ color: suffixTextColor }}>
                      <img
                        src={suffixBullet}
                        alt="Suffix Bullet"
                        className="mr-1 mt-0.5 3xl:mt-2"
                      />
                      <div>
                        {(() => {
                          let dbSuffix = itemDB.suffixes.find((s) => s.name === suffix.name);
                          if (!dbSuffix) {
                            dbSuffix = itemDB.uniqueSuffixes.find((s) => s.name === suffix.name);
                          }

                          if (!dbSuffix || !dbSuffix.description) {
                            return (
                              <p>
                                {suffix.name} —{' '}
                                <span style={{ color: suffixValueColor }}>{suffix.value}%</span>
                              </p>
                            );
                          }

                          const desc = dbSuffix.description
                            .replace(
                              /\[VALUE\]%/g,
                              `<span style='color:${suffixValueColor};'>${suffix.value}%</span>`
                            )
                            .replace(
                              /\[VALUE\]/g,
                              `<span style='color:${suffixValueColor};'>${suffix.value}</span>`
                            );
                          return <p dangerouslySetInnerHTML={{ __html: desc }} />;
                        })()}
                      </div>
                    </li>
                  ) : null}
                </ul>
                <p
                  className={`${ptserifFontRegularItalic.className} w-[244px] pt-1 pl-1 text-[12px] 3xl:text-[18px]`}
                  style={{
                    wordBreak: 'break-word',
                    overflow: 'hidden',
                  }}
                >
                  {itemQuote
                    ? `"${itemQuote}"`
                    : `"We've been fighting these flesh-eaters for so long, been soaked in so much blood,
                    that after a while it's difficult to tell what side you're truly on."`}
                </p>

                <p
                  className={`${ptserifFontRegularItalic.className} pt-1 pl-1 text-[12px] 3xl:text-[18px]`}
                >
                  -{itemAuthor ? `${itemAuthor}` : `Gio, The Savior`} {}
                </p>
              </div>
              <div className="flex w-full h-6 justify-center items-center mt-2 mb-2">
                <img src="/images/breakline.png" alt="breakline" />
              </div>
              <div className=" flex justify-center items-center w-full mb-5">
                <img src="/images/goldcurrency.png" alt="Gold currency icon" />
                <p className={`${ptserifFontBold.className} text-[20px] 3xl:text-[25px]`}>
                  : {formatValue(itemValue)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
