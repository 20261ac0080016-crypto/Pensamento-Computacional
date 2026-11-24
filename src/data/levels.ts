import {
  AbstractionLevel,
  AlgorithmLevel,
  DecompositionLevel,
  PatternLevel,
  PillarMeta,
} from '../types/game';

export const PILLARS: PillarMeta[] = [
  {
    id: 'decomposition',
    order: 1,
    title: 'Decomposição',
    shortTitle: 'Decomposição',
    tagline: 'Dividir para conquistar',
    description:
      'Quebre problemas grandes e intimidadores em partes menores, independentes e fáceis de gerenciar.',
    imagePath: '/src/assets/images/pillar_decomposition_1795520641519.jpg',
    accentHex: '#2563EB',
    accentBgClass: 'bg-blue-600',
    accentTextClass: 'text-blue-700',
    accentBorderClass: 'border-blue-600',
    accentSoftBgClass: 'bg-blue-50',
  },
  {
    id: 'patterns',
    order: 2,
    title: 'Reconhecimento de Padrões',
    shortTitle: 'Padrões',
    tagline: 'Enxergar o que se repete',
    description:
      'Identifique regularidades, ciclos e semelhanças entre dados para prever resultados e reaproveitar soluções.',
    imagePath: '/src/assets/images/pillar_patterns_1795520642902.jpg',
    accentHex: '#D97706',
    accentBgClass: 'bg-amber-600',
    accentTextClass: 'text-amber-700',
    accentBorderClass: 'border-amber-600',
    accentSoftBgClass: 'bg-amber-50',
  },
  {
    id: 'abstraction',
    order: 3,
    title: 'Abstração',
    shortTitle: 'Abstração',
    tagline: 'Focar apenas no essencial',
    description:
      'Filtre detalhes irrelevantes e mantenha somente os atributos necessários para construir um modelo útil.',
    imagePath: '/src/assets/images/pillar_abstraction_1795520643303.jpg',
    accentHex: '#059669',
    accentBgClass: 'bg-emerald-600',
    accentTextClass: 'text-emerald-700',
    accentBorderClass: 'border-emerald-600',
    accentSoftBgClass: 'bg-emerald-50',
  },
  {
    id: 'algorithms',
    order: 4,
    title: 'Algoritmos',
    shortTitle: 'Algoritmos',
    tagline: 'Sequência precisa de passos',
    description:
      'Crie instruções claras, finitas e ordenadas que qualquer pessoa ou máquina consiga executar sem ambiguidade.',
    imagePath: '/src/assets/images/pillar_algorithms_1795520643891.jpg',
    accentHex: '#4F46E5',
    accentBgClass: 'bg-indigo-600',
    accentTextClass: 'text-indigo-700',
    accentBorderClass: 'border-indigo-600',
    accentSoftBgClass: 'bg-indigo-50',
  },
];

