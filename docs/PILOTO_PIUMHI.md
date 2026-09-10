# Ágora Fide — Runbook do piloto em Piumhi/MG
Data: 10/09/2026

## Objetivo do piloto
Validar três comportamentos antes de ampliar o produto:
1. retorno ao Momento Diário;
2. vínculo e uso recorrente de uma paróquia;
3. intenção comercial em marketplace/peregrinação, mantendo cobrança desligada até validação jurídica e gateway.

## Escopo liberado
- cadastro/login e onboarding;
- escolha de cidade e paróquia;
- Home personalizada;
- Momento Diário, conclusão, streak, favorito e compartilhamento;
- Minha Igreja, horários, avisos, eventos, campanhas e contato quando os dados estiverem validados;
- Explorar;
- Eventos e inscrição gratuita;
- Peregrinações em modo interesse, sem cobrança;
- Loja, produto e carrinho, sem checkout financeiro;
- Perfil, favoritos, pedidos/doações e configurações;
- painel paroquial com acesso controlado;
- analytics essenciais.

## Conteúdo real e regra editorial
Piumhi/MG pertence à Diocese de Luz. A Paróquia São Sebastião é a entidade inicial do piloto. Não publicar telefone, endereço, horários, eventos, campanhas ou avisos como oficiais sem validação em fonte institucional ou diretamente com a paróquia. Conteúdo editorial temporário deve carregar indicação explícita de demonstração.

Não foram encontrados, nesta rodada, dados oficiais suficientes para sustentar no app as opções “Paróquia São João Batista” e “Paróquia Nossa Senhora Aparecida” como paróquias de Piumhi. Elas não devem ser cadastradas como entidades verificadas até confirmação institucional.

## Experiência do primeiro usuário
1. abrir Ágora Fide;
2. criar/entrar na conta;
3. informar Piumhi/MG;
4. escolher uma paróquia validada ou “Ainda não encontrei minha paróquia”;
5. escolher interesses;
6. entrar na Home;
7. concluir o Momento Diário;
8. abrir Minha Igreja;
9. explorar evento/peregrinação/loja;
10. retornar no dia seguinte.

## Checklist antes de convidar usuários externos
- deployment de produção concluído;
- variáveis públicas do Supabase configuradas no ambiente;
- redirects de Auth apontando para domínio final;
- `/api/health` respondendo;
- smoke test em iPhone e Android;
- ao menos uma paróquia parceira com nome e dados institucionais confirmados;
- textos de Termos e Privacidade revisados para o responsável legal do piloto;
- checkout, doações e reservas financeiras mantidos desligados;
- nenhum conteúdo fictício apresentado como oficial.

## Smoke test obrigatório
- abrir splash/boas-vindas;
- login e retorno de sessão;
- onboarding completo;
- seleção/troca de paróquia;
- Home sem erro;
- Momento Diário: concluir, favoritar e compartilhar;
- Minha Igreja: navegar por horários/avisos/eventos/campanhas;
- Explorar e filtros;
- inscrição gratuita em evento;
- interesse em peregrinação sem cobrança e sem duplicidade;
- produto -> carrinho -> alterar quantidade -> remover;
- checkout exibe bloqueio do piloto;
- Perfil, Favoritos, Pedidos, Doações, Configurações;
- logout e novo login;
- acesso comum negado aos painéis administrativos.

## Métricas do primeiro ciclo
- contas criadas;
- onboarding concluído;
- usuários com paróquia principal;
- conclusão do Momento Diário;
- D1 e D7;
- streak médio;
- visitas a Minha Igreja;
- cliques em contato/localização;
- inscrições em eventos;
- interesses em peregrinação;
- produtos adicionados ao carrinho.

## Bloqueios externos atuais
O código pode ser preparado integralmente no GitHub, mas publicação e teste em dispositivo dependem de um deployment acessível. Em 10/09/2026, o status Vercel associado aos commits permanece em falha por `build-rate-limit`. Isso impede declarar o piloto publicamente lançado até o bloqueio da conta ser resolvido.
