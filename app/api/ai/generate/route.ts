import { NextResponse } from "next/server";
export async function POST(req:Request){
 try{const {prompt}=await req.json(); if(!prompt?.trim()) return NextResponse.json({error:"Prompt is required."},{status:400});
 const key=process.env.OPENAI_API_KEY;
 if(!key) return NextResponse.json({demo:true,content:`Instagram post concept\n\nHook: ${prompt}\n\nCaption: Turn this idea into a clear, engaging story for your audience. Add a strong opening, 2–3 useful points, and a simple call to action.\n\nHashtags: #instagram #contentcreator #socialmedia #marketing #growth`});
 const r=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${key}`},body:JSON.stringify({model:process.env.OPENAI_MODEL||"gpt-5-mini",input:`Create Instagram content for this request: ${prompt}. Return a hook, caption, CTA and 8 relevant hashtags.`,max_output_tokens:700})});
 const d=await r.json(); if(!r.ok) return NextResponse.json({error:d?.error?.message||"AI request failed."},{status:500}); return NextResponse.json({content:d.output_text||"No content generated."});
 }catch{return NextResponse.json({error:"Invalid request."},{status:400})}}
