# Configurar WSL

## Preparando o Windows

> **PowerShell**

```pwsh
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
```

### 🖥️ Habilitar VM

> **PowerShell**

```pwsh
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
dism.exe /online /enable-feature /featurename:Microsoft-Hyper-V-All /all /norestart
```

### 📁 Habilitar Long Paths

> **PowerShell**

```pwsh
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force
```

- Por padrão, o **Windows** limita caminhos a **260 caracteres**.

## Instalar WSL

> **PowerShell**

```pwsh
wsl --install # (Ubuntu Latest por padrão)
wsl --set-default-version 2
```

> [!TIP]
>
> Você pode listar todas as distros disponíveis com `wsl --list --online` e instalar via `wsl --install -d <NAME>`, por exemplo: `wsl --install -d Ubuntu-24.04`.

Para acessar o **WSL**, execute:

> **PowerShell**

```pwsh
wsl
```

---

## 🐧 Preparando o WSL

Uma vez dentro do **WSL**, vamos preparar o ambiente de desenvolvimento:

> **Bash**

```bash
cd ~
sudo true
```

### 🔧 Reparar dpkg

> **Bash**

```bash
sudo dpkg-divert --local --rename --add /usr/bin/systemd-sysusers
sudo ln -s /bin/true /usr/bin/systemd-sysusers || true
sudo dpkg --configure -a
sudo apt-get update
sudo apt-get upgrade -y
```

### 🔀 Git

> **Bash**

```bash
sudo apt-get install git
```

- Normalmente já vem instalado.
- Você precisará fazer login mesmo que já esteja logado no **Windows**.

### 🐍 Python

> **Bash**

```bash
sudo apt-get install python3
```

- Normalmente já vem instalado.

### 🔄 nvm

> **Bash**

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash
\. "$HOME/.nvm/nvm.sh"
```

### 🐢 Node.js

> **Bash**

```bash
nvm install 24
nvm use 24
```

- **Node.js v22 para v24**: https://nodejs.org/en/blog/migrations/v22-to-v24

---

## Extensão WSL para IDEs baseadas no VSCode

- [**Visual Studio Code WSL**](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-wsl)

Após instalar, tecle <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> e escolha a opção **`WSL: Connect to WSL`**.
