// main.js - Código Final Corrigido (Foco em Score e URL)

const jogador = document.querySelector('.jogador');
const pipe = document.querySelector('.pipe');
const nuvem = document.querySelector('.nuvem');
const scoreElement = document.querySelector('.score');
const imagemElemento = document.querySelector(".pipe");
const gameBoard = document.querySelector('.game-board');

const startButton = document.querySelector('#botao-iniciar'); 
const restartButton = document.querySelector('.botao-reiniciar');

// CORREÇÃO 1: URL ajustada para evitar a barra dupla (//)
const API_URL = 'https://backend-edutec-85jy.vercel.app'; 
const UPDATE_SCORE_ENDPOINT = 'update-score'; // CORREÇÃO 2: Removida a barra inicial (/)
const PAGINA_LOGIN = '../cadastro/login.html'; 

// Variáveis de estado
let userEmail = sessionStorage.getItem('usuarioAtivo'); 
let gameLoop = null; // Variável para controlar o loop principal
let backgroundInterval = null; // Variável para controlar a mudança de background

// ... [Variáveis visuais, cores, fundos, winScore] ...
const imagens = [
    "images/planta1-removebg-preview.png", "images/cacto1-removebg-preview.png",
    "images/neve1-removebg-preview.png", "images/pedra1-removebg-preview.png"
];
const fundos = [
    "url('images/tropical1.jpg')", "url('images/deserto1.jpg')",
    "url('images/polar2.jpg')", "url('images/floresta1.jpg')"
];
const cores = ['#FFFFFF', '#000000', '#000000', '#FFFFFF'];
const sombras = ['2px 2px 4px #000000', '2px 2px 4px #FFFFFF', '2px 2px 4px #FFFFFF', '2px 2px 4px #000000'];
const winScore = 1000;


const jump = () => {
    if (!jogador.classList.contains('jump')) {
        jogador.classList.add('jump');
        setTimeout(() => {
            jogador.classList.remove('jump')
        }, 500)
    }
}

async function sendScoreToRanking(score) {
    
    let userEmail = sessionStorage.getItem('usuarioAtivo'); // Reafirma o valor aqui

    if (!userEmail) {
        console.warn("Usuário não logado. Pontuação não será salva.");
        return; 
    }
    
    // CORREÇÃO DE TIPAGEM: Garante que a pontuação é tratada como número. 
    // Se for undefined ou null, será 0. Se for string ("100"), será 100.
    const finalScore = Number(score) || 0; 

    // Log de debug com a nova URL
    console.log(`Tentando enviar pontuação. URL COMPLETA: ${API_URL}/${UPDATE_SCORE_ENDPOINT}`);
    console.log(`Dados enviados: Email: ${userEmail}, Score: ${finalScore}`); // AGORA VAI LOGAR O NÚMERO CORRIGIDO

    try {
        // CORREÇÃO 4: Concatenação explícita com a barra (/)
        const response = await fetch(`${API_URL}/${UPDATE_SCORE_ENDPOINT}`, { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                email: userEmail, 
                newScore: finalScore // Usando a pontuação corrigida
            })
        });
        
        // ... (restante do tratamento de resposta)
        const data = await response.json();

        if (response.ok) {
            console.log("Pontuação salva com sucesso:", data.message);
        } else {
            // Aqui o backend respondeu com 400 (Bad Request)
            console.error("Erro ao salvar pontuação no backend:", data.message);
        }

    } catch (error) {
        // Captura o 'Failed to fetch' (Erro 500 ou Conexão)
        console.error("Erro de conexão ao tentar salvar pontuação:", error); 
    }
}

function startGame() {
    // Esconde o botão de Iniciar
    startButton.style.display = 'none';
    restartButton.style.display = 'none';
    // Mostra o tabuleiro do jogo (que estava oculto)
    gameBoard.style.display = 'block'; 

    // Reinicia as animações e estilos
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

    // Configuração inicial do ambiente
    document.body.style.backgroundImage = fundos[index];
    scoreElement.style.color = cores[index];
    scoreElement.style.textShadow = sombras[index];
    imagemElemento.src = imagens[index];
    scoreElement.textContent = `Pontuação: 0`;

    // Loop de mudança de background
    backgroundInterval = setInterval(() => {
        index = (index + 1) % imagens.length;
        imagemElemento.src = imagens[index];
        document.body.style.backgroundImage = fundos[index];
        scoreElement.style.color = cores[index];
        scoreElement.style.textShadow = sombras[index];
    }, 10000);

    // Loop principal do jogo (Colisão e Pontuação)
    gameLoop = setInterval(() => {
        const pipePosition = pipe.offsetLeft;
        const jogadorPosition = +window.getComputedStyle(jogador).bottom.replace('px', ''); 

        score++;
        scoreElement.textContent = `Pontuação: ${score}`;

        // Lógica de Game Over
        if (pipePosition <= 120 && jogadorPosition < 90 && pipePosition > 0) {
            clearInterval(gameLoop);
            clearInterval(backgroundInterval);
            document.removeEventListener('keydown', jump); // Remove o listener

            pipe.style.animation = 'none';
            pipe.style.left = `${pipePosition}px`;

            jogador.style.animation = 'none';
            jogador.style.bottom = `${jogadorPosition}px`;
            jogador.src = './images/game-over.png';
            jogador.style.width = '75px';
            jogador.style.marginLeft = '50px';

            restartButton.style.display = 'block';
            
            // CORREÇÃO CRÍTICA 3: Garante que 'score' é passado como número
            sendScoreToRanking(Number(score)); 
        }

        // Lógica de Vitória
        if (score >= winScore) {
            clearInterval(gameLoop);
            clearInterval(backgroundInterval);
            document.removeEventListener('keydown', jump); // Remove o listener

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
            sendScoreToRanking(winScore);
        }
    }, 100);

    document.addEventListener('keydown', jump);
}

// Lógica de Bloqueio/Inicialização
document.addEventListener('DOMContentLoaded', () => {
    userEmail = sessionStorage.getItem('usuarioAtivo'); 
    
    // Esconde o gameBoard por padrão (para ser iniciado pelo botão)
    gameBoard.style.display = 'none'; 

    const redirectToLogin = () => {
        window.top.location.href = PAGINA_LOGIN;
    };
    
    // Garante que os botões são válidos antes de adicionar listeners
    if (!startButton || !restartButton) {
        console.error("Erro: Elementos #botao-iniciar ou .botao-reiniciar não encontrados no HTML.");
        return;
    }

    if (userEmail) {
        startButton.textContent = "Iniciar Jogo";
        startButton.removeEventListener('click', redirectToLogin); 
        startButton.addEventListener('click', startGame); 
        
    } else {
        startButton.textContent = "Fazer Login / Cadastrar";
        startButton.addEventListener('click', redirectToLogin); 
    }
});

// Listener de Reinício
if (restartButton) {
    restartButton.addEventListener('click', () => {
        location.reload();
    });
}