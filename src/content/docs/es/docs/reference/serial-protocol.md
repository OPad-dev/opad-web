---
editUrl: https://github.com/OPad-dev/OPad/edit/main/docs/es/reference/serial-protocol.md
lastUpdated: 2026-11-23T00:32:11+01:00
title: Referencia del protocolo serie
description: Especificación del entramado serie CDC, negociación y formato de cable Protocol Buffers entre anfitrión y teclado.
sidebar:
  order: 5
---

La suite de escritorio de OPad se comunica con el teclado mediante serie USB CDC-ACM a 115200 baudios. Los mensajes de control y telemetría se codifican como Protocol Buffers v3 (`proto3`) dentro de tramas delimitadas por longitud.

## Capa de entramado

Existen tres variantes de entramado para mantener compatibilidad bidireccional entre aplicaciones de escritorio y firmwares antiguos y nuevos.

### Variantes de entramado

| Variante | Bytes mágicos | Campo de longitud | Carga útil | Campo de comprobación | Cabecera / Cola |
|---|---|---|---|---|---|
| **Legacy** | Ninguno | `uint32` (little-endian, `>= 2`) | Carga protobuf cruda | Ninguno | 4 bytes / 0 bytes |
| **Marked** | `0xAA, 0x55` | `uint16` (little-endian) | Carga protobuf cruda | Ninguno | 4 bytes / 0 bytes |
| **Checked** | `0xAA, 0x5A` | `uint16` (little-endian) | Carga protobuf cruda | `uint16` (CRC-16 LE) | 4 bytes / 2 bytes |


- **Entramado Legacy**: Usado por firmwares y aplicaciones anteriores a las tramas marcadas. Una longitud sin signo de 32 bits little-endian (`2..=8186`, `LEGACY_MIN_PAYLOAD = 2` para que las rachas de ceros no se interpreten como tramas vacías) seguida inmediatamente de la carga protobuf.
- **Entramado Marked**: Empieza con los bytes mágicos `[0xAA, 0x55]` (`FRAME_MAGIC`) seguidos de una longitud little-endian de 16 bits y la carga protobuf. Permite resincronizar rápidamente tras bytes serie sueltos.
- **Entramado Checked**: Empieza con los bytes mágicos `[0xAA, 0x5A]` (`FRAME_MAGIC_CHECKED`) seguidos de una longitud little-endian de 16 bits, la carga protobuf y una cola CRC-16 little-endian de 2 bytes.

### Especificación CRC-16

Las tramas Checked utilizan CRC-16/CCITT-FALSE (valor de comprobación `0x29B1` para `"123456789"`):

- **Polinomio**: `0x1021`
- **Valor inicial**: `0xFFFF`
- **RefIn / RefOut**: `false` / `false`
- **XorOut**: `0x0000`
- **Cobertura**: Calculado sobre el campo de longitud de 2 bytes concatenado con los bytes de carga útil (se excluyen los 2 bytes mágicos).
- **Codificación**: Añadido tras la carga útil en orden de bytes little-endian.

### Límites de tamaño de trama

- **Sobrecarga de cabecera**: 4 bytes (`HEADER_BYTES` / `FRAME_HEADER_SIZE`).
- **Sobrecarga de cola CRC**: 2 bytes (`CRC_BYTES` / `FRAME_CRC_SIZE`) solo en tramas Checked.
- **Tamaño máximo de carga útil**: 8186 bytes (`MAX_PAYLOAD_BYTES = 8192 - 4 - 2` / `FRAME_MAX_PAYLOAD`).
- **Tiempo límite de trama parcial obsoleta**: 500 ms (`RX_STALE_US = 500000` en firmware, `STALE_PARTIAL_FRAME = 500 ms` en anfitrión).

Las tramas con longitudes superiores a 8186 bytes o que fallen la validación CRC se rechazan avanzando un byte la posición de escaneo para seguir recuperando cualquier trama real pegada inmediatamente tras una trama truncada.

## Negociación de entramado

Para preservar la compatibilidad bidireccional (AGENTS.md §1.3), el entramado se negocia en cada conexión:

