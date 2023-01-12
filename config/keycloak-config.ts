import session from 'express-session';
import Keycloak from 'keycloak-connect';
import config from './index'

const memoryStore =  new session.MemoryStore();

const keycloakConfig :any = {
  realm: config.realm,
  serverUrl: config.authServerUrl,
  bearerOnly: true,
  clientId: config.clientId,
  realmPublicKey: config.realmPublicKey,  
};


export function configureKeycloak(app: any, graphqlPath: any) {
  
  app.use(session({
    secret: 'this should be a long secret',
    resave: false,
    saveUninitialized: true,
    store: memoryStore
  }));

  const keycloak = new Keycloak({
    store: memoryStore
  }, keycloakConfig)

  app.use(keycloak.middleware({
    admin: graphqlPath
  }))

  app.use(graphqlPath, keycloak.middleware())

  console.log(keycloak);
  return { keycloak }
}