export const DECOMPOSITION_LEVELS: DecompositionLevel[] = [
  {
    id: 'dec-1',
    levelNumber: 1,
    title: 'Organizando uma Feira de Ciências',
    scenario:
      'A escola vai realizar uma Feira de Ciências e toda a equipe está perdida com dezenas de tarefas misturadas.',
    instruction:
      'Selecione uma tarefa por vez e distribua cada uma no módulo funcional correspondente para organizar o projeto.',
    hasDiscardBin: false,
    buckets: [
      {
        id: 'infra',
        title: 'Infraestrutura & Espaço',
        subtitle: 'Mesas, energia e circulação',
      },
      {
        id: 'conteudo',
        title: 'Projetos & Conteúdo',
        subtitle: 'Experimentos e apresentações',
      },
      {
        id: 'divulgacao',
        title: 'Comunicação & Público',
        subtitle: 'Convites e sinalização',
      },
    ],
    tasks: [
      { id: 't1', label: 'Reservar o pátio e posicionar as bancadas', targetBucketId: 'infra' },
      { id: 't2', label: 'Revisar os roteiros dos experimentos dos grupos', targetBucketId: 'conteudo' },
      { id: 't3', label: 'Criar cartazes com mapa dos estandes', targetBucketId: 'divulgacao' },
      { id: 't4', label: 'Verificar tomadas e extensões elétricas', targetBucketId: 'infra' },
      { id: 't5', label: 'Testar funcionamento dos protótipos antes da abertura', targetBucketId: 'conteudo' },
      { id: 't6', label: 'Enviar convite digital para pais e visitantes', targetBucketId: 'divulgacao' },
    ],
    hints: [
      'Agrupe tarefas que dependem dos mesmos recursos ou habilidades.',
      'Tomadas e bancadas fazem parte da montagem física (Infraestrutura).',
      'Cartazes e convites orientam quem visita (Comunicação).',
    ],
    explanation:
      'Ao decompor um evento complexo em 3 frentes independentes (Infraestrutura, Conteúdo e Comunicação), equipes diferentes podem trabalhar em paralelo sem atropelos.',
  },
  {
    id: 'dec-2',
    levelNumber: 2,
    title: 'Arquitetura de um Aplicativo de Clima',
    scenario:
      'Você vai construir um aplicativo de previsão do tempo no navegador e precisa separar responsabilidades antes de programar.',
    instruction:
      'Classifique cada tarefa técnica no subsistema correto. Atenção: descarte tarefas que não pertencem ao escopo deste aplicativo.',
    hasDiscardBin: true,
    buckets: [
      {
        id: 'ui',
        title: 'Interface Visual',
        subtitle: 'O que o usuário vê e toca',
      },
      {
        id: 'dados',
        title: 'Camada de Dados',
        subtitle: 'Coleta e armazenamento',
      },
      {
        id: 'logica',
        title: 'Regras & Cálculos',
        subtitle: 'Processamento e alertas',
      },
    ],
    tasks: [
      { id: 't1', label: 'Desenhar cartão de temperatura e ícones de chuva', targetBucketId: 'ui' },
      { id: 't2', label: 'Buscar medições meteorológicas por cidade', targetBucketId: 'dados' },
      { id: 't3', label: 'Converter valores entre Celsius e Fahrenheit', targetBucketId: 'logica' },
      { id: 't4', label: 'Criar campo de busca com histórico recente', targetBucketId: 'ui' },
      { id: 't5', label: 'Salvar lista de cidades favoritas localmente', targetBucketId: 'dados' },
      { id: 't6', label: 'Emitir alerta quando o índice UV passar de 8', targetBucketId: 'logica' },
      { id: 't7', label: 'Implementar ranking de jogadores de futebol', targetBucketId: 'discard' },
    ],
    hints: [
      'Interface Visual cuida apenas da apresentação na tela.',
      'Camada de Dados busca e guarda informações brutas.',
      'Existe uma tarefa totalmente fora do tema de clima que deve ir para "Fora do Escopo".',
    ],
    explanation:
      'Separar Interface, Dados e Lógica evita código emaranhado e facilita testar cada módulo isoladamente — além de evitar desperdício de esforço em recursos fora do escopo.',
  },
  {
    id: 'dec-3',
    levelNumber: 3,
    title: 'Investigando uma Queda no Site da Biblioteca',
    scenario:
      'O portal da biblioteca escolar ficou lento e alguns alunos não conseguem buscar livros. Precisamos decompor o diagnóstico.',
    instruction:
      'Associe cada verificação técnica à camada correta do sistema e descarte palpites irrelevantes que não ajudam no diagnóstico.',
    hasDiscardBin: true,
    buckets: [
      {
        id: 'cliente',
        title: 'Navegador do Usuário',
        subtitle: 'Tela, cache e scripts locais',
      },
      {
        id: 'rede',
        title: 'Rede & Servidor',
        subtitle: 'Conexão e tempo de resposta',
      },
      {
        id: 'banco',
        title: 'Acervo & Busca',
        subtitle: 'Consultas e indexação de livros',
      },
    ],
    tasks: [
      { id: 't1', label: 'Medir se a busca demora apenas em títulos sem índice', targetBucketId: 'banco' },
      { id: 't2', label: 'Checar erros de execução no console do navegador', targetBucketId: 'cliente' },
      { id: 't3', label: 'Verificar latência e status HTTP das requisições', targetBucketId: 'rede' },
      { id: 't4', label: 'Testar carregamento com cache do navegador limpo', targetBucketId: 'cliente' },
      { id: 't5', label: 'Inspecionar limite de conexões simultâneas no servidor', targetBucketId: 'rede' },
      { id: 't6', label: 'Avaliar quantos registros a consulta de livros retorna', targetBucketId: 'banco' },
      { id: 't7', label: 'Trocar a cor das cadeiras da sala de leitura', targetBucketId: 'discard' },
      { id: 't8', label: 'Reiniciar o projetor da sala de vídeo', targetBucketId: 'discard' },
    ],
    hints: [
      'Erros de tela e cache pertencem ao Navegador do Usuário.',
      'Consultas lentas e quantidade de registros pertencem ao Acervo & Busca.',
      'Duas tarefas são problemas físicos da escola sem relação com o site.',
    ],
    explanation:
      'Decompor um defeito por camadas (Cliente → Rede → Acervo) permite isolar rapidamente onde o gargalo acontece em vez de tentar adivinhar no escuro.',
  },
];

