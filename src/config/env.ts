import * as dotenv from 'dotenv';

dotenv.config()
const port = process.env.PORT;
const node_env = process.env.NODE_ENV;
const database_url = process.env.DATABASE_URL;
const jwt_secret = process.env.JWT_SECRET;

if (port == null){
    throw new Error("PORT FEHLT IN DER ENV FILE");
}else if(node_env == null){
    throw new Error("NODE_ENV FEHLT IN DER ENV FILE");
}else if (database_url == null){
    throw new Error("DATABASE_URL FEHLT IN DER ENV FILE");
}else if (jwt_secret == null) {
    throw new Error("JWT_SECRET FEHLT IN DER ENV FILE");
}

export type env_config = {
    port: string,
    node_env: string,
    database_url: string,
    jwt_secret: string
}

export const config: env_config = {
    port: port,
    node_env: node_env,
    database_url: database_url,
    jwt_secret: jwt_secret
}