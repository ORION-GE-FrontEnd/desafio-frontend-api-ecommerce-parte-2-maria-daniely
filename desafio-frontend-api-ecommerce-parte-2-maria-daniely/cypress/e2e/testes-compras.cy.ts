/// <reference types="cypress" />

// Dados de teste para o usuário
const usuarioDeTeste = {
  nome: 'Daniely Vasconcelos',
  email: 'daniely.vasconcelos@test.com',
  password: 'minhasenha123'
};

// Funções Auxiliares Testes 
// Garante que o usuário de teste esteja salvo no localStorage
const garantirUsuarioSalvo = () => {
  cy.window().then((win) => {
    const usuariosSalvos: { email: string; password: string; nome: string }[] = JSON.parse(win.localStorage.getItem('users') || '[]');
    const usuarioJaExiste = usuariosSalvos.some((u: { email: string }) => u.email === usuarioDeTeste.email);
    if (!usuarioJaExiste) {
      usuariosSalvos.push(usuarioDeTeste);
      win.localStorage.setItem('users', JSON.stringify(usuariosSalvos));
    }
  });
};

// Realiza o processo de login
const fazerLogin = () => {
  garantirUsuarioSalvo(); 
  cy.visit('/login');
  cy.get('input[placeholder="E-mail"]').type(usuarioDeTeste.email);
  cy.get('input[placeholder="Senha"]').type(usuarioDeTeste.password);
  cy.get('button[type="submit"]').contains('Login').click();
  cy.url().should('include', '/home');
  cy.contains(`Bem-vindo(a), ${usuarioDeTeste.nome}`).should('be.visible');
  cy.log('Login Concluído.');
};

// Adiciona um produto ao carrinho e navega para a página do carrinho
const adicionarUmProdutoEClicarCarrinho = () => {
  cy.contains('Todos os Produtos').should('be.visible');
  cy.scrollTo('bottom', { duration: 1000 });
  cy.wait(1000);
  cy.get('button.bg-gray-800').contains('Adicionar ao carrinho').first().should('be.visible').click();
  cy.wait(500);
  cy.get('button[aria-label="Ir para o carrinho de compras"]').click();
  cy.url().should('include', '/carrinho');
  cy.contains('Carrinho de Compras').should('be.visible');
  cy.get('.flex.justify-between.items-center.bg-amber-50').should('have.length', 1);
  cy.log('Um item adicionado e carrinho verificado.');
};

// Preenche e submete o formulário de pagamento
const preencherFormularioPagamento = () => {
  cy.get('button').contains('Finalizar Compra').click(); 
  cy.url().should('include', '/pagamento');
  cy.contains('Forma de Pagamento').should('be.visible');

  cy.get('input[type="radio"][value="pix"]').click({ force: true });
  cy.contains('Você escolheu a forma pix de pagamento.').should('be.visible');

  cy.get('input[placeholder="Endereço"]').type('Villa Kenedy Quadra B');
  cy.get('input[placeholder="Número/Complemento"]').type('17');
  cy.get('button[type="submit"]').contains('Confirmar Pedido').click();
  
  cy.url().should('include', '/resumo-pedido');
  cy.contains('Resumo do Pagamento').should('be.visible');
  cy.log('Formulário de pagamento preenchido e resumo verificado.');
};

//Blocos de Teste 

describe('Login de Usuário', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    garantirUsuarioSalvo(); 
    cy.viewport(1280, 800);
    cy.visit('/login');
  });

  it('Deve permitir ao usuário fazer login com credenciais válidas', () => {
    cy.get('input[placeholder="E-mail"]').type(usuarioDeTeste.email);
    cy.get('input[placeholder="Senha"]').type(usuarioDeTeste.password);
    cy.get('button[type="submit"]').contains('Login').click();
    cy.url().should('include', '/home');
    cy.contains(`Bem-vindo(a), ${usuarioDeTeste.nome}`).should('be.visible');
  });
});

describe('Adicionar Item ao Carrinho', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    garantirUsuarioSalvo(); 
    cy.viewport(1280, 800);
    fazerLogin();
  });

  it('Deve permitir adicionar um produto ao carrinho e verificar na página do carrinho', () => {
    adicionarUmProdutoEClicarCarrinho(); 
  });
});

describe('Checkout do Pedido', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    garantirUsuarioSalvo(); 
    cy.viewport(1280, 800);
    fazerLogin(); 
    adicionarUmProdutoEClicarCarrinho(); 
  });

  it('Deve permitir preencher o formulário de pagamento e navegar para o resumo do pedido', () => {
    preencherFormularioPagamento(); 
  });
});

describe('Confirmação Final do Pedido', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    garantirUsuarioSalvo(); 
    cy.viewport(1280, 800);
    fazerLogin(); 
    adicionarUmProdutoEClicarCarrinho(); 
    preencherFormularioPagamento(); 
  });

  it('Deve permitir finalizar o pedido e exibir a confirmação na tela de resumo', () => {
    cy.get('button').contains('Finalizar Pedido').click(); 

   
    cy.contains('Pedido realizado com sucesso!').should('be.visible');
    cy.contains('Número do Pedido: #').should('be.visible');
    cy.contains('Obrigado por sua compra!').should('be.visible');

  
    cy.get('button').contains('Voltar para o Início').click();
    cy.url().should('include', '/home');
    cy.contains('Todos os Produtos').should('be.visible');
    cy.log('Confirmação do pedido verificada e retorno à Home.');
  });
});