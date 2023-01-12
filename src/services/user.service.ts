import axios from 'axios';
import config from '../../config';
import { genarateUserToken } from '../utils';
import qs from 'qs';
import { createUserRepo, findUserRepo, removeRefreshTokenRepo, saveRefreshTokenRepo } from '../../database/repository/user.respository';


// SignUp
export const registerUserService = async (userInputs: any): Promise<void> => {

    const {
        username,
        email,
        password
    } = userInputs;

    const TOKEN_DATA = await genarateUserToken();
    const checkExistingUser = await findUserRepo({ email });
         
    if (!checkExistingUser) { 
            
        try {
            const response = await axios({
                method: 'post',
                url: `${config.authServerUrl}admin/realms/${config.realm}/users`,
                data: {
                    "enabled": true,
                    "username": username,
                    "email":email,
                    "credentials": [{
                        "type": "password",
                        "value": password,
                        "temporary": false
                    }]
                },
                headers: {
                    Authorization: `Bearer ${TOKEN_DATA.access_token}`,
                    'Content-Type': 'application/json'
                }
            });

        }
        catch (error)
        {
            console.log(error);
            throw new Error("Username already exists");
        }

        // DB 
        const newUser: any = await createUserRepo({ username, email, password });

    }
    else
    {
        throw new Error("Email Already Registered");
    }

}

// Login
export const loginUserService = async (userInputs: any) =>
{
    const { email, password } = userInputs;

    try {
        const response = await axios({
            method: 'post',
            url: `${config.authServerUrl}realms/${config.realm}/protocol/openid-connect/token`,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8', },
            data: qs.stringify({
                grant_type: 'password',
                client_id: config.clientId,
                client_secret: config.secret,
                username: email,
                password: password
            })
        });
        
        const data = response.data;
        // // DB
        const user = await findUserRepo({ email });

        //save refresh token on DB
        await saveRefreshTokenRepo(user?.id, data.refresh_token);

        return{
            refreshToken:data.refresh_token,
            accessToken: data.access_token
        };
        
    }
    catch (error)
    {
        throw new Error("User unauthorized");
    }

}

//logout user
export const logoutUserService = async (refreshToken : string) : Promise<void> =>
{
    try
    {
        const response = await axios({
            method: 'post',
            url: `${config.authServerUrl}realms/${config.realm}/protocol/openid-connect/logout`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                Authorization: `Bearer ${refreshToken}`
            },
        });

        // remove refresh token from DB
        await removeRefreshTokenRepo(refreshToken);

    }
    catch (error)
    {
        console.log(error);
        
    }
}


// Get access token from refresh token

export const refreshTokenService = async (refreshToken: string) =>
{
    try
    {
        const response = await axios({
            method: 'post',
            url: `${config.authServerUrl}realms/${config.realm}/protocol/openid-connect/token`,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8', },
            data: qs.stringify({
                grant_type: 'refresh_token',
                client_id: config.clientId,
                client_secret: config.secret,
                refresh_token: refreshToken
            })
        });

        return response.data;

    }
    catch (error)
    {
        console.log(error);
        return 'Refresh token not accepted';
    }
}

// protect Route
export const protectRouteService = async () =>
{
    return {
        username:"John"
    }
}