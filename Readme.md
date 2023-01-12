# # Dependencies

- yarn add keycloak-connect
- yarn add keycloak-connect-graphql
- yarn add express-session
- yarn add @types/express-session
- yarn add qs

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`MONGO_URI`=Your MonogoDB URL

`PORT`=Your server runnig port

`AUTH_SEVER_URL`= Keycloak base url

`REALM`=Your Keycloak realm

`CLIENT_ID`= Project client

`SECRET_ID`= Project client's secret id

`REALM_PUBLIC_KEY`= Your Keycloak realm public key

`TOKEN_CLIENT_ID`= Admin cli

`TOKEN_SECRET_ID`= Admin cli secret id
