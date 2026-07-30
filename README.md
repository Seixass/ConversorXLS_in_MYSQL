# Sistema RDB — Conversor XLS/XLSX → MySQL

## O que é

Um sistema web para pegar uma planilha (`.xls`/`.xlsx`) e transformar ela numa tabela
MySQL de verdade, sem precisar escrever `CREATE TABLE` nem `INSERT` na mão. Você sobe o
arquivo, o sistema lê as colunas e adivinha o tipo de cada uma (texto, número, data...),
você confere/ajusta se quiser, e ele cria a tabela e insere todas as linhas — com um
relatório no final dizendo o que deu certo e o que falhou.

- **Backend**: Laravel 13 (PHP) + [PhpSpreet.readthedocs.io/) — API REST.
- **Frontend**: React 19 (Vite) — tela única com 3 passos.
- **Banco**: MySQL — ainda não configuradoseguinte).

## Como funciona (os 3 passos na tela)

1. **Upload** — você arrasta a planilha e tabela (ou deixa
   em branco, que ele usa o nome do arquivo). O sistema lê o cabeçalho e uma amostra das
   linhas para adivinhar o tipo de cada co
2. **Conferência** — mostra as colunas detectadas, o tipo que ele escolheu pra cada uma
   e uma prévia dos dados. Você pode renomrcar se aceita
   vazio, e mudar o nome da tabela — antes de qualquer coisa ser gravada no banco.
3. **Relatório** — ao confirmar, a importala), então dá pra
   acompanhar o progresso em tempo real. No final, mostra quantas linhas foram lidas,
   quantas entraram com sucesso, e o motivélula com tipo
   errado, linha vazia, etc.) — sem travar o import inteiro por causa de uma linha ruim.

## O banco de dados: como adicionar e como ir alimentando

**Hoje o projeto não tem nenhum MySQL configurado de propósito** — as credenciais em
`backend/.env` estão em branco pra você prsar (local, de
teste, de produção, o que for).

### Adicionar o banco (uma vez só)

1. Crie um banco vazio no seu MySQL: `CREATE DATABASE conversor_xls;` (o nome é livre).
2. Preencha `backend/.env` com host/porta/banco.
3. Rode `php artisan migrate` — isso cria só as tabelas internas do próprio sistema
   (`users`, `cache`, `jobs`, `spreadsheets relatórios de
   cada importação). **Nenhuma tabela de dados sua é criada aqui** — essas nascem
   depois, uma por importação.

Ou seja: existe **um banco só**, configura tanto o próprio
sistema guarda seu histórico de importações quanto as tabelas que você importa vão
aparecer.

### Como ir alimentando (importações segui

Cada vez que você sobe uma planilha e confE TABLE` novo com
o nome que você deu. **Não existe hoje um jeito de "somar" linhas numa tabela que já
existe** — se você tentar importar de novo já foi criado, a
importação falha avisando que a tabela já existe (é proposital, pra não sobrescrever ou
duplicar dados sem querer).

Na prática, "ir alimentando" o banco funci

- Cada planilha nova vira uma tabela nova,`funcionarios_julho`,
  `funcionarios_agosto`, ou `vendas_2026_08`, `vendas_2026_09`...).
- Se você quiser **atualizar** uma tabela s da mesma
  origem, hoje o caminho é: apagar a tabela antiga (`DROP TABLE` direto no MySQL, fora
  do sistema) e importar de novo com o mesome novo e trocar
  qual tabela seus relatórios/consultas usam.
- Se no futuro for necessário **acrescentaente** (em vez de
  sempre criar uma tabela nova), isso é uma funcionalidade nova a ser construída — hoje
  o `TableBuilder` sempre cria e nunca ins.

## Rodando o projeto

### Pré-requisitos

- PHP 8.3+ com extensões `pdo_mysql`, `zipue com `php -m`)
- Composer
- Node.js 18+ e npm
- Um servidor MySQL acessível (local ou remoto)

### Backend (Laravel)

```bash
cd backend
composer install
cp .env.example .env      # se ainda não t
php artisan key:generate
# edite o .env com as credenciais MySQL (sa)
php artisan migrate        # cria users, cache, jobs e spreadsheet_imports
php artisan serve          # sobe a API em
```

Em **outro terminal**, suba também o worker de fila — é ele quem processa a importação
em segundo plano (sem isso, uma importaçãoueued` para sempre):

```bash
cd backend
php artisan queue:work
```

### Frontend (React)

```bash
cd frontend
npm install
cp .env.example .env    # se ainda não tivbackend não estiver em localhost:8000
npm run dev              # sobe em http://localhost:5173
```

Abra `http://localhost:5173` no navegador.

## Estrutura de pastas

