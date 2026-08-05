# Manual de Usuario — Savory Restaurant Web

Plataforma web moderna para restaurantes con menú interactivo, reservaciones, panel administrativo y PWA.

---

## 1. Introducción

Este sistema permite gestionar la presencia digital de un restaurante: catálogo de productos, reservaciones, contenido del sitio, colores, fidelización, analytics, chatbot, notificaciones push, PWA e idioma. Los datos se almacenan en archivos JSON dentro de `src/data/` — no requiere base de datos.

---

## 2. Primeros Pasos

### 2.1 Iniciar el servidor de desarrollo

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

### 2.2 Poblar datos de ejemplo

El proyecto se siembra automáticamente al iniciar. Si necesitas reiniciar los datos:

```bash
npx tsx src/lib/seed.ts
```

### 2.3 Construir para producción

```bash
npm run build
npm start
```

---

## 3. Credenciales de Acceso

| Rol        | Email                  | Contraseña |
|------------|------------------------|------------|
| Superadmin | admin@restaurant.com    | admin123   |
| Editor     | editor@restaurant.com   | editor123  |

**Roles disponibles:**
- **superadmin** — acceso completo, incluyendo gestión de usuarios
- **admin** — puede gestionar productos, reservaciones, configuración y contenido
- **editor** — solo productos y reservaciones
- **user** — acceso básico de solo lectura

---

## 4. Sitio Público

### 4.1 Landing Page (`/`)
- **Hero 3D interactivo** con partículas tipo galaxia (Canvas 2D, sin Three.js)
- Menú destacado (productos con `featured: true`)
- Vista previa "Sobre Nosotros"
- Testimonios ficticios
- Llamado a la acción (CTA) para reservar
- **Feed de Instagram** simulado (6 imágenes estáticas)
- **Botón de suscripción a notificaciones Push**

### 4.2 Menú (`/menu`)
- Todos los productos del restaurante en cuadrícula
- **Badges dietéticos automáticos**: se detectan palabras clave en el nombre/descripción del plato (Vegano, Sin Gluten, Sin Lactosa, Picante, Orgánico, Sin Azúcar)
- **Lightbox de imágenes**: click en cualquier foto para verla en pantalla completa
- Botón "Ordenar por WhatsApp" por cada producto
- **Código QR** del menú en la esquina superior derecha
- Enlace a detalle individual

### 4.3 Detalle de Producto (`/menu/[slug]`)
- Información completa del plato
- Lightbox para la imagen
- Badges dietéticos
- Botón "Ordenar" vía WhatsApp
- Código QR de la página

### 4.4 Sobre Nosotros (`/about`)
- Historia del restaurante (configurable desde admin)
- Estilos dinámicos según la configuración de colores

### 4.5 Contacto (`/contact`)
- Dirección, teléfono, email, horario
- Mapa embebido de Google Maps
- Botones WhatsApp, **Google Maps** y **Waze** para navegación
- Footer con datos de contacto, horario, redes sociales y botones de navegación

### 4.6 Reservar (`/reservar`)
- Formulario: nombre, email, teléfono, fecha, hora, número de invitados, notas
- Validaciones básicas
- Las nuevas reservaciones aparecen como `pending` en el panel de admin

### 4.7 ChatBot (`/`)
- Botón flotante en la esquina **inferior izquierda** en todas las páginas
- Asistente virtual basado en palabras clave:
  - Horario, dirección, teléfono
  - Recomendación de productos destacados
  - Ayuda con reservaciones
  - Consulta por categorías del menú
  - Respuesta genérica + enlace a WhatsApp si no entiende

---

## 5. Panel de Administración (`/admin`)

Acceso protegido por autenticación. Requiere iniciar sesión en `/login`.

### 5.1 Barra lateral (navegación)

En escritorio se muestra siempre visible. En **móvil** se convierte en un **drawer deslizable** con un botón hamburguesa en la parte superior.

**Secciones:**
- **Dashboard** — resumen con enlaces rápidos
- **Productos** — CRUD completo del menú
- **Reservaciones** — administrar solicitudes
- **Analytics** — gráficos y estadísticas
- **Fidelidad** — programa de puntos para clientes
- **Usuarios** — solo superadmin, gestión de cuentas
- **Configuración** — personalización del sitio

### 5.2 Productos (`/admin/products`)

Lista con buscador, botones Editar/Eliminar y "Añadir Producto".

Campos del producto:
- **Nombre** — texto
- **Slug** — URL amigable, se genera automáticamente desde el nombre
- **Descripción** — texto del plato
- **Precio** — número (se mostrará formateado ejemplo: $12.50)
- **Imagen** — URL de la imagen
- **Categoría** — texto libre (ej: Entradas, Platos Fuertes, Postres, Bebidas)
- **Destacado** — checkbox para mostrar en landing
- **Disponible** — checkbox para ocultar del menú público

