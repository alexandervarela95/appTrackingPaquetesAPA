@echo off
setlocal

if "%MONGODB_URI%"=="" (
  echo Defina MONGODB_URI antes de ejecutar el backup.
  exit /b 1
)

set BACKUP_DIR=%~dp0..\..\backups\mongo
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

for /f "tokens=1-4 delims=/ " %%a in ("%date%") do set FECHA=%%d-%%b-%%c
for /f "tokens=1-2 delims=:." %%a in ("%time%") do set HORA=%%a%%b
set DESTINO=%BACKUP_DIR%\backup-%FECHA%-%HORA%

mongodump --uri="%MONGODB_URI%" --out="%DESTINO%"
echo Backup generado en %DESTINO%

