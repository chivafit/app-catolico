insert into public.dioceses (name, city, state, verified)
values ('Diocese de Guaxupé', 'Guaxupé', 'MG', true)
on conflict do nothing;

insert into public.parishes (name, slug, city, state, address, verified)
values ('Paróquia São Sebastião', 'sao-sebastiao-piumhi', 'Piumhi', 'MG', 'Piumhi - MG', true)
on conflict (slug) do nothing;

insert into public.daily_devotionals (devotional_date, title, scripture_reference, reflection, prayer, purpose, published)
values (
  current_date,
  'Comece o dia com presença',
  'Evangelho do dia',
  'Nem tudo precisa ser resolvido antes de você dar o primeiro passo. Hoje, escolha agir com presença, confiança e caridade.',
  'Senhor, ajuda-me a viver este dia com serenidade, discernimento e atenção às pessoas que colocares no meu caminho.',
  'Faça um gesto concreto de escuta ou reconciliação com alguém.',
  true
)
on conflict (devotional_date) do nothing;

insert into public.sellers (name, verified, commission_bps)
values ('Livraria Parceira Demo', true, 1500);