### 5.3 Reservaciones (`/admin/reservations`)

Tabla con todas las solicitudes. Acciones:
- **Confirmar** — cambia el estado a `confirmed`
- **Cancelar** — cambia el estado a `cancelled`
- **Eliminar** — borra la reservación

### 5.4 Analíticas (`/admin/analytics`)

Panel con:
- **Tarjetas resumen**: total de productos, productos destacados, productos disponibles, total de reservaciones
- **Gráfico de barras**: productos por precio
- **Distribución de reservaciones**: barras apiladas por estado (pendiente/confirmada/cancelada)
- **Productos destacados vs normales**: barra comparativa
- **Disponibilidad**: productos disponibles vs no disponibles

### 5.5 Fidelidad (`/admin/loyalty`)

Programa de puntos para clientes recurrentes.

Acciones:
- **Lista de clientes** con email, nombre, puntos y visitas totales
- **Editar** — modal para modificar puntos y visitas de un cliente
- **Eliminar** — borrar cliente del programa
- **Tarjetas resumen**: total clientes, total puntos acumulados, promedio de puntos

### 5.6 Usuarios (`/admin/users`)

Solo visible para superadmin. CRUD completo de cuentas del sistema.
Campos: nombre, email, contraseña, rol (superadmin/admin/editor/user).

### 5.7 Configuración (`/admin/settings`)

Formulario único con todas las opciones del sitio. Botón "Guardar Cambios" al final.

#### 5.7.1 Identidad del Sitio
- **Nombre del Sitio** — aparece en el header, footer y SEO
- **Descripción** — meta description
- **Logo** — subida de imagen (se almacena como base64 en el archivo de configuración)

#### 5.7.2 Personalización de Colores

8 áreas configurables con 14 colores predefinidos cada una + selector **hexadecimal** manual:

| Área | Propósito |
|------|-----------|
| Color Principal | Botones, acentos, enlaces |
| Color Secundario | Acentos decorativos |
| Fondo del Hero | Sección principal de bienvenida |
| Fondo de Página | Color de fondo general |
| Fondo de Tarjetas | Cards, contenedores, secciones |
| Fondo del Footer | Pie de página |
| Texto Principal | Títulos y texto principal |
| Texto Secundario | Descripciones y subtítulos |

Cada campo tiene un botón **↺** para restablecer el valor por defecto individualmente. Botón **"Restablecer todos los colores"** al final.

#### 5.7.3 Sección Hero
- Título principal del landing
- Subtítulo del hero

#### 5.7.4 Sección Sobre Nosotros
- Título de la sección
- Contenido / historia del restaurante

#### 5.7.5 Información de Contacto
- Dirección, teléfono, email, horario laboral

#### 5.7.6 Redes Sociales
- Facebook, Instagram, Twitter (URLs completas)

#### 5.7.7 WhatsApp
- Número de teléfono (con código de país)
- Mensaje predeterminado para el botón "Ordenar" y el CTA

#### 5.7.8 Reservaciones
- **Habilitar/Deshabilitar** reservaciones
- Máximo de invitados por reservación
- Aviso / nota informativa

#### 5.7.9 Código QR del Menú
- Genera un QR basado en la URL del menú (`/menu`)
- Botón **"Descargar QR"** para guardar la imagen PNG

---

## 6. Funcionalidades Avanzadas

### 6.1 PWA (Progressive Web App)

El sitio es instalable como una aplicación en dispositivos móviles y de escritorio.

**Características:**
- **manifest.json** con íconos SVG de 192×192 y 512×512
- **Service Worker** (`sw.js`): cachea recursos estáticos y páginas para funcionar offline
- **Página offline** (`/offline`) con mensaje amigable
- **Prompt de instalación**: al cargar la página por primera vez, se muestra un botón para instalar la app

### 6.2 Notificaciones Push

- **Suscripción**: el componente `PushSubscribe` en el landing solicita permiso al usuario y registra el dispositivo
- **API endpoint** `POST /api/push/subscribe` para almacenar suscripciones
- **Service Worker** maneja los eventos `push` (muestra notificación) y `notificationclick` (abre el sitio al hacer click)
- Las suscripciones se guardan en `src/data/push-subscriptions.json`

### 6.3 Multi-idioma (i18n)

El sitio soporta **Español** e **Inglés**.

