insert into public.dioceses (name, city, state, verified)
values ('Diocese de Luz', 'Luz', 'MG', true)
on conflict do nothing;

insert into public.parishes (diocese_id, name, slug, city, state, address, verified)
select d.id, 'Paróquia São Sebastião', 'sao-sebastiao-piumhi', 'Piumhi', 'MG', 'Piumhi - MG', true
from public.dioceses d
where d.name = 'Diocese de Luz'
limit 1
on conflict (slug) do update set diocese_id=excluded.diocese_id, verified=true;

-- Conteúdo editorial temporário do piloto. Não apresentar como liturgia oficial.
insert into public.daily_devotionals (devotional_date, title, scripture_reference, reflection, prayer, purpose, published)
values (
  current_date,
  '[Demonstração] Comece o dia com presença',
  'Conteúdo de demonstração',
  'Nem tudo precisa ser resolvido antes de você dar o primeiro passo. Hoje, escolha agir com presença, confiança e caridade.',
  'Senhor, ajuda-me a viver este dia com serenidade, discernimento e atenção às pessoas que colocares no meu caminho.',
  'Faça um gesto concreto de escuta ou reconciliação com alguém.',
  true
)
on conflict (devotional_date) do nothing;

insert into public.sellers (name, verified, commission_bps)
values ('Livraria Parceira Demo', false, 1500);
