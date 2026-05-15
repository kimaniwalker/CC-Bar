"use client"
import Image from "next/image";
import React from "react";
import { ProductHeartButton } from "../Favorites/ProductHeartButton";

export const ImagePicker = ({ images, alt, id }: { images: string[], alt: string,id: string }) => {
    const [selected, setSelected] = React.useState(images[0]);

    return (
        <div className="flex flex-col gap-3">
            {/* main image */}
            <div className="w-full aspect-square relative rounded-xl overflow-hidden">
                <Image loading="eager" src={selected} alt={alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw"  />
                <ProductHeartButton product_id={id}/>
            </div>

            {/* thumbnails — only show if more than 1 image */}
            {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                    {images.map((img, index) => (
                        <button
                            key={index}
                            onClick={() => setSelected(img)}
                            className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                                selected === img
                                    ? "border-black opacity-100"
                                    : "border-transparent opacity-50 hover:opacity-80"
                            }`}
                        >
                            <Image loading="eager" src={img} alt={`${alt} ${index + 1}`} fill className="object-cover" sizes="80px" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}