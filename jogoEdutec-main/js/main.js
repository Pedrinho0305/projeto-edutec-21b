const jogador = document.querySelector('.jogador');
const pipe = document.querySelector('.pipe');
const nuvem = document.querySelector('.nuvem');
const scoreElement = document.querySelector('.score');
const imagemElemento = document.querySelector(".pipe");
const gameBoard = document.querySelector('.game-board');

// Certifique-se de que o botão 'Iniciar' tem o ID "botao-iniciar" no HTML
const startButton = document.querySelector('#botao-iniciar'); 
const restartButton = document.querySelector('.botao-reiniciar');

// No seu main.js, verifique se a constante que define a URL da API
// está apontando para o ENDPOINT correto do backend.

const API_URL = 'http://localhost:5500'; // Raiz do seu servidor Node.js
const UPDATE_SCORE_ENDPOINT = '/update-score'; // A rota configurada no server.js // Corrigido para a rota de update
const PAGINA_LOGIN = '../cadastro/login.html'; // Usando o caminho que você definiu

// 1. PADRONIZAÇÃO DO ARMAZENAMENTO: Usa 'usuarioAtivo' do sessionStorage
let userEmail = sessionStorage.getItem('usuarioAtivo'); 

// Variáveis visuais e de pontuação
const imagens = [
    "images/planta1-removebg-preview.png",
    "images/cacto1-removebg-preview.png",
    "images/neve1-removebg-preview.png",
    "images/pedra1-removebg-preview.png"
];
const fundos = [
    "url('images/tropical1.jpg')",
    "url('images/deserto1.jpg')",
    "url('images/polar2.jpg')",
    "url('images/floresta1.jpg')"
];
const cores = ['#FFFFFF', '#000000', '#000000', '#FFFFFF'];
const sombras = ['2px 2px 4px #000000', '2px 2px 4px #FFFFFF', '2px 2px 4px #FFFFFF', '2px 2px 4px #000000'];
const winScore = 1000;

const jump = () => {
    // Adiciona o jump apenas se a classe 'jump' não estiver presente
    if (!jogador.classList.contains('jump')) {
        jogador.classList.add('jump');
        setTimeout(() => {
            jogador.classList.remove('jump')
        }, 500)
    }
}

async function sendScoreToRanking(score) {
    if (!userEmail) return; 

    try {
        // Envia para a rota de atualização de score
        const response = await fetch(`${API_URL}${UPDATE_SCORE_ENDPOINT}`, { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                email: userEmail, 
                newScore: score // O nome da propriedade deve ser 'newScore'
            })
        });
       if (response.ok) {
            const data = await response.json();
            console.log("Pontuação salva com sucesso:", data);
        } else {
            // Se o backend retornar 404, 500, etc.
            console.error("Erro ao salvar pontuação no backend:", response.status, await response.text());
        }

    } catch (error) {
        // Erro de rede (servidor desligado)
        console.error("Erro de conexão ao tentar salvar pontuação:", error);
    }
}

