# Infraestructura CDK para Frontend

Este directorio contiene la infraestructura como código (IaC) usando AWS CDK para desplegar la aplicación frontend en **AWS CloudFront**.

## Arquitectura

La aplicación se despliega en **CloudFront** (CDN global de AWS) con la siguiente arquitectura:
- **CloudFront Distribution**: CDN global que sirve la aplicación a los usuarios finales
- **S3 Bucket**: Almacena los archivos estáticos de la aplicación (privado, solo accesible vía CloudFront)
- **S3 Deployment**: Automatiza el despliegue de archivos desde `dist/` al bucket S3 e invalida el cache de CloudFront

**Flujo de despliegue:**
1. `npm run build` genera los archivos en `dist/`
2. `npm run deploy` sube los archivos al bucket S3
3. CloudFront automáticamente invalida su cache y sirve la nueva versión
4. Los usuarios acceden a través de la URL de CloudFront

## Prerrequisitos

1. **AWS CLI configurado** con el perfil `975050028915_AdministratorAccess`:
   ```bash
   aws configure --profile 975050028915_AdministratorAccess
   ```

2. **Node.js y npm** instalados

3. **CDK CLI** (se instalará automáticamente con `npm install`)

## Configuración

### 1. Configurar perfil de AWS

Asegúrate de tener configurado el perfil `975050028915_AdministratorAccess` en `~/.aws/credentials`:

```ini
[975050028915_AdministratorAccess]
aws_access_key_id = YOUR_ACCESS_KEY
aws_secret_access_key = YOUR_SECRET_KEY
region = us-east-1
```

### 2. Instalar dependencias

Desde la raíz del proyecto:
```bash
npm run infra:install
```

O desde el directorio `infra`:
```bash
cd infra
npm install
```

### 3. Bootstrap CDK (solo la primera vez)

```bash
cd infra
node node_modules/aws-cdk/bin/cdk bootstrap --profile 975050028915_AdministratorAccess
```

## Despliegue

### Desde la raíz del proyecto (recomendado)

```bash
# Desplegar a desarrollo (por defecto)
npm run deploy

# Desplegar a producción
npm run deploy:prod

# Desplegar a desarrollo explícitamente
npm run deploy:dev
```

### Desde el directorio infra

```bash
cd infra

# Desarrollo
npm run deploy

# Producción
npm run deploy:prod

# Desarrollo explícitamente
npm run deploy:dev
```

## Comandos útiles

```bash
# Ver qué cambios se van a aplicar
npm run infra:diff

# Generar CloudFormation template sin desplegar
npm run infra:synth

# Eliminar la infraestructura
npm run infra:destroy
```

## Variables de entorno

Puedes configurar la región y cuenta de AWS usando variables de entorno:

```bash
export CDK_DEFAULT_ACCOUNT=123456789012
export CDK_DEFAULT_REGION=us-east-1
npm run deploy
```

## Configuración de dominio personalizado (opcional)

Para usar un dominio personalizado:

1. Crea un certificado SSL en AWS Certificate Manager (ACM) en la región `us-east-1`
2. Edita `bin/app.ts` y agrega:
   ```typescript
   domainName: "tu-dominio.com",
   certificateArn: "arn:aws:acm:us-east-1:ACCOUNT:certificate/CERT_ID",
   ```
3. Edita `lib/frontend-stack.ts` y descomenta las secciones de dominio personalizado

## Outputs

Después del despliegue, verás los siguientes outputs:
- **BucketName**: Nombre del bucket S3 (solo para referencia, no accesible públicamente)
- **DistributionId**: ID de la distribución CloudFront
- **DistributionDomainName**: URL de CloudFront (ej: `d1234567890.cloudfront.net`)
- **WebsiteURL**: **URL completa de CloudFront** donde está disponible tu aplicación (ej: `https://d1234567890.cloudfront.net`)

**Importante**: Los usuarios deben acceder a través de la URL de CloudFront (`WebsiteURL`), no directamente al bucket S3.

## Notas

- El bucket S3 está configurado para ser privado (solo accesible vía CloudFront)
- Los archivos se despliegan automáticamente desde `dist/` después de hacer `npm run build`
- CloudFront invalida automáticamente el cache en cada despliegue
- En producción, considera cambiar `removalPolicy` a `RETAIN` en `frontend-stack.ts`
