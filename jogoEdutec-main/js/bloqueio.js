document.addEventListener('DOMContentLoaded', () => {
    // 1. Defina o ID do botão que será afetado pela lógica
    const botaoJogar = document.getElementById('botao-jogar'); 
    
    // Assumimos que a página do jogo é 'jogo.html' e a de login é 'index.html'
    const PAGINA_JOGO = 'jogar.html';
    const PAGINA_LOGIN = '../index.html';

    if (!botaoJogar) {
        console.error("Erro: O elemento com ID 'botao-jogar' não foi encontrado.");
        return;
    }

    // 2. Função de verificação principal
    function verificarStatusECadastrado() {
        // A chave 'loggedInUserEmail' é usada para indicar que o usuário está logado.
        const emailDoUsuarioLogado = sessionStorage.getItem('usuarioAtivo');

        if (emailCadastrado) {
            // Se o email existir, o usuário está LOGADO (e, portanto, cadastrado)
            // Ação: Direcionar para a página do jogo
            
            botaoJogar.textContent = "Jogar Agora";
            botaoJogar.onclick = function() {
                window.location.href = PAGINA_JOGO; // Redireciona para o jogo
            };
            
            console.log(`[STATUS] Usuário logado: ${emailCadastrado}. Botão configurado para IR AO JOGO.`);
        
        } else {
            // Se o email NÃO existir, o usuário NÃO está logado
            // Ação: Direcionar para a página de login/cadastro
            
            botaoJogar.textContent = "Fazer Login / Cadastrar";
            botaoJogar.onclick = function() {
                window.location.href = PAGINA_LOGIN; // Redireciona para o login
            };
            
            console.log("[STATUS] Usuário não logado. Botão configurado para IR AO LOGIN.");
        }
    }

    // Executa a verificação ao carregar a página
    verificarStatusECadastrado();
});