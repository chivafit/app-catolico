export const SERVER_FETCH_TIMEOUT_MS=9000;

export class ServerFetchTimeoutError extends Error{
 constructor(public readonly label:string,public readonly timeoutMs:number=SERVER_FETCH_TIMEOUT_MS){
  super(`${label}: timeout after ${timeoutMs}ms`);
  this.name="ServerFetchTimeoutError";
 }
}

export async function withServerTimeout<T>(promise:PromiseLike<T>,label:string,timeoutMs=SERVER_FETCH_TIMEOUT_MS):Promise<T>{
 let timer:ReturnType<typeof setTimeout>|undefined;
 try{
  return await Promise.race([
   Promise.resolve(promise),
   new Promise<T>((_,reject)=>{timer=setTimeout(()=>reject(new ServerFetchTimeoutError(label,timeoutMs)),timeoutMs)})
  ]);
 }finally{
  if(timer)clearTimeout(timer);
 }
}

export function isServerFetchTimeout(error:unknown):error is ServerFetchTimeoutError{
 return error instanceof ServerFetchTimeoutError||Boolean(error&&typeof error==="object"&&"name" in error&&(error as {name?:string}).name==="ServerFetchTimeoutError");
}
