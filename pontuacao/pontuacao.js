// pontuacao.js - CÓDIGO FINAL CORRIGIDO

// URL base da sua API na Vercel
const API_URL = 'https://backend-edutec-85jy.vercel.app';
const RANKING_ENDPOINT = '/'; // Assumindo que a rota GET / lista todos os usuários

// REMOVIDA A VARIÁVEL GLOBAL:
// const containerRanking = document.querySelector('.container1'); // <-- Foi movida para dentro do DOMContentLoaded

/**
 * Função para buscar os dados de todos os usuários na API.
 */
async function fetchRankingData(containerRanking) { // AGORA RECEBE containerRanking COMO ARGUMENTO
    try {
        console.log(`Buscando dados de ranking em: ${API_URL}${RANKING_ENDPOINT}`);
        
        const response = await fetch(`${API_URL}${RANKING_ENDPOINT}`);
        
        if (!response.ok) {
            // Tenta ler a mensagem de erro do servidor
            let errorText = await response.text();
            throw new Error(`Erro HTTP ${response.status}: ${errorText || response.statusText}`);
        }
        
        const users = await response.json();
        return users;

    } catch (error) {
        console.error("❌ Erro ao buscar dados de ranking:", error);
        // Exibe uma mensagem de erro na tela
        containerRanking.innerHTML = '<p class="error-message">Não foi possível carregar o Ranking. Verifique a conexão com o servidor.</p>';
        return [];
    }
}

/**
 * Função para ordenar os usuários e exibir o Top 10 no HTML.
 */
function displayRanking(users, containerRanking) { // AGORA RECEBE containerRanking COMO ARGUMENTO
    // 1. Filtra usuários que têm pontuação (score) definida e ordena de forma decrescente
    const rankedUsers = users
        .filter(user => user.score && typeof user.score === 'number')
        .sort((a, b) => b.score - a.score);

    // Limpa o conteúdo estático atual
    containerRanking.innerHTML = ''; 

    // 2. Determina o Top 10 (ou menos, se não houver 10 usuários)
    const top10 = rankedUsers.slice(0, 10);

    if (top10.length === 0) {
        containerRanking.innerHTML = '<p class="no-data-message">Nenhum jogador com pontuação registrada ainda.</p>';
        return;
    }

    // 3. Cria a estrutura HTML dinamicamente
    top10.forEach((user, index) => {
        const rank = index + 1;
        
        // Determina a classe para os primeiros colocados (opcional para estilização)
        let rankClass = '';
        if (rank === 1) rankClass = 'rank-gold';
        else if (rank === 2) rankClass = 'rank-silver';
        else if (rank === 3) rankClass = 'rank-bronze';

        const rowHTML = `
            <div class="user-row ${rankClass}">
                <span class="rank-number">#${rank}</span>
                <div class="user-info">
                    <span class="user-name">${user.name || 'Nome Desconhecido'}</span>
                    <span class="user-email">${user.email}</span>
                    <span class="user-score">${user.score}</span>
                </div>
            </div>
        `;
        
        containerRanking.innerHTML += rowHTML;
    });
}

/**
 * Inicializa o carregamento do ranking ao carregar a página.
 */
document.addEventListener('DOMContentLoaded', async () => {
    // CORREÇÃO CRÍTICA: DEFINIR A VARIÁVEL AQUI DENTRO, após o HTML ser carregado.
    const containerRanking = document.querySelector('.container1');

    if (!containerRanking) {
        console.error("Erro: O elemento com a classe '.container1' não foi encontrado no HTML.");
        return; // Sai da função se o elemento não existir, evitando o erro 'null'.
    }

    // Exibe um estado de carregamento inicial
    containerRanking.innerHTML = '<p class="loading-message">Carregando Ranking...</p>';
    
    // Passar containerRanking para as funções
    const users = await fetchRankingData(containerRanking);
    displayRanking(users, containerRanking);
});