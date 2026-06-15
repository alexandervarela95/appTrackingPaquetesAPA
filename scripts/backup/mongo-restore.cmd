REM Restaura una copia de MongoDB generada por el proceso de respaldo del proyecto.
@echo off
setlocal

if "%MONGODB_URI%"=="" (
  echo Defina MONGODB_URI antes de ejecutar la restauracion.
  exit /b 1
)

if "%~1"=="" (
  echo Uso: mongo-restore.cmd RUTA_DEL_BACKUP
  exit /b 1
)

mongorestore --uri="%MONGODB_URI%" --drop "%~1"
echo Restauracion finalizada desde %~1
