# Backups y Restauración

## Objetivo

Definir un procedimiento claro para respaldar y restaurar MongoDB sin incluir credenciales reales en el repositorio.

## Variables requeridas

Antes de ejecutar cualquier script, defina:

```bash
MONGODB_URI=mongodb://usuario:password@localhost:27017/appTrackingPaquetesAPA?authSource=admin
```

En un entorno local sin autenticación, puede usar:

```bash
MONGODB_URI=mongodb://127.0.0.1:27017/appTrackingPaquetesAPA
```

## Backup

Desde la raíz del proyecto:

```bash
scripts\backup\mongo-backup.cmd
```

El respaldo se guarda en:

```text
backups/mongo/
```

La carpeta `backups/` no debe versionarse.

## Restauración

```bash
scripts\backup\mongo-restore.cmd backups\mongo\NOMBRE_DEL_BACKUP
```

El script usa `--drop`, por lo que reemplaza las colecciones existentes con el contenido del respaldo.

## Evidencias subidas

MongoDB guarda la metadata de evidencias, pero los archivos viven en:

```text
backend/uploads/evidencias/
```

En producción se recomienda respaldar esa carpeta o migrar a almacenamiento externo compatible con S3, Azure Blob, Google Cloud Storage o infraestructura equivalente.

## Frecuencia sugerida

- Ambiente académico/local: backup antes de cada demostración.
- Ambiente productivo: backup diario como mínimo, con retención semanal y mensual.
- Restauración: probar al menos una restauración por ciclo de entrega.