export const PATTERN_LEVELS: PatternLevel[] = [
  {
    id: 'pat-1',
    levelNumber: 1,
    mode: 'sequence',
    title: 'Ciclo de Sinais da Estação',
    scenario:
      'Um painel luminoso emite sinais em uma sequência fixa para orientar trens de carga, mas os últimos 3 painéis apagaram.',
    instruction:
      'Complete os espaços marcados com "?" escolhendo as peças na paleta abaixo e depois identifique a regra que gera a sequência.',
    gridCols: 4,
    slots: [
      {
        id: 's0',
        token: { shape: 'circle', color: 'amber', rotation: 0 },
        expectedToken: { shape: 'circle', color: 'amber', rotation: 0 },
      },
      {
        id: 's1',
        token: { shape: 'triangle', color: 'cobalt', rotation: 90 },
        expectedToken: { shape: 'triangle', color: 'cobalt', rotation: 90 },
      },
      {
        id: 's2',
        token: { shape: 'square', color: 'emerald', rotation: 0 },
        expectedToken: { shape: 'square', color: 'emerald', rotation: 0 },
      },
      {
        id: 's3',
        token: { shape: 'circle', color: 'amber', rotation: 0 },
        expectedToken: { shape: 'circle', color: 'amber', rotation: 0 },
      },
      {
        id: 's4',
        token: { shape: 'triangle', color: 'cobalt', rotation: 90 },
        expectedToken: { shape: 'triangle', color: 'cobalt', rotation: 90 },
      },
      {
        id: 's5',
        token: null,
        expectedToken: { shape: 'square', color: 'emerald', rotation: 0 },
      },
      {
        id: 's6',
        token: null,
        expectedToken: { shape: 'circle', color: 'amber', rotation: 0 },
      },
      {
        id: 's7',
        token: null,
        expectedToken: { shape: 'triangle', color: 'cobalt', rotation: 90 },
      },
    ],
    palette: [
      { shape: 'circle', color: 'amber', rotation: 0 },
      { shape: 'triangle', color: 'cobalt', rotation: 90 },
      { shape: 'square', color: 'emerald', rotation: 0 },
      { shape: 'diamond', color: 'slate', rotation: 0 },
    ],
    ruleQuestion: 'Qual regra descreve exatamente esse padrão?',
    ruleOptions: [
      { id: 'r1', label: 'Repetição cíclica de um bloco de 3 peças (Círculo → Triângulo → Quadrado)' },
      { id: 'r2', label: 'Alternância de apenas 2 formas que trocam de cor a cada passo' },
      { id: 'r3', label: 'Aumento aleatório de lados a cada nova posição da fila' },
    ],
    correctRuleId: 'r1',
    hints: [
      'Compare a posição 1 com a posição 4 e a posição 2 com a posição 5.',
      'A sequência recomeça a cada 3 símbolos idênticos.',
    ],
    explanation:
      'Reconhecer ciclos periódicos (tamanho 3) permite prever qualquer posição futura sem precisar observar toda a sequência infinitamente.',
  },
  {
    id: 'pat-2',
    levelNumber: 2,
    mode: 'matrix',
    title: 'Matriz de Distribuição Equilibrada',
    scenario:
      'Na fábrica automatizada, cada linha e cada coluna de uma grade 3×3 precisa conter exatamente uma peça de cada tipo, sem repetições.',
    instruction:
      'Preencha as 3 células vazias da matriz respeitando a regra de não repetição em linhas e colunas.',
    gridCols: 3,
    slots: [
      {
        id: 'm0',
        token: { shape: 'circle', color: 'amber', rotation: 0 },
        expectedToken: { shape: 'circle', color: 'amber', rotation: 0 },
      },
      {
        id: 'm1',
        token: { shape: 'triangle', color: 'cobalt', rotation: 0 },
        expectedToken: { shape: 'triangle', color: 'cobalt', rotation: 0 },
      },
      {
        id: 'm2',
        token: { shape: 'square', color: 'emerald', rotation: 0 },
        expectedToken: { shape: 'square', color: 'emerald', rotation: 0 },
      },
      {
        id: 'm3',
        token: { shape: 'triangle', color: 'cobalt', rotation: 0 },
        expectedToken: { shape: 'triangle', color: 'cobalt', rotation: 0 },
      },
      {
        id: 'm4',
        token: { shape: 'square', color: 'emerald', rotation: 0 },
        expectedToken: { shape: 'square', color: 'emerald', rotation: 0 },
      },
      {
        id: 'm5',
        token: null,
        expectedToken: { shape: 'circle', color: 'amber', rotation: 0 },
      },
      {
        id: 'm6',
        token: { shape: 'square', color: 'emerald', rotation: 0 },
        expectedToken: { shape: 'square', color: 'emerald', rotation: 0 },
      },
      {
        id: 'm7',
        token: null,
        expectedToken: { shape: 'circle', color: 'amber', rotation: 0 },
      },
      {
        id: 'm8',
        token: null,
        expectedToken: { shape: 'triangle', color: 'cobalt', rotation: 0 },
      },
    ],
    palette: [
      { shape: 'circle', color: 'amber', rotation: 0 },
      { shape: 'triangle', color: 'cobalt', rotation: 0 },
      { shape: 'square', color: 'emerald', rotation: 0 },
    ],
    ruleQuestion: 'Que propriedade estrutural garante o preenchimento correto da grade?',
    ruleOptions: [
      { id: 'r1', label: 'Cada peça aparece no máximo uma vez por linha e por coluna (Quadrado Latino)' },
      { id: 'r2', label: 'Todas as colunas possuem exatamente as mesmas peças na mesma ordem' },
      { id: 'r3', label: 'A diagonal principal deve conter sempre a mesma peça' },
    ],
    correctRuleId: 'r1',
    hints: [
      'Na segunda linha já existem Triângulo e Quadrado: falta apenas uma peça.',
      'Na segunda coluna já existem Triângulo e Quadrado: observe qual falta!',
    ],
    explanation:
      'Padrões bidimensionais com restrições de linha e coluna (como no Sudoku ou escalonamento de horários) reduzem possibilidades por eliminação lógica.',
  },
  {
    id: 'pat-3',
    levelNumber: 3,
    mode: 'motif',
    title: 'Compressão de Rotina Repetida',
    scenario:
      'Um sensor gravou 9 comandos seguidos de uma linha de montagem. Para economizar memória, precisamos descobrir o menor bloco que se repete.',
    instruction:
      'Complete as 3 últimas posições da sequência e aponte qual é o menor bloco repetido (motivo padrão).',
    gridCols: 3,
    slots: [
      {
        id: 'c0',
        token: { shape: 'diamond', color: 'cobalt', rotation: 0, value: 'A' },
        expectedToken: { shape: 'diamond', color: 'cobalt', rotation: 0, value: 'A' },
      },
      {
        id: 'c1',
        token: { shape: 'diamond', color: 'cobalt', rotation: 0, value: 'A' },
        expectedToken: { shape: 'diamond', color: 'cobalt', rotation: 0, value: 'A' },
      },
      {
        id: 'c2',
        token: { shape: 'circle', color: 'amber', rotation: 0, value: 'B' },
        expectedToken: { shape: 'circle', color: 'amber', rotation: 0, value: 'B' },
      },
      {
        id: 'c3',
        token: { shape: 'diamond', color: 'cobalt', rotation: 0, value: 'A' },
        expectedToken: { shape: 'diamond', color: 'cobalt', rotation: 0, value: 'A' },
      },
      {
        id: 'c4',
        token: { shape: 'diamond', color: 'cobalt', rotation: 0, value: 'A' },
        expectedToken: { shape: 'diamond', color: 'cobalt', rotation: 0, value: 'A' },
      },
      {
        id: 'c5',
        token: { shape: 'circle', color: 'amber', rotation: 0, value: 'B' },
        expectedToken: { shape: 'circle', color: 'amber', rotation: 0, value: 'B' },
      },
      {
        id: 'c6',
        token: null,
        expectedToken: { shape: 'diamond', color: 'cobalt', rotation: 0, value: 'A' },
      },
      {
        id: 'c7',
        token: null,
        expectedToken: { shape: 'diamond', color: 'cobalt', rotation: 0, value: 'A' },
      },
      {
        id: 'c8',
        token: null,
        expectedToken: { shape: 'circle', color: 'amber', rotation: 0, value: 'B' },
      },
    ],
    palette: [
      { shape: 'diamond', color: 'cobalt', rotation: 0, value: 'A' },
      { shape: 'circle', color: 'amber', rotation: 0, value: 'B' },
      { shape: 'square', color: 'emerald', rotation: 0, value: 'C' },
    ],
    ruleQuestion: 'Qual é o menor bloco (sub-rotina) que gera toda a sequência ao ser repetido?',
    ruleOptions: [
      { id: 'r1', label: 'Repetir 3 vezes o bloco [A, A, B]' },
      { id: 'r2', label: 'Repetir 4 vezes o bloco [A, B]' },
      { id: 'r3', label: 'Repetir 2 vezes o bloco [A, B, A, B]' },
    ],
    correctRuleId: 'r1',
    hints: [
      'Olhe os 3 primeiros itens juntos: dois losangos azuis seguidos de um círculo âmbar.',
      'A cada grupo de 3 posições, o mesmo trio [A, A, B] reaparece.',
    ],
    explanation:
      'Identificar o menor motivo repetido é a base da compressão de dados e da criação de laços de repetição (loops) e funções reutilizáveis em programação.',
  },
];

