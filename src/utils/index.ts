import config from '../../config';
import axios from'axios';
import qs from 'qs';
 
export const genarateUserToken = async () => {
        
    const response = await axios({
        method: 'post',
        url: `${config.authServerUrl}realms/master/protocol/openid-connect/token`,
        headers: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        data: qs.stringify({
            grant_type: 'client_credentials',
            client_id: config.tokenClientId,
            client_secret: config.tokenSecretId
        })
    }) 
        
    return response.data;
    
}

module.exports.FormateData = (data :any) => {
        if(data){
            return { data }
        }else{
            throw new Error('Data Not found!')
        }
    }