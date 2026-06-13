import z from "zod";

function sanitizeString(val:unknown){
    if(typeof val !== "string") return val

    return val
    .trim()
    .replace(/\s+/g," ")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export const userSchema = z.object({
    name:z.preprocess(
        sanitizeString,
        z
            .string()
            .min(3,"Name must be at least 3 characters long")
            .max(20,"Name must be at most 20 characters long")
            .transform((val)=>{
                return val.charAt(0).toUpperCase() + val.slice(1)
            })
    ),
    username: z.preprocess(
        sanitizeString,
    z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(30, "Username must be at most 30 characters long")
    .regex(
          /^[a-zA-Z0-9_]+$/,
          "Username can only contain letters, numbers, and underscores"
        )
    .transform((val) => val.toLowerCase())
    ),
    email: z.preprocess(
        sanitizeString,
        z
            .string()
            .email("Invalid email address")
            .transform((val)=> val.toLowerCase())
    ),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .max(100, "Password must be at most 100 characters long")
}).strict()

export function formatZodErrors(issues:any[]){
    const errors:Record<string,string>={}

    issues.forEach(((issue)=>{
        const field = issue.path[0]
        
        if(field && !errors[field]){
            errors[field]= issue.message
        }
    }))
    return errors
}

