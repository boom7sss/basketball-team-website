$ErrorActionPreference = "Stop"

$bundledNode = "C:\Users\13326\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
$node = Get-Command node -ErrorAction SilentlyContinue

if ($node) {
  & $node.Source "server/server.mjs"
} elseif (Test-Path $bundledNode) {
  & $bundledNode "server/server.mjs"
} else {
  Write-Error "没有找到 Node.js。请先安装 Node.js，或在 Codex 环境中运行本脚本。"
}
