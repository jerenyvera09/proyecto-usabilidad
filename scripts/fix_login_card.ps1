$ErrorActionPreference = 'Stop'
$path = Join-Path $PSScriptRoot '..\frontend\src\pages\Usuarios.jsx'
$content = Get-Content -Raw -Encoding UTF8 $path
$content = $content -replace 'className=\"card p-12 max-w-md mx-auto\"', 'className=\"card p-12 max-w-md mx-auto backdrop-blur-md bg-white/5 dark:bg-black/30 border border-white/10 dark:border-white/10\"'
$content = $content -replace 'className=\"card p-8 max-w-md mx-auto\"', 'className=\"card p-8 max-w-md mx-auto backdrop-blur-md bg-white/5 dark:bg-black/30 border border-white/10 dark:border-white/10\"'
Set-Content -Path $path -Value $content -Encoding UTF8 -NoNewline
Write-Host "Applied glass background to login card in Usuarios.jsx"
