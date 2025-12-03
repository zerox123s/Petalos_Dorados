# 🌸 Florería CMS

<div align="center">

![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)

**Plataforma E-commerce & Panel Administrativo**

Sistema de gestión de contenido (CMS) y comercio electrónico semi-estático diseñado para negocios de floristería. La arquitectura separa la vista del cliente (optimizada para velocidad y conversión) del panel de administración (protegido y funcional), utilizando servicios en la nube para la persistencia de datos y almacenamiento de medios.

[Demo en Vivo](#) • [Reportar Bug](#) • [Solicitar Funcionalidad](#)

</div>

---

## 📸 Vistas Previas

### Landing Page (Cliente)
<div align="center">
  <img src="./screenshots/landing-page.png" alt="Landing Page" width="800"/>
  <p><i>Interfaz de usuario responsiva y optimizada para conversión</i></p>
</div>

### Panel Administrativo
<div align="center">
  <img src="./screenshots/admin-dashboard.png" alt="Admin Dashboard" width="800"/>
  <p><i>Gestión completa de inventario y configuración del negocio</i></p>
</div>

---

## ✨ Funcionalidades

### 🛍️ Frontend (Cliente)

- **Diseño Responsivo**: Interfaz adaptativa implementada con Tailwind CSS para dispositivos móviles y escritorio
- **Navegación SPA**: Transiciones fluidas entre secciones (Inicio, Catálogo, Nosotros) utilizando React Router
- **Filtrado Dinámico**: Clasificación de productos por categorías en tiempo real sin recargas de página
- **Integración WhatsApp**: Sistema de pedidos simplificado que genera enlaces directos a la API de WhatsApp con el detalle del producto
- **Gestión de Estado Visual**: Indicadores visuales para productos sin stock (escala de grises, deshabilitación de interacciones)

### 🔐 Backend & Administración (Dashboard)

- **Autenticación**: Sistema de login seguro gestionado por Supabase Auth
- **CRUD de Productos**: Interfaz para crear, leer, actualizar y eliminar productos del inventario
- **Gestión de Medios**: Carga y optimización automática de imágenes mediante la API de Cloudinary
- **Configuración Global**: Modificación de variables del negocio (Nombre, Teléfono, Mensajes) persistente en base de datos
- **Seguridad**: Implementación de Row Level Security (RLS) en PostgreSQL para proteger la integridad de los datos

---

## 🛠️ Stack Tecnológico

| Categoría | Tecnología |
|-----------|-----------|
| **Frontend** | React 18, Vite |
| **Estilos** | Tailwind CSS, Lucide React |
| **Base de Datos** | PostgreSQL (Supabase) |
| **Almacenamiento** | Cloudinary |
| **Notificaciones** | React Hot Toast |
| **Enrutamiento** | React Router DOM v6 |
| **Autenticación** | Supabase Auth |

---

## 🚀 Instalación y Configuración Local

### Requisitos Previos

- Node.js (v16 o superior)
- npm o yarn
- Cuenta en [Supabase](https://supabase.com)
- Cuenta en [Cloudinary](https://cloudinary.com)

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/floreria-cms.git
cd floreria-cms
```

### 2️⃣ Instalar dependencias

```bash
npm install
```

### 3️⃣ Configuración de Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_PRESET=your_upload_preset
```

### 4️⃣ Configuración de Base de Datos

Ejecutar el script SQL de inicialización en la consola SQL de Supabase:

```sql
-- Crear tabla de negocio
CREATE TABLE negocio (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  telefono TEXT NOT NULL,
  mensaje_bienvenida TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Crear tabla de categorías
CREATE TABLE categorias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Crear tabla de productos
CREATE TABLE productos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  imagen_url TEXT,
  categoria_id UUID REFERENCES categorias(id),
  stock BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE negocio ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad (ejemplo básico)
CREATE POLICY "Permitir lectura pública" ON productos FOR SELECT USING (true);
CREATE POLICY "Permitir escritura autenticada" ON productos FOR ALL USING (auth.role() = 'authenticated');
```

### 5️⃣ Ejecución

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

---

## 📁 Estructura del Proyecto

```
floreria-cms/
│
├── src/
│   ├── components/         # Componentes reutilizables
│   │   ├── Navbar.jsx
│   │   ├── Modal.jsx
│   │   ├── ProductCard.jsx
│   │   └── ...
│   │
│   ├── pages/              # Vistas de la aplicación
│   │   ├── Home.jsx
│   │   ├── Catalogo.jsx
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   └── ...
│   │
│   ├── services/           # Servicios e integraciones
│   │   ├── supabase.js
│   │   └── uploadImage.js
│   │
│   ├── App.jsx             # Configuración de rutas
│   └── main.jsx            # Punto de entrada
│
├── public/                 # Archivos estáticos
├── .env.example            # Ejemplo de variables de entorno
├── package.json
└── README.md
```

---

## 🔒 Seguridad

- **Row Level Security (RLS)**: Todas las tablas utilizan políticas de seguridad a nivel de fila
- **Autenticación JWT**: Tokens seguros gestionados por Supabase Auth
- **Variables de Entorno**: Credenciales sensibles almacenadas de forma segura
- **Validación de Inputs**: Sanitización de datos en formularios

---

## 🤝 Contribución

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📝 Licencia

Distribuido bajo la licencia MIT. Consulte el archivo `LICENSE` para más información.

---

## 👤 Autor

**Tu Nombre**

- GitHub: [@tu-usuario](https://github.com/tu-usuario)
- LinkedIn: [Tu Perfil](https://linkedin.com/in/tu-perfil)

---

## 🙏 Agradecimientos

- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/)
- [Cloudinary](https://cloudinary.com/)
- [Lucide Icons](https://lucide.dev/)

---

<div align="center">

**⭐ Si este proyecto te fue útil, considera darle una estrella ⭐**

</div>
