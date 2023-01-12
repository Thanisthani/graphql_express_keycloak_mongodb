import mongoose, { ConnectOptions } from 'mongoose'
import config from '../config'



export default ()=>{
    mongoose.connect(`${config.dbURL}`, {
        useNewUrlParser: true
      } as ConnectOptions)
    console.log('Db Connected');
      
      mongoose.connection.on("error", (e) => {
        console.error(`Error ${e}`);
      });
}