# Vinde — Escopo Mestre

Este arquivo fixa no repositório o escopo do documento mestre de funcionalidades aprovado em 10/09/2026. O PDF é a fonte de verdade para o que o produto deve fazer; o design mobile-first aprovado é a referência de interface.

## Princípio
FÉ faz o usuário voltar. COMUNIDADE faz o usuário participar. ECONOMIA faz a plataforma monetizar.

> A paróquia distribui, o conteúdo retém e a economia monetiza.

## Regra de aceite
Uma funcionalidade só pode ser marcada como pronta quando houver interface mobile-first, lógica funcional, persistência quando aplicável, permissões/RLS, estados vazio/loading/erro e navegação integrada.

## MVP
- [x] Conta/login base por e-mail/magic link (login por telefone retirado do escopo por decisão de produto)
- [x] Onboarding e paróquia principal
- [x] Home mobile-first
- [x] Momento Diário
- [x] Minha Igreja
- [x] Eventos
- [x] Campanhas
- [x] Loja/livros e carrinho
- [x] Peregrinações básicas
- [x] Busca Global + Explorar
- [x] Painel paroquial com RLS
- [x] Analytics essenciais
- [x] Recomendações contextuais na Home

## Recomendações contextuais — implementado
O motor inicial é determinístico e explicável, sem IA generativa decidindo conteúdo religioso. A prioridade é: Momento Diário/liturgia disponível → vida da paróquia → oração conforme período do dia → próximo evento → campanha → peregrinação → descoberta da loja. A Home apresenta o rail “Para você hoje” e cada recomendação leva a uma funcionalidade existente.

A fonte editorial litúrgica brasileira indicada para validação institucional é a Edições CNBB / Igreja em Oração, que disponibiliza celebração do dia, cor litúrgica e leituras com base na tradução oficial brasileira. O app não replica automaticamente textos integrais dessa fonte até existir autorização/licença ou integração formal. Enquanto isso, usa o conteúdo editorial persistido em `daily_devotionals`, com campo de fonte explícita.

## Funcionalidades detalhadas já cobertas
Conta/perfil/LGPD; recuperação por magic link; seguir igrejas; preferências; agenda e avisos na Home; busca por tipo/cidade/data/texto/proximidade; Momento Diário com fonte/reflexão/áudio/histórico; Minha Igreja com contatos/mapa/celebrações/secretaria; eventos; campanhas; peregrinações; loja/livraria; CRUD paroquial; analytics D1/D7/D30, ativação, Momento, ativos por paróquia e CTR.

## Pendência externa antes de declarar MVP 100% validado
- [ ] auditoria ponta a ponta no deployment de produção e conteúdo real do piloto.
- [ ] formalizar autorização/licença com a fonte litúrgica escolhida antes de importar ou reproduzir textos integrais de terceiros.

## Fase 2
Checkout real; split/repasses; painel vendedor; ingressos QR; reserva de peregrinações; carteira/extrato; Premium; push notifications; biblioteca digital licenciada.

## Fase 3
Dioceses/santuários; clube de leitura; momentos da vida; intenções digitais completas; recomendações inteligentes; turismo ampliado; apps nativos se os dados justificarem.

## Guardrails
Pagamentos, repasses, doações, turismo e conteúdo editorial/licenciado exigem validação jurídica, fiscal e contratual antes do lançamento comercial. Não ativar dinheiro real apenas para completar interface.
