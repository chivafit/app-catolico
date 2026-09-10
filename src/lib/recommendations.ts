export type FaithRecommendation={id:string;title:string;subtitle:string;href:string;kind:"liturgy"|"parish"|"prayer"|"event"|"campaign"|"pilgrimage"|"shop";priority:number};

type Context={devotional?:any;parish?:any;events?:any[];campaigns?:any[];pilgrimages?:any[];products?:any[]};

const hourSP=()=>Number(new Intl.DateTimeFormat("pt-BR",{timeZone:"America/Sao_Paulo",hour:"2-digit",hour12:false}).format(new Date()));

export function buildFaithRecommendations(c:Context):FaithRecommendation[]{
 const out:FaithRecommendation[]=[];
 if(c.devotional) out.push({id:"daily",title:"Momento Diário",subtitle:c.devotional.scripture_reference?`Palavra de hoje • ${c.devotional.scripture_reference}`:"Reserve alguns minutos para a Palavra",href:"/momento",kind:"liturgy",priority:100});
 if(c.parish) out.push({id:"parish",title:"Viver minha paróquia",subtitle:`Horários, avisos e vida da ${c.parish.name||"sua igreja"}`,href:"/igreja",kind:"parish",priority:90});
 const h=hourSP();out.push({id:"prayer",title:h<12?"Começar o dia em oração":h<18?"Uma pausa para rezar":"Encerrar o dia com Deus",subtitle:"Um convite simples para viver a fé hoje",href:"/oracoes",kind:"prayer",priority:85});
 const ev=c.events?.[0];if(ev)out.push({id:`event-${ev.id}`,title:ev.title,subtitle:"Próximo da vida da comunidade",href:"/eventos",kind:"event",priority:75});
 const campaign=c.campaigns?.[0];if(campaign)out.push({id:`campaign-${campaign.id}`,title:campaign.title,subtitle:"Uma forma concreta de participar",href:"/campanhas",kind:"campaign",priority:60});
 const trip=c.pilgrimages?.[0];if(trip)out.push({id:`pilgrimage-${trip.id}`,title:trip.title,subtitle:"Caminhos de fé para conhecer",href:"/peregrinacoes",kind:"pilgrimage",priority:45});
 const product=c.products?.[0];if(product)out.push({id:`product-${product.id}`,title:product.title||product.name,subtitle:"Selecionado na Loja Ágora Fide",href:"/loja",kind:"shop",priority:30});
 return out.sort((a,b)=>b.priority-a.priority).slice(0,5);
}
