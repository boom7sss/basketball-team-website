$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$bundledNode = "C:\Users\13326\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
$nodeCommand = Get-Command node -ErrorAction SilentlyContinue
$nodePath = if ($nodeCommand) { $nodeCommand.Source } elseif (Test-Path $bundledNode) { $bundledNode } else { "" }

if (-not $nodePath) {
  Write-Host "没有找到 Node.js，无法启动官网。"
  exit 1
}

$existing = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue
if ($existing) {
  Write-Host "官网已经在运行：http://localhost:3000"
  Start-Process "http://localhost:3000"
  exit 0
}

$out = Join-Path $root "server.log"
$err = Join-Path $root "server.err.log"
$process = Start-Process `
  -FilePath $nodePath `
  -ArgumentList "server/server.mjs" `
  -WorkingDirectory $root `
  -WindowStyle Hidden `
  -RedirectStandardOutput $out `
  -RedirectStandardError $err `
  -PassThru

Start-Sleep -Seconds 1
$started = Get-Process -Id $process.Id -ErrorAction SilentlyContinue
if (-not $started) {
  Write-Host "官网启动失败，请查看 server.err.log。"
  exit 1
}

Write-Host "官网已启动：http://localhost:3000"
Write-Host "后台地址：http://localhost:3000/admin"
Write-Host "后台密码：team-admin-2026"
Start-Process "http://localhost:3000"