1. Mientras se desconoce el entramado del teclado, el anfitrión envía `Hello` (`frame_crc = true`, `he_calibration = true`) cada 400 ms (`HELLO_RETRY`), alternando entre **Marked** (`0xAA, 0x55`) y **Legacy** hasta que el teclado responde.
2. En el primer mensaje decodificado del anfitrión, el teclado fija esa familia de entramado (`s_host_framing`) y responde usando el mismo entramado.
3. Si el anfitrión envió un `Hello` Marked con `frame_crc = true` y el firmware admite tramas comprobadas, el teclado envía `HelloAck` con `frame_crc = true` como trama **Marked** y luego cambia TX a entramado **Checked** (`0xAA, 0x5A` + CRC-16) para todos los mensajes siguientes (`s_tx_crc = true`). Al recibir `HelloAck.frame_crc = true`, el anfitrión también cambia su TX a entramado Checked.
4. Si alguno de los extremos no admite CRC (o si se negoció Legacy), ambos permanecen en Marked o Legacy durante la sesión. Bajar DTR (cerrar el puerto) reinicia el estado de entramado y CRC en el teclado.

## Envolventes de nivel superior

Todos los mensajes del protocolo usan dos envolventes protobuf raíz con un `sequence_number` y un `oneof payload`:

```protobuf
message HostToDevice {
    uint32 sequence_number = 1;
    oneof payload {
        Hello hello = 2;
        SetConfig set_config = 3;
        TimeSync time_sync = 4;
        GameplayDisplayState gameplay_state = 5;
        CounterSyncRequest counter_sync = 6;
        bool request_status = 7;
        HostStatus host_status = 8;
        bool reset_latency_stats = 9;
        DataUpdate data_update = 10;
        SetLayout set_layout = 11;
        uint32 reset_layout = 12;
        bool request_logs = 13;
        ClaimOwnership claim_ownership = 14;
        DetectPinRequest detect_pin = 15;
        bool run_board_test = 16;
        PlayAnimation play_animation = 17;
        bool restart = 18;
        bool start_he_calibration = 19;
        bool cancel_he_calibration = 20;
        bool he_live_view = 21;
    }
}

message DeviceToHost {
    uint32 sequence_number = 1;
    oneof payload {
        HelloAck hello_ack = 2;
        DeviceStatus status = 3;
        ConfigAck config_ack = 4;
        CounterSyncResponse counter_sync_resp = 5;
        LogEventBatch log_batch = 6;
        LayoutAck layout_ack = 7;
        DetectPinResponse detect_pin_resp = 8;
        KeyPressBatch key_presses = 9;
        BoardTestResult board_test = 10;
        HeCalibrationProgress he_calibration_progress = 11;
        HeLiveSample he_live_sample = 12;
    }
}
```

## Catálogo de mensajes del protocolo

### Mensajes de sesión e identidad

- **`Hello` / `HelloAck`**: Apretón de manos que transporta `protocol_version`, `client_version`, `firmware_version`, `board_profile`, `device_id`, generación de contadores y totales de Key 1/2, `owner_id` de 16 bytes, `running_partition` (`ota_0` / `ota_1` / `factory`), `current_config`, `input_module` (`InputModule`), `key_count` y banderas de capacidad (`key_press_times`, `board_test`, `builtin_animations`, `restart`, `he_input`, `he_calibration`, `he_live`, `tap_rate_per_second`, `frame_crc`).
- **`ClaimOwnership`**: Envía un `owner_id` de 16 bytes para emparejar el teclado con una instalación anfitriona en NVS. Solo se atiende en `IDLE` y rechaza IDs vacíos o de ceros.
- **`DeviceStatus`**: Devuelto en respuesta a `request_status = true`. Informa `uptime_seconds`, `state` (`DeviceState`), `brightness`, `display_asleep`, `lifetime_key1`/`2`/`3`, `map_key1`/`2`/`3`, estadísticas de latencia del dispositivo (`latency_samples`, `p50`, `p99`, `p999`, `max`, `hid_deferred_reports`), `display_ok`, `nvs_ok`, `nvs_writes` y `he_calibration` (`HeCalibrationStatus`).
- **`HostStatus`**: Enviado cada 1 segundo y en transiciones de estado para informar al teclado de `tosu_connected`, `playing`, `play_id` (reinicia contadores de pulsaciones de mapa al cambiar) y `osu_active` (si los deslizamientos de volumen actúan sobre osu! o sobre el volumen del sistema).
- **`restart`**: Solicita un reinicio limpio del firmware (`esp_restart`) una vez que el teclado esté en `IDLE` y su imagen OTA esté confirmada; guarda contadores, configuración, diseños y calibración pendientes antes de reiniciar.

