// config/KeycloakConfig.js
export const keycloakConfig = {
    url: "http://localhost:8080", // Your Keycloak URL
    realm: "myrealm",             // Your created Realm Name
    clientId: "myclient",         // Your Client ID
    clientSecret: "VmRX...",      // Client Secret (from Keycloak -> Clients -> Credentials)
    adminUsername: "admin",       // Keycloak Admin username (for registration)
    adminPassword: "admin"        // Keycloak Admin password (for registration)
};