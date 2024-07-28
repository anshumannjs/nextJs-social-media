import { cloudinary } from "./cloudinaryConfig";
import { createServerClient, CookieOptions, createBrowserClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// export const uploadeToCloudinary=async (fileUri: string)=>{
//     const result=await cloudinary.uploader.upload(fileUri, { folder: "userss", use_filename: true })

//     return result
// }

export const uploadToSupabaseFromServer=async (file: File)=>{
    const cookieStore=cookies()

    const supabase=createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string){
                    return cookieStore.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions){
                    try{
                        cookieStore.set({name, value, ...options})
                    }
                    catch(err){
                        console.log(err)
                    }
                },
                remove(name: string, options: CookieOptions){
                    try{
                        cookieStore.set({name, value: "", ...options})
                    }
                    catch(err){
                        console.log(err)
                    }
                }
            }
        }
    )

    const b64=Buffer.from(await file?.arrayBuffer()).toString("base64")
    const {data, error}=await supabase.storage.from("images").upload(file.name, b64, {
        upsert: true
    })
    console.log("data", data)
    console.log("err", error)
    if (data){
        const result= supabase.storage.from("images").getPublicUrl(data?.path!)
        console.log(result)
        return {data: result.data, error: null}
    }
    return {data, error}
}