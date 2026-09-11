"use client";

import "./oracoes.css";
import {useMemo,useState} from "react";
import {AppShell} from "@/components/AppShell";
import {BookHeart,ChevronDown,ChevronUp,Heart,Search,Sparkles,Sun,Moon,Shield,Church} from "lucide-react";

type Prayer={id:string;title:string;category:string;moment:string;icon:"heart"|"sun"|"moon"|"shield"|"church";text:string};

const prayers:Prayer[]=[
{id:"pai-nosso",title:"Pai-Nosso",category:"Essenciais",moment:"Para todos os momentos",icon:"church",text:"Pai nosso que estais nos céus, santificado seja o vosso nome; venha a nós o vosso Reino; seja feita a vossa vontade, assim na terra como no céu. O pão nosso de cada dia nos dai hoje; perdoai-nos as nossas ofensas, assim como nós perdoamos a quem nos tem ofendido; e não nos deixeis cair em tentação, mas livrai-nos do mal. Amém."},
{id:"ave-maria",title:"Ave-Maria",category:"Marianas",moment:"Confiança e intercessão",icon:"heart",text:"Ave Maria, cheia de graça, o Senhor é convosco; bendita sois vós entre as mulheres e bendito é o fruto do vosso ventre, Jesus. Santa Maria, Mãe de Deus, rogai por nós, pecadores, agora e na hora de nossa morte. Amém."},
{id:"gloria",title:"Glória ao Pai",category:"Essenciais",moment:"Louvor breve",icon:"sparkles",text:"Glória ao Pai, ao Filho e ao Espírito Santo, como era no princípio, agora e sempre. Amém."},
{id:"santo-anjo",title:"Santo Anjo",category:"Proteção",moment:"Ao começar ou terminar o dia",icon:"shield",text:"Santo Anjo do Senhor, meu zeloso guardador, se a ti me confiou a piedade divina, sempre me rege, me guarda, me governa e me ilumina. Amém."},
{id:"salve-rainha",title:"Salve Rainha",category:"Marianas",moment:"Amparo de Nossa Senhora",icon:"heart",text:"Salve, Rainha, Mãe de misericórdia, vida, doçura e esperança nossa, salve! A vós bradamos, os degredados filhos de Eva. A vós suspiramos, gemendo e chorando neste vale de lágrimas. Eia, pois, advogada nossa, esses vossos olhos misericordiosos a nós volvei. E, depois deste desterro, mostrai-nos Jesus, bendito fruto do vosso ventre. Ó clemente, ó piedosa, ó doce sempre Virgem Maria. Rogai por nós, Santa Mãe de Deus, para que sejamos dignos das promessas de Cristo. Amém."},
{id:"sao-miguel",title:"São Miguel Arcanjo",category:"Proteção",moment:"Força nas dificuldades",icon:"shield",text:"São Miguel Arcanjo, defendei-nos no combate. Sede nosso refúgio contra as maldades e ciladas do demônio. Ordene-lhe Deus, instantemente o pedimos; e vós, príncipe da milícia celeste, pela virtude divina, precipitai no inferno a Satanás e aos outros espíritos malignos que andam pelo mundo para perder as almas. Amém."},
{id:"ato-contricao",title:"Ato de Contrição",category:"Reconciliação",moment:"Exame de consciência",icon:"church",text:"Meu Deus, eu me arrependo de todo o coração de vos ter ofendido, porque sois tão bom e amável. Prometo, com a vossa graça, esforçar-me para não mais pecar e evitar as ocasiões de pecado. Senhor, tende piedade de mim. Amém."},
{id:"sao-francisco",title:"Oração pela Paz",category:"Paz",moment:"Serviço e reconciliação",icon:"heart",text:"Senhor, fazei de mim um instrumento de vossa paz. Onde houver ódio, que eu leve o amor; onde houver ofensa, que eu leve o perdão