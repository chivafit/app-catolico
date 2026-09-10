"use client";
import {Share2} from "lucide-react";
export function ShareButton({title}:{title:string}){
 async function share(){const text=title;if(navigator.share)await navigator.share({title,text,url:location.href});else await navigator.clipboard.writeText(`${text} ${location.href}`)}
 return <button className="cta secondary" onClick={share}><Share2 size={16}/>Compartilhar</button>
}
