// -- modais --

// abre o modal certo e inicia o jogo correspondente
const botoesAbrirModal = document.querySelectorAll('.abrir-modal');

botoesAbrirModal.forEach(botao => {
    botao.addEventListener('click', () => {
        const idModal = botao.getAttribute('data-modal');
        const modal = document.getElementById(idModal);

        // inicia o jogo antes de abrir
        if (idModal === 'modal-quiz')         iniciarQuiz();
        if (idModal === 'modal-verdade-mito') iniciarVerdadeMito();
        if (idModal === 'modal-safra')        iniciarSafra();

        modal.showModal();
    });
});

// fecha ao clicar no x
const botoesFecharModal = document.querySelectorAll('.fechar-modal');

botoesFecharModal.forEach(botao => {
    botao.addEventListener('click', () => {
        const idModal = botao.getAttribute('data-modal');
        document.getElementById(idModal).close();
    });
});

// fecha clicando fora (no backdrop)
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', evento => {
        if (evento.target === modal) modal.close();
    });
});


// -- menu mobile --

const botaoMenuMobile = document.getElementById('botaoMenuMobile');
const menuNav = document.getElementById('menuNav');

// abre/fecha o menu no mobile
botaoMenuMobile.addEventListener('click', () => {
    menuNav.classList.toggle('aberto');
});

// fecha o menu ao navegar
document.querySelectorAll('.menu a').forEach(link => {
    link.addEventListener('click', () => {
        menuNav.classList.remove('aberto');
    });
});


// -- quiz agro --
// multipla escolha sobre agricultura

// perguntas do quiz
const perguntasQuiz = [
    {
        pergunta: "Qual é um dos principais produtos agrícolas exportados pelo Paraná?",
        opcoes: ["Arroz", "Soja", "Café", "Laranja"],
        correta: 1
    },
    {
        pergunta: "Qual prática agrícola ajuda a preservar a qualidade do solo?",
        opcoes: ["Queimadas", "Monocultura sem rotação", "Plantio direto", "Desmatamento"],
        correta: 2
    },
    {
        pergunta: "O que é agricultura orgânica?",
        opcoes: [
            "Agricultura que usa apenas máquinas pesadas",
            "Produção sem agrotóxicos sintéticos",
            "Plantação feita somente em solos arenosos",
            "Agricultura que depende só de chuva"
        ],
        correta: 1
    },
    {
        pergunta: "Qual dessas práticas ajuda a economizar água na lavoura?",
        opcoes: [
            "Irrigação por inundação",
            "Irrigação por gotejamento",
            "Regar apenas à noite",
            "Não irrigar"
        ],
        correta: 1
    },
    {
        pergunta: "O que é rotação de culturas?",
        opcoes: [
            "Plantar sempre a mesma cultura no mesmo lugar",
            "Alternar diferentes culturas no mesmo solo ao longo do tempo",
            "Girar as máquinas agrícolas para não desgastar",
            "Trocar de fazenda todo ano"
        ],
        correta: 1
    }
];

// controle do quiz
let indicePerguntaAtual  = 0;
let pontuacaoQuiz        = 0;
let respostaQuizFeita    = false;

// reinicia o quiz do zero
function iniciarQuiz() {
    indicePerguntaAtual = 0;
    pontuacaoQuiz       = 0;
    respostaQuizFeita   = false;
    exibirPerguntaQuiz();
}

