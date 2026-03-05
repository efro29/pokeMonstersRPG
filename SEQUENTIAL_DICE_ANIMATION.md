# Animação Sequencial de Dados - Documentação de Implementação

## Resumo das Mudanças

Implementei um sistema de animação de dados sequenciais para as batalhas de duelo, onde cada dado é rolado um de cada vez com animação individual e dano acumulativo.

## Arquivos Criados

### 1. `/components/sequential-dice-roller.tsx`
Novo componente responsável pela animação sequencial de dados:
- **Rolagem individual**: Cada dado rola um de cada vez com intervalo de 800ms entre eles
- **Animações visuais**: 
  - Dados apresentam cores diferentes durante rolagem (amarelo), completos (verde) e pendentes (cinza)
  - Brilho animado enquanto rolando
  - Exibição de dano individual após cada rolagem (-valor em vermelho)
- **Dano total**: Mostra o dano acumulativo e fórmula (ex: 5 + 3 + 1 = 9)
- **Callbacks**: Suporta callback para cada dado rolado e callback de conclusão

## Arquivos Modificados

### 2. `/components/duel-battle-scene.tsx`

#### Imports Adicionados
```typescript
import { SequentialDiceRoller } from "./sequential-dice-roller";
```

#### Estados Adicionados
```typescript
const [isSequentialRolling, setIsSequentialRolling] = useState(false);
const [sequentialDiceCount, setSequentialDiceCount] = useState(0);
const [sequentialDiceSize, setSequentialDiceSize] = useState(0);
```

#### Modificações de Funções

**`handleAttackSelect()`**:
- Extrai dados do golpe selecionado (ex: "2d6" → numDice=2, diceSize=6)
- Inicia rolagem sequencial em vez de D20
- Suporta golpes especiais com animações anime

**`handleSequentialDiceComplete()`**:
- Nova função que processa os resultados dos dados sequenciais
- Aplica dano com efetividade de tipo
- Inclui bônus de ataque do treinador (Combate/2)
- Mostra log formatado com breakdown de dano
- Transição automática para turno do rival

#### Renderização

**Seção de rolling**:
- Adiciona condição `isSequentialRolling` para renderizar `SequentialDiceRoller`
- Mantém compatibilidade com D20 para fallback
- Mostra informações de golpe (nome, formato de dados)

## Fluxo de Batalha

### Antes (Original)
1. Jogador escolhe ataque
2. D20 rola (único resultado)
3. Dano aplicado

### Depois (Novo)
1. Jogador escolhe ataque
2. Sistema extrai dados (ex: 3d6)
3. **Primeiro dado**: Animação, resultado (5)
4. **Segundo dado**: Animação, resultado (3)
5. **Terceiro dado**: Animação, resultado (1)
6. Dano total (5+3+1=9) aplicado ao rival
7. Turno do rival é executado

## Cálculo de Dano

O dano é calculado considerando:
- **Base**: Soma dos dados (ex: 5+3+1=9)
- **Bônus Treinador**: +Combate/2
- **Efetividade de Tipo**: x0.5, x1, x2 (fraco, normal, super-efetivo)
- **Multiplicador de Nível**: Ajuste baseado em diferença de nível

Exemplo: `(9 + 2) × 1.5 × 1.2 = 19.8 → 19 dano`

## Animações Visuais

### Dados Individuais
- **Tamanho**: 64x64px
- **Estados**:
  - Rolando: Fundo amarelo (#F59E0B), pulsação de escala
  - Completo: Fundo verde (#22C55E)
  - Pendente: Fundo cinza (#1E293B)
- **Efeitos**: Brilho horizontal durante rolagem

### Dano Progressivo
- Aparece sob cada dado após rolagem
- Texto em vermelho com animação de scale-in
- Formato: "Dano\n-5" (por exemplo)

### Dano Total
- Aparece após todos os dados rolarem
- Exibição grande (4xl) em vermelho escuro
- Mostra fórmula: "5 + 3 + 1 = 9"

## Casos de Uso

✅ Golpes normais com dados simples (1d6, 2d8, etc)
✅ Golpes com animações anime (efeitos de tipo especial)
✅ Múltiplos dados (3d6, 2d10, etc)
✅ Bônus de atributos do treinador
✅ Efetividade de tipo (super-efetivo, fraco, etc)
✅ Balanceamento por nível

## Logs de Batalha

Cada ataque com dados sequenciais gera log como:
```
Pikachu usou Thunderbolt: Dados [5+3+1=9] +2 (Combate) = 13 de dano! [Super Efetivo] [Nv: x1.2]
```

## Próximos Passos Opcionais

1. **Sons**: Adicionar efeito sonoro para cada dado rolando
2. **Críticos**: Sistema de crítico na rolagem sequencial
3. **Visual melhorado**: Explosões/efeitos de dano ao rival
4. **Histórico**: Mostrar breakdown detalhado de dano em tooltip
