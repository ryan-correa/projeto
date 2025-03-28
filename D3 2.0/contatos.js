document.addEventListener('DOMContentLoaded', function() {
    // Seleção dos elementos do DOM
    const btnAdicionarContato = document.getElementById('btn-adicionar-contato');
    const modalContatos = document.getElementById('modal-contatos');
    const closeModalBtn = document.querySelector('.close'); // Botão de fechar (X)
    const formularioContato = document.getElementById('formulario-contato');
    const listaContatos = document.getElementById('lista-contatos');
    const listaContatosFrequentes = document.getElementById('lista-contatos-frequentes');
    const contatosArea = document.getElementById('contatos-area');
    const contatosFrequentesArea = document.getElementById('contatos-frequentes-area');

    // Função para abrir o modal de adicionar contato
    function openModal() {
        modalContatos.style.display = 'block'; // Torna o modal visível
    }

    // Função para fechar o modal de adicionar contato
    function closeModal() {
        modalContatos.style.display = 'none'; // Torna o modal invisível
    }

    // Função para abrir o modal com as informações do contato
    function openInfoModal(nome, telefone, email) {
        document.getElementById('info-nome').textContent = nome;
        document.getElementById('info-telefone').textContent = telefone;
        document.getElementById('info-email').textContent = email;
        document.getElementById('modal-info').style.display = 'block'; // Abre o modal de informações

        // Adiciona o contato aos Contatos Frequentes
        addToFrequentes(nome, telefone, email);
    }

    // Função para fechar o modal de informações
    function closeInfoModal() {
        document.getElementById('modal-info').style.display = 'none'; // Fecha o modal de informações
    }

    // Função para enviar o formulário de contato e adicionar o contato à área Contatos
    formularioContato.addEventListener('submit', function(event) {
        event.preventDefault();

        const nome = document.getElementById('nome').value;
        const telefone = document.getElementById('telefone').value;
        const email = document.getElementById('email').value;

        // Adicionando o contato na área Contatos (apenas o nome será mostrado)
        const contatoDiv = document.createElement('div');
        contatoDiv.classList.add('contato-nome');
        contatoDiv.textContent = nome;

        // Ao clicar no nome, abre o modal com as informações do contato
        contatoDiv.onclick = function() {
            openInfoModal(nome, telefone, email);
        };
        listaContatos.appendChild(contatoDiv);

        // Limpar os campos do formulário após adicionar o contato
        formularioContato.reset();

        // Fechar o modal de adicionar contato
        closeModal();
    });

    // Função para adicionar aos Contatos Frequentes (Se o contato for visualizado)
    function addToFrequentes(nome, telefone, email) {
        // Criar elemento de contato frequente
        const contatoFrequenteDiv = document.createElement('div');
        contatoFrequenteDiv.classList.add('contato-nome');
        contatoFrequenteDiv.textContent = nome;

        // Verifica se o contato já existe nos frequentes
        if (!isContatoFrequente(nome)) {
            contatoFrequenteDiv.onclick = function() {
                openInfoModal(nome, telefone, email);
            };
            listaContatosFrequentes.appendChild(contatoFrequenteDiv);
        }
    }

    // Função para verificar se o contato já está nos contatos frequentes
    function isContatoFrequente(nome) {
        const contatosFrequentes = listaContatosFrequentes.getElementsByClassName('contato-nome');

        for (let i = 0; i < contatosFrequentes.length; i++) {
            if (contatosFrequentes[i].textContent === nome) {
                return true;
            }
        }
        return false;
    }

    // Fecha o modal se o usuário clicar fora dele
    window.onclick = function(event) {
        if (event.target == modalContatos) {
            closeModal();
        }
        if (event.target == document.getElementById('modal-info')) {
            closeInfoModal();
        }
    }

    // Função para exibir a área de Contatos
    document.getElementById('btn-contatos').addEventListener('click', function() {
        contatosArea.style.display = 'block';
        contatosFrequentesArea.style.display = 'none';
    });

    // Função para exibir a área de Contatos Frequentes
    document.getElementById('btn-contatos-frequentes').addEventListener('click', function() {
        contatosArea.style.display = 'none';
        contatosFrequentesArea.style.display = 'block';
    });

    // Abrir o modal ao clicar no botão "Adicionar Contato"
    btnAdicionarContato.addEventListener('click', function() {
        openModal(); // Chama a função para abrir o modal
    });

    // Fechar o modal de adicionar contato ao clicar no botão de fechar (X)
    closeModalBtn.addEventListener('click', function() {
        closeModal(); // Chama a função para fechar o modal
    });
});