### Mensajes de configuración

- **`SetConfig` / `ConfigAck`**: Actualiza ajustes del dispositivo mediante `ConfigPayload` y devuelve estado de éxito, mensaje y `current_config` activa. La persistencia en NVS se difiere hasta `IDLE` si se recibe durante `PLAYING` o `COOLDOWN`.
- **`ConfigPayload`**: Transporta `key1_hid_usage`, `key2_hid_usage`, `debounce_us`, `brightness`, `display_sleep_seconds`, `gameplay_display_hz`, `press_color_rgb` obsoleto, `key1_gpio`, `key2_gpio`, campos por dirección `SwipeAction` / tecla / modificadores (`swipe_{left,right,up,down}_{action,key,modifiers}`), ajustes Hall Effect por tecla (`key1_he`, `key2_he`, `key3_he`), `key3_hid_usage` opcional y máscara de bits `game_keys` opcional.

### Mensajes de juego y pantalla

- **`TimeSync`**: Sincroniza la fecha y hora del teclado (`year`, `month`, `day`, `hour`, `minute`, `second`).
- **`GameplayDisplayState`**: Mensaje heredado de visualización de mapa que transporta `title`, `artist`, `current_pp`, `progress_ratio` (`0.0`–`1.0`), `current_map_presses_k1`/`k2`, `play_id`, `difficulty` y `stars`.
- **`DataUpdate`**: Transmite valores modificados de fuentes de datos de UI (`repeated DataValue values`, hasta 32 por mensaje), cada uno con un ID `source` (`ui_source_t`) y `oneof value { double number; string text; bool clear; }`.
- **`SetLayout` / `LayoutAck`**: Envía un diseño de pantalla personalizado (`screen`, `background` RGB y hasta 32 entradas `UiWidget`) y confirma aceptación o informa errores de validación.
- **`reset_layout`**: Restablece el ID de pantalla indicado (`uint32`) a su diseño predeterminado integrado.
- **`PlayAnimation`**: Reproduce una animación de resultados (ID `animation`: `0` detiene, `1..127` integradas, `128+n` reservadas) con la cadena de calificación (`"SS"`, `"S"`, `"A"`, ...). Se ignora durante un mapa y se detiene inmediatamente al empezar uno.

### Mensajes de calibración y telemetría Hall Effect

- **`HeKeySettings`**: Ajustes por tecla en 0.1% del rango calibrado (`1..1000`): `actuation`, `release_hyst`, `top_reset`, `rt_press`, `rt_release`, `bottom_dead_zone` opcional, `rt_mode` (`HeRtMode`) y `allow_below_noise_floor` opcional.
- **`HeCalibrationStatus`**: Incluido en `DeviceStatus`. Informa banderas de calibración y conteos crudos de reposo/fondo por tecla para Keys 1–3, `is_locked`, `is_calibrating`, `noise_floor_rest` y `noise_floor_movement`.
- **`start_he_calibration` / `cancel_he_calibration`**: Inicia o cancela la calibración interactiva Hall Effect.
- **`HeCalibrationProgress`**: Informa la etapa activa (`HeCalStage`), `key_index` (`1`–`3`, `0` en reposo/inactivo/completo), `presses_done` (`0..5`), `error` (`HeCalError`), `error_message`, `raw_value` en vivo y conteos guardados `key{1,2,3}_{rest,full}` al tener éxito.
- **`he_live_view` / `HeLiveSample`**: Enviar `he_live_view = true` transmite conteos ADC crudos (`key1_raw`, `key2_raw`, `key3_raw`) y estados booleanos pulsados (`key1_down`, `key2_down`, `key3_down`) a ~50 Hz (`HE_LIVE_PERIOD_US = 20000`) durante 2 segundos (`HE_LIVE_KEEPALIVE_US = 2000000`); el anfitrión lo refresca para mantener el flujo y convierte los conteos crudos en recorrido usando `HeCalibrationStatus`. Nunca se transmite durante `PLAYING` ni `COOLDOWN`.

### Mensajes de contadores, diagnóstico de hardware y autoprueba

