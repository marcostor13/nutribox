# CLAUDE.md — BUNKERGYM by Giovifitness · Landing Page

> Especificación de construcción para Claude Code.
> Objetivo: construir una landing page de una sola página (long-scroll), premium y con movimiento,
> que adapte el **lenguaje visual de FORH (forh.jp)** al contenido comercial de **BUNKERGYM by Giovifitness**.
> Lee este archivo completo antes de escribir código. Sigue el plan sección por sección.

---

## 0. Contexto y objetivo

**Cliente:** BUNKERGYM / Bunker Xtreme, marca fitness de Giovifitness.
**Tipo de sitio:** Landing de conversión (value ladder), long-scroll, 1 página con anclas + drawer de navegación.
**Público:** principalmente mujeres que buscan transformación (bajar de peso, tonificar, energía, nutrición), con oferta secundaria a hombres (personalizado 1a1, outfit, store).
**Job de la página (uno solo):** que la visitante agende una **evaluación gratuita** o inicie contacto por WhatsApp. Todo lo demás (store, nutribox, outfit) alimenta ese objetivo.

**Referencia de diseño (obligatoria):** https://forh.jp/
No copiar el contenido de FORH (es un gym japonés). **Copiar su sistema de diseño y ritmo:** secciones numeradas, hero en capas, carrusel de personas, tono editorial premium, mucho espacio en blanco.

---

## 1. Stack técnico

| Capa | Elección | Motivo |
|---|---|---|
| Framework | **Angular 18+ standalone components** | Alineado al stack de Ignia; mantenible por el equipo |
| Estilos | **Tailwind CSS** + design tokens en `:root` | Velocidad + consistencia |
| Animación scroll | **GSAP + ScrollTrigger** | Reveals, parallax del hero en capas (patrón FORH) |
| Carrusel | **Swiper** | Carrusel de personas/testimonios y de productos |
| Iconos | **Lucide** (`lucide-angular`) | Livianos, editables |
| Deploy | **Netlify** (build estático `ng build`) | Flujo habitual |

Node 20+. No usar `localStorage` para estado crítico. No añadir librerías pesadas de UI (Material, PrimeNG): el diseño es custom.

**Comandos base (Claude Code los ejecuta):**
```bash
npm create @angular@latest bunkergym -- --style=scss --routing=false --ssr=false --standalone
cd bunkergym
npm i -D tailwindcss postcss autoprefixer && npx tailwindcss init
npm i gsap swiper lucide-angular
```

---

## 2. Estructura de carpetas

```
src/
  app/
    app.component.ts            # shell: nav + <main> con todas las secciones
    core/
      scroll.service.ts         # inicializa GSAP/ScrollTrigger, respeta reduced-motion
      whatsapp.util.ts          # genera links wa.me con mensaje precargado
    layout/
      side-nav/                 # drawer lateral estilo FORH
      floating-cta/             # botón flotante "Agenda tu evaluación"
    sections/
      hero/
      transformation/          # 01
      services/                # 02
      nutribox/                # 03
      store/                   # 04
      outfit/                  # 05
      method/                  # 06
      stories/                 # 07  (carrusel personas)
      community/               # 08
      final-cta/               # cierre
    shared/
      section-header/          # "0X · LABEL · subtítulo" (patrón FORH)
      reveal.directive.ts      # [appReveal] fade/slide-up on scroll
  assets/
    img/                       # fotos del cliente (ver §12)
    video/                     # loop de hero (opcional)
  styles.scss                  # tokens + base
```

---

## 3. Sistema de diseño (tokens)

Concepto: **"Búnker" — concreto + acero + amarillo señal.** Base neutra cálida (herencia FORH) con acento industrial atlético. NO usar terracota/#D97757, NO usar verde ácido, NO look de periódico.

### 3.1 Color
```css
:root{
  --bone:      #EDE9E0;  /* fondo principal, hueso cálido */
  --bone-soft: #F5F2EC;  /* fondo alterno / tarjetas claras */
  --ink:       #17161A;  /* casi-negro, texto y fondos oscuros */
  --ink-800:   #26242A;  /* superficies oscuras secundarias */
  --concrete:  #8A857C;  /* gris concreto, texto secundario */
  --signal:    #F5C518;  /* AMARILLO SEÑAL — acento único, CTAs, números de sección */
  --signal-ink:#161200;  /* texto sobre amarillo */
  --line:      #D8D3C8;  /* hairlines / bordes sutiles */
}
```
Regla de uso del acento: **el amarillo es la única "voz alta".** Aparece en: números de sección `01–08`, botones primarios, subrayados de palabra clave, y detalles mínimos. Todo lo demás es hueso/tinta. Nunca fondos amarillos grandes.