- Selector de idioma en el **Header** (botón ES/EN)
- El idioma se guarda en `localStorage` y persiste entre sesiones
- Textos traducidos: landing, header, navegación, CTA, chatbot, etc.
- Archivos de traducción: `src/lib/i18n/es.json` y `src/lib/i18n/en.json`

Para agregar un nuevo idioma:
1. Crear archivo en `src/lib/i18n/<codigo>.json` con las mismas claves
2. Agregar el código al array `locales` en `src/lib/i18n/index.tsx`

### 6.4 SEO y Schema

- **Meta tags dinámicos** por página vía `generateMetadata` de Next.js
- **Sitemap XML** en `/sitemap.xml` — lista todas las rutas públicas
- **Robots.txt** en `/robots.txt` — permite rastreo completo
- **Schema.org JSON-LD** tipo `LocalBusiness` inyectado en todas las páginas, con nombre, dirección, teléfono, horario y redes sociales

### 6.5 Códigos QR

Cada página de menú (lista y detalle) muestra un código QR generado con la librería `qrcode`. El QR enlaza a la URL actual para compartir fácilmente.

### 6.6 Badges Dietéticos Automáticos

El componente `detectDietaryBadges()` en `src/lib/dietary.ts` analiza el nombre y la descripción de cada producto buscando palabras clave y asigna badges visuales:
- **Vegano** — palabras clave: vegano, vegan, vegetal, plant-based
- **Sin Gluten** — palabras clave: sin gluten, gluten-free, gluten free
- **Sin Lactosa** — palabras clave: sin lactosa, lactose-free, lactose free
- **Picante** — palabras clave: picante, spicy, chili
- **Orgánico** — palabras clave: orgánico, organic, natural
- **Sin Azúcar** — palabras clave: sin azúcar, sugar-free, sugar free

### 6.7 Google Maps y Waze

Botones en la página de contacto y en el footer que abren la navegación paso a paso en Google Maps o Waze con la dirección del restaurante.

---

## 7. Estructura del Proyecto

```
restaurant-3d/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing
│   │   ├── layout.tsx            # Layout global (Schema, PWA, ChatBot)
│   │   ├── about/page.tsx        # Sobre Nosotros
│   │   ├── contact/page.tsx      # Contacto
│   │   ├── reservar/page.tsx     # Formulario de reservación
│   │   ├── menu/
│   │   │   ├── page.tsx          # Lista del menú
│   │   │   └── [slug]/page.tsx   # Detalle del producto
│   │   ├── offline/page.tsx      # Página offline PWA
│   │   ├── login/page.tsx        # Inicio de sesión
│   │   ├── admin/
│   │   │   ├── layout.tsx        # Layout admin (sidebar/header móvil)
│   │   │   ├── page.tsx          # Dashboard
│   │   │   ├── products/         # CRUD productos
│   │   │   ├── reservations/     # Gestión reservaciones
│   │   │   ├── analytics/        # Estadísticas y gráficos
│   │   │   ├── loyalty/          # Programa de fidelidad
│   │   │   ├── users/            # Gestión usuarios (superadmin)
│   │   │   └── settings/         # Configuración del sitio
│   │   ├── api/                  # Rutas API (REST)
│   │   ├── robots.txt/route.ts   # SEO
│   │   └── sitemap.xml/route.ts  # SEO
│   ├── components/
│   │   ├── Header.tsx            # Header con logo e idioma
│   │   ├── Footer.tsx            # Footer con contacto, redes, mapas
│   │   ├── AdminSidebar.tsx      # Sidebar/drawer del admin
│   │   ├── ChatBot.tsx           # Asistente virtual
│   │   ├── ImageLightbox.tsx     # Visor de imágenes fullscreen
│   │   ├── QRCodeDisplay.tsx     # Generador de códigos QR
│   │   ├── WhatsAppButton.tsx    # Botón flotante de WhatsApp
│   │   ├── InstagramFeed.tsx     # Feed simulado de Instagram
│   │   ├── PushSubscribe.tsx     # Suscripción a notificaciones push
│   │   ├── PWAInstallPrompt.tsx  # Prompt de instalación PWA
│   │   ├── SchemaScript.tsx      # Schema.org JSON-LD
│   │   ├── ServiceWorkerRegister.tsx  # Registro de SW
│   │   ├── LanguageSwitcher.tsx  # Selector ES/EN
│   │   └── MapLinks.tsx          # Botones Google Maps / Waze
│   ├── lib/
│   │   ├── types.ts              # Interfaces y defaultSettings
│   │   ├── db.ts                 # Helpers JSON CRUD
│   │   ├── auth.ts               # NextAuth configuración
│   │   ├── seed.ts               # Poblado de datos iniciales
│   │   ├── dietary.ts            # Detección de badges dietéticos
│   │   └── i18n/                 # Sistema multi-idioma
│   │       ├── es.json
│   │       ├── en.json
│   │       └── index.tsx         # I18nProvider + useTranslations
│   └── data/                     # Archivos JSON (persistencia)
│       ├── products.json
│       ├── users.json
│       ├── reservations.json
│       ├── loyalty.json
│       ├── push-subscriptions.json
│       └── settings.json
└── public/
    ├── sw.js                     # Service Worker
    ├── manifest.json             # PWA manifest
    ├── icon-192.svg
    └── icon-512.svg
```