export const ABSTRACTION_LEVELS: AbstractionLevel[] = [
  {
    id: 'abs-1',
    levelNumber: 1,
    previewType: 'metro',
    title: 'Mapa Esquemático do Metrô',
    scenario:
      'Você precisa criar um mapa de bolso do metrô para ajudar passageiros a ir de uma estação a outra sem se perder.',
    goal: 'Orientar passageiros sobre trajetos, conexões e ordem das paradas.',
    instruction:
      'Ative apenas os atributos ESSENCIAIS para o mapa funcional e desative os detalhes irrelevantes (ruído visual).',
    attributes: [
      {
        id: 'a1',
        label: 'Ordem e nomes das estações',
        detail: 'Identifica onde embarcar e desembarcar em cada linha',
        isEssential: true,
        visualTag: 'stations',
      },
      {
        id: 'a2',
        label: 'Pontos de baldeação entre linhas',
        detail: 'Mostra onde é possível trocar de uma linha para outra',
        isEssential: true,
        visualTag: 'transfers',
      },
      {
        id: 'a3',
        label: 'Cor do estofado dos assentos do trem',
        detail: 'Detalhe estético interno que não muda a rota',
        isEssential: false,
        visualTag: 'noise-seats',
      },
      {
        id: 'a4',
        label: 'Conexão lógica das linhas por cor',
        detail: 'Diferencia visualmente a Linha Azul da Linha Verde',
        isEssential: true,
        visualTag: 'lines',
      },
      {
        id: 'a5',
        label: 'Marca das lâmpadas da plataforma',
        detail: 'Informação de manutenção predial irrelevante ao passageiro',
        isEssential: false,
        visualTag: 'noise-lamps',
      },
      {
        id: 'a6',
        label: 'Geometria exata de cada curva do túnel subterrâneo',
        detail: 'Mapas de metrô usam ângulos retos esquemáticos para clareza',
        isEssential: false,
        visualTag: 'noise-curves',
      },
    ],
    hints: [
      'Um bom mapa de metrô famoso (como o de Londres) ignora curvas geográficas reais para priorizar legibilidade.',
      'Pergunte-se: um passageiro precisa saber a cor dos bancos ou a marca das lâmpadas para trocar de estação?',
    ],
    explanation:
      'A abstração brilhante dos mapas de metrô modernos descarta a geografia exata dos túneis e detalhes estéticos, mantendo apenas nomes, ordem das estações e baldeações.',
  },
  {
    id: 'abs-2',
    levelNumber: 2,
    previewType: 'library',
    title: 'Modelo de Empréstimo da Biblioteca',
    scenario:
      'A escola está criando um sistema digital simples para controlar quem pegou cada livro e quando deve devolvê-lo.',
    goal: 'Registrar empréstimos ativos e identificar atrasos na devolução.',
    instruction:
      'Selecione somente os dados que o modelo computacional precisa armazenar e descarte o que é desnecessário para essa finalidade.',
    attributes: [
      {
        id: 'b1',
        label: 'Código único do exemplar (ID)',
        detail: 'Distingue duas cópias do mesmo livro',
        isEssential: true,
        visualTag: 'book-id',
      },
      {
        id: 'b2',
        label: 'Identificação do estudante',
        detail: 'Associa o empréstimo a quem está com o livro',
        isEssential: true,
        visualTag: 'student-id',
      },
      {
        id: 'b3',
        label: 'Data prevista de devolução',
        detail: 'Permite calcular automaticamente se há atraso',
        isEssential: true,
        visualTag: 'due-date',
      },
      {
        id: 'b4',
        label: 'Peso exato da capa em gramas',
        detail: 'Não interfere no prazo nem no controle de posse',
        isEssential: false,
        visualTag: 'noise-weight',
      },
      {
        id: 'b5',
        label: 'Cor da camiseta do aluno no dia do empréstimo',
        detail: 'Dado irrelevante para localizar o livro ou cobrar devolução',
        isEssential: false,
        visualTag: 'noise-shirt',
      },
      {
        id: 'b6',
        label: 'Status do exemplar (Disponível / Emprestado)',
        detail: 'Evita que dois alunos tentem reservar o mesmo exemplar',
        isEssential: true,
        visualTag: 'status',
      },
    ],
    hints: [
      'Pense nos campos mínimos de uma tabela de banco de dados para saber "quem está com qual livro e até quando".',
      'Características físicas aleatórias do aluno ou do papel não ajudam a controlar prazos.',
    ],
    explanation:
      'Na modelagem de software, abstrair significa representar objetos reais (um livro, um aluno) apenas pelos atributos que resolvem o problema do sistema.',
  },
  {
    id: 'abs-3',
    levelNumber: 3,
    previewType: 'delivery',
    title: 'Grafo de Rota de Entregas',
    scenario:
      'Um sistema de logística calcula o caminho mais rápido para entregar encomendas entre quatro bairros da cidade.',
    goal: 'Encontrar o trajeto de menor tempo total entre a origem e o destino.',
    instruction:
      'Filtre apenas as variáveis matemáticas necessárias para calcular a melhor rota no grafo da cidade.',
    attributes: [
      {
        id: 'c1',
        label: 'Pontos de origem, parada e destino (Nós)',
        detail: 'Define os locais que precisam ser conectados',
        isEssential: true,
        visualTag: 'nodes',
      },
      {
        id: 'c2',
        label: 'Vias ligando os bairros (Arestas)',
        detail: 'Mostra quais deslocamentos diretos existem',
        isEssential: true,
        visualTag: 'edges',
      },
      {
        id: 'c3',
        label: 'Tempo médio de percurso em cada via (Peso)',
        detail: 'Permite somar custos e escolher a rota mais rápida',
        isEssential: true,
        visualTag: 'weights',
      },
      {
        id: 'c4',
        label: 'Nome completo do arquiteto das pontes',
        detail: 'Curiosidade histórica que não altera o tempo de viagem',
        isEssential: false,
        visualTag: 'noise-architect',
      },
      {
        id: 'c5',
        label: 'Fachada e cor das casas da vizinhança',
        detail: 'Excesso de detalhes visuais que não afeta o trajeto',
        isEssential: false,
        visualTag: 'noise-houses',
      },
      {
        id: 'c6',
        label: 'Restrição de sentido único das ruas',
        detail: 'Impede sugerir trajetos na contramão',
        isEssential: true,
        visualTag: 'direction',
      },
    ],
    hints: [
      'Para calcular caminhos mínimos, um mapa vira um grafo com Nós, Arestas, Pesos (tempo) e Sentido.',
      'Aparência das casas e dados históricos das construções são ruído para um algoritmo de rota.',
    ],
    explanation:
      'Um aplicativo de GPS abstrai uma cidade inteira em um grafo matemático simples: pontos (nós), conexões direcionadas (arestas) e tempos de travessia (pesos).',
  },
];

export const ALGORITHM_LEVELS: AlgorithmLevel[] = [
  {
    id: 'alg-1',
    levelNumber: 1,
    title: 'Primeiro Trajeto do Robô',
    scenario:
      'O robô explorador precisa coletar o cristal de energia no caminho e alcançar o farol de destino sem bater nos muros.',
    instruction:
      'Monte a sequência ordenada de comandos abaixo e clique em "Executar Algoritmo" para testar.',
    gridSize: 5,
    start: { r: 4, c: 0, dir: 'E' },
    goal: { r: 1, c: 4 },
    walls: [
      { r: 3, c: 0 },
      { r: 3, c: 1 },
      { r: 1, c: 2 },
      { r: 1, c: 3 },
    ],
    crystals: [{ r: 4, c: 2 }],
    allowedCommands: ['MOVE', 'LEFT', 'RIGHT', 'COLLECT'],
    maxBlocks: 14,
    optimalBlocks: 9,
    hints: [
      'O robô começa olhando para a Direita (Leste). Avance 2 casas até o cristal e use "Coletar".',
      'Depois de coletar, avance até a borda direita (coluna 5), gire à Esquerda para apontar para cima e avance até o farol.',
    ],
    explanation:
      'Um algoritmo precisa considerar o estado atual (posição e direção do robô). Cada instrução executa exatamente na ordem definida.',
  },
  {
    id: 'alg-2',
    levelNumber: 2,
    title: 'Desvio pelos Canteiros',
    scenario:
      'Há dois cristais espalhados pelo laboratório e obstáculos no meio da pista. Planeje a rota completa antes de executar.',
    instruction:
      'Programe o robô para coletar todos os cristais e parar exatamente sobre o farol.',
    gridSize: 6,
    start: { r: 5, c: 1, dir: 'N' },
    goal: { r: 0, c: 5 },
    walls: [
      { r: 3, c: 1 },
      { r: 3, c: 2 },
      { r: 2, c: 4 },
      { r: 4, c: 4 },
      { r: 1, c: 1 },
    ],
    crystals: [
      { r: 4, c: 1 },
      { r: 1, c: 3 },
    ],
    allowedCommands: ['MOVE', 'LEFT', 'RIGHT', 'COLLECT'],
    maxBlocks: 20,
    optimalBlocks: 15,
    hints: [
      'O robô já começa olhando para Cima (Norte): avance 1 casa para pegar o primeiro cristal.',
      'Como há um muro logo acima, vire à Direita, contorne até a 4ª coluna e suba até o segundo cristal antes de seguir para o farol.',
    ],
    explanation:
      'Planejar algoritmos com múltiplos objetivos exige verificar pré-condições: não basta chegar ao destino, é preciso garantir que todas as metas intermediárias foram cumpridas.',
  },
  {
    id: 'alg-3',
    levelNumber: 3,
    title: 'Eficiência com Laços de Repetição',
    scenario:
      'O corredor forma uma escadaria repetitiva com 3 cristais. A memória do robô aceita no máximo 8 blocos de instrução!',
    instruction:
      'Use um bloco "Repetir 3×" para encapsular o padrão da escada e chegar ao farol dentro do limite de blocos.',
    gridSize: 6,
    start: { r: 5, c: 0, dir: 'E' },
    goal: { r: 2, c: 4 },
    walls: [
      { r: 4, c: 0 },
      { r: 3, c: 1 },
      { r: 2, c: 2 },
      { r: 5, c: 2 },
      { r: 4, c: 3 },
      { r: 3, c: 4 },
    ],
    crystals: [
      { r: 4, c: 1 },
      { r: 3, c: 2 },
      { r: 2, c: 3 },
    ],
    allowedCommands: ['MOVE', 'LEFT', 'RIGHT', 'COLLECT', 'LOOP_3'],
    maxBlocks: 8,
    optimalBlocks: 7,
    hints: [
      'Cada degrau da escada faz exatamente o mesmo: Avançar → Girar Esq. → Avançar → Coletar → Girar Dir.',
      'Coloque esses 5 comandos dentro de "Repetir 3×" e adicione 1 "Avançar" fora do laço para pisar no farol.',
    ],
    explanation:
      'Unindo Reconhecimento de Padrões e Algoritmos, um laço de repetição transforma 16 passos repetidos em apenas 7 blocos compactos e elegantes.',
  },
];