Secciones oscuras (fondo `--ink`) se usan solo en: Hero, Método (06) y Comunidad (08), para crear ritmo claro→oscuro→claro.

### 3.2 Tipografía
```
Display  : "Archivo"  (peso 800/900, ancho expanded en titulares grandes)  → titulares, números
Body     : "Inter"    (400/500/600)                                        → párrafos, listas, UI
Acento   : "Fraunces" italic (peso 400, óptico soft)                        → SOLO subtítulos de sección y pull-quotes, con restraint
```
Cargar por Google Fonts (`@fontsource` o `<link>`). Fraunces solo en cursiva y con moderación (imita el aire editorial de FORH sin caer en Playfair genérico).

**Escala tipográfica (clamp, responsive):**
```
--fs-hero:   clamp(2.75rem, 8vw, 6.5rem);   /* titular hero, uppercase, tracking -0.02em */
--fs-h2:     clamp(2rem, 5vw, 4rem);
--fs-h3:     clamp(1.35rem, 2.5vw, 2rem);
--fs-lead:   clamp(1.1rem, 1.6vw, 1.35rem);
--fs-body:   1rem;
--fs-eyebrow:0.8rem;  /* uppercase, letter-spacing 0.22em */
--fs-num:    clamp(3rem, 6vw, 5rem);  /* número 0X de sección, --signal */
```

### 3.3 Espaciado, radios, sombras
```
Ritmo vertical de secciones: padding-block clamp(5rem, 12vh, 9rem)
Contenedor: max-width 1240px, padding-inline clamp(1.25rem, 5vw, 4rem)
Radios: casi nulos. --radius: 4px (tarjetas), botones pill solo en CTA flotante.
Sombras: sutiles y cálidas. --shadow: 0 20px 60px -30px rgba(23,22,26,.35)
Hairlines: 1px solid var(--line) para dividir secciones (patrón FORH).
```

### 3.4 Movimiento
- Reveal por defecto: `opacity 0→1`, `translateY(24px→0)`, `duration .8s`, `ease power3.out`, disparado por ScrollTrigger al 80% del viewport.
- Hero: parallax de capas (figura + sombra + fondo) al hacer scroll, muy sutil (`yPercent` 6–12).
- Carrusel de personas (07): transición suave, autoplay lento pausable.
- **Respetar `prefers-reduced-motion: reduce`** → desactivar parallax y reveals (mostrar todo estático).

---

## 4. Principios de layout (ADN FORH)

1. **Header de sección estandarizado** (componente `section-header`):
   ```
   ┌───────────────────────────────────────────┐
   │  01        SERVICES                        │   ← número --signal grande + label EN uppercase
   │            Nuestros servicios              │   ← subtítulo Fraunces italic
   └───────────────────────────────────────────┘
   ```
   El número `0X` y la etiqueta en inglés son fieles a FORH. Justificación: la página **es** una secuencia (recorrido de venta), así que numerar codifica orden real, no es decoración.

2. **Asimetría y aire:** alternar bloques imagen-full-bleed con bloques de texto respirados. Nunca centrar todo. Grids de 12 columnas con contenido a 5–7 columnas.

3. **Ritmo de fondo:** claro (hero oscuro) → claro → claro → oscuro (método) → claro → oscuro (comunidad) → cierre. Divisores hairline entre secciones claras.

4. **Imágenes en capas** en el hero (figura recortada + sombra desplazada), imitando `kv_model.png` + `kv_model_shadow.png` de FORH.

---

## 5. Navegación

**Drawer lateral** (como FORH): botón hamburguesa fijo arriba-derecha; abre panel oscuro (`--ink`) desde la derecha con:
- Logo BUNKERGYM
- Enlaces ancla: Inicio · Transformación · Servicios · NutriBox · Store · Outfit · Método · Historias · Comunidad
- Redes (IG / WhatsApp) — placeholders
- CTA "Agenda tu evaluación"