---

## 8. API Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/register` | Registrar nuevo usuario |
| POST | `/api/auth/[...nextauth]` | Autenticación NextAuth |
| GET | `/api/products` | Obtener todos los productos |
| POST | `/api/products` | Crear producto |
| GET | `/api/products/[id]` | Obtener producto por ID |
| PUT | `/api/products/[id]` | Actualizar producto |
| DELETE | `/api/products/[id]` | Eliminar producto |
| GET | `/api/reservations` | Obtener reservaciones |
| POST | `/api/reservations` | Crear reservación |
| PUT | `/api/reservations/[id]` | Cambiar estado de reservación |
| DELETE | `/api/reservations/[id]` | Eliminar reservación |
| GET | `/api/users` | Obtener usuarios |
| POST | `/api/users` | Crear usuario |
| PUT | `/api/users/[id]` | Actualizar usuario |
| DELETE | `/api/users/[id]` | Eliminar usuario |
| GET | `/api/settings` | Obtener configuración |
| PUT | `/api/settings` | Guardar configuración |
| GET | `/api/loyalty` | Obtener clientes fidelidad |
| PUT | `/api/loyalty` | Actualizar cliente fidelidad |
| DELETE | `/api/loyalty` | Eliminar cliente fidelidad |
| POST | `/api/push/subscribe` | Suscribir a notificaciones push |
| DELETE | `/api/push/subscribe` | Cancelar suscripción push |
| GET | `/api/push/subscribe` | Listar suscripciones |

---

## 9. Personalización de Colores — Referencia Visual

| Color | Preview | Hex |
|-------|---------|-----|
| Púrpura | ██ | `#8B5CF6` |
| Rojo | ██ | `#EF4444` |
| Naranja | ██ | `#F97316` |
| Verde | ██ | `#10B981` |
| Azul | ██ | `#3B82F6` |
| Rosa | ██ | `#EC4899` |
| Amarillo | ██ | `#EAB308` |
| Turquesa | ██ | `#14B8A6` |
| Negro | ██ | `#000000` |
| Blanco | ██ | `#FFFFFF` |
| Gris Oscuro | ██ | `#0a0a0a` |
| Gris | ██ | `#1a1a2e` |
| Azul Noche | ██ | `#0f0f23` |
| Gris Claro | ██ | `#f3f4f6` |

Valores por defecto: `primaryColor: #8B5CF6`, fondo oscuro (`#000000`), texto blanco.

---

## 10. Solución de Problemas

**El sitio no carga datos**
- Verificar que `npm run dev` o `npm start` esté corriendo
- Revisar que los archivos en `src/data/` existan y tengan formato JSON válido

**No puedo iniciar sesión**
- Usar las credenciales de seed (admin@restaurant.com / admin123)
- Si se modificaron los usuarios, verificar `src/data/users.json`

**Los cambios de configuración no se ven**
- Hacer click en "Guardar Cambios" en la página de configuración
- Recargar la página pública

**Error de compilación**
- Ejecutar `npm run build` y leer el mensaje de error
- Verificar que no haya caracteres especiales en los archivos JSON

**Las imágenes no cargan**
- El logo debe subirse desde la configuración (se guarda como base64)
- Las imágenes de productos deben ser URLs públicas accesibles

**El QR no se genera**
- Asegurar que la librería `qrcode` esté instalada: `npm install qrcode`

**Las notificaciones push no funcionan**
- El sitio debe estar servido con HTTPS (o localhost)
- El navegador debe soportar la API de Push Notifications
- Verificar que el Service Worker esté registrado (consola del navegador)

---

## 11. Despliegue

### Vercel (recomendado)

```bash
npm install -g vercel
vercel
```

Configurar variable de entorno `NEXTAUTH_SECRET` en el panel de Vercel.

### Servidor Node.js

```bash
npm run build
npm start
```

El servidor corre en el puerto 3000 por defecto. Configurar `PORT=8080 npm start` para cambiar.

---

*Documentación generada para Savory Restaurant Web v1.0*
