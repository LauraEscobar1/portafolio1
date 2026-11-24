# Portafolio — Laura Escobar

Una sola página con scroll, animaciones 3D y efectos ligados al scroll.
Next.js (App Router) + React + TypeScript + Tailwind CSS v4. Sin librerías de animación: todo es CSS + React.

## Cómo correrlo

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # versión de producción
```

## Dónde cambiar cada cosa

| Qué | Dónde |
| --- | --- |
| Textos, placeholders [entre corchetes], proyectos, experiencia, testimonios, correo y redes | `lib/data.ts` |
| Tu foto del hero | `SITE.heroPhoto` en `lib/data.ts` (ej. `"/laura.png"` dentro de `public/`) |
| Marco decorativo de la foto | prop `frame` de `components/HeroPhoto.tsx` (se pinta sobre el arco) |
| "Cómo la uso" de cada tecnología | `USAGE` / campo `usage` en `lib/data.ts` |
| Captura de cada proyecto | campo `image` de cada proyecto en `lib/data.ts` |
| Colores, tamaños y animaciones | `app/globals.css` (la paleta está en `:root` y en `@theme`) |

## Estructura

```
app/            layout (fuentes Bodoni Moda + Didact Gothic), página y estilos
components/     una sección por archivo
  fx/           intro, cursor personalizado y efectos globales de scroll
  nav/          inicio (hero o torre), tarjetas, sección abierta y entradas
  transitions/  animaciones de entrada de las secciones
lib/            datos, navegación (nav.tsx) y hooks
public/         memoji.webp y las 16 fotos de "Fuera de la pantalla"
```

## Cómo se navega

- **`/` (versión principal):** una sola página con scroll hacia abajo. Entre
  secciones hay transiciones que avanzan con el scroll (`components/transitions/`):
  el inicio se encoge en una ventana con tarjetitas, una caja 3D antes de
  Formación, partículas antes de Proyectos, una línea que se dibuja antes de
  Experiencia, una ventana que crece antes de Testimonios y una estrella antes
  de Contacto.
- **`/torre` (versión alternativa):** una torre 3D desde la que se entra y se
  sale de cada sección (`components/nav/`).

Contenido real en `lib/data.ts`: proyectos (con sus botones de GitHub, APK,
instaladores o demo), experiencia general y burbujas de proyectos, testimonios,
contacto y stack. Las portadas están en `public/proyectos/` y tu foto recortada
en `public/laura-sticker.webp`. El CV está en `public/cv-laura-escobar.pdf`.

## Animaciones

- **Intro**: monograma "LE." + contador; dos cortinas (frost y pistacho) descubren el hero.
- **Hero**: el nombre en contorno se dibuja de izquierda a derecha, el arco sube desde abajo, el título entra palabra por palabra; el arco se inclina con el mouse (±12° / ±15°) con un brillo que sigue el cursor.
- **Sobre mí**: capas con profundidad (HOLA, círculo, burbuja) + Memoji que gira hacia el cursor.
- **Formación**: tarjetas con inclinación 3D y foco de luz.
- **Stack**: 14 tarjetas que vuelan de translateZ -2400 a +600 con el scroll.
- **Proyectos**: tarjetas tipo bancaria con fórmula de `renderVals()` + destello.
- **Experiencia**: "Experiencia" se enciende desde el desenfoque; tarjetas escalonadas.
- **Contacto**: mancha líquida (goo + turbulencia + difference) que invierte las letras.
- **Extras**: cursor con inercia (solo mouse) y botones magnéticos.

Todo respeta `prefers-reduced-motion`: sin intro, sin vuelos, sin rotaciones y sin mancha líquida.

## Formulario

Valida en el navegador (nombre, correo, asunto y mensaje) y, al enviarlo, abre la app de correo
con el mensaje listo. Si quieres que llegue directo a tu bandeja, conéctalo a un servicio como
Formspree o Resend en `components/Contact.tsx` (función `onSubmit`).

## Formulario de contacto (Web3Forms)

Los mensajes del formulario llegan a tu correo gracias a [Web3Forms](https://web3forms.com) (gratis).

1. Entra a https://web3forms.com, escribe `laurasofiaa.ec@gmail.com` y pide tu **Access Key** (te llega al correo).
2. En local: crea un archivo `.env.local` en la raíz con
   `NEXT_PUBLIC_WEB3FORMS_KEY=tu-clave`
3. En Vercel: *Settings → Environment Variables* → agrega `NEXT_PUBLIC_WEB3FORMS_KEY` con tu clave y vuelve a desplegar.

Si la clave no está configurada, el botón abre la app de correo con el mensaje listo (como plan B).

## Desplegar en Vercel

1. Sube el proyecto a un repositorio de GitHub.
2. En https://vercel.com → *Add New → Project* → importa el repositorio (Vercel detecta Next.js solo).
3. Agrega la variable `NEXT_PUBLIC_WEB3FORMS_KEY` y pulsa *Deploy*.
