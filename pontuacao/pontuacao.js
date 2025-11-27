// ./js/ranking.js

const API_URL = 'http://localhost:5500';

/**
 * Busca os dados de ranking do servidor, exibe em lista e loga os dados do usuário.
 */
async function fetchRanking() {
    //const listContainer = document.getElementById('ranking-list-container');
    
    // CORREÇÃO 1: Usando a chave padronizada 'usuarioAtivo'
    const loggedEmail = sessionStorage.getItem('usuarioAtivo');
    
    // NOTA: userBestScore (Local) só é confiável se for atualizado após o POST /update-score
    // Para fins de exibição, vamos confiar no rankingData.
    let userBestScore = sessionStorage.getItem('userBestScore') || 0; 
    
    // Elemento para exibir a melhor pontuação pessoal
    const personalScoreDisplay = document.getElementById('personal-best-score');


    // 1. Imprime os dados do usuário no console
    if (loggedEmail) {
        console.log("==================================================");
        console.log(`[RANKING - USUÁRIO LOGADO]`);
        console.log(`Email: ${loggedEmail}`);
        console.log(`Melhor Pontuação Pessoal (Local): ${userBestScore}`);
        console.log("==================================================");
    } else {
        console.log("[RANKING] Nenhum usuário logado no momento.");
    }


    // 2. Carregamento visual
    if (listContainer) {
        listContainer.innerHTML = '<p style="text-align: center;">Carregando Ranking...</p>';
    }

    // Limpa a pontuação pessoal
    if (personalScoreDisplay) {
        personalScoreDisplay.textContent = '';
    }

    // 3. Comunicação com o Backend
    try {
        const response = await fetch(`${API_URL}/ranking`);

        if (!response.ok) {
            const errorText = await response.text();
            if (listContainer) {
                listContainer.innerHTML = `<p style="text-align: center; color: red;">Erro ${response.status}: Falha ao buscar dados. O servidor não está respondendo. Detalhe: ${errorText.substring(0, 50)}...</p>`;
            }
            console.error('Erro de resposta do servidor:', response.status, errorText);
            return;
        }

        const rankingData = await response.json();
        let foundUserInRanking = false; // Flag para rastrear o usuário logado

        if (listContainer) {
            listContainer.innerHTML = ''; // Limpa o carregamento

            if (rankingData.length === 0) {
                listContainer.innerHTML = '<p style="text-align: center;">Nenhum usuário cadastrado ou com pontuação no ranking ainda.</p>';
                return;
            }

            const ul = document.createElement('ul'); 
            ul.style.listStyleType = 'none';
            ul.style.padding = '0';

            // 4. Montagem da lista
            rankingData.forEach((user, index) => {
                const li = document.createElement('li');
                const displayName = user.email.split('@')[0].toUpperCase();
                
                li.innerHTML = `
                    <span style="font-weight: bold; margin-right: 15px; font-size: 1.2em;">#${index + 1}</span> 
                    <span style="font-weight: 500;">${displayName}</span>: 
                    <span style="float: right; font-weight: bold; color: #4CAF50; font-size: 1.1em;">${user.score} pts</span>
                `;

                // Adiciona um estilo de destaque para o usuário logado E ATUALIZA O SCORE PESSOAL
                if (loggedEmail && user.email === loggedEmail) {
                    li.style.backgroundColor = '#e8f5e9'; 
                    li.style.borderLeft = '4px solid #4CAF50';
                    li.style.padding = '10px 15px';
                    li.style.fontWeight = 'bold';
                    
                    userBestScore = user.score; // Pega o score do banco, que é mais confiável
                    foundUserInRanking = true;
                } else {
                    li.style.padding = '8px 15px';
                    li.style.borderBottom = '1px dashed #eee';
                }
                li.style.marginBottom = '5px';
                
                ul.appendChild(li);
            });
            
            listContainer.appendChild(ul);
            
            // 5. Exibe a melhor pontuação pessoal (se o usuário estiver no ranking)
            if (loggedEmail && foundUserInRanking && personalScoreDisplay) {
                personalScoreDisplay.textContent = `Seu Recorde: ${userBestScore} pts`;
            }
        }
    } catch (error) {
        if (listContainer) {
            listContainer.innerHTML = '<p style="text-align: center; color: red; padding: 20px;">' +
                                      '🚨 Erro de Rede. Verifique se o servidor de API (porta 5500) está ativo.' +
                                      '</p>';
        }
        console.error('Erro fatal ao buscar o ranking:', error);
    }
}

// Inicia a função ao carregar a página
document.addEventListener('DOMContentLoaded', fetchRanking);

document.addEventListener('DOMContentLoaded', () => {
    // Chave de login padronizada
    const USUARIO_ATIVO_KEY = 'usuarioAtivo'; 
    
    // 1. Elementos HTML que precisamos manipular
    const loginLinkAnchor = document.querySelector('nav a[href="../cadastro/login.html"]');
    const userStatusDisplay = document.getElementById('user-status-display');
    
    // 2. Status do usuário
    const userEmail = sessionStorage.getItem(USUARIO_ATIVO_KEY);

    // =======================================================
    // FUNÇÃO DE LOGOUT
    // =======================================================
    function handleLogout(event) {
        event.preventDefault(); 
        sessionStorage.removeItem(USUARIO_ATIVO_KEY); 
        // Recarrega a página principal (fora de iframe, se houver)
        window.top.location.reload(); 
    }

    if (userEmail) {
        // =======================================================
        // AÇÕES SE O USUÁRIO ESTIVER LOGADO (CADASTRADO)
        // =======================================================
        
        console.log(`[INDEX] Usuário ativo: ${userEmail}. Ocultando link de login.`);
        
        // 1. FAZ A ÂNCORA DE LOGIN SUMIR
        if (loginLinkAnchor) {
            loginLinkAnchor.style.display = 'none';
        }
        
        // 2. EXIBE O E-MAIL DO USUÁRIO E O BOTÃO DE SAIR
        if (userStatusDisplay) {
            
            // Limpa qualquer conteúdo anterior
            userStatusDisplay.innerHTML = '';
            
            // Cria elemento para exibir o email (ex: "Bem-vindo, nome")
            const emailSpan = document.createElement('span');
            // Exibe apenas a parte do nome antes do @ (para ficar mais limpo)
            emailSpan.innerHTML =  `<img src="../assets/material-symbols_person.svg" alt=""> <strong >${userEmail.split('@')[0]}</strong>`;
            emailSpan.style.marginRight = '10px';
            emailSpan.style.color = '#388e3c'; 
            emailSpan.style.fontWeight = '500';

            // Cria o link de Sair/Logout
            const logoutLink = document.createElement('a');
            logoutLink.href = '#';
            logoutLink.textContent = 'Sair';
            logoutLink.style.color = '#d32f2f'; 
            logoutLink.style.textDecoration = 'none';
            logoutLink.addEventListener('click', handleLogout);

            // Adiciona os elementos ao contêiner de status no header
            userStatusDisplay.appendChild(emailSpan);
            userStatusDisplay.appendChild(logoutLink);
        }

    } else {
        // =======================================================
        // AÇÕES SE O USUÁRIO NÃO ESTIVER LOGADO
        // =======================================================
        
        console.log("[INDEX] Nenhum usuário logado. Link 'Fazer login' visível.");
        
        // 1. Garante que o link de login está visível
        if (loginLinkAnchor) {
            loginLinkAnchor.style.display = 'inline';
        }
        
        // 2. Garante que a área de status está vazia
        if (userStatusDisplay) {
            userStatusDisplay.innerHTML = '';
        }
    }
});