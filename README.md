# Luz de Detalles — Sitio web

Sitio de e-commerce (React + Vite + TypeScript + Tailwind) para el negocio de velas y detalles personalizados.

## Cómo editar los datos del negocio (¡lo único que necesitas tocar!)

Todo el contenido editable vive en **`src/config/site.config.ts`**:

- `WHATSAPP_NUMBER`: reemplaza `"WHATSAPP_NUMBER"` por tu número real en formato internacional sin "+" ni espacios (ej: `"573001234567"`).
- `INSTAGRAM_URL`: reemplaza `"INSTAGRAM_URL"` por el link real de tu perfil (ej: `"https://instagram.com/luz.dedetalles"`).
- `EMAIL`, `CITY`, `DOMICILIO_PRICE`, `BRAND_NAME`, `BRAND_TAGLINE`: ajusta a gusto.

Los productos (nombres, precios, presentaciones, descripciones, categorías y campos de personalización) están en **`src/data/products.ts`**. Cambia un precio ahí y se actualiza en todo el sitio automáticamente (catálogo, destacados, carrito y mensajes de WhatsApp).

## Fotografías

- Las fotos reales del negocio están en `src/assets/images/`.
- Dos productos no tenían foto real disponible al momento de construir el sitio y quedaron marcados así:
  - **Vela Grande Pack x10**: usa una foto referencial (badge "Imagen referencial" visible en el sitio).
  - **Esfera Navideña Personalizada para Mascota**: muestra un placeholder elegante ("Foto próximamente") en vez de una foto que no le pertenece al producto.
- Para reemplazar cualquier foto: coloca la nueva imagen en `src/assets/images/`, impórtala en `src/data/products.ts` y úsala en el arreglo `images` del producto correspondiente.

## Comandos

```bash
npm install       # instalar dependencias (una sola vez)
npm run dev       # servidor de desarrollo local
npm run build     # genera la versión de producción en /dist
npm run preview   # sirve /dist localmente para revisar el build final
```

## Publicar el sitio

La carpeta `dist/` (generada con `npm run build`) es un sitio estático listo para subir a cualquier hosting (Netlify, Vercel, GitHub Pages, hosting compartido, etc.). No necesita servidor backend.

## Estructura

```
src/
  config/site.config.ts   -> datos del negocio (WhatsApp, Instagram, domicilio...)
  data/products.ts        -> catálogo completo de productos
  components/             -> todas las secciones del sitio
  context/CartContext.tsx -> lógica del carrito
  utils/whatsapp.ts       -> generación de mensajes de WhatsApp
```
