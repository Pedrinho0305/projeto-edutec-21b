// pontuacao.js - CÓDIGO FINAL E OTIMIZADO

// URL base da sua API na Vercel
const API_URL = 'https://backend-edutec-85jy.vercel.app';
const RANKING_ENDPOINT = '/'; 

/**
 * Função para buscar os dados de todos os usuários na API.
 */
async function fetchRankingData(containerRanking) { 
    try {
        // CORREÇÃO: Adiciona um timestamp (Cache Busting)
        const timestamp = new Date().getTime();
        const urlComCacheBusting = `${API_URL}${RANKING_ENDPOINT}?t=${timestamp}`;
        
        console.log(`Buscando dados de ranking em: ${urlComCacheBusting}`);
        
        const response = await fetch(urlComCacheBusting);
        
        if (!response.ok) {
            // Se o servidor retornar 4xx ou 5xx
            let errorText = await response.text();
            throw new Error(`Erro HTTP ${response.status}: ${errorText || response.statusText}`);
        }
        
        const users = await response.json();
        return users;

    } catch (error) {
        console.error("❌ Erro ao buscar dados de ranking:", error);
        // Exibe a mensagem de erro no container do ranking
        containerRanking.innerHTML = '<p class="error-message">Não foi possível carregar o Ranking. Verifique a conexão com o servidor.</p>';
        return [];
    }
}

/**
 * Função para ordenar os usuários e exibir o Top 10 no HTML.
 */
function displayRanking(users, containerRanking) { 
    
    // NOVO TRATAMENTO DE DADOS: Otimizado para garantir que 'score' seja um número (0 se for null/undefined)
    const rankedUsers = users
        .map(user => ({
            ...user,
            // CORREÇÃO: Trata null/undefined, que pode vir do DB, como 0
            score: Number(user.score) || 0 
        }))
        // Filtra usuários com score 0, para não poluir o ranking com cadastros novos sem jogar
        .filter(user => user.score > 0)
        // Ordena de forma decrescente
        .sort((a, b) => b.score - a.score);

    // Limpa o conteúdo estático atual
    containerRanking.innerHTML = ''; 

    // 2. Determina o Top 10 
    const top10 = rankedUsers.slice(0, 10);

    // CRÍTICO: Se houver um <h1> ou outro elemento que é o pai dos rankings
    // e você quer inserir a tabela dentro dele. Se containerRanking é o elemento que DEVERIA conter as linhas,
    // o código abaixo vai funcionar.
    
    if (top10.length === 0) {
        containerRanking.innerHTML = '<p class="no-data-message">Nenhum jogador com pontuação registrada ainda. Jogue para aparecer aqui!</p>';
        return;
    }
    
    // **CORREÇÃO para evitar 'innerHTML' em um elemento nulo (se for o caso)
    // Criar o HTML da lista inteira e atribuir uma única vez
    let rankingHTML = '';

    // 3. Cria a estrutura HTML dinamicamente
    top10.forEach((user, index) => {
        const rank = index + 1;
        
        let rankClass = '';
        if (rank === 1) rankClass = 'rank-gold';
        else if (rank === 2) rankClass = 'rank-silver';
        else if (rank === 3) rankClass = 'rank-bronze';

        rankingHTML += `
            
                <div class="user-info">
                    
                    <span class="user-name">${user.name || 'Nome Desconhecido'}</span>
                    <span class="user-email">${user.email}</span>
                    <span class="user-score">${user.score} pts</span>
                </div>
                
            
        `;
    });
    
    // Adiciona o HTML ao container de uma vez
    containerRanking.innerHTML = rankingHTML;
}

/**
 * Inicializa o carregamento do ranking ao carregar a página.
 */
document.addEventListener('DOMContentLoaded', async () => {
    
    // Elemento onde o ranking será inserido (geralmente uma div ou section)
    const containerRanking = document.querySelector('.container1');

    if (!containerRanking) {
        // Se o elemento não existe, dispara o erro, mas NÃO trava o script.
        console.error("Erro: O elemento com a classe '.container1' não foi encontrado no HTML.");
        
        // NOVO: Adiciona a mensagem em um elemento mais genérico, se container1 não for encontrado.
        // Se a página de ranking for 'pontuacao.html', este erro é CRÍTICO.
        return; 
    }

    // Exibe um estado de carregamento inicial
    containerRanking.innerHTML = '<p class="loading-message">Carregando Ranking...</p>';
    
    // Passar containerRanking para as funções
    const users = await fetchRankingData(containerRanking);
    displayRanking(users, containerRanking);
});

document.addEventListener('DOMContentLoaded', () => {
    // Chave usada para verificar o status de login
    const USUARIO_ATIVO_KEY = 'usuarioAtivo'; 
    
    // 1. Elementos HTML que precisamos manipular
    const loginLink = document.querySelector('a[href="../cadastro/login.html"]');
    const userStatusDisplay = document.getElementById('user-status-display');
    const navBar = document.querySelector('nav');

    // Verifica o status de login no sessionStorage
    const userEmail = sessionStorage.getItem(USUARIO_ATIVO_KEY);

    // =======================================================
    // FUNÇÃO DE LOGOUT
    // =======================================================
    function handleLogout(event) {
        event.preventDefault(); // Impede o link de navegar
        sessionStorage.removeItem(USUARIO_ATIVO_KEY); // Remove o email
        // Recarrega a página principal para atualizar o estado
        window.location.reload(); 
    }

    if (userEmail) {
        // =======================================================
        // AÇÕES SE O USUÁRIO ESTIVER LOGADO (CADASTRADO)
        // =======================================================
        
        console.log(`Usuário ativo: ${userEmail}. Ocultando link de login.`);
        
        // 1. FAZ A ÂNCORA DE LOGIN SUMIR
        if (loginLink) {
            loginLink.style.display = 'none';
        }
        
        // 2. EXIBE O E-MAIL DO USUÁRIO E O BOTÃO DE SAIR
        if (userStatusDisplay) {
            // Cria um novo elemento para exibir o email
            const emailSpan = document.createElement('span');
            emailSpan.innerHTML =`<div class="img-text"><img src="../assets/material-symbols_person.svg" alt=""> <strong class = "nome-usuario">${userEmail.split('@')[0]} |</strong></div>`;
             // Cor verde para indicar sucesso

            // Cria o link de Sair/Logout
            const logoutLink = document.createElement('a');
            logoutLink.href = '#';
            logoutLink.textContent = 'Sair';
             // Cor vermelha para indicar saída
            logoutLink.style.textDecoration = 'none';
            logoutLink.addEventListener('click', handleLogout);

            // Adiciona os elementos ao contêiner de status
            userStatusDisplay.appendChild(emailSpan);
            userStatusDisplay.appendChild(logoutLink);
        }

    } else {
        // =======================================================
        // AÇÕES SE O USUÁRIO NÃO ESTIVER LOGADO
        // =======================================================
        
        console.log("Nenhum usuário logado. Link 'Fazer login' visível.");
        
        // Garante que o link de login está visível (caso haja manipulação anterior)
        if (loginLink) {
            loginLink.style.display = 'inline';
        }
        // O userStatusDisplay permanece vazio.
    }
});