**CTA flotante** (`floating-cta`): pill amarillo abajo-derecha, visible tras hacer scroll fuera del hero → abre WhatsApp con mensaje precargado.

Scroll suave entre anclas. Header transparente sobre el hero, con fondo `--bone` al hacer scroll.

---

## 6. Utilidades

`whatsapp.util.ts`: función `waLink(msg: string)` → `https://wa.me/51XXXXXXXXX?text=<encoded>`.
Número de WhatsApp como constante `WA_NUMBER` (placeholder `51999999999` — dejar comentario `// TODO cliente`).
Cada CTA del value ladder abre WhatsApp con un mensaje distinto (ver copy por sección).

---

## 7. Arquitectura de información (sección por sección)

> Copy ya editado y corregido. Respetar textos. Todos los CTA → WhatsApp con mensaje precargado (o formulario, ver §13).

### HERO (fondo `--ink`, texto claro, imagen en capas)
- **Eyebrow:** `BUNKER XTREME · GIOVIFITNESS`
- **Titular (display, uppercase):** `Bienvenida a tu nueva versión`
- **Lead:** `Transforma tu cuerpo, tu energía y tu confianza con entrenamiento, nutrición y bienestar en un solo lugar.`
- **Subcopy:** `Deja de empezar de cero cada lunes. Aquí encontrarás las herramientas para sentirte fuerte, saludable y con más confianza en ti.`
- **CTAs:** primario `Empieza hoy` (amarillo) · secundario `Agenda una evaluación gratuita` (outline claro)
- **Imagen:** figura fitness recortada (PNG) + sombra desplazada + fondo. Parallax sutil.
- **Wireframe:**
```
┌──────────────────────────────────────────────┐
│  BUNKER XTREME · GIOVIFITNESS         [ ≡ ]   │
│                                               │
│  BIENVENIDA A            ╭───────────────╮    │
│  TU NUEVA VERSIÓN        │   figura +    │    │
│  (lead)                  │   sombra      │    │
│  [ Empieza hoy ][ Evaluación gratuita ]  │    │
│                          ╰───────────────╯    │
└──────────────────────────────────────────────┘
```

### 01 · TRANSFORMATION — "Tu transformación comienza aquí" (fondo `--bone`)
Intro: `No importa cuál sea tu meta. Tenemos un sistema diseñado para ayudarte.`
Grid de 6 objetivos (icono lucide + texto), reveal escalonado (stagger):
Bajar de peso · Tonificar tu cuerpo · Aumentar masa muscular · Recuperar tu energía · Aprender a comer mejor · Verte y sentirte espectacular.
Imagen de apoyo: entrenadora evaluando a clienta (foto del PDF).

### 02 · SERVICES — "Nuestros servicios" (fondo `--bone-soft`)
Tres tarjetas grandes verticales (o alternadas imagen/texto):

**a) Entrenamiento grupal** — `Entrena junto a una comunidad de mujeres con tus mismos objetivos.`
Beneficios: Clases dinámicas · Quema de grasa · Tonificación · Motivación constante · Horarios flexibles · Comunidad privada.
CTA: `Quiero entrenar en grupo` → WA: "Hola, quiero info del entrenamiento grupal".

**b) Entrenamiento personalizado 1 a 1** — `Tu entrenador personal en todo momento. Para hombres y mujeres.`
Programa según: edad · objetivos · nivel físico · lesiones · disponibilidad.
Incluye: seguimiento permanente · evaluaciones periódicas · plan nutricional personalizado · comunicación directa · ajustes semanales.
CTA: `Quiero mi plan personalizado`.

**c) Planes nutricionales** — `Sin nutrición, los resultados no llegan. Olvídate de las dietas extremas.`
Adaptado a: tus gustos · tu presupuesto · tu rutina · tus objetivos.
Obtienes: menú personalizado · lista de compras · opciones de reemplazo · seguimiento.
CTA: `Solicitar mi plan`.

### 03 · NUTRIBOX — "Come sin culpa" (fondo `--bone`)
Titular: `NutriBox` · subtítulo: `Disfruta comer sin culpa.`
Copy: `Una selección de snacks saludables elegidos para mantener tus objetivos sin sacrificar el sabor.`
Contiene: snacks proteicos · galletas saludables · frutos secos · barras energéticas · productos funcionales.
Imagen: caja de snacks (foto del PDF), tratamiento producto sobre fondo hueso.
CTA: `Quiero mi NutriBox`.

### 04 · STORE — "Fitness Store" (fondo `--bone-soft`)
Titular: `Fitness Store` · `Todo lo que necesitas para entrenar desde casa.`
Grid de productos (imágenes del PDF): mancuernas · bandas elásticas · tobilleras · mat de yoga · kettlebells · accesorios fitness.
Carrusel Swiper opcional para los implementos.
CTA: `Ver tienda`.

### 05 · OUTFIT — "Outfit Fitness" (fondo `--bone`)
Titular: `Outfit Fitness` · `Moda deportiva que combina estilo, comodidad y rendimiento.`
`Colecciones para sentirte segura dentro y fuera del gimnasio.`
Encontrarás: leggings · tops deportivos · casacas · polos oversize · conjuntos premium · accesorios fitness.
Galería editorial (fotos del PDF, mujer y hombre).
CTA: `Comprar outfit`.

### 06 · METHOD — "¿Por qué elegirnos?" (fondo `--ink`, oscuro)
Titular claro: `Método Integral` · `No trabajamos solo el cuerpo.`
Seis pilares con icono, en fila/grid, acento amarillo:
Movimiento · Nutrición · Energía · Hábitos · Confianza · Bienestar.
Frase de cierre (Fraunces italic, grande): `Cuando una mujer se transforma por dentro, todo cambia por fuera.`

### 07 · STORIES — "Historias de transformación" (fondo `--bone`) ★ CARRUSEL FORH
Adaptación directa del carrusel de personas de FORH. Cada card = una alumna, con foto y estructura:
```
[ foto ]  Nombre · edad · rol
          "# frase de resultado"
          OBJETIVO        → lo que buscaba
          PUNTO DE PARTIDA→ de dónde venía
          RESULTADO       → lo que logró en BUNKER
```
Incluir tabs/avatares arriba (como FORH) + prev/next. Placeholders con 4–6 personas; el cliente reemplaza por fotos y testimonios reales.
Soportar: fotos antes/después, video (embed) y "resultados medibles" (ej. -8 kg / 12 semanas).

### 08 · COMMUNITY — "Comunidad Bunker Xtreme" (fondo `--ink`, oscuro)
Titular: `Comunidad Bunker Xtreme`
`Más que un programa. Una tribu que se apoya, crece y evoluciona junta.`
Mosaico de fotos de comunidad + contador social (miembros / clases / transformaciones) con animación count-up.

### CIERRE · FINAL CTA (fondo `--signal` como excepción controlada, o `--ink` con acento)
Titular grande: `Tu nueva vida empieza hoy`
`No esperes el momento perfecto. El momento perfecto es AHORA.`
Botón principal: `🚀 Quiero transformar mi vida` → WhatsApp / formulario.
Footer minimal: logo · redes · WhatsApp · © BUNKERGYM by Giovifitness.

---

## 8. Componentes reutilizables

- `SectionHeaderComponent` (`@Input() num, labelEn, subtitle, theme: 'light'|'dark'`).
- `RevealDirective` (`[appReveal]`, `@Input() delay`) → wrap ScrollTrigger.
- `ServiceCardComponent`, `ProductCardComponent`, `PillarComponent`, `PersonaCardComponent`.
- `CtaButtonComponent` (`@Input() variant: 'primary'|'outline', href/waMessage`).

---

## 9. Configuración GSAP (core/scroll.service.ts)
- Registrar `ScrollTrigger`.
- Batch de elementos `[appReveal]` con stagger 0.08s.
- Hero: timeline con parallax de capas.
- Count-up en Comunidad al entrar en viewport.
- Guard: si `matchMedia('(prefers-reduced-motion: reduce)').matches` → no animar, set final state.

---

## 10. Responsive
- Mobile-first. Breakpoints Tailwind: `sm 640 · md 768 · lg 1024 · xl 1280`.
- Hero: en móvil, titular arriba y figura debajo; en desktop, split asimétrico.
- Grids 6→ colapsan a 2/1 columnas.
- Drawer full-width en móvil.
- Carrusel: 1 card visible en móvil, 2–3 en desktop.
- Tipografía por `clamp()` ya definida.

