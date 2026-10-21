import mongoose from 'mongoose';

const connectDB = async() => {
    try{
        await mongoose.connect("mongodb+srv://nishamoyal:wJU7X7oUKb6KKE2s@nishacluster.axjohtp.mongodb.net/");
        await mongoose.connection.db.admin().command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }catch(error){
        console.log(error);
        console.log('MongoDB connection failed');
        process.exit(1);
    }
}

export default connectDB;