// Arquivo: frontend/src/components/Tour/tourSteps.js
export const steps = [
  {
    target: 'body',
    content: 'Bem-vindo ao PC-Express! Este tour rápido vai te mostrar as principais funcionalidades da plataforma. Vamos nessa?',
    placement: 'center',
    title: 'Bem-vindo!'
  },
  {
    target: '.dashboard-kpi-cards', // A div que envolve os 4 cards principais
    content: 'Aqui no Painel, você tem uma visão geral e em tempo real do seu negócio.',
    title: 'Seu Centro de Comando'
  },
  {
    target: '#main-sidebar-nav', // O ID do elemento <nav> da barra lateral
    content: 'É por aqui que você navega entre todas as seções do sistema.',
    title: 'Navegação Principal'
  },
  {
    target: 'a[href="/products"]', // O link <a> para a página de Produtos
    content: 'Nesta seção, você pode cadastrar, editar e visualizar todos os seus produtos.',
    title: 'Gerenciamento de Produtos'
  },
  {
    target: 'a[href="/insights"]', // O link <a> para a página de Análises
    content: 'Aqui a mágica acontece! Usamos Machine Learning para prever a demanda e otimizar seu estoque.',
    title: 'Insights com IA'
  },
  {
    target: '#user-profile-menu', // O ID do botão/ícone que abre o menu do usuário
    content: 'Por aqui você pode alterar o idioma, trocar para o modo claro/escuro e gerenciar sua conta.',
    title: 'Configurações e Perfil'
  },
  {
    target: 'body',
    content: 'É isso! Agora você conhece as principais áreas do PC-Express. Explore à vontade.',
    placement: 'center',
    title: 'Você está pronto!'
  }
];
