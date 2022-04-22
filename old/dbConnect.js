// OLD: lib/dbConnect.js - Used to connect to a mongodb database (using mongoose)

// import mongoose from 'mongoose'

// const MONGODB_URI = process.env.MONGODB_URI

// let cached = global.mongoose

// if (!cached) cached = global.mongoose = { conn: null, promise: null }

// async function dbConnect() {
//   if (cached.conn) return cached.conn

//   if (!cached.promise) {
//     const opts = {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       bufferCommands: false
//     }

//     cached.promise = mongoose.connect(MONGODB_URI, opts).then(mongoose => {
//       return mongoose
//     })
//   }

//   cached.conn = await cached.promise  
//   return cached.conn
// }

// export default dbConnect