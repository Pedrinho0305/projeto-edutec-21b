const RANKING_GET_URL = "http://localhost:5500/ranking";
const rankingList = document.getElementById('ranking-list');



// Função para carregar e exibir o ranking no HTML
async function loadRanking() {
    // Exibe a mensagem de carregamento e limpa a lista
    
    rankingList.innerHTML = ''; 

    try {
        const response = await fetch(RANKING_GET_URL);
        
        if (!response.ok) {
            throw new Error(`Erro do servidor: ${response.status}`);
        }

        const rankingData = await response.json(); // Array com o Top 10

        if (rankingData.length === 0) {
            rankingList.innerHTML = '<li>Nenhuma pontuação registrada ainda. Seja o primeiro!</li>';
            return;
        }

        // Itera sobre os dados e cria os elementos da lista
        rankingData.forEach((entry, index) => {
            const li = document.createElement('li');
            li.textContent = `${index + 1}º. ${entry.email} - ${entry.score} pontos`;
            rankingList.appendChild(li);
        });

    } catch (error) {
        console.error("Erro ao carregar o ranking:", error);
        rankingList.innerHTML = `<li>Erro ao carregar o ranking: ${error.message}</li>`;
    } finally {
        // Esconde a mensagem de carregamento após a tentativa
        loadingMessage.style.display = 'none';
    }
}

// 🔑 Chama a função para carregar o ranking assim que a página é carregada
document.addEventListener('DOMContentLoaded', loadRanking);