- **`CounterSyncRequest` / `CounterSyncResponse`**: Reconcilia los conteos de por vida persistentes (`CounterState`, con `lifetime_key3` opcional y bandera `force_restore`) y devuelve el estado sincronizado del teclado.
- **`DetectPinRequest` / `DetectPinResponse`**: Escanea GPIOs candidatos de interruptores durante `timeout_ms` (ignorando `exclude_gpio`) para detectar a qué pin está cableada `key_id`.
- **`run_board_test` / `BoardTestResult`**: Ejecuta la prueba de PCB del carrier y módulo de entrada en `IDLE`: mide tensiones de ID de módulo (`id_mv`, `id_loaded_mv`, `reverse_probe_mv`), informa `boot_module`/`module` (`InputModule`), `cable_reversed`, GPIOs de teclas y máscaras de pull-up/pull-down/puentes, y en Hall Effect V3 incluye `HeAdcTest` (estado de reinicio de ADS7028, recorrido de registros, calibración de offset, barrido de velocidad SCLK con `0xA5A` y 3 ráfagas de canal de sensor).
- **`KeyPress` / `KeyPressBatch`**: Agrupa marcas de tiempo de pulsaciones aceptadas de teclas de juego (`key`, `t_us` en microsegundos del teclado, más `now_us` del lote y conteo `dropped`) durante `HostStatus.playing` para el cálculo preciso del ritmo KPM.
- **`reset_latency_stats`**: Borra el histograma de latencia flanco-a-HID y el contador de reportes diferidos en el teclado.
- **`request_logs` / `LogEvent` / `LogEventBatch`**: Vacía eventos del búfer circular de diagnóstico (hasta 8 por lote) del teclado al daemon.

## Límites de búfer y campos en Nanopb

Los límites fijos de cadenas, bytes y arreglos repetidos se definen en `protocol/opad.options`:

| Campo | Tamaño máximo / Límite | Tipo de asignación |
|---|---|---|
| `Hello.client_version` | 32 bytes | Cadena fija |
| `HelloAck.firmware_version` | 32 bytes | Cadena fija |
| `HelloAck.board_profile` | 32 bytes | Cadena fija |
| `HelloAck.device_id` | 32 bytes | Cadena fija |
| `HelloAck.owner_id` | 16 bytes | Arreglo fijo de bytes (`bytes`) |
| `HelloAck.running_partition` | 17 bytes | Cadena fija |
| `ClaimOwnership.owner_id` | 16 bytes | Arreglo fijo de bytes (`bytes`) |
| `ConfigAck.message` | 64 bytes | Cadena fija |
| `GameplayDisplayState.title` | 64 bytes | Cadena fija |
| `GameplayDisplayState.artist` | 64 bytes | Cadena fija |
| `GameplayDisplayState.difficulty` | 32 bytes | Cadena fija |
| `DataValue.text` | 64 bytes | Cadena fija |
| `DataUpdate.values` | 32 elementos | Mensaje repetido |
| `UiWidget.label` | 32 bytes | Cadena fija |
| `UiWidget.suffix` | 12 bytes | Cadena fija |
| `SetLayout.widgets` | 32 elementos | Mensaje repetido |
| `LayoutAck.message` | 64 bytes | Cadena fija |
| `PlayAnimation.grade` | 4 bytes | Cadena fija |
| `CounterState.device_id` | 32 bytes | Cadena fija |
| `CounterSyncResponse.message` | 64 bytes | Cadena fija |
| `LogEvent.tag` | 16 bytes | Cadena fija |
| `LogEvent.message` | 64 bytes | Cadena fija |
| `LogEventBatch.events` | 8 elementos | Mensaje repetido |
| `KeyPressBatch.presses` | 32 elementos | Mensaje repetido |
| `BoardTestResult.message` | 64 bytes | Cadena fija |
| `HeAdcTest.message` | 48 bytes | Cadena fija |
| `HeAdcTest.speeds` | 6 elementos | Mensaje repetido |
| `HeAdcTest.channels` | 3 elementos | Mensaje repetido |
| `HeCalibrationProgress.error_message` | 48 bytes | Cadena fija |

Estos límites estáticos permiten al firmware del ESP32-S3 codificar y decodificar mensajes protobuf sin asignación dinámica en el heap.
