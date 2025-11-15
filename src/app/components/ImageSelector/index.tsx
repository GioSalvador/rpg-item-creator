'use client';

import { useState, useEffect } from 'react';
import itemDB from '@/app/data/itemDB.json';

interface ImageSelectorProps {
  itemType: string;
  selectImage: string;
  setSelectImage: (value: string) => void;
}

export const ImageSelector = ({ itemType, selectImage, setSelectImage }: ImageSelectorProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredImages, setFilteredImages] = useState<string[]>([]);

  useEffect(() => {
    // Encontra o tipo selecionado
    const selectedType = itemDB.itemType.find((t) => t.name === itemType);

    // Se existir, define suas imagens
    if (selectedType) {
      setFilteredImages(selectedType.images);

      // Seta a primeira imagem como padrão (se não houver nenhuma selecionada ainda)
      if (!selectImage && selectedType.images.length > 0) {
        setSelectImage(selectedType.images[0]);
      }
    }
  }, [itemType, selectImage, setSelectImage]);

  return (
    <div className="flex flex-col gap-2">
      <button
        className="bg-black cursor-pointer h-6 text-[0.8rem]"
        type="button"
        onClick={() => setIsModalOpen(true)}
      >
        {selectImage ? 'Change Image' : 'Select an Image...'}
      </button>

      {selectImage && (
        <div className="flex items-center gap-2">
          <img src={selectImage} alt="Selected" className="w-12 h-12 object-contain border" />
          <span className="text-sm text-gray-300">{selectImage.split('/').pop()}</span>
        </div>
      )}

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

            <div className="grid grid-cols-3 gap-3">
              {filteredImages.map((imgPath) => (
                <img
                  key={imgPath}
                  src={imgPath}
                  alt={imgPath}
                  onClick={() => {
                    setSelectImage(imgPath);
                    setIsModalOpen(false);
                  }}
                  className="w-20 h-20 object-contain cursor-pointer border border-white hover:border-red-600 transition"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
