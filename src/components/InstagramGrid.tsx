import React from "react";
import Reveal from "./Reveal";
import { SITE_CONFIG } from "../config/site.config";
import velaDegrade from "../assets/images/vela-degrade.jpg";
import velaEscarchada from "../assets/images/vela-escarchada.jpg";
import velaGrandeX6 from "../assets/images/vela-grande-x6.jpg";
import cajaVelas from "../assets/images/caja-velas.jpg";
import grado from "../assets/images/grado.jpg";
import babyShower from "../assets/images/baby-shower.jpg";

const IMAGES = [velaDegrade, velaEscarchada, velaGrandeX6, cajaVelas, grado, babyShower];

export default function InstagramGrid() {
  return (
    <section className="py-16 md:py-24 bg-ivory/60">
      <div className="max-w-8xl mx-auto px-5 md:px-8 text-center">
        <Reveal className="mb-10">
          <p className="uppercase tracking-[0.25em] text-xs text-gold font-medium mb-3">Síguenos</p>
          <h2 className="font-serif text-3xl md:text-4xl text-ink mb-4">{"@"}Luz de Detalles en Instagram</h2>
          <a
            href={SITE_CONFIG.INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-gold hover:underline"
          >
            Ver más en Instagram →
          </a>
        </Reveal>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
          {IMAGES.map((img, idx) => (
            <Reveal key={img} delay={idx * 50}>
              <a
                href={SITE_CONFIG.INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="block aspect-square overflow-hidden rounded-lg group"
              >
                <img
                  src={img}
                  alt="Foto de producto compartida en Instagram"
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
