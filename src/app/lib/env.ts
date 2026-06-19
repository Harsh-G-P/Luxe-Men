
const requiredEnv = {
    DATABASE_URL : process.env.DATABASE_URL,
    NEXTAUTH_SECRET : process.env.NEXTAUTH_SECRET,
}

for (const [key,value] of Object.entries(requiredEnv)){
    if(!value){
        throw new Error(`Missing environment variable: ${key}`)
    }
}

export default requiredEnv