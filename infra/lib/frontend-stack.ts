import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import { Construct } from "constructs";
import * as path from "path";

export interface FrontendStackProps extends cdk.StackProps {
  domainName?: string;
  certificateArn?: string;
}

export class FrontendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: FrontendStackProps) {
    super(scope, id, props);

    // Bucket S3 privado para almacenar los archivos estáticos
    // Solo accesible a través de CloudFront (no público)
    const websiteBucket = new s3.Bucket(this, "WebsiteBucket", {
      bucketName: `oxy-frontend-${this.account}-${this.region}`,
      publicReadAccess: false, // CloudFront será el único que acceda
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Cambiar a RETAIN en producción
      autoDeleteObjects: true, // Eliminar objetos al destruir el stack
      versioned: false,
      encryption: s3.BucketEncryption.S3_MANAGED,
    });

    // OAI (Origin Access Identity) para CloudFront
    const originAccessIdentity = new cloudfront.OriginAccessIdentity(
      this,
      "OriginAccessIdentity",
      {
        comment: "OAI for frontend website",
      }
    );

    // Dar permisos a CloudFront para leer del bucket
    websiteBucket.grantRead(originAccessIdentity);

    // Distribución CloudFront - CDN global para servir la aplicación
    // Los usuarios acceden a través de CloudFront, no directamente al bucket S3
    const distribution = new cloudfront.Distribution(this, "Distribution", {
      defaultBehavior: {
        origin: new origins.S3Origin(websiteBucket, {
          originAccessIdentity,
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
        cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
        compress: true,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      },
      // Manejo de errores para SPA React Router (404/403 -> index.html)
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
          ttl: cdk.Duration.minutes(5),
        },
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
          ttl: cdk.Duration.minutes(5),
        },
      ],
      defaultRootObject: "index.html",
      enabled: true,
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100, // US, Canada y Europa
      // Si tienes dominio personalizado, descomenta y configura:
      // domainNames: props.domainName ? [props.domainName] : undefined,
      // certificate: props.certificateArn
      //   ? cloudfront.ViewerCertificate.fromAcmCertificate(
      //       acm.Certificate.fromCertificateArn(this, "Cert", props.certificateArn),
      //       {
      //         aliases: [props.domainName!],
      //       }
      //     )
      //   : undefined,
    });

    // Desplegar los archivos del build al bucket S3
    // Esto también invalida automáticamente el cache de CloudFront
    new s3deploy.BucketDeployment(this, "DeployWebsite", {
      sources: [
        s3deploy.Source.asset(path.join(__dirname, "../../dist")),
      ],
      destinationBucket: websiteBucket,
      distribution, // CloudFront distribution - invalida cache automáticamente
      distributionPaths: ["/*"], // Invalidar todos los paths en CloudFront
      prune: true, // Eliminar archivos antiguos del bucket
    });

    // Outputs
    new cdk.CfnOutput(this, "BucketName", {
      value: websiteBucket.bucketName,
      description: "Name of the S3 bucket",
    });

    new cdk.CfnOutput(this, "DistributionId", {
      value: distribution.distributionId,
      description: "CloudFront Distribution ID",
    });

    new cdk.CfnOutput(this, "DistributionDomainName", {
      value: distribution.distributionDomainName,
      description: "CloudFront Distribution Domain Name",
      exportName: "FrontendDistributionDomainName",
    });

    new cdk.CfnOutput(this, "WebsiteURL", {
      value: `https://${distribution.distributionDomainName}`,
      description: "Website URL",
    });
  }
}