// renderiza a pergunta atual
function exibirPerguntaQuiz() {
    const areaQuiz       = document.getElementById('area-quiz');
    const perguntaAtual  = perguntasQuiz[indicePerguntaAtual];
    const totalPerguntas = perguntasQuiz.length;
    const porcentagem    = (indicePerguntaAtual / totalPerguntas) * 100;

    areaQuiz.innerHTML = `
        <h2 class="quiz-titulo">🌾 Quizz Agro</h2>
        <p class="quiz-progresso-texto">Pergunta ${indicePerguntaAtual + 1} de ${totalPerguntas}</p>
        <div class="barra-progresso">
            <div class="barra-preenchida" style="width: ${porcentagem}%"></div>
        </div>
        <p class="pergunta-quiz">${perguntaAtual.pergunta}</p>
        <div class="lista-opcoes">
            ${perguntaAtual.opcoes.map((opcao, indice) => `
                <button class="opcao-quiz" onclick="responderQuiz(${indice})">${opcao}</button>
            `).join('')}
        </div>
        <button class="botao-proximo" id="botaoProximoQuiz" onclick="proximaPerguntaQuiz()">
            ${indicePerguntaAtual < totalPerguntas - 1 ? 'Próxima →' : 'Ver Resultado 🏆'}
        </button>
    `;

    respostaQuizFeita = false;
}

// verifica a opcao clicada
function responderQuiz(indiceEscolhido) {
    if (respostaQuizFeita) return; // bloqueia resposta dupla
    respostaQuizFeita = true;

    const perguntaAtual  = perguntasQuiz[indicePerguntaAtual];
    const botoesOpcao    = document.querySelectorAll('.opcao-quiz');

    // desabilita tudo apos escolher
    botoesOpcao.forEach(botao => botao.disabled = true);

    if (indiceEscolhido === perguntaAtual.correta) {
        botoesOpcao[indiceEscolhido].classList.add('correta');
        pontuacaoQuiz++;
    } else {
        botoesOpcao[indiceEscolhido].classList.add('errada');
        botoesOpcao[perguntaAtual.correta].classList.add('correta'); // mostra a certa
    }

    // exibe o btn de avancar
    document.getElementById('botaoProximoQuiz').style.display = 'block';
}

// proxima pergunta ou resultado final
function proximaPerguntaQuiz() {
    indicePerguntaAtual++;

    if (indicePerguntaAtual < perguntasQuiz.length) {
        exibirPerguntaQuiz();
    } else {
        exibirResultadoQuiz();
    }
}

// tela de resultado do quiz
function exibirResultadoQuiz() {
    const areaQuiz       = document.getElementById('area-quiz');
    const totalPerguntas = perguntasQuiz.length;
    const percentual     = Math.round((pontuacaoQuiz / totalPerguntas) * 100);

    // emoji e msg conforme a pontuacao
    let emoji    = '😢';
    let mensagem = 'Não desanime! Tente novamente para aprender mais!';

    if (percentual >= 80) {
        emoji    = '🏆';
        mensagem = 'Incrível! Você é um expert em agricultura!';
    } else if (percentual >= 60) {
        emoji    = '🌱';
        mensagem = 'Bom trabalho! Você sabe bastante sobre o agronegócio!';
    } else if (percentual >= 40) {
        emoji    = '📚';
        mensagem = 'Razoável! Que tal estudar um pouco mais?';
    }

    areaQuiz.innerHTML = `
        <div class="resultado-jogo">
            <div class="resultado-emoji">${emoji}</div>
            <h2 class="resultado-titulo">Quiz Concluído!</h2>
            <p class="resultado-pontuacao">${pontuacaoQuiz}/${totalPerguntas} (${percentual}%)</p>
            <p class="resultado-mensagem">${mensagem}</p>
            <button class="botao-reiniciar" onclick="iniciarQuiz()">🔄 Tentar Novamente</button>
        </div>
    `;
}


// -- verdade ou mito --
// jogador decide se cada afirmacao e verdade ou mito

