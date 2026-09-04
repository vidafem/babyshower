# Carpeta de Tipografías (Fonts)

Coloca aquí tus fuentes descargadas en formatos modernos como:
- `.woff2` (Recomendado por su ligereza y compatibilidad)
- `.woff`
- `.ttf` o `.otf`

### ¿Cómo usarlas en tu web?
En `css/style.css` encontrarás la sección `@font-face` comentada lista para descomentar con el nombre de tu fuente:

```css
@font-face {
  font-family: 'MiFuentePersonalizada';
  src: url('../assets/fonts/mi-fuente.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
```
Por defecto, la plantilla ya incluye tipografías elegantes de Google Fonts (Playfair Display, Montserrat y Cormorant Garamond) para que se vea hermosa desde el primer instante sin necesidad de instalar nada.
