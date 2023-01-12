import userModel from '../models/user.model'
import { IUserInputs} from '../types/user.type'

// Save user
export const createUserRepo = async ({ username, email, password }: IUserInputs) =>
{
        try {
            const user = new userModel({
                username,
                email,
                password
            })
            
            const userResult = await user.save()

            return userResult;
        }
        catch (error)
        {
            console.log(error); 
            return error
        }
    }

// find user by email
 export const  findUserRepo =async ({email} : any)=>{
        try {
            const existingUser = await userModel.findOne({ email: email });
            return existingUser;
        }
        catch (error)
        {
            console.log(error); 
        }
}

// find user by username
export const findUserByUsernameRepo = async ({ name }: any) =>
{
    try {
        const existingUser = await userModel.findOne({ name: name });
        return existingUser;
    }
    catch (error)
    {
        console.log(error); 
    }
}

// find user by refreshtoken
export const findUserByTokenRepo = async (refreshToken : any)   =>{
    try {
        const existingUser = await userModel.findOne({ refreshToken: refreshToken });
        return existingUser;
    }
    catch (error)
    {
        console.log(error); 

    }
} 

// save refersh token
export const saveRefreshTokenRepo = async (userID: string, refreshToken: string) =>
{
    
    const user = await userModel.findById(userID).findOneAndUpdate({refreshToken:refreshToken})

    const result = await user?.save();
    //  console.log(result)
    

}

// remove refresh token from db
export const removeRefreshTokenRepo = async (refreshToken: string) =>
{
    try {
        const user = await findUserByTokenRepo(refreshToken);
        if(user) {
            user.refreshToken = '';
            const result = await user.save();
            console.log(result);
        }
    }
    catch (error) {
        console.log(error);
    }
}

// find user by id
export const findUserByIdRepo = async (id: string) =>
{
    try {
            const existingUser = await userModel.findById(id).select('-password').select('-refreshToken')
            console.log({existingUser})

            return existingUser

        }
        catch (error) {
            console.log(error);
        }
}
    
