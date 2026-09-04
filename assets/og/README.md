# Miniatura para WhatsApp y Redes Sociales (Open Graph)

Aquí se encuentra el archivo `preview.jpg` que WhatsApp, Facebook, iMessage, Telegram y Twitter muestran cuando compartes el enlace de tu invitación en un chat.

### Especificaciones técnicas exactas para WhatsApp:
1. **Dimensiones recomendadas**: 1200 x 630 píxeles (proporción 1.91:1) o 600 x 315 píxeles.
2. **Peso del archivo**: Menor a 300 KB (WhatsApp descarta las miniaturas si la imagen pesa demasiado para ahorrar datos).
3. **Formato**: `.jpg` o `.png`.
4. **Protocolo HTTPS**: Cuando subas tu web a Vercel, debe tener el dominio final con `https://` en la etiqueta `<meta property="og:image" content="https://tu-dominio.vercel.app/assets/og/preview.jpg">` en el archivo `index.html`.

### ¿Cómo actualizar la vista previa en WhatsApp si la cambias después?
WhatsApp guarda en caché la primera vez que lee un enlace. Si cambias la imagen y quieres que se actualice de inmediato:
- Pega tu link en el depurador oficial de Facebook (Facebook y WhatsApp comparten el mismo rastreador web): [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) y haz clic en "Depurar" / "Scrape Again".
- O simplemente añade una versión al final de tu link al compartirlo, por ejemplo: `https://tu-invitacion.vercel.app/?v=2`.