```
SistemaRDBConversorXLS/
├── backend/                          # AP
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/SpreadsheetImportController.php
│   │   │   └── Requests/             # vamação
│   │   ├── Jobs/ImportSpreadsheetJob.php   # importação em lote (fila)
│   │   ├── Models/SpreadsheetImport.php  a importação
│   │   └── Services/Spreadsheet/
│   │       ├── SpreadsheetAnalyzer.php   nas e amostra dados
│   │       ├── TypeInferrer.php            # infere tipo (texto/inteiro/decimal/data/booleano)
│   │       ├── ColumnNameNormalizer.php  tificadores MySQL válidos
│   │       ├── TableBuilder.php            # gera o CREATE TABLE dinamicamente (falha se a tabela já existir)
│   │       ├── RowCaster.php             la na hora de inserir
│   │       └── ChunkReadFilter.php         # leitura da planilha em blocos (arquivos grandes)
│   ├── database/migrations/          # tao as importadas)
│   ├── routes/api.php                # rotas da API
│   ├── storage/app/private/          # plemporariamente
│   └── .env / .env.example           # credenciais MySQL em branco
└── frontend/                         # SP
    └── src/
        ├── api/client.js             # cl)
        ├── components/
        │   ├── UploadStep.jsx        # 1.
        │   ├── MappingStep.jsx       # 2. conferir/editar colunas, tipos e nome da tabela
        │   └── ReportStep.jsx        # 3. relatório final
        └── App.jsx                  # orquestra os 3 passos acima
```

## Exemplo de uso via linha de comando (AP

Se preferir automatizar sem a interface, dte:

```bash
# 1. Analisar a planilha (recebe o import_id e as colunas detectadas)
curl -X POST http://localhost:8000/api/spr
  -F "file=@planilha.xlsx" \
  -F "table_name=minha_tabela"

# 2. Confirmar o mapeamento e disparar a i
curl -X POST http://localhost:8000/api/spreadsheets/imports/1/confirm \
  -H "Content-Type: application/json" \
  -d '{
    "table_name": "minha_tabela",
    "columns": [
      {"column_name": "nome", "type": "str
      {"column_name": "idade", "type": "integer", "nullable": true}
    ]
  }'

# 3. Consultar o relatório (repita até status = completed|failed)
curl http://localhost:8000/api/spreadsheet
```

## Como funciona a inferência de tipos

A cada coluna, o `SpreadsheetAnalyzer` lê uma amostra das linhas (até 200 por padrão) e
o `TypeInferrer` decide o tipo MySQL com b

| Tipo detectado | Quando | Coluna MySQL |
|---|---|---|
| `integer` | todos os valores são números
| `decimal` | todos os valores são numéricos (com casas decimais) | `DECIMAL(18,4)` |
| `boolean` | todos os valores são `0`/`1`
| `date` | todas as células têm formatação de data do Excel, sem hora | `DATE` |
| `datetime` | idem, com componente de hor
| `string` / `text` | qualquer outro caso (inclui tipos inconsistentes) | `VARCHAR(255)` / `TEXT` |

Se uma coluna tiver valores de tipos misturados (ex: números e texto juntos), ela cai
para `string` por segurança — você pode foa tela de
conferência, mas aí linhas incompatíveis com o tipo escolhido serão reportadas como
falha na importação (em vez de travar o pr

## Tratamento de erros e formatos de data

- **Linhas totalmente vazias** são ignoradmotivo
  `linha vazia (ignorada)` no relatório.
- **Células com tipo incompatível** (ex: tmo `integer`)
  fazem aquela linha falhar, mas não interrompem a importação das demais.
- **Datas** aceitam tanto o valor nativo dem formatos comuns
  (`Y-m-d`, `d/m/Y`, `d-m-Y`, `m/d/Y`, com ou sem hora); se nenhum formato bater, a linha
  falha com o motivo registrado.
- **Encoding**: o PhpSpreadsheet já normaliza para UTF-8 na leitura de `.xls`/`.xlsx`;
  como reforço, qualquer string que não sea a partir de
  Windows-1252 antes de inserir.
- **Arquivos grandes**: a leitura e a inse00 linhas por vez
  (`ImportSpreadsheetJob::CHUNK_SIZE`), rodando em fila (background job) para não travar
  a requisição HTTP nem estourar memória.

## Por que não usei o pacote Laravel Excel

Neste ambiente o PHP é 8.5, e nem o `maatw
`phpoffice/phpspreadsheet` que ele trava (`^1.30`) suportam PHP 8.5 ainda. Por isso o
projeto usa o `phpoffice/phpspreadsheet` (vel Excel)
diretamente — o que também dá controle total sobre a inferência de tipos e a leitura em
blocos, que são customizadas mesmo. Se o site/excel` também
funcionaria, mas não é necessário.
