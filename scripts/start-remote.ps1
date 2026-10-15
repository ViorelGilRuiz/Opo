param(
  [Parameter(Mandatory = $true)]
  [ValidatePattern('^[^@\s]+@[^@\s]+\.[^@\s]+$')]
  [string]$AllowedEmail
)
$ErrorActionPreference = 'Stop'
$projectPath = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$runtimePath = Join-Path $projectPath 'tmp/remote'
$clientPath = Join-Path $runtimePath 'cloudflared.exe'
if (-not (Test-Path -LiteralPath $clientPath)) { throw 'Falta el cliente oficial cloudflared en tmp/remote/cloudflared.exe.' }
New-Item -ItemType Directory -Force -Path $runtimePath | Out-Null
try { $response = Invoke-WebRequest -Uri 'http://127.0.0.1:3000/' -UseBasicParsing -TimeoutSec 3 } catch { $response = $null }
if ($response -and $response.Content -notmatch 'OpoSprint') { throw 'El puerto 3000 pertenece a otro servicio. No se publicará.' }
if (-not $response) {
  $serverProcess = Start-Process -FilePath (Get-Command node.exe).Source -ArgumentList '--env-file-if-exists=.env','scripts/server.mjs' -WorkingDirectory $projectPath -WindowStyle Hidden -RedirectStandardOutput (Join-Path $runtimePath 'server.log') -RedirectStandardError (Join-Path $runtimePath 'server-error.log') -PassThru
  $serverProcess.Id | Set-Content -LiteralPath (Join-Path $runtimePath 'server.pid')
  $ready = $false
  for ($attempt = 0; $attempt -lt 20; $attempt++) {
    Start-Sleep -Milliseconds 250
    try { $response = Invoke-WebRequest -Uri 'http://127.0.0.1:3000/' -UseBasicParsing -TimeoutSec 2; $ready = $response.Content -match 'OpoSprint'; if ($ready) { break } } catch { }
  }
  if (-not $ready) { throw 'El servidor de OpoSprint no está preparado; no se creará el túnel.' }
}
$tunnelProcess = Start-Process -FilePath $clientPath -ArgumentList 'tunnel','--url','http://127.0.0.1:3000','--allowed-mail',$AllowedEmail,'--no-autoupdate','--protocol','http2' -WorkingDirectory $projectPath -WindowStyle Hidden -RedirectStandardOutput (Join-Path $runtimePath 'tunnel.log') -RedirectStandardError (Join-Path $runtimePath 'tunnel-error.log') -PassThru
$tunnelProcess.Id | Set-Content -LiteralPath (Join-Path $runtimePath 'tunnel.pid')
Write-Output 'Túnel protegido solicitado. Consulta tmp/remote/tunnel-error.log para conocer el enlace y comprobar la conexión. No se ha modificado el firewall ni el router.'
