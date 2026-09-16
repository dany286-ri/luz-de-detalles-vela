import React from "react";
import Reveal from "./Reveal";
import velaDegrade from "../assets/images/vela-degrade.jpg";
import velaEscarchada from "../assets/images/vela-escarchada.jpg";
import velaGrandeX6 from "../assets/images/vela-grande-x6.jpg";
import cajaVelas from "../assets/images/caja-velas.jpg";
import cajaVelasDetalle from "../assets/images/caja-velas-detalle.jpg";
import grado from "../assets/images/grado.jpg";
import babyShower from "../assets/images/baby-shower.jpg";
import esferaNavidena from "../assets/images/esfera-navidena.jpg";

const PHOTOS = [
  { src: velaGrandeX6, alt: "Velas grandes personalizadas, foto real del producto", tall: true },
  { src: cajaVelas, alt: "Caja de velas lista para regalar, foto real del producto", tall: false },
  { src: grado, alt: "Vela de grado personalizada con foto y tarjeta, foto real del producto", tall: false },
  { src: velaEscarchada, alt: "Velas escarchadas personalizadas, foto real del producto", tall: true },
  { src: babyShower, alt: "Vela de baby shower personalizada, foto real del producto", tall: false },
  { src: cajaVelasDetalle, alt: "Detalle de la caja de velas, foto real del producto", tall: true },
  { src: velaDegrade, alt: "Velas degradé personalizadas, foto real del producto", tall: false },
  { src: esferaNavidena, alt: "Esfera navideña personalizada para mascota, foto real del producto", tall: false },
];

/** Galería editorial de trabajos reales, en formato tipo masonry. */
export default function Gallery() {
  return (
    <section id="galeria" className="py-16 md:py-24">
      <div className="max-w-8xl mx-auto px-5 md:px-8">
        <Reveal className="max-w-xl mb-10 md:mb-14">
          <p className="uppercase tracking-[0.25em] text-xs text-gold font-medium mb-3">Nuestro trabajo</p>
          <h2 className="font-serif text-3xl md:text-4xl text-ink">Hecho para momentos especiales</h2>
        </Reveal>

        <div className="columns-2 md:columns-4 gap-4 md:gap-5 [column-fill:balance]">
          {PHOTOS.map((photo, idx) => (
            <Reveal key={photo.src} delay={(idx % 4) * 70} className="mb-4 md:mb-5 break-inside-avoid">
              <div className={`overflow-hidden rounded-2xl ${photo.tall ? "aspect-[3/4]" : "aspect-square"}`}>
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
