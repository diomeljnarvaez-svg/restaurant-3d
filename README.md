# 🍽️ Restaurant 3D — Sitio web para restaurantes

Sitio web completo y moderno para restaurantes: menú digital, reservaciones, panel de administración, programa de fidelidad, PWA, notificaciones push y soporte multi-idioma (ES/EN).

> Proyecto de demostración listo para personalizar y presentar a clientes.

**Demo:** https://restaurant-3d-two.vercel.app

---

## ✨ Características

- **Landing page** con hero animado, platos destacados, historia, testimonios e Instagram simulado.
- **Menú digital** con categorías, filtros, badges dietéticos automáticos, lightbox de imágenes y pedidos por WhatsApp.
- **Reservaciones** con formulario público y gestión desde el panel (pendiente / confirmada / cancelada).
- **Panel de administración** con dashboard, CRUD de productos, reservaciones, analytics, fidelidad, usuarios y configuración visual del sitio.
- **Personalización total** de colores, textos, contacto, redes sociales y WhatsApp desde `/admin/settings`.
- **PWA instalable** con service worker, página offline y prompt de instalación.
- **Notificaciones push** y suscripción de dispositivos.
- **Multi-idioma** Español / Inglés con persistencia en `localStorage`.
- **SEO** con metadatos dinámicos, `sitemap.xml`, `robots.txt` y Schema.org (`LocalBusiness`).
- **Códigos QR** para el menú y cada plato.
- **Chatbot** flotante basado en palabras clave.

---

## 🧰 Stack

| Tecnología | Uso |
|---|---|
| [Next.js 16](https://nextjs.org) (App Router, Turbopack) | Framework |
| React 19 + TypeScript | UI |
| Tailwind CSS 4 | Estilos |
| NextAuth v5 (Credentials) + bcryptjs | Autenticación |
| Neon Postgres (`@neondatabase/serverless`) | Persistencia |
| Three.js / React Three Fiber | Efectos 3D |
| qrcode | Generación de QR |

---

## 🚀 Puesta en marcha

### Requisitos

- Node.js 20+ (recomendado 24)
- Una base de datos PostgreSQL (se usa [Neon](https://neon.tech); el plan gratuito es suficiente)

### Instalación

```bash
npm install
```

### Variables de entorno

Creá un archivo `.env.local` en la raíz:

```env
NEXTAUTH_SECRET=una-cadena-larga-y-secreta
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL=postgresql://usuario:password@host/db?sslmode=require
```

- **`DATABASE_URL`** — si está definida, la app guarda todo en Postgres (recomendado para producción). Si no, usa los JSON de `src/data/` (solo desarrollo local).
- **`NEXTAUTH_SECRET`** — obligatorio en producción. Generá uno con `openssl rand -base64 32`.
- **`NEXTAUTH_URL`** — URL pública del sitio en producción.

### Desarrollo

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

### Producción

```bash
npm run build
npm start
```

---

## 📜 Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm start` | Servidor de producción |
| `npm run lint` | ESLint |
| `npm run db:seed` | Carga los JSON de `src/data/` en la base de datos (hashea contraseñas) |
| `npm run db:reset-demo` | **Respalda** los datos actuales y restaura la demo por defecto |

`db:reset-demo` guarda una copia en `backups/<fecha>/` antes de sobrescribir.

---

## 🔑 Credenciales demo

| Rol | Email | Contraseña |
|---|---|---|
| Superadmin | `admin@restaurant.com` | `admin123` |
| Editor | `editor@restaurant.com` | `editor123` |

> Cambiá estas credenciales antes de usar el sitio en producción.

---

## 🗂️ Estructura

```
src/
├── app/
│   ├── page.tsx              # Landing
│   ├── menu/                 # Menú y detalle de producto
│   ├── reservar/             # Formulario de reservación
│   ├── about/ · contact/     # Páginas informativas
│   ├── login/                # Inicio de sesión
│   ├── admin/                # Panel de administración
│   └── api/                  # Endpoints REST
├── components/               # Header, Footer, ChatBot, Hero3D, QR, PWA…
├── lib/
│   ├── db.ts                 # Capa de datos (Neon / JSON)
│   ├── auth.ts               # Configuración NextAuth
│   ├── types.ts              # Tipos y settings por defecto
│   ├── dietary.ts            # Badges dietéticos
│   └── i18n/                 # Traducciones ES/EN
└── data/                     # Datos semilla en JSON
scripts/
├── seed.mjs                  # Sube los JSON a Neon
└── reset-demo.mjs            # Respaldo + reset a la demo
```

---

## ☁️ Despliegue en Vercel

El proyecto está conectado a GitHub: cada push a `main` despliega automáticamente en Vercel.

1. Importá el repositorio en [Vercel](https://vercel.com/new).
2. Configurá `DATABASE_URL`, `NEXTAUTH_SECRET` y `NEXTAUTH_URL` en **Settings → Environment Variables**.
3. Desplegá. La tabla `kv_store` se crea sola en el primer acceso.
4. Ejecutá `npm run db:seed` (o `npm run db:reset-demo`) apuntando a la base de producción para cargar los datos iniciales.

---

## 📄 Documentación

- [Manual de usuario completo](docs/MANUAL.md)

---

## 📝 Licencia

Proyecto privado de demostración. Todos los derechos reservados.
