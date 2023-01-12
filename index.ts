import express , {Express, Request,Response} from 'express';
import {graphqlHTTP} from 'express-graphql';
import cors from 'cors';
import bodyparser from 'body-parser';
import config from './config';
import { schema } from './graphql/typeDefs';
import { resolver } from './graphql/resolvers';
import { configureKeycloak } from './config/keycloak-config';
import {KeycloakContext} from 'keycloak-connect-graphql'
import connection from './database/connection';
import cookieParser from 'cookie-parser'

const graphqlPath = '/graphql'


const app : Express = express();

// Config Keycloak
configureKeycloak(app, graphqlPath)

app.use(cors());
app.use(express.json());
app.use((bodyparser.urlencoded({ extended: true })));
app.use(cookieParser());

//CONNECTING TO DATABASE:
connection();


app.use(
    graphqlPath,
    (req: Request, res: Response) =>
    {
       return graphqlHTTP({
            schema: schema,
            rootValue: resolver,
            graphiql: true,
        //     context: (req: any, res: any) => {
        //         return {
        //             kauth: new KeycloakContext({ req: req as any }),
                    
        //         }
        //    },
           context : {req ,res}
         
        })(req,res)
    }
)


app.listen(config.port, ()=>{
    console.log(`Server running at ${config.port}`)
})
