# Subir cambios a GitHub desde VS Code

Esta guía corresponde al repositorio **Golden Notes**. Los pasos crean commits con la identidad de Hector Pineda y los publican en la rama `main`.

## 1. Abrir el proyecto y revisar la identidad

1. Abre en VS Code la carpeta raíz del proyecto: `Golden Notes` (la carpeta que contiene `index.html` y `.gitignore`).
2. Abre **Terminal > New Terminal**. Confirma que la terminal está situada en esa carpeta.
3. Ejecuta estos comandos para verificar la identidad local del repositorio:

   ```powershell
   git config user.name
   git config user.email
   ```

   Deben mostrar:

   ```text
   Hector Pineda
   hector.epm.3011@gmail.com
   ```

   Si no coinciden, configúralos para este proyecto (sin afectar otros repositorios):

   ```powershell
   git config user.name "Hector Pineda"
   git config user.email "hector.epm.3011@gmail.com"
   ```

   GitHub atribuye los commits según el correo del commit. Para que aparezcan asociados a tu perfil, ese correo debe estar agregado y verificado en tu cuenta de GitHub. La cuenta con la que VS Code inicia sesión para hacer el envío controla el acceso al repositorio; por sí sola no cambia el autor del commit.

## 2. Revisar y preparar los cambios

1. Guarda los archivos editados.
2. Abre **Source Control** desde la barra lateral de VS Code (`Ctrl+Shift+G`).
3. Revisa la lista **Changes**. Abre cada archivo modificado y confirma que el cambio pertenece a esta actualización.
4. Para incluir todos los cambios revisados, pulsa **+** junto a **Changes**. También puedes preparar archivos individualmente con el **+** que aparece al pasar sobre cada archivo.
5. Revisa **Staged Changes** antes de confirmar. No incluyas archivos con claves, contraseñas, datos privados ni cambios que no quieras publicar.

El instructivo está dentro de `docs/` y se puede versionar. Los demás archivos de esa carpeta siguen excluidos por `.gitignore`.

## 3. Crear el commit

1. En el campo **Message**, escribe un resumen corto y claro, por ejemplo:

   ```text
   Mostrar icono de carrito consistente en móvil
   ```

2. Pulsa **Commit** (la marca de verificación). Si VS Code pregunta si debe preparar automáticamente todos los cambios, elige **No** y revisa/prepara tú los archivos.
3. Confirma en la terminal que quedó registrado con tu identidad:

   ```powershell
   git log -1 --format="%h %an <%ae> — %s"
   ```

## 4. Subir el commit

1. En la barra inferior, confirma que estás en la rama `main`.
2. Pulsa **Sync Changes** en la vista **Source Control** o en la barra inferior. Si aparece el menú de tres puntos, usa **Push**.
3. Si VS Code solicita iniciar sesión, autoriza la cuenta que tiene acceso de escritura al repositorio `daemonserver/Golden-Notes`.
4. Espera a que termine el envío. Abre GitHub y revisa el historial de `main`; el commit debe aparecer con tu nombre.

Si VS Code ofrece **Publish Branch** en vez de **Push**, detente y verifica la rama y el remoto antes de continuar. En este proyecto, los cambios normales se suben a `main`.

## Reglas para el historial

- Cada `git commit` agrega una entrada al historial; subir cambios no borra los commits anteriores.
- No uses **Force Push**, `git push --force` ni reescribas el historial para una carga normal. El historial actual ya quedó unificado en un commit con tu identidad; los commits nuevos se sumarán a ese historial.
- Si un commit aparece con un autor inesperado, detén el envío y revisa `git config user.name` y `git config user.email` antes de crear otro.
