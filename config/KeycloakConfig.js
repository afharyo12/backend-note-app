import "dotenv/config";
// config/KeycloakConfig.js
export const keycloakConfig = {
    url: process.env.KEYCLOAK_URL || "http://localhost:8080", // Your Keycloak URL
    realm: "myrealm",             // Your created Realm Name
    clientId: "myclient",         // Your Client ID
    clientSecret: "EqQwHRXZJqsSRMIiBk0Z2S3PUnLLmBi7",      // Client Secret (from Keycloak -> Clients -> Credentials)
    adminUsername: "admin",       // Keycloak Admin username (for registration)
    adminPassword: "admin"        // Keycloak Admin password (for registration)
};