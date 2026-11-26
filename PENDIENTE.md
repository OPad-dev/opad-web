# Lo que falta para que la web sea la mejor posible

Lista de lo que necesito (material, decisiones o datos) para terminar la web de OPad.
Está ordenada por impacto: lo de arriba es lo que más vende.

## 1. Una imagen del producto que venda

La página principal muestra el OPad como modelo 3D interactivo, sacado del modelo real de la carcasa V4
(negra de PETG, con las ranuras de los lados en azul claro; se descartó la versión con imagen fija). Aún se ve
"de videojuego": plástico sin textura y teclas inventadas.

Hay dos caminos (se pueden combinar):

- **Fotos del prototipo impreso** (lo mejor). Varias fotos con fondo oscuro, luz de ventana lateral y el móvil
  fijo en un soporte. Ángulos: vista general en tres cuartos, primer plano de la pantalla encendida y primer
  plano de las teclas.
- **Imagen de estudio hecha con Blender** (gratis y de código abierto). Simula la luz de verdad y da un aspecto de
  foto de producto. Para hacerla necesito:
  - [ ] Permiso para instalar Blender (unos 300 MB, sin cuenta ni pago).
  - [ ] Color y acabado de la carcasa final (¿PLA mate? ¿qué color?).
  - [ ] Forma y color de las teclas con las que se venderá (Cherry, OEM, XDA…), o una foto o enlace al modelo.
  - [ ] Si los interruptores se ven bajo las teclas, y de qué color son.
  - [ ] Qué vista enseña la pantalla: entre mapas (hora y pulsaciones) o durante una partida (PP, combo).

- [x] Elegir entre 3D e imagen fija: se queda el 3D.

## 2. Datos del Kickstarter

La web dice "Próximamente en Kickstarter" sin fecha, precio ni enlace, porque no hay que inventarlos.

- [ ] Fecha de lanzamiento, aunque sea aproximada ("primavera de 2027").
- [ ] Precio o precio orientativo.
- [ ] Enlace a la página previa del Kickstarter, para que la gente pulse "Notify me on launch". Es la mejor
  forma de reunir interesados antes de lanzar y no necesita ningún servicio de pago.
- [ ] Qué se incluye en cada recompensa (kit para montar, montado, con teclas, etc.).

## 3. Enseñarlo funcionando

Lo que más convence de este producto es ver la pantalla reaccionando mientras se juega.

- [ ] Un vídeo corto (10–20 s) o GIF del OPad en uso: tecleando en osu! y la pantalla con PP, combo y precisión.
  Puede grabarse con el móvil. Iría en la sección "Tu partida, en directo".
- [ ] Opcional: un segundo clip de tocar la pantalla para reintentar el mapa.

## 4. Identidad

- [ ] **Logo definitivo.** El que hay (un círculo rosa sobre una tecla oscura) es provisional, igual que el de la
  documentación.
- [ ] **Imagen para compartir en redes** (la que aparece al pegar el enlace en Discord, X o WhatsApp). Ahora no
  hay ninguna. La puedo hacer en cuanto haya imagen del producto.

## 5. Ficha para el comprador

Falta una sección corta con lo que un jugador quiere saber antes de comprar, sin tecnicismos:

- [ ] Medidas (la carcasa mide 84 × 82,5 mm) y peso.
- [ ] Qué viene en la caja. Confirmado: incluye cable USB-C.
- [ ] Con qué funciona: Windows y Linux. ¿Y macOS? Hay que confirmarlo.
- [ ] Preguntas frecuentes: ¿necesito la app para jugar?, ¿funciona en osu!lazer y en stable?,
  ¿se pueden cambiar las teclas?, ¿es legal en torneos?

## 6. Publicarla

- [x] **Dominio.** `https://opad.dev`, configurado en `astro.config.mjs`.
- [ ] **Alojamiento gratuito en GitHub Pages.** El workflow `.github/workflows/deploy.yml` ya construye y publica la
  web en cada push, a diario y a mano. Falta: subirlo, activar Pages en el repositorio (Settings → Pages → Source:
  GitHub Actions) y apuntar el DNS de `opad.dev` a GitHub Pages.
- [ ] Opcional: que OPad avise a la web al cambiar `main` (un `repository_dispatch` de tipo `opad-updated`), para
  no esperar a la construcción diaria. Necesita un token con permiso sobre `opad-web` guardado en OPad.

## 7. Repaso final (lo hago yo cuando lo anterior esté)

- [ ] Revisión de diseño completa con la imagen definitiva.
- [ ] Escribir `DESIGN.md` con el sistema visual (colores, tipografía, componentes) para que futuros cambios sean
  coherentes.
- [ ] Repaso de rendimiento: la portada a veces tarda en responder en móviles lentos y el modelo 3D pesa unos
  650 KB.
- [ ] Repaso de accesibilidad y de los textos en inglés y español.