// afirmacoes com explicacoes
const afirmacoesVerdadeMito = [
    {
        afirmacao:  "A soja é o principal produto agrícola exportado pelo Paraná.",
        resposta:   true,
        explicacao: "Verdade! O Paraná é um dos maiores produtores de soja do Brasil, sendo o produto destaque da agricultura paranaense."
    },
    {
        afirmacao:  "Queimadas são uma prática benéfica para o solo a longo prazo.",
        resposta:   false,
        explicacao: "Mito! As queimadas destroem a matéria orgânica, eliminam microrganismos essenciais e causam erosão. São altamente prejudiciais."
    },
    {
        afirmacao:  "O plantio direto é uma técnica que ajuda a conservar o solo e reduzir a erosão.",
        resposta:   true,
        explicacao: "Verdade! O plantio direto mantém os resíduos vegetais sobre o solo, conservando a umidade e aumentando a matéria orgânica."
    },
    {
        afirmacao:  "O Paraná é o maior produtor de soja do Brasil.",
        resposta:   false,
        explicacao: "Mito! O Mato Grosso é o maior produtor de soja do Brasil. O Paraná geralmente ocupa a segunda ou terceira posição."
    },
    {
        afirmacao:  "A rotação de culturas melhora a saúde do solo ao longo do tempo.",
        resposta:   true,
        explicacao: "Verdade! Alternar culturas diferentes ajuda a repor nutrientes, controlar pragas e melhorar a estrutura do solo."
    },
    {
        afirmacao:  "Agrotóxicos podem ser usados em qualquer quantidade sem afetar o meio ambiente.",
        resposta:   false,
        explicacao: "Mito! O uso excessivo contamina o solo e a água, e prejudica insetos benéficos como as abelhas. Devem ser usados com responsabilidade."
    }
];

// controle do jogo vm
let indiceAfirmacaoAtual    = 0;
let pontuacaoVerdadeMito    = 0;
let respostaVerdadeFeita    = false;

// reinicia o jogo vm
function iniciarVerdadeMito() {
    indiceAfirmacaoAtual = 0;
    pontuacaoVerdadeMito = 0;
    respostaVerdadeFeita = false;
    exibirAfirmacao();
}

// renderiza a afirmacao atual
function exibirAfirmacao() {
    const areaJogo        = document.getElementById('area-verdade-mito');
    const afirmacaoAtual  = afirmacoesVerdadeMito[indiceAfirmacaoAtual];
    const totalAfirmacoes = afirmacoesVerdadeMito.length;
    const porcentagem     = (indiceAfirmacaoAtual / totalAfirmacoes) * 100;

    areaJogo.innerHTML = `
        <h2 class="quiz-titulo">🤔 Verdade ou Mito?</h2>
        <p class="quiz-progresso-texto">Afirmação ${indiceAfirmacaoAtual + 1} de ${totalAfirmacoes}</p>
        <div class="barra-progresso">
            <div class="barra-preenchida" style="width: ${porcentagem}%"></div>
        </div>
        <div class="afirmacao-destaque">"${afirmacaoAtual.afirmacao}"</div>
        <div class="botoes-verdade-mito">
            <button class="botao-verdade" id="btnVerdade" onclick="responderVerdadeMito(true)">✅ Verdade</button>
            <button class="botao-mito"    id="btnMito"   onclick="responderVerdadeMito(false)">❌ Mito</button>
        </div>
        <div class="caixa-feedback" id="caixaFeedback"></div>
        <button class="botao-proximo" id="botaoProximoVM" onclick="proximaAfirmacao()">
            ${indiceAfirmacaoAtual < totalAfirmacoes - 1 ? 'Próxima →' : 'Ver Resultado 🏆'}
        </button>
    `;

    respostaVerdadeFeita = false;
}

// verifica resposta do jogador
function responderVerdadeMito(respostaUsuario) {
    if (respostaVerdadeFeita) return; // bloqueia dupla
    respostaVerdadeFeita = true;

    const afirmacaoAtual  = afirmacoesVerdadeMito[indiceAfirmacaoAtual];
    const caixaFeedback   = document.getElementById('caixaFeedback');
    const btnVerdade      = document.getElementById('btnVerdade');
    const btnMito         = document.getElementById('btnMito');

    // desabilita os btns apos responder
    btnVerdade.disabled = true;
    btnMito.disabled    = true;

    const acertou = respostaUsuario === afirmacaoAtual.resposta;

    if (acertou) {
        pontuacaoVerdadeMito++;
        caixaFeedback.className   = 'caixa-feedback feedback-certo';
        caixaFeedback.innerHTML   = `✅ <strong>Correto!</strong> ${afirmacaoAtual.explicacao}`;
    } else {
        caixaFeedback.className   = 'caixa-feedback feedback-errado';
        caixaFeedback.innerHTML   = `❌ <strong>Errado!</strong> ${afirmacaoAtual.explicacao}`;
    }

    caixaFeedback.style.display                        = 'block';
    document.getElementById('botaoProximoVM').style.display = 'block';
}

// proxima afirmacao ou resultado
function proximaAfirmacao() {
    indiceAfirmacaoAtual++;

    if (indiceAfirmacaoAtual < afirmacoesVerdadeMito.length) {
        exibirAfirmacao();
    } else {
        exibirResultadoVerdadeMito();
    }
}

// resultado final do jogo vm
function exibirResultadoVerdadeMito() {
    const areaJogo   = document.getElementById('area-verdade-mito');
    const total      = afirmacoesVerdadeMito.length;
    const percentual = Math.round((pontuacaoVerdadeMito / total) * 100);

    let emoji    = '😕';
    let mensagem = 'Continue aprendendo sobre agricultura!';

    if (percentual >= 80) {
        emoji    = '🌟';
        mensagem = 'Você arrasou! É um verdadeiro expert do agro!';
    } else if (percentual >= 60) {
        emoji    = '🌿';
        mensagem = 'Boa! Você tem bons conhecimentos sobre agricultura!';
    } else if (percentual >= 40) {
        emoji    = '📖';
        mensagem = 'Valeu a tentativa! Que tal estudar um pouco mais?';
    }

    areaJogo.innerHTML = `
        <div class="resultado-jogo">
            <div class="resultado-emoji">${emoji}</div>
            <h2 class="resultado-titulo">Fim do Jogo!</h2>
            <p class="resultado-pontuacao">${pontuacaoVerdadeMito}/${total} (${percentual}%)</p>
            <p class="resultado-mensagem">${mensagem}</p>
            <button class="botao-reiniciar" onclick="iniciarVerdadeMito()">🔄 Jogar Novamente</button>
        </div>
    `;
}


// -- adivinhe a safra --
// jogador recebe dicas e tenta adivinhar a cultura

// culturas com dicas progressivas
const culturasSafra = [
    {
        dicas: [
            "🌱 Sou uma leguminosa muito cultivada no sul do Brasil.",
            "🔬 Meu óleo é usado em óleo de cozinha e na produção de biodiesel.",
            "📦 Sou exportada em grande quantidade para a China.",
            "🌿 Minha planta tem flores brancas e sementes dentro de vagens."
        ],
        opcoes:  ["Milho", "Soja", "Trigo", "Algodão"],
        correta: 1
    },
    {
        dicas: [
            "🌾 Sou um cereal usado para fazer farinha.",
            "🍞 O pão e o macarrão que você come todo dia são feitos de mim.",
            "❄️ Prefiro climas mais frios para crescer bem.",
            "🌾 Meus grãos crescem em hastes chamadas espigas."
        ],
        opcoes:  ["Arroz", "Cevada", "Trigo", "Centeio"],
        correta: 2
    },
    {
        dicas: [
            "☕ Sou uma das bebidas mais consumidas no mundo.",
            "🫘 Meus grãos são torrados e moídos para preparar a bebida.",
            "🌳 Minha planta é um arbusto que gosta de altitudes elevadas.",
            "🇧🇷 O Brasil é o maior produtor mundial da minha espécie."
        ],
        opcoes:  ["Chá", "Cacau", "Café", "Erva-mate"],
        correta: 2
    },
    {
        dicas: [
            "🟡 Sou um cereal muito versátil — viro fubá, canjica e pipoca.",
            "🌽 Minha espiga é grande, com fileiras de grãos coloridos.",
            "🐔 Sou amplamente usado para alimentar aves e suínos.",
            "☀️ Preciso de bastante sol e calor para crescer bem."
        ],
        opcoes:  ["Milho", "Sorgo", "Trigo", "Arroz"],
        correta: 0
    }
];

