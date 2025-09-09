function jogoEmTelaCheia(){
    let tela_jogo = document.querySelector("#tela-jogo")

    if(tela_jogo.requestFullscreen){
        tela_jogo.requestFullscreen()
    }

    else if(tela_jogo.mozRequestFullscreen){
        tela_jogo.mozRequestFullScreen()
    }

    else if(tela_jogo.webkitRequestFullscreen){
        tela_jogo.webkitRequestFullscreen()
    }
    
}