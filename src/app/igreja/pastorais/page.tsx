import Link from "next/link";
import {AppShell} from "@/components/AppShell";
import {UsersRound,BookOpen,HeartHandshake,Music2,Flame,Church,ChevronRight,ArrowLeft} from "lucide-react";
import styles from "../vida-paroquial.module.css";

const items=[
 {name:"Catequese",desc:"Iniciação à vida cristã para crianças, adolescentes, jovens e adultos.",icon:BookOpen},
 {name:"ECC",desc:"Encontro de Casais com Cristo e vida comunitária para famílias.",icon:HeartHandshake},
 {name:"EJC",desc:"Encontro de Jovens com Cristo, formação, amizade e missão.",icon:UsersRound},
 {name:"Terço dos Homens",desc:"Oração mariana, fraternidade e encontros periódicos.",icon:Church},
 {name:"Vicentinos",desc:"Serviço aos mais necessitados e presença solidária na comunidade.",icon:HeartHandshake},
 {name:"Coroinhas",desc:"Formação e serviço litúrgico para crianças e adolescentes.",icon:Church},
 {name:"Liturgia",desc:"Leitores, comentaristas, ministros e equipes de celebração.",icon:BookOpen},
 {name:"Música",desc:"Canto, instrumentos e ministérios de música da comunidade.",icon:Music2},
 {name:"RCC",desc:"Renovação Carismática Católica, grupos de oração e formação.",icon:Flame},
 {name:"Pastoral Familiar",desc:"Acolhimento, formação e acompanhamento de famílias e casais.",icon:HeartHandshake},
 {name:"Apostolado da Oração",desc:"Espiritualidade, oração e missão em comunhão com a Igreja.",icon:HeartHandshake},
 {name:"Dízimo",desc:"Pastoral de conscientização, acolhida e corresponsabilidade.",icon:Church}
];

export default function Pastorais(){return <AppShell><div className={styles.page}>
 <section className={styles.hero}><span className={styles.eyebrow}>VIDA PAROQUIAL</span><h1>Pastorais e movimentos</h1><p>Descubra onde você pode servir, aprender, rezar e participar mais de perto da sua comunidade.</p></section>
 <section className={styles.section}><div className={styles.sectionHead}><small>ENCONTRE SEU LUGAR</small><h2>Comunidades para caminhar junto</h2></div><div className={styles.grid}>{items.map(({name,desc,icon:Icon})=><Link href={`/igreja/secretaria?interesse=${encodeURIComponent(name)}`} className={styles.card} key={name}><span className={styles.icon}><Icon size={19}/></span><strong>{name}</strong><p>{desc}</p><span>Quero participar</span></Link>)}</div></section>
 <div className={styles.note}><strong>Como funciona?</strong><p>O Vinde organiza as opções da comunidade e direciona o interesse para a secretaria ou responsável da pastoral. A disponibilidade e os encontros dependem de cada paróquia.</p></div>
 <Link href="/igreja" className={styles.back}><ArrowLeft size={15}/>Voltar para Igreja</Link>
 </div></AppShell>}
