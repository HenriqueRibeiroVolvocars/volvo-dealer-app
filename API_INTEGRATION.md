# Guia de Integração - API de Dados de Veículos

## 📋 Resumo

Este projeto foi atualizado para consumir dados de uma API externa em vez de dados mockados. Os dados dos veículos (Volvo e competidores) agora vêm do arquivo `/public/api/vehicles.json`, que pode ser facilmente sincronizado com sua API backend.

## 🏗️ Arquitetura

### Como funciona:

1. **Hook `useVehicleData`** ([src/hooks/useVehicleData.ts](src/hooks/useVehicleData.ts))
   - Faz fetch dos dados do endpoint `/api/vehicles.json`
   - Transforma raw data em estrutura de modelos Volvo + competidores
   - Filtra por tipo (Premium / Non Premium)
   - Cache com React Query (5 minutos)

2. **Componentes que usam os dados:**
   - `ComparativoPage.tsx` - Comparação Premium
   - `ComparativoNonPremiumPage.tsx` - Comparação Non Premium
   - `ComparativoSelectorPage.tsx` - Seletor de tipo

### Estrutura de dados esperada (JSON):

```json
[
  {
    "name": "Volvo EX30 Core",
    "price": "229.950",
    "motorType": "BEV",
    "power": "272",
    "acceleration": "5,7",
    "autonomy": "250",
    "battery": "51",
    "chargingTime": "26",
    "trunk": "318",
    "os": "Google",
    "ncapAdult": "88%",
    "ncapChildren": "85%",
    "dealerships": "52",
    "materials": "Premium Escandinavo",
    "resaleValue": "65-70%",
    "flag1": "Volvo",
    "flag2": "Premium",
    "volvoModel": "EX30"
  },
  {
    "name": "Mini Aceman E",
    "price": "254.990",
    "motorType": "BEV",
    "power": "184",
    "acceleration": "9,0",
    "autonomy": "270",
    "battery": "49,2",
    "chargingTime": "30",
    "trunk": "300",
    "os": "Mini OS",
    "ncapAdult": "83%",
    "ncapChildren": "80%",
    "dealerships": "50",
    "materials": "Premium Britânico",
    "resaleValue": "55-65%",
    "flag1": "EX30",
    "flag2": "Premium"
  }
]
```

## 🔄 Mapeamento de campos

| CSV Input | JSON API | Descrição |
|-----------|----------|-----------|
| `model` | `name` | Nome completo do veículo |
| `price` | `price` | Preço (sem "R$") |
| `engine` | `motorType` | Tipo de motor (BEV, PHEV, ICE, etc) |
| `power` | `power` | Potência em cv |
| `intensity` | `acceleration` | 0-100 km/h em segundos |
| `autonomy` | `autonomy` | Autonomia em km |
| `battery` | `battery` | Capacidade da bateria |
| `time_recharge` | `chargingTime` | Tempo de recarga |
| `trunk` | `trunk` | Volume do porta-malas |
| `sistem` | `os` | Sistema operacional |
| `ncap_adult` | `ncapAdult` | NCAP - Adultos |
| `ncap_child` | `ncapChildren` | NCAP - Crianças |
| `dealers` | `dealerships` | Número de concessionárias |
| `quality_materials` | `materials` | Qualidade de materiais |
| `resale` | `resaleValue` | Valor de revenda % |
| `comparison` | `flag1` | "Volvo" ou modelo que compete (ex: "EX30") |
| `segment` | `flag2` | "Premium" ou "Non Premium" |

## 📝 Como atualizar os dados

### Opção 1: Usar o script automático

Se você tiver um arquivo CSV com os dados dos veículos:

```bash
node scripts/convertCsvToJson.js data/vehicles.csv public/api/vehicles.json
```

### Opção 2: Conectar com API backend

Modifique o `useVehicleData` hook para apontar para sua API:

```typescript
// src/hooks/useVehicleData.ts
const API_URL = 'https://sua-api.com/api/vehicles'; // Trocar aqui
```

## 📂 Arquivo CSV de referência

Exemplo de formato CSV esperado (`data/vehicles.csv`):

