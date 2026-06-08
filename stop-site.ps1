$connections = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue
if (-not $connections) {
  Write-Host "官网没有在运行。"
  exit 0
}

foreach ($connection in $connections) {
  Stop-Process -Id $connection.OwningProcess -Force
}

Write-Host "官网已停止。"
