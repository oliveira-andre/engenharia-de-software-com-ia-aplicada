# › Binários

Projetos com binários nativos distribuem **um artefato por plataforma × arquitetura**, por exemplo:

```js
require(`@esbuild/${process.platform}-${process.arch}`);

// require('@esbuild/linux-x64')
// require('@esbuild/darwin-arm64')
// require('@esbuild/win32-x64')
// ...
```

---

# › Comandos

## → Variáveis inline

### CMD

```cmd
cmd /V:ON /C "set VAR=Hello ✨ & echo !VAR!"
```

### Windows PowerShell 5 ↔ PowerShell 7

```powershell
$env:VAR="Hello ✨"; echo $env:VAR;
```

### Bash ↔ ZSH ↔ WSL ↔ Git (MinGW/MSYS2)

```bash
VAR="Hello ✨"; echo $VAR;
```

---

## → Operadores lógicos (`&&`, `||`, `;`)

### CMD

```cmd
echo A & echo B
echo A && echo B
echo A || echo B
```

### Windows PowerShell (5)

```powershell
echo A; echo B
if ($?) { echo B }       # `&&`
if (-not $?) { echo B }  # `||`
```

### Bash ↔ ZSH ↔ WSL ↔ Git (MinGW/MSYS2) ↔ PowerShell 7

```bash
echo A; echo B
echo A && echo B
echo A || echo B
```

---

## → Aspas simples em argumentos

### CMD

```json
{
  "scripts": { "msg": "echo \"...\"" }
}
```

- O **CMD** passa as aspas simples literalmente junto com o argumento.

### Windows PowerShell 5 ↔ PowerShell 7 ↔ Bash ↔ ZSH ↔ WSL ↔ Git (MinGW/MSYS2)

```json
{
  "scripts": { "msg": "echo '...'" }
}
```

```json
{
  "scripts": { "msg": "echo \"...\"" }
}
```

---

## → Comandos Unix (`rm -rf`, `chmod`)

### CMD

```cmd
rmdir /S /Q folder
```

### Windows PowerShell 5 ↔ PowerShell 7

```powershell
Remove-Item -Recurse -Force folder
```

### Bash ↔ ZSH ↔ WSL ↔ Git (MinGW/MSYS2)

```bash
rm -rf folder
chmod 755 script.sh
```

- `chmod` não tem equivalente direto no **Windows**.

---

# › Caminhos

## → Separador (`sep`)

### Windows

```js
const path = '.\\src\\utils';
```

### Bash ↔ ZSH ↔ WSL ↔ Git (MinGW/MSYS2)

```js
const path = './src/utils';
```

---

## → Separador dinâmico

### Windows ↔ Unix

```js
import { sep, join, normalize } from 'node:path';

const A = `src${sep}utils`;
const B = join('src', 'utils');
const C = normalize('src/utils');
```