```
model	price	engine	power	intensity	autonomy	battery	time_recharge	trunk	sistem	ncap_adult	ncap_child	dealers	quality_materials	resale	comparison	segment
Volvo EX30 Core	229.950	BEV	272	5,7	250	51	26	318	Google	88%	85%	52	Premium Escandinavo	65-70%	Volvo	Premium
Mini Aceman E	254.990	BEV	184	9,0	270	49,2	30	300	Mini OS	83%	80%	50	Premium Britânico	55-65%	EX30	Premium
```

**Importante:** O arquivo deve estar em formato TSV (separado por TAB) ou CSV (separado por vírgula).

## 🔧 Arquivo de conversão TypeScript

Para usar em browsers ou projetos Node.js TypeScript, use:

```typescript
import { convertCSVToAPI } from '@/utils/csvConverter';

const csvRecord = {
  model: 'Volvo EX30 Core',
  price: '229.950',
  engine: 'BEV',
  // ... outros campos
  comparison: 'Volvo',
  segment: 'Premium'
};

const apiRecord = convertCSVToAPI(csvRecord);
```

## 🧪 Testando localmente

1. **Desenvolvimento:**
   ```bash
   npm run dev
   # Acessa: http://localhost:8080/
   ```

2. **Build para produção:**
   ```bash
   npm run build
   npm run preview
   ```

## 📊 Fluxo de dados

```
CSV/API Backend
       ↓
   vehicles.json
       ↓
useVehicleData hook
       ↓
transformData() → agrupa por modelo Volvo + competidores
       ↓
filtro por "Premium" ou "Non Premium"
       ↓
Componentes de comparação (ComparativoPage, etc)
       ↓
Visualização no UI
```

## ⚠️ Notas importantes

### Flags (`flag1` e `flag2`)

- **flag1 / comparison**: 
  - `"Volvo"` para carros Volvo (idealmente). A lógica do front‑end agora
    também detecta Volvo quando o nome/model contém a palavra "Volvo",
    quando não há `name`/`model` informado, ou (em último caso) quando o valor
    se iguala a um dos modelos já identificados (por exemplo, `"EX30"`).
    Ainda assim é recomendável que sua API marque explicitamente os veículos
    Volvo com `"Volvo"` para evitar ambiguidades.
  - Opcionalmente, pode usar o próprio modelo (ex: `"EX30"`) em registros
    Volvo; a aplicação converte esse valor para o nome do modelo automaticamente.

- **flag2 / segment**: 
  - `"Premium"` ou `"Non Premium"`

### Exemplos corretos de flag1:

```json
// Volvo (com volvoModel)
{ "name": "Volvo EX30 Core", "flag1": "Volvo", "flag2": "Premium", "volvoModel": "EX30" }

// Competidor do EX30 Premium
{ "name": "Mini Aceman E", "flag1": "EX30", "flag2": "Premium" }

// Competidor do EX30 Non Premium
{ "name": "BYD Yuan Plus", "flag1": "EX30", "flag2": "Non Premium" }
```

## 🌐 Certificado SSL / CORS

Se sua API está em domínio diferente, configure CORS:

```typescript
// Exemplo em Node.js/Express
app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true
}));
```

## ❓ Troubleshooting

### Dados não aparecem na página?

1. Verifique no DevTools → Network → `/api/vehicles.json`
2. Verifique se o endpoint está retornando JSON válido
3. Verifique o console para erros de parsing

### Competidores não aparecem?

- Certifique-se que `flag1` tem o modelo Volvo correto (ex: `"EX30"`)
- Certifique-se que `flag2` é exatamente `"Premium"` ou `"Non Premium"`

### Diferença entre acceleração e intensity?

- Ambos representam o mesmo conceito: **tempo para 0-100 km/h em segundos**
- Seu CSV usa `intensity`, a API usa `acceleration`
- A conversão é automática

## 📞 Suporte

Para questões sobre: - Query de dados: Ver [src/hooks/useVehicleData.ts](src/hooks/useVehicleData.ts)
- Transformação: Ver [src/utils/csvConverter.ts](src/utils/csvConverter.ts)
- Componentes: Ver [src/pages/ComparativoPage.tsx](src/pages/ComparativoPage.tsx)
