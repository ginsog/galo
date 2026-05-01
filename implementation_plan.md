# Plan de Implementación: Sitio Web Galo

Este documento detalla el plan para desarrollar el sitio web estático para Galo. El objetivo es construir una interfaz moderna, sencilla, responsiva y sin necesidad de base de datos, estructurada con un encabezado, un menú lateral, un área de contenido dinámico y un pie de página.

## Revisión del Usuario Requerida

> [!IMPORTANT]
> **Contenido de Textos**: Los textos específicos para las páginas de Servicios y Proyectos se encuentran en el archivo `Galo.docx`. Dado que no puedo leer automáticamente archivos `.docx`, durante la etapa de ejecución necesitaré que me proporciones el contenido de este documento (copiando y pegando el texto) o bien utilizaré textos de relleno (Lorem Ipsum) que luego podrás reemplazar.
>
> **Navegación (SPA vs Múltiples HTML)**: Al tener un menú lateral que cambia el contenido contiguo, la mejor forma de dar una experiencia fluida (sin recargar la página entera) es hacer una "Single Page Application" (SPA) simple usando Vanilla JavaScript, ocultando y mostrando secciones. Si prefieres archivos HTML separados por cada página (`index.html`, `servicios.html`, etc.), indícalo por favor.

## Preguntas Abiertas

> [!TIP]
> 1. **Colores de la Marca**: ¿Hay alguna paleta de colores preferida o debo extraer los colores basándome en el archivo `logo galo.png`?
> 2. **Formulario de Contacto**: Para la sección "Contactos", al no tener base de datos ni backend, ¿deseas que el formulario envíe un correo usando algún servicio gratuito de terceros (como Formspree) o simplemente mostrar la información de contacto (teléfono, email, dirección)?

## Cambios Propuestos

### 1. Estructura Base y Estilos (HTML/CSS)
- **Diseño General**: Uso de CSS Grid / Flexbox para la disposición principal (Header superior, Menú izquierdo, Contenido a la derecha, Footer inferior).
- **Responsive Design**: Se implementarán *Media Queries* para que en dispositivos móviles el menú lateral se conviorte en un menú hamburguesa desplegable y el contenido ocupe el 100% del ancho.
- **Estética Moderna**: Implementación de tipografías legibles (Google Fonts), bordes redondeados, sombras suaves, y micro-animaciones (efectos *hover* en los botones y enlaces del menú).

### 2. Archivos a Crear

#### [NEW] `index.html` (en `c:\desarrollo\worspaceAntigravity\Galo\`)
Archivo principal que contendrá el esqueleto (Header, Menú lateral, Footer) y los contenedores de las secciones:
- **Header**: Logotipo `logo galo.png` en la esquina superior izquierda.
- **Menú Lateral**: Enlaces a Inicio, Servicios, Proyectos (con un submenú desplegable para los 3 proyectos) y Contactos.
- **Contenido**: Contenedores para cada vista que se mostrarán u ocultarán según el menú.

#### [NEW] `styles.css` (en `c:\desarrollo\worspaceAntigravity\Galo\`)
Contendrá todas las reglas de estilo (colores, tipografía, layouts y responsividad).

#### [NEW] `app.js` (en `c:\desarrollo\worspaceAntigravity\Galo\`)
Script muy ligero en Vanilla JavaScript para:
- Manejar la apertura y cierre del menú en móviles.
- Navegar entre las diferentes secciones (Inicio, Servicios, Proyectos, Contactos) sin recargar la página entera.
- Desplegar el submenú de "Proyectos".

### 3. Vistas de Contenido

- **Inicio**: Presentación principal usando la imagen `inicio.jpg` y el texto introductorio.
- **Servicios**: Lista descriptiva de los servicios extraída de `Galo.docx`. Se puede integrar la imagen `img-servicios.jpg`.
- **Proyectos (Submenú)**: 
  - *Nissan*: Descripción y uso de `nissan.jpg`.
  - *Ford Junin Montanari*: Descripción y uso de `montanari.jpg`.
  - *Fábrica Indelplas*: Descripción y uso de `indelplas.jpg`.
- **Contactos**: Datos de contacto y opcionalmente un formulario visual.

## Plan de Verificación

### Verificación Manual
- Abrir `index.html` en un navegador web de escritorio para comprobar el layout completo (Header, Menú Izquierdo, Footer).
- Probar la interactividad del menú lateral y el cambio de contenido.
- Redimensionar la ventana del navegador a un ancho menor (ej. 768px o usar DevTools simulando un móvil) para verificar que el layout se adapta, el menú izquierdo desaparece y se habilita el botón tipo hamburguesa.
- Comprobar que todas las imágenes (`inicio.jpg`, `logo galo.png`, `nissan.jpg`, etc.) cargan correctamente.
