import Link from "next/link";
import {AppShell} from "@/components/AppShell";
import {Heart,Church,BookOpen,FileText,Baby,UsersRound,CalendarDays,ChevronRight,ArrowLeft} from "lucide-react";
import styles from "../vida-paroquial.module.css";

const sacraments=[
 {name:"Batismo",desc:"Orientações, documentos, encontro de pais e padrinhos e datas disponíveis.",cta:"Iniciar preparação",icon:Baby},
 {name:"Matrimônio",desc:"Primeiros passos para celebrar o casamento na Igreja e organizar o processo paroquial.",cta:"Quero me casar na Igreja",icon:Heart},
 {name:"Curso de noivos",desc:"Preparação para o matrimônio, encontros e orientações para o casal.",cta:"Ver preparação",icon:UsersRound},
 {name:"Primeira Eucaristia",desc:"Informações sobre catequese, idade, turmas e preparação sacramental.",cta:"Ver inscrição",icon:BookOpen},
 {name:"Crisma",desc:"Turmas, preparação, encontros e documentação necessária.",cta:"Ver inscrição",icon:Church},
 {name:"Confissão",desc:"Consulte horários e orientações para o sacramento da Reconciliação.",cta:"Consultar",icon:Church}
];
const office=[
 {name:"Intenção de missa",desc:"Orientações para solicitar intenção e verificar celebrações disponíveis.",icon:CalendarDays},
 {name:"Certidões e documentos",desc:"Batismo, casamento e outros registros emitidos pela secretaria paroquial.",icon:FileText},
 {name:"Atendimento paroquial",desc:"Horários da secretaria e direcionamento para o atendimento adequado.",icon:Church},
 {name:"Inscrição na catequese",desc:"Informações sobre turmas, faixa etária, responsáveis e período de matrícula.",icon:BookOpen}
];

export default function Secretaria(){return <AppShell><div className={styles.page}>
 <section className={styles.hero}><span className={styles.eyebrow}>SECRETARIA PAROQUIAL</span><h1>Sacramentos e serviços</h1><p>Um ponto de partida simples para entender etapas, documentos e preparação antes de falar com a sua paróquia.</p></section>
 <section className={styles.section} id="formacao"><div className={styles.sectionHead}><small>SACRAMENTOS & FORMAÇÃO</small><h2>Para cada momento da vida</h2></div><div className={styles.grid}>{sacraments.map(({name,desc,cta,icon:Icon})=><a href="#atendimento" className={styles.card} key={name}><span className={styles.icon}><Icon size={19}/></span><strong>{name}</strong><p>{desc}</p><span>{cta}</span></a>)}</div></section>
 <section className={styles.section} id="atendimento"><div className={styles.sectionHead}><small>SECRETARIA</small><h2>Serviços paroquiais</h2></div><div className={styles.featured}>{office.map(({name,desc,icon:Icon})=><div className={styles.featuredRow} key={name}><span><Icon size={18}/></span><div><strong>{name}</strong><small>{desc}</small></div><ChevronRight size={16}/></div>)}</div></section>
 <div className={styles.note}><strong>Sobre casamento e batismo</strong><p>O Vinde não trata esses sacramentos como uma reserva comum. A ideia é iniciar o processo: mostrar requisitos, preparação, documentos e datas indicadas pela paróquia; a confirmação final depende da secretaria e das normas pastorais locais.</p></div>
 <Link href="/igreja" className={styles.back}><ArrowLeft size={15}/>Voltar para Igreja</Link>
 </div></AppShell>}