## 11. Accesibilidad y performance (quality floor)
- Contraste AA (cuidado amarillo sobre blanco: usar `--signal` solo sobre tinta o como fill de botón con texto `--signal-ink`).
- Focus visible en todos los interactivos; navegación por teclado en drawer y carrusel.
- `alt` descriptivos en todas las imágenes.
- `loading="lazy"` en imágenes bajo el fold; `<picture>`/webp.
- Objetivo Lighthouse ≥ 90 en Performance y Accesibilidad.
- Sin CLS: reservar dimensiones de imágenes.

---

## 12. Assets / imágenes
Las fotos vienen del documento del cliente (PDF adjunto original). Colocar en `src/assets/img/` con placeholders y comentarios `// TODO: reemplazar por asset real`:
```
hero-figure.png        (figura recortada para capas del hero)
hero-shadow.png        (sombra de la figura)
class-group.jpg        (clase grupal)
trainer-eval.jpg       (evaluación entrenadora+clienta)  → sección 01
nutribox-*.jpg         (cajas de snacks)                 → sección 03
store-*.jpg            (implementos, bandas, mancuernas)  → sección 04
outfit-*.jpg           (moda deportiva mujer/hombre)      → sección 05
persona-01..06.jpg     (testimonios)                      → sección 07
community-*.jpg        (mosaico)                           → sección 08
```
Mientras no haya assets reales, usar placeholders de color hueso con proporción correcta para no romper el layout.

---

## 13. CTAs / conversión (decisión de negocio)
Por defecto **todos los CTA abren WhatsApp** (`wa.me`) con mensaje precargado por servicio — encaja con SME peruano y flujo de Ignia (WAHA/n8n).
Excepción "Agenda una evaluación gratuita": dejar preparado un slot para **formulario** (nombre, WhatsApp, objetivo) o un embed de agenda (Calendly/Cal.com). Implementar el formulario como componente `booking-form` que por ahora hace `console.log` + redirige a WhatsApp con los datos; marcar `// TODO backend NestJS / n8n webhook`.

---

## 14. Pasos de construcción (para Claude Code)
1. Scaffold Angular standalone + Tailwind + libs (§1).
2. Cargar tokens en `styles.scss` y fuentes (§3).
3. Crear `SectionHeaderComponent`, `RevealDirective`, `scroll.service.ts`.
4. Construir shell: `SideNav` + `FloatingCta` + `<main>`.
5. Implementar secciones en orden: Hero → 01 … 08 → Cierre, usando el copy de §7.
6. Integrar GSAP reveals + parallax hero + carrusel Swiper (07) + count-up (08).
7. Cablear CTAs a `whatsapp.util.ts` con mensajes por sección.
8. Pasar responsive, reduced-motion y a11y (§10–11).
9. `ng build` y verificar Lighthouse.
10. Deploy Netlify (`ng build`, publish dir `dist/bunkergym/browser`).

---

## 15. Criterios de aceptación (checklist)
- [ ] Todas las secciones del PDF presentes y en orden, con copy corregido.
- [ ] Patrón FORH visible: números `0X` amarillos + label EN + subtítulo Fraunces.
- [ ] Hero con imagen en capas y parallax sutil.
- [ ] Carrusel de historias con estructura OBJETIVO/PUNTO DE PARTIDA/RESULTADO.
- [ ] Ritmo de fondo claro→oscuro respetado (Hero, 06, 08 oscuros).
- [ ] Amarillo señal usado solo como acento (nunca fondos grandes salvo cierre).
- [ ] Todos los CTA abren WhatsApp con mensaje correcto; slot de formulario listo.
- [ ] Drawer + CTA flotante funcionales.
- [ ] `prefers-reduced-motion` respetado.
- [ ] Responsive impecable en 375 / 768 / 1280.
- [ ] Lighthouse ≥ 90 Perf/A11y. Sin errores de consola.

---

## 16. Fuera de alcance (fase 2)
- Backend real de reservas (NestJS + Mongo) y webhook n8n.
- E-commerce real de Store/Outfit (por ahora los CTA llevan a WhatsApp/catálogo).
- Blog / CMS.
- Multilenguaje.

**Nota final:** no reproducir contenido de FORH; es solo referencia de estilo. Todo el copy y las imágenes son de BUNKERGYM by Giovifitness.