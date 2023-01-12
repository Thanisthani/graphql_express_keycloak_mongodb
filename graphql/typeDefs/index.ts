import { buildSchema } from 'graphql';
import{auth} from 'keycloak-connect-graphql'

export const schema = buildSchema(`
    type Query {
        protectedRouteResolver:ProtectPayload! ,
        refreshTokenResolver : AuthPayload
    }

    type Mutation {
        registerUserResolver(username:String!,email:String!,password:String!) : RegisterPayload! ,
        loginUserResolver(email:String!,password:String!) : AuthPayload!,
        logoutUserResolver: String  
    }

    type User {
        id: ID!
        username: String!
        email: String!
    }

    type AuthPayload {
        accessToken: String!
    }

    type RegisterPayload{
        message: String
    }

    type ProtectPayload {
        username: String!
    }

    type ProtectRoute{
        message: String
    }
`);