function startGame() {
    // SE O USUÁRIO NÃO ESTIVER LOGADO, ESTA FUNÇÃO NUNCA DEVE SER CHAMADA DIRETAMENTE.
    // A lógica de bloqueio no DOMContentLoaded já resolve isso.
    
    // Configuração inicial da UI
    startButton.style.display = 'none';
    restartButton.style.display = 'none';
    gameBoard.style.display = 'block';

    pipe.style.animation = 'pipe-animation 1.5s infinite linear';
    pipe.style.display = 'block';
    pipe.style.left = '';
    jogador.src = './images/mario.gif';
    jogador.style.width = '150px';
    jogador.style.marginLeft = '0';
    jogador.style.animation = '';
    jogador.style.bottom = '0px';
    nuvem.style.display = 'block';

    let score = 0;
    let index = 0;

    document.body.style.backgroundImage = fundos[index];
    scoreElement.style.color = cores[index];
    scoreElement.style.textShadow = sombras[index];
    imagemElemento.src = imagens[index];
    scoreElement.textContent = `Pontuação: 0`;

    const backgroundInterval = setInterval(() => {
        index = (index + 1) % imagens.length;
        imagemElemento.src = imagens[index];
        document.body.style.backgroundImage = fundos[index];
        scoreElement.style.color = cores[index];
        scoreElement.style.textShadow = sombras[index];
    }, 10000);

    const loop = setInterval(() => {
        const pipePosition = pipe.offsetLeft;
        // Posição do jogador deve ser obtida dentro do loop para ser precisa
        const jogadorPosition = +window.getComputedStyle(jogador).bottom.replace('px', ''); 

        score++;
        scoreElement.textContent = `Pontuação: ${score}`;

        // Lógica de Game Over (Colisão)
        if (pipePosition <= 120 && jogadorPosition < 90 && pipePosition > 0) {
            clearInterval(loop);
            clearInterval(backgroundInterval);

            pipe.style.animation = 'none';
            pipe.style.left = `${pipePosition}px`;

            jogador.style.animation = 'none';
            jogador.style.bottom = `${jogadorPosition}px`;

            jogador.src = './images/game-over.png';
            jogador.style.width = '75px';
            jogador.style.marginLeft = '50px';

            restartButton.style.display = 'block';
            
            // Envia a pontuação para o ranking
            sendScoreToRanking(score);
        }

        // Lógica de Vitória (Win Score)
        if (score >= winScore) {
            clearInterval(loop);
            clearInterval(backgroundInterval);

            pipe.style.display = 'none';
            nuvem.style.display = 'none';

            jogador.style.animation = 'none';

            jogador.src = './images/imagemVence.gif';
            jogador.style.width = 'auto';
            jogador.style.height = '400px'; 
            jogador.style.bottom = '50px'; 
            jogador.style.left = '50%'; 
            jogador.style.transform = 'translateX(-50%)'; 
            jogador.style.marginLeft = '0';

            restartButton.style.display = 'block';
            
            // Envia a pontuação de vitória
            sendScoreToRanking(winScore);
        }
    }, 100);

    document.addEventListener('keydown', jump);
}

// 2. Lógica de Bloqueio Integrada (Substitui a função bloqueio())

document.addEventListener('DOMContentLoaded', () => {
    // Garante que a checagem use a variável correta
    userEmail = sessionStorage.getItem('usuarioAtivo'); 

    // Função de redirecionamento (precisa ser definida aqui para ser removida/adicionada)
    const redirectToLogin = () => {
        window.top.location.href = PAGINA_LOGIN;
    };

    if (userEmail) {
        // Se logado: Configura o botão para INICIAR O JOGO
        startButton.textContent = "Iniciar Jogo";
        
        // 1. Remove qualquer listener anterior que possa estar lá (como o de redirecionamento)
        startButton.removeEventListener('click', redirectToLogin); 
        
        // 2. ADICIONA o listener correto: Chama a função que inicia a animação do jogo
        startButton.addEventListener('click', startGame); 
        
        console.log(`[STATUS] Usuário logado: ${userEmail}. Botão configurado para INICIAR JOGO.`);
        
        // Oculta o tabuleiro para esperar o clique em 'Iniciar Jogo'
        gameBoard.style.display = 'none';
        
    } else {
        // Se não logado: Configura o botão para REDIRECIONAR
        startButton.textContent = "Fazer Login / Cadastrar";
        
        // Adiciona o listener para redirecionar
        startButton.addEventListener('click', redirectToLogin); 
        
        console.log("[STATUS] Usuário não logado. Botão configurado para IR AO LOGIN.");
        
        // Oculta completamente o tabuleiro do jogo (visualmente bloqueado)
        gameBoard.style.display = 'none'; 
    }
});

// Listener de Reinício (permanece o mesmo)
restartButton.addEventListener('click', () => {
    location.reload();
});


// Você DEVE garantir que o botão no HTML tem o ID="botao-iniciar".
// <button id="botao-iniciar" class="botao-iniciar">Iniciar</button>