---
editUrl: https://github.com/OPad-dev/OPad/edit/main/docs/es/guides/customize-screen-layout.md
lastUpdated: 2026-11-26T23:14:24+01:00
title: Personalizar el diseño de la pantalla
description: Cómo diseñar, previsualizar, aplicar, exportar e importar diseños personalizados de pantalla Idle y Playing en opad-gui, con todas las fuentes de datos disponibles.
sidebar:
  order: 3
---

La pantalla de 320×240 del teclado tiene dos diseños: la **Idle screen**, que se muestra fuera de un mapa, y la **Playing screen**, que se muestra durante uno. Editas ambas en la página **Designer** de la app, cuya previsualización (dibujada al doble de tamaño) la genera el propio código de interfaz del firmware: lo que ves es lo que muestra el teclado.

## Ruta rápida

Necesitas `opad-gui` y `opad-daemon` en ejecución. El teclado puede estar desconectado: **Apply to pad** guarda el diseño en el daemon y lo envía la próxima vez que se conecte el teclado. Si la app dice que el teclado pertenece a otra instalación de OPad, resuélvelo primero (consulta [Recuperación §7](/es/docs/recovery/#7-reflashear-y-desvincular-un-teclado)).

1. Abre `opad-gui` y selecciona **Designer** en la barra de navegación izquierda (o lanza `opad-gui --page designer`).
2. Encima de la previsualización, elige **Idle screen** o **Playing screen**. Cada una se guarda por separado.
3. Haz clic en un tipo en **Add widget**, arrástralo a su sitio en la previsualización y ajusta su fuente de datos, su texto y sus colores en **Properties** ([Widgets](#widgets), [Propiedades](#propiedades)).
4. Compruébalo con las casillas de previsualización: **Live data from osu!** sondea `opad-daemon` cada segundo para mostrar valores reales de `tosu` y de ritmo de pulsación (con `tosu` en marcha; si no, se usan valores de ejemplo integrados), y **Show keys pressed** simula ambas teclas pulsadas para comprobar los colores de resaltado de las Key card.
5. Haz clic en **Apply to pad** (mostrado como **Apply to pad •** mientras haya cambios sin aplicar). Para guardar una copia en un archivo, haz clic en **Export** ([Exportar e importar un diseño](#exportar-e-importar-un-diseño)).

La línea de estado bajo la previsualización dice entonces `Applied to the pad` y el `•` desaparece. El teclado muestra tu diseño Idle al momento y cambia a tu diseño Playing al empezar un mapa. Los diseños sobreviven a una desconexión: el teclado los guarda en NVS (`opad_ui`).

## Widgets

Una pantalla admite hasta `32` widgets.

| Widget | Qué dibuja |
|---|---|
| **Text** | `Label` + valor enlazado + `Suffix`. Con `Data` en `None (static text)`, texto estático. Un ritmo de pulsación puede mostrarse en `KPM (keys per minute)` o `KPS (keys per second)`; KPS lleva un decimal por defecto. |
| **Progress bar** | Barra horizontal: `Background` es la pista y `Accent` el relleno. Enlázala a una fuente `0..1` como `map.progress` o `play.health`. |
| **Key card** | Tarjeta de contador para K1 o K2 (`pad.k1_map`, `pad.k1_lifetime`, `pad.k1_label` o los equivalentes de K2). `Label` es el título; `Background` y `Accent` se intercambian mientras la tecla está pulsada. **Show tap rate (key's live KPM or KPS)** añade el ritmo en vivo de la tecla en la esquina. |
| **Status dot** | Círculo (`Accent` cuando está activo, `Background` cuando está inactivo) seguido de `Label` en `Text / fg`. Enlázalo a una fuente `0/1` como `status.pc`, `status.tosu` o `status.osu`. |
| **Rectangle** | Rectángulo redondeado relleno (`Background` con `Radius`), con un **Border** opcional de 1 px en `Text / fg`. |
| **Grade** | La letra de calificación (`play.grade`) con los colores de rango de osu! (`SS`/`X`, `S`, `A`, `B`, `C`, `D`). |

**Colocar y ordenar:**

- Arrastra un widget en la previsualización para moverlo, o arrastra su tirador rosa inferior derecho para redimensionarlo.
- Las teclas de flecha desplazan el widget seleccionado `1 px` (`Shift` + flecha: `10 px`); `Delete` lo elimina.
- En la lista **Widgets (`n`/32)** (`top of list = drawn on top`), **Raise** y **Lower** cambian el orden de dibujo, **Duplicate** copia el widget desplazado `+8, +8 px` y **Delete** lo elimina.

## Propiedades

Los ajustes del widget seleccionado, en **Properties**:

| Propiedad | Valores |
|---|---|
| **Type**, **Data** | Tipo de widget; fuente de datos ([Fuentes de datos](#fuentes-de-datos-ui_source_t)). |
| **Font** | `12 px`, `14 px`, `16 px`, `20 px`, `24 px`, `32 px`, `48 px` |
| **Align** | `Left`, `Center`, `Right` |
| **X**, **Y** | `-320` a `640`, `-240` a `480` |
| **Width**, **Height** | `1` a `640`, `1` a `480` |
| **Radius** | `0` a `120` |
| **Decimals** | `Source default` o `0`–`4` |
| **Label**, **Suffix** | Hasta `31` y `11` bytes |
| **Text / fg**, **Background**, **Accent**, **Screen bg** | Haz clic en la muestra o escribe `#RRGGBB` |
| Opciones | **Fill background (text)**, **Border**, **Hide when there is no data**, **Show tap rate (key's live KPM or KPS)** (solo Key card) |
| **Unit** | `KPM (keys per minute)` o `KPS (keys per second)`; también actualiza las palabras completas `KPM`/`PPM`/`KPS` en `Label` y `Suffix` |

## Aplicar, deshacer y restablecer

| Botón | Efecto |
|---|---|
| **Apply to pad** | Fuera de un mapa (`Idle`): el daemon guarda el diseño en SQLite y lo envía al teclado, que lo almacena en NVS (`opad_ui`). Durante un mapa o el cooldown: va a la RAM del teclado al momento y se guarda en disco y NVS cuando el teclado vuelve a `Idle`. |
| **Revert** | Deshace los cambios sin aplicar. |
| **Reset to default** | Carga el diseño integrado del firmware para esta pantalla; haz clic en **Apply to pad** para usarlo. |
| **Reload** | Descarta los cambios locales y vuelve a pedir al daemon los diseños guardados. |

## Exportar e importar un diseño

Ambos actúan sobre la pantalla seleccionada arriba (**Idle screen** o **Playing screen**).

- **Export** abre un diálogo para guardar con nombre predeterminado `opad-idle.json` u `opad-playing.json` y escribe el diseño en JSON formateado.
- **Import** pide un archivo `.json` de diseño, lo valida con las mismas reglas que el firmware (`ui_layout_validate`) y lo carga en el editor. Haz clic en **Apply to pad** para guardarlo y enviarlo.

## Fuentes de datos (`ui_source_t`)

Cada widget se enlaza a un ID de fuente de `ui_source_t` (`firmware/main/ui/core/ui_ids.h`). La lista **Data** muestra cada una como `<grupo>: <etiqueta>`, por ejemplo `Map: Title`, e incluye todas las fuentes siguientes excepto `72` y `73` (`pad.k1_down`, `pad.k2_down`), los indicadores de tecla pulsada que los widgets **Key card** enlazan por sí solos. El ID `42` está reservado.

En las tablas, *Ritmo* significa un entero en KPM o un decimal en KPS; los números entre paréntesis son los decimales por defecto. `0` (`none`, `None (static text)`) es `Label` + `Suffix` estáticos sin datos en vivo.

### Mapa (desde `tosu`)

| ID | Identificador | Etiqueta | Formato | Descripción |
|---|---|---|---|---|
| `1` | `map.title` | Title | Texto | Título del mapa. |
| `2` | `map.artist` | Artist | Texto | Artista del mapa. |
| `3` | `map.mapper` | Mapper | Texto | Creador del mapa. |
| `4` | `map.difficulty` | Difficulty | Texto | Nombre de la dificultad. |
| `5` | `map.status` | Status | Texto | Estado del mapa (p. ej., `ranked`, `loved`). |
| `6` | `map.stars` | Stars | Fijo (`2`) | Calificación total de estrellas (con mods activos). |
| `7` | `map.stars_live` | Stars live | Fijo (`2`) | Estrellas en vivo en la posición actual del mapa. |
| `8` | `map.ar` | AR | Fijo (`1`) | Approach Rate. |
| `9` | `map.cs` | CS | Fijo (`1`) | Circle Size. |
| `10` | `map.od` | OD | Fijo (`1`) | Overall Difficulty. |
| `11` | `map.hp` | HP | Fijo (`1`) | HP Drain Rate. |
| `12` | `map.bpm` | BPM | Entero | BPM del mapa (no tu velocidad de pulsación). |
| `13` | `map.objects` | Objects | Entero agrupado | Número total de objetos del mapa. |
| `14` | `map.max_combo` | Max combo | Entero agrupado | Combo máximo posible del mapa. |
| `15` | `map.length` | Length | Duración (`m:ss`) | Duración total del mapa (ms). |
| `16` | `map.time_elapsed` | Time elapsed | Duración (`m:ss`) | Tiempo transcurrido del mapa (ms). |
| `17` | `map.time_remaining` | Time remaining | Duración (`m:ss`) | Tiempo restante del mapa (ms). |
| `18` | `map.progress` | Progress | Porcentaje (`0`, bruto `0..1`) | Progreso del mapa (usable en Progress bar). |
| `19` | `map.kiai` | Kiai | Entero (`0`/`1`) | `1` durante kiai. |

### Partida en vivo (desde `tosu` y ritmo de pulsación del daemon)

| ID | Identificador | Etiqueta | Formato | Descripción |
|---|---|---|---|---|
| `20` | `play.pp` | PP | Fijo (`0`) | PP actual en vivo. |
| `21` | `play.pp_fc` | PP fc | Fijo (`0`) | PP estimado si se consigue full combo. |
| `22` | `play.pp_max` | PP max | Fijo (`0`) | PP máximo alcanzable en esta partida. |
| `23` | `play.accuracy` | Accuracy | Fijo (`2`) | Porcentaje de precisión actual. |
| `24` | `play.score` | Score | Entero agrupado | Puntuación actual. |
| `25` | `play.combo` | Combo | Entero agrupado | Combo actual. |
| `26` | `play.max_combo` | Max combo | Entero agrupado | Combo máximo alcanzado en este intento. |
| `27` | `play.grade` | Grade | Texto | Letra de rango actual (`SS`, `S`, `A`, `B`, `C`, `D`). |
| `28` | `play.hits_300` | Hits 300 | Entero agrupado | Conteo de aciertos 300. |
| `29` | `play.hits_100` | Hits 100 | Entero agrupado | Conteo de aciertos 100. |
| `30` | `play.hits_50` | Hits 50 | Entero agrupado | Conteo de aciertos 50. |
| `31` | `play.hits_miss` | Hits miss | Entero agrupado | Conteo de fallos (misses). |
| `32` | `play.slider_breaks` | Slider breaks | Entero agrupado | Conteo de slider breaks. |
| `33` | `play.ur` | UR | Fijo (`1`) | Unstable Rate. |
| `34` | `play.health` | Health | Porcentaje (`0`, bruto `0..1`) | Barra de vida actual (usable en Progress bar). |
| `35` | `play.mods` | Mods | Texto | Cadena de mods activos (p. ej., `HDDT`). |
| `36` | `play.player` | Player | Texto | Nombre del jugador en la partida activa. |
| `37` | `play.failed` | Failed | Entero (`0`/`1`) | `1` si la partida ha fallado. |
| `51` | `play.ppm` | Live KPM | Ritmo | Velocidad actual de pulsación combinada (`0` sin pulsar). |
| `52` | `play.ppm_avg` | Tapping avg KPM | Ritmo | Media del intento mientras se pulsa (sin descansos). |
| `53` | `play.ppm_peak` | PEAK KPM | Ritmo | Las 7 pulsaciones consecutivas más rápidas en este intento. |
| `54` | `play.k1_ppm` | K1 live KPM | Ritmo | Velocidad actual de pulsación de Key 1. |
| `55` | `play.k1_ppm_avg` | K1 tapping avg KPM | Ritmo | Media de Key 1 mientras se pulsa en este intento. |
| `56` | `play.k1_ppm_peak` | K1 peak KPM | Ritmo | Pico de ráfaga de Key 1 en este intento. |
| `57` | `play.k2_ppm` | K2 live KPM | Ritmo | Velocidad actual de pulsación de Key 2. |
| `58` | `play.k2_ppm_avg` | K2 tapping avg KPM | Ritmo | Media de Key 2 mientras se pulsa en este intento. |
| `59` | `play.k2_ppm_peak` | K2 peak KPM | Ritmo | Pico de ráfaga de Key 2 en este intento. |
| `84` | `play.ppm_song` | AVG KPM | Ritmo | Ritmo global de la canción (de la primera a la última nota, descansos incluidos). |
| `86` | `play.ppm_song_peak` | Best 10 s KPM | Ritmo | Ventana de 10 segundos más rápida de la canción en este intento. |

### Perfil y sesión (desde `tosu`)

| ID | Identificador | Etiqueta | Formato | Descripción |
|---|---|---|---|---|
| `40` | `profile.name` | Name | Texto | Nombre de usuario de osu! conectado. |
| `41` | `profile.rank` | Rank | Entero agrupado | Rango global. |
| `43` | `profile.pp` | PP | Fijo (`0`) | PP total del perfil. |
| `44` | `profile.accuracy` | Accuracy | Fijo (`2`) | Precisión del perfil. |
| `45` | `profile.playcount` | Playcount | Entero agrupado | Partidas totales del perfil. |
| `46` | `profile.level` | Level | Fijo (`0`) | Nivel del perfil. |
| `47` | `profile.country` | Country | Texto | Código de país. |
| `48` | `session.playtime` | Playtime | Duración (`m:ss` / `h:mm:ss`) | Tiempo jugado en la sesión actual (ms). |
| `49` | `session.playcount` | Playcount | Entero agrupado | Mapas jugados en esta sesión. |
| `50` | `game.state` | State | Texto | Estado actual de osu! (p. ej., `Playing`, `Song select`). |

### Teclado (locales al dispositivo, funcionan sin anfitrión)

| ID | Identificador | Etiqueta | Formato | Descripción |
|---|---|---|---|---|
| `60` | `pad.k1_map` | K1 map | Entero agrupado | Pulsaciones de la primera tecla de juego en el mapa actual. |
| `61` | `pad.k2_map` | K2 map | Entero agrupado | Pulsaciones de la segunda tecla de juego en el mapa actual. |
| `62` | `pad.total_map` | Total map | Entero agrupado | Pulsaciones combinadas de teclas de juego en el mapa actual. |
| `63` | `pad.k1_lifetime` | K1 lifetime | Entero agrupado | Contador de por vida de la primera tecla de juego. |
| `64` | `pad.k2_lifetime` | K2 lifetime | Entero agrupado | Contador de por vida de la segunda tecla de juego. |
| `65` | `pad.total_lifetime` | Total lifetime | Entero agrupado | Total de por vida de las teclas de juego activas. |
| `66` | `pad.kps` | KPS | Entero | Pulsaciones por segundo en ventana móvil de 1 s locales al teclado. |
| `67` | `pad.k1_label` | K1 label | Texto | Carácter asignado a la primera tecla de juego (p. ej., `Z`). |
| `68` | `pad.k2_label` | K2 label | Texto | Carácter asignado a la segunda tecla de juego (p. ej., `X`). |
| `69` | `pad.clock` | Clock | Texto | Reloj local (`HH:MM`, sincronizado desde el anfitrión). |
| `70` | `pad.date` | Date | Texto | Fecha local (p. ej., `Sat 12 Sep`). |
| `71` | `pad.uptime` | Uptime | Duración (`m:ss` / `h:mm:ss`) | Tiempo desde el arranque del teclado (ms). |
| `72` | `pad.k1_down` | *(solo Key card)* | Entero (`0`/`1`) | Estado de Key 1 pulsada (no aparece en la lista). |
| `73` | `pad.k2_down` | *(solo Key card)* | Entero (`0`/`1`) | Estado de Key 2 pulsada (no aparece en la lista). |

### Historial (desde SQLite del daemon, independiente de `tosu`)

Sobre el periodo de historial seleccionado.

| ID | Identificador | Etiqueta | Formato | Descripción |
|---|---|---|---|---|
| `74` | `history.ppm_avg` | Tapping avg KPM | Ritmo | Media de pulsación. |
| `75` | `history.ppm_peak` | Best PEAK KPM | Ritmo | Mejor pico de ráfaga de 7 pulsaciones. |
| `76` | `history.k1_ppm_avg` | K1 tapping avg KPM | Ritmo | Media de pulsación de Key 1. |
| `77` | `history.k1_ppm_peak` | K1 best peak KPM | Ritmo | Mejor pico de Key 1. |
| `78` | `history.k2_ppm_avg` | K2 tapping avg KPM | Ritmo | Media de pulsación de Key 2. |
| `79` | `history.k2_ppm_peak` | K2 best peak KPM | Ritmo | Mejor pico de Key 2. |
| `83` | `history.period` | Period | Texto | Etiqueta del periodo (p. ej., `LAST 30 DAYS`, `ALL TIME`). |
| `85` | `history.ppm_song` | AVG KPM | Ritmo | Media del ritmo global de canción. |
| `87` | `history.ppm_song_peak` | Best 10 s KPM | Ritmo | Mejor ventana de 10 s de canción. |

### Conexión (indicadores de estado, `0`/`1`)

| ID | Identificador | Etiqueta | Formato | Descripción |
|---|---|---|---|---|
| `80` | `status.pc` | PC | Entero (`0`/`1`) | `1` cuando `opad-daemon` está conectado por USB CDC. |
| `81` | `status.tosu` | Tosu | Entero (`0`/`1`) | `1` cuando `opad-daemon` está conectado a `tosu`. |
| `82` | `status.osu` | Osu | Entero (`0`/`1`) | `1` cuando `tosu` detecta un proceso `osu!` en ejecución. |

## Si no ha funcionado

| Ves | Qué hacer |
|---|---|
| Línea de estado `Applied: Layout applied to pad RAM; will be saved after gameplay` | Nada: lo aplicaste durante un mapa; se guarda cuando termine. |
| Línea de estado `Applied: Saved; it will be applied when the pad connects` | Nada: el teclado está desconectado; conéctalo. |
| `This pad's firmware shows tap rates in KPM only; update the pad's firmware to show them in KPS` | Algún widget usa **Unit** = `KPS (keys per second)` (`FLAG_PER_SECOND`), que el firmware anterior ignora. Vuelve a `KPM (keys per minute)` o sigue [Actualizar el firmware](/es/docs/guides/update-firmware/). |
| `Daemon unavailable (...)` o `No live data yet (is tosu running?)` | Comprueba que `opad-daemon` y `tosu` estén en ejecución; consulta [Solución de problemas](/es/docs/troubleshooting/) y [Usar OPad con tosu](/es/docs/guides/use-with-tosu/). |
| Diseño rechazado al importar o aplicar | Necesita como máximo `32` widgets, `Width` 1–640, `Height` 1–480, `Label` ≤ 31 bytes, `Suffix` ≤ 11 bytes e IDs válidos de `ui_source_t`. |
| El teclado se queda en la pantalla roja de calibración | Un teclado Hall Effect sin calibrar oculta las pantallas normales hasta completar la calibración; consulta [Calibrar interruptores Hall Effect](/es/docs/guides/calibrate-hall-effect/). |
