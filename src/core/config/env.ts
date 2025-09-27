import dotenvSafe from "dotenv-safe";
import { get } from "env-var";

dotenvSafe.config({
  allowEmptyValues: true,
  example: ".env.example",
});

export const envs = {
  PORT: get("PORT").required().asPortNumber(),
  API_PREFIX: get("DEFAULT_API_PREFIX").default("/api/v1").asString(),
  NODE_ENV: get("NODE_ENV").default("development").asString(),
  MONGO_INITDB_ROOT_USERNAME: get("MONGO_INITDB_ROOT_USERNAME")
    .default("k2ngroup")
    .asString(),
  MONGO_INITDB_ROOT_PASSWORD: get("MONGO_INITDB_ROOT_PASSWORD")
    .required()
    .asString(),
  MONGO_DB_NAME: get("MONGO_DB_NAME").required().asString(),
  MONGO_HOST: get("MONGO_HOST").default("localhost").asString(),
  MONGO_PORT: get("MONGO_PORT").default("27017").asString(),

  // MinIO Configuration
  MINIO_ROOT_USER: get("MINIO_ROOT_USER").default("minioadmin").asString(),
  MINIO_ROOT_PASSWORD: get("MINIO_ROOT_PASSWORD")
    .default("minioadmin")
    .asString(),
  MINIO_HOST: get("MINIO_HOST").default("localhost").asString(),
  MINIO_PORT: get("MINIO_PORT").default("9000").asString(),
  REGION_AWS: get("REGION_AWS").default("us-east-1").asString(),
  BUCKET_NAME: get("BUCKET_NAME").default("mybucket").asString(),

  mot_de_passe: "ybfm tkhc pyaa bmuy",
  address_mail: "cesaristos85@gmail.com",
};

export const CONNECTION_STRING = `mongodb://${envs.MONGO_INITDB_ROOT_USERNAME}:${envs.MONGO_INITDB_ROOT_PASSWORD}@${envs.MONGO_HOST}:${envs.MONGO_PORT}/${envs.MONGO_DB_NAME}?authSource=admin`;