// controle do jogo safra
let indiceCulturaAtual       = 0;
let pontuacaoSafra           = 0;
let indiceDicaAtual          = 0;
let respostaSafraFeita       = false;

// reinicia o jogo safra
function iniciarSafra() {
    indiceCulturaAtual = 0;
    pontuacaoSafra     = 0;
    indiceDicaAtual    = 0;
    respostaSafraFeita = false;
    exibirCultura();
}

// renderiza o estado atual da cultura
function exibirCultura() {
    const areaSafra    = document.getElementById('area-safra');
    const culturaAtual = culturasSafra[indiceCulturaAtual];
    const totalCulturas = culturasSafra.length;
    const porcentagem  = (indiceCulturaAtual / totalCulturas) * 100;

    // so mostra as dicas ja reveladas
    const dicasReveladas = culturaAtual.dicas.slice(0, indiceDicaAtual + 1);
    const temMaisDicas   = indiceDicaAtual < culturaAtual.dicas.length - 1;

    areaSafra.innerHTML = `
        <h2 class="quiz-titulo">🌾 Adivinhe a Safra</h2>
        <p class="quiz-progresso-texto">
            Cultura ${indiceCulturaAtual + 1} de ${totalCulturas}
            &nbsp;•&nbsp; Dica ${indiceDicaAtual + 1}/${culturaAtual.dicas.length}
        </p>
        <div class="barra-progresso">
            <div class="barra-preenchida" style="width: ${porcentagem}%"></div>
        </div>
        <div class="caixa-dicas">
            ${dicasReveladas.map(dica => `<p>${dica}</p>`).join('')}
            ${temMaisDicas
                ? `<button class="botao-mais-dica" onclick="revelarProximaDica()">+ Mais uma dica</button>`
                : ''}
        </div>
        <div class="grade-opcoes-safra">
            ${culturaAtual.opcoes.map((opcao, indice) => `
                <button class="opcao-safra" onclick="responderSafra(${indice})">${opcao}</button>
            `).join('')}
        </div>
        <button class="botao-proximo" id="botaoProximoSafra" onclick="proximaCultura()">
            ${indiceCulturaAtual < totalCulturas - 1 ? 'Próxima →' : 'Ver Resultado 🏆'}
        </button>
    `;

    respostaSafraFeita = false;
}

// revela proxima dica
function revelarProximaDica() {
    if (indiceDicaAtual < culturasSafra[indiceCulturaAtual].dicas.length - 1) {
        indiceDicaAtual++;
        exibirCultura();
    }
}

// verifica resposta do safra
function responderSafra(indiceEscolhido) {
    if (respostaSafraFeita) return; // bloqueia dupla
    respostaSafraFeita = true;

    const culturaAtual = culturasSafra[indiceCulturaAtual];
    const botoesOpcao  = document.querySelectorAll('.opcao-safra');

    // desabilita tudo
    botoesOpcao.forEach(botao => botao.disabled = true);

    if (indiceEscolhido === culturaAtual.correta) {
        botoesOpcao[indiceEscolhido].classList.add('correta');
        pontuacaoSafra++;
    } else {
        botoesOpcao[indiceEscolhido].classList.add('errada');
        botoesOpcao[culturaAtual.correta].classList.add('correta'); // mostra a resp certa
    }

    document.getElementById('botaoProximoSafra').style.display = 'block';
}

// proxima cultura
function proximaCultura() {
    indiceCulturaAtual++;
    indiceDicaAtual = 0; // reseta dicas p nova cultura

    if (indiceCulturaAtual < culturasSafra.length) {
        exibirCultura();
    } else {
        exibirResultadoSafra();
    }
}

// resultado final do safra
function exibirResultadoSafra() {
    const areaSafra  = document.getElementById('area-safra');
    const total      = culturasSafra.length;
    const percentual = Math.round((pontuacaoSafra / total) * 100);

    let emoji    = '🌱';
    let mensagem = 'Continue praticando para conhecer mais culturas paranaenses!';

    if (percentual >= 80) {
        emoji    = '🏅';
        mensagem = 'Parabéns! Você conhece muito bem as culturas do Paraná!';
    } else if (percentual >= 50) {
        emoji    = '🌾';
        mensagem = 'Bom trabalho! Você está aprendendo bem sobre o campo!';
    }

    areaSafra.innerHTML = `
        <div class="resultado-jogo">
            <div class="resultado-emoji">${emoji}</div>
            <h2 class="resultado-titulo">Safra Concluída!</h2>
            <p class="resultado-pontuacao">${pontuacaoSafra}/${total} (${percentual}%)</p>
            <p class="resultado-mensagem">${mensagem}</p>
            <button class="botao-reiniciar" onclick="iniciarSafra()">🔄 Jogar Novamente</button>
        </div>
    `;
}


// -- acessibilidade --

// alto contraste
const btnContraste = document.getElementById('btnContraste');
const estiloNormal = document.getElementById('estiloNormal');
const estiloContraste = document.getElementById('estiloContraste');
const contrasteAtivo = localStorage.getItem('altoContraste') === '1';

estiloNormal.disabled = false; // mantém o CSS base sempre ativo
estiloContraste.disabled = !contrasteAtivo;
document.body.classList.toggle('alto-contraste', contrasteAtivo);
btnContraste.classList.toggle('ativo', contrasteAtivo);

btnContraste.addEventListener('click', () => {
    const usarContraste = estiloContraste.disabled;
    estiloContraste.disabled = !usarContraste;
    document.body.classList.toggle('alto-contraste', !estiloContraste.disabled);
    btnContraste.classList.toggle('ativo', !estiloContraste.disabled);
    localStorage.setItem('altoContraste', estiloContraste.disabled ? '0' : '1');
});

// tamanho da fonte (A+ / A-)
const FONTE_BASE = 16, FONTE_MIN = 12, FONTE_MAX = 22;
let tamanhoFonte = parseInt(localStorage.getItem('tamanhoFonte') || FONTE_BASE);
document.documentElement.style.fontSize = tamanhoFonte + 'px';

document.getElementById('btnFontePlus').addEventListener('click', () => {
    if (tamanhoFonte >= FONTE_MAX) return;
    tamanhoFonte += 2;
    document.documentElement.style.fontSize = tamanhoFonte + 'px';
    localStorage.setItem('tamanhoFonte', tamanhoFonte);
});

document.getElementById('btnFonteMinus').addEventListener('click', () => {
    if (tamanhoFonte <= FONTE_MIN) return;
    tamanhoFonte -= 2;
    document.documentElement.style.fontSize = tamanhoFonte + 'px';
    localStorage.setItem('tamanhoFonte', tamanhoFonte);
});

// leitura por voz (tts)
const btnOuvir = document.getElementById('btnOuvir');
btnOuvir.addEventListener('click', () => {
    if (!('speechSynthesis' in window)) {
        alert('Seu navegador não suporta leitura por voz.');
        return;
    }
    // para se ja estiver lendo
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
        btnOuvir.textContent = '🔊';
        btnOuvir.setAttribute('aria-label', 'Ouvir conteúdo da página');
        return;
    }
    // coleta texto das secoes visiveis
    const seletores = [
        '.inicio-conteudo h1',
        '.inicio-conteudo p',
        '.jogo-info h3',
        '.jogo-info p',
        '.sobre-conteudo p'
    ];
    const textoParaLer = seletores
        .flatMap(s => Array.from(document.querySelectorAll(s)))
        .map(el => el.textContent.trim())
        .filter(t => t.length > 0)
        .join('. ');

    const fala = new SpeechSynthesisUtterance(textoParaLer);
    fala.lang  = 'pt-BR';
    fala.rate  = 0.92;
    fala.onend = () => {
        btnOuvir.textContent = '🔊';
        btnOuvir.setAttribute('aria-label', 'Ouvir conteúdo da página');
    };
    speechSynthesis.speak(fala);
    btnOuvir.textContent = '⏹';
    btnOuvir.setAttribute('aria-label', 'Parar leitura');
});