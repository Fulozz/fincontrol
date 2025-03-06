# Documentação do Sistema de Controle Financeiro

## Estrutura do Projeto

O projeto está organizado da seguinte forma:

- `app/`: Contém as páginas da aplicação (Next.js App Router)
- `components/`: Componentes reutilizáveis
- `hooks/`: Hooks personalizados, incluindo simulações de chamadas de API
- `public/`: Arquivos estáticos
- `styles/`: Arquivos de estilo (se houver)

## Adaptação para API Real

Para adaptar o sistema para usar uma API real, siga estes passos:

1. Substitua as funções em `hooks/api.ts` por chamadas reais à sua API.
2. Atualize os tipos de dados em `hooks/api.ts` para corresponder à sua API.
3. Ajuste os componentes que usam esses hooks para lidar com possíveis diferenças nos dados retornados.

Exemplo de adaptação de um hook:

```typescript
export function useCards() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('https://sua-api.com/cards')
      .then(response => response.json())
      .then(data => {
        setCards(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { cards, loading, error };
}
