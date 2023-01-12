import{auth} from 'keycloak-connect-graphql'
import { loginUserService, logoutUserService, protectRouteService, refreshTokenService, registerUserService } from '../../src/services/user.service';

export const resolver = {
    
    loginUserResolver:  async ({ email, password }: any,context:any) =>
    { 
        try {
            const data = await loginUserService({ email, password });

            // Set refresh token on cookies
            context.res.cookie('jwt', data.refreshToken, { httpOnly: true, sameSite: 'strict', maxAge: 24 * 60 * 60 * 1000 });

            return {
                accessToken: data.accessToken
            };
            
        }
        catch (error: any)
        {
            console.log(error);
            throw new Error(error.message);
            
        }

    },

    registerUserResolver: async ({ username, email, password }: any) =>
    {
        try {
            await registerUserService({ username, email, password });

            return {
                message:"Sucessfully user registered"
            };

        }
        catch (error: any)
        {
            console.log(error.message)
            throw new Error(error.message)   
        }       
    },

    // get accessToken from refresh token
    refreshTokenResolver: async ({}:any, context:any) =>
    {
        const token = <any>context.req.header('Authorization')?.replace('Bearer ', '');
        
        console.log("accessTOken", token);
      try { const cookies = context.req.cookies;
        if (!cookies?.jwt)
            return context.res.sendStatus(204);
        
        const refreshToken = cookies.jwt as string;

        const data = await refreshTokenService(refreshToken);
        const accessToken = data.access_token;

        return {
            accessToken
          }
        }
      catch (error: any)
      {
          throw new Error(error.message);
        }

    },

    // logout user

    logoutUserResolver: async ({ }, context: any) =>
    {
        try
        {
            const cookies = context.req.cookies;
         
            if (!cookies?.jwt) return context.res.sendStatus(204); 
            const refreshToken = cookies.jwt;

            await logoutUserService(refreshToken);

            // remove refresh token from cookies
            context.res.clearCookie('jwt', { httpOnly: true, sameSite: 'strict', secure: true });
            context.res.status(204);
        }
        catch (error: any)
        {
            throw new Error(error.message)
        }
    },
    
    // Protect
    
    protectedRouteResolver: auth(async () => {
        const data = await protectRouteService();
        return {
            username: data.username
        };
    })
}
