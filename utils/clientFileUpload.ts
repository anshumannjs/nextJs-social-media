import restrictedApi from "@/middleware/restrictedApi";
import { createBrowserClient } from "@supabase/ssr";
import { NextResponse } from "next/server";


export const uploadToSupabaseFromClient=async (value: {file: File[], caption: string, location: string, tags: string})=>{
    const {hasAccess}=await restrictedApi()

    if(hasAccess){
        const supabase=createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,)
    
        const b64=Buffer.from(await value.file[0]?.arrayBuffer()).toString("base64")
        
        const {data, error}=await supabase.storage.from("images").createSignedUploadUrl(value.file[0].name,{
            upsert: true
        })
        console.log("data", data)
        console.log("err", error)
        if (data){
            const result=await supabase.storage.from("images").uploadToSignedUrl(data?.path!, data.token, b64)
            if (result.data){
                const fetchResult=await fetch("/api/post", {
                    method: "POST",
                    body: JSON.stringify({...value, uploadedImage: result.data})
                })

                console.log(fetchResult)
                return fetchResult
            }
            else{
                return NextResponse.json({status: 400, message: "couldn't upload image"})
            }
        }
        else{
            return NextResponse.json({status: 400, message: "couldn't upload image"})
        }
    }
}