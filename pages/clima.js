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
            emailSpan.innerHTML =`<div class="img-text"><img src="../assets/material-symbols_person.svg" alt=""> <strong class = "nome-usuario">${userEmail.split('@')[0]} |</strong></div>`;
            emailSpan.style.fontWeight = '500';

            // Cria o link de Sair/Logout
            const logoutLink = document.createElement('a');
            logoutLink.href = '#';
            logoutLink.textContent = 'Sair';
            
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