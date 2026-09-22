import {AppShell} from "@/components/AppShell";
import {HomeReference} from "@/components/HomeReference";
import {getEvents,getMassSchedules,getParish,getTodayDevotional} from "@/lib/data";

export default async function HomePage(){
 const [devotional,events,parish]=await Promise.all([getTodayDevotional(),getEvents(),getParish()]);
 const schedules=await getMassSchedules(parish?.id);
 const now=new Date();
 const today=now.getDay();
 const hhmm=now.toTimeString().slice(0,5);
 const nextMass=schedules.find((m:any)=>Number(m.weekday)===today&&String(m.starts_at).slice(0,5)>=hhmm)||null;
 return <AppShell hideHeader>
  <HomeReference devotional={devotional} event={events[0]||null} parish={parish} nextMass={nextMass}/>
 </AppShell>;
}
