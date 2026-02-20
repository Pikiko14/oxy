#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { FrontendStack } from "../lib/frontend-stack";

const app = new cdk.App();

// Obtener el contexto de entorno (production, development, etc.)
const env = app.node.tryGetContext("env") || "development";

// Obtener cuenta y región desde variables de entorno o dejar que CDK las resuelva automáticamente
// Si no se especifican, CDK las obtendrá del perfil AWS configurado
const account = process.env.CDK_DEFAULT_ACCOUNT || process.env.AWS_ACCOUNT_ID;
const region = process.env.CDK_DEFAULT_REGION || process.env.AWS_REGION || "us-east-1";

// Configuración por entorno
const config = {
  development: {
    domainName: undefined, // Sin dominio personalizado en dev
    certificateArn: undefined,
    // Si account está definida, usar env explícito, sino dejar que CDK lo resuelva
    env: account
      ? {
          account,
          region,
        }
      : undefined, // CDK resolverá automáticamente desde el perfil
  },
  production: {
    domainName: undefined, // Configurar si tienes dominio
    certificateArn: undefined, // Configurar si tienes certificado ACM
    env: account
      ? {
          account,
          region,
        }
      : undefined, // CDK resolverá automáticamente desde el perfil
  },
};

const stackConfig = config[env as keyof typeof config] || config.development;

new FrontendStack(app, `FrontendStack-${env}`, {
  ...stackConfig,
  description: `Frontend infrastructure for ${env} environment`,
  tags: {
    Environment: env,
    Project: "oxy-frontend",
  },
});
