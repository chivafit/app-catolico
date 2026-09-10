-- Ágora Fide — preparação do piloto real em Piumhi/MG
-- Dados institucionais abaixo devem ser publicados somente quando houver fonte oficial validada.
-- Fonte consultada em 10/09/2026: Diocese de Luz — Paróquia São Sebastião, Piumhi/MG.

-- Corrige a diocese do seed antigo: Piumhi pertence à Diocese de Luz, não à Diocese de Guaxupé.
insert into public.dioceses (name, city, state, verified)
values ('Diocese de Luz', 'Luz', 'MG', true)
on conflict do nothing;

update public.parishes p
set diocese_id = d.id,
    verified = true
from public.dioceses d
where p.slug = 'sao-sebastiao-piumhi'
  and d.name = 'Diocese de Luz';

-- Não inventar telefone, endereço ou horários: preencher apenas após confirmação em fonte oficial.
-- O app pode manter a paróquia disponível para seleção mesmo enquanto campos ainda estiverem nulos.

-- Conteúdo de demonstração deve continuar claramente identificado até substituição por conteúdo pastoral validado.
update public.parish_posts
set title = case when title ilike '%demo%' then title else '[DEMONSTRAÇÃO] ' || title end
where parish_id = (select id from public.parishes where slug='sao-sebastiao-piumhi')
  and coalesce(title,'') not ilike '[DEMONSTRAÇÃO]%';
