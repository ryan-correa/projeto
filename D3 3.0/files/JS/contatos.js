document.addEventListener('DOMContentLoaded', function() {
    // Seleção dos elementos do DOM
    const btnAdicionarContato = document.getElementById('btn-adicionar-contato');
    const modalContatos = document.getElementById('modal-contatos');
    const closeModalBtn = document.querySelector('.close');
    const formularioContato = document.getElementById('formulario-contato');
    const listaContatos = document.getElementById('lista-contatos');
    const listaContatosFrequentes = document.getElementById('lista-contatos-frequentes');
    const contatosArea = document.getElementById('contatos-area');
    const contatosFrequentesArea = document.getElementById('contatos-frequentes-area');
    const modalErro = document.getElementById('modal-erro');
    const mensagemErro = document.getElementById('mensagem-erro');
    const closeErroBtn = document.querySelector('.close-erro');
    const modalEditar = document.getElementById('modal-editar');
    let contatoAtual;

    function openModal() {
        modalContatos.style.display = 'block';
    }

    function closeModal() {
        modalContatos.style.display = 'none';
    }

    function openInfoModal(nome, telefone, email) {
        document.getElementById('info-nome').textContent = nome;
        document.getElementById('info-telefone').textContent = telefone;
        document.getElementById('info-email').textContent = email;
        document.getElementById('modal-info').style.display = 'block';
        addToFrequentes(nome, telefone, email);
    }

    function closeInfoModal() {
        document.getElementById('modal-info').style.display = 'none';
    }

    function openErroModal(mensagem) {
        mensagemErro.textContent = mensagem;
        modalErro.style.display = 'block';
        setTimeout(function() {
            modalErro.style.display = 'none';
        }, 2000);
    }

    function openEditarModal(contato) {
        contatoAtual = contato;
        document.getElementById('editar-nome').value = contato.dataset.nome;
        document.getElementById('editar-telefone').value = contato.dataset.telefone;
        document.getElementById('editar-email').value = contato.dataset.email;
        modalEditar.style.display = 'block';
    }

    function closeEditarModal() {
        modalEditar.style.display = 'none';
    }

    formularioContato.addEventListener('submit', function(event) {
        event.preventDefault();

        const nome = document.getElementById('nome').value;
        const telefone = document.getElementById('telefone').value;
        const email = document.getElementById('email').value;

        if (isContatoExistente(nome, telefone, email)) {
            openErroModal('Contato já existe com esse nome, telefone ou email.');
            return;
        }

        const contatoDiv = document.createElement('div');
        contatoDiv.classList.add('contato-nome');
        contatoDiv.classList.add('estilizado'); // Classe de estilo
        contatoDiv.style.opacity = 0;
        setTimeout(() => {
            contatoDiv.style.transition = 'opacity 0.5s ease';
            contatoDiv.style.opacity = 1;
        }, 10);

        contatoDiv.innerHTML = `<span class="nome-text">${nome}</span>`;
        contatoDiv.dataset.nome = nome;
        contatoDiv.dataset.telefone = telefone;
        contatoDiv.dataset.email = email;

        const btnRemoverContato = document.createElement('button');
        btnRemoverContato.classList.add('btn-remover-contato');
        btnRemoverContato.textContent = '🗑️';
        contatoDiv.appendChild(btnRemoverContato);

        const btnEditarContato = document.createElement('button');
        btnEditarContato.classList.add('btn-editar-contato');
        btnEditarContato.textContent = '✏️';
        contatoDiv.appendChild(btnEditarContato);

        contatoDiv.onclick = function() {
            openInfoModal(nome, telefone, email);
        };
        listaContatos.appendChild(contatoDiv);

        formularioContato.reset();
        closeModal();

        btnRemoverContato.addEventListener('click', function(event) {
            event.stopPropagation();
            removerContato(nome, telefone, email);
        });

        btnEditarContato.addEventListener('click', function(event) {
            event.stopPropagation();
            openEditarModal(contatoDiv);
        });
    });

    function isContatoExistente(nome, telefone, email) {
        const contatos = listaContatos.getElementsByClassName('contato-nome');
        for (let i = 0; i < contatos.length; i++) {
            if (contatos[i].dataset.nome === nome || contatos[i].dataset.telefone === telefone || contatos[i].dataset.email === email) {
                return true;
            }
        }

        const contatosFrequentes = listaContatosFrequentes.getElementsByClassName('contato-nome');
        for (let i = 0; i < contatosFrequentes.length; i++) {
            if (contatosFrequentes[i].dataset.nome === nome || contatosFrequentes[i].dataset.telefone === telefone || contatosFrequentes[i].dataset.email === email) {
                return true;
            }
        }

        return false;
    }

    function addToFrequentes(nome, telefone, email) {
        const contatoFrequenteDiv = document.createElement('div');
        contatoFrequenteDiv.classList.add('contato-nome');
        contatoFrequenteDiv.classList.add('estilizado');
        contatoFrequenteDiv.innerHTML = `<span class="nome-text">${nome}</span>`;
        contatoFrequenteDiv.dataset.nome = nome;
        contatoFrequenteDiv.dataset.telefone = telefone;
        contatoFrequenteDiv.dataset.email = email;

        if (!isContatoFrequente(nome, telefone, email)) {
            contatoFrequenteDiv.onclick = function() {
                openInfoModal(nome, telefone, email);
            };
            listaContatosFrequentes.appendChild(contatoFrequenteDiv);
        }
    }

    function isContatoFrequente(nome, telefone, email) {
        const contatosFrequentes = listaContatosFrequentes.getElementsByClassName('contato-nome');
        for (let i = 0; i < contatosFrequentes.length; i++) {
            if (contatosFrequentes[i].dataset.nome === nome || contatosFrequentes[i].dataset.telefone === telefone || contatosFrequentes[i].dataset.email === email) {
                return true;
            }
        }
        return false;
    }

    function removerContato(nome, telefone, email) {
        const contatos = listaContatos.getElementsByClassName('contato-nome');
        for (let i = 0; i < contatos.length; i++) {
            if (contatos[i].dataset.nome === nome && contatos[i].dataset.telefone === telefone && contatos[i].dataset.email === email) {
                contatos[i].remove();
            }
        }

        const contatosFrequentes = listaContatosFrequentes.getElementsByClassName('contato-nome');
        for (let i = 0; i < contatosFrequentes.length; i++) {
            if (contatosFrequentes[i].dataset.nome === nome && contatosFrequentes[i].dataset.telefone === telefone && contatosFrequentes[i].dataset.email === email) {
                contatosFrequentes[i].remove();
            }
        }
    }

    window.onclick = function(event) {
        if (event.target == modalContatos) {
            closeModal();
        }
        if (event.target == document.getElementById('modal-info')) {
            closeInfoModal();
        }
        if (event.target == modalErro) {
            modalErro.style.display = 'none';
        }
        if (event.target == modalEditar) {
            closeEditarModal();
        }
    }

    document.getElementById('btn-contatos').addEventListener('click', function() {
        contatosArea.style.display = 'block';
        contatosFrequentesArea.style.display = 'none';
    });

    document.getElementById('btn-contatos-frequentes').addEventListener('click', function() {
        contatosArea.style.display = 'none';
        contatosFrequentesArea.style.display = 'block';
    });

    btnAdicionarContato.addEventListener('click', function() {
        openModal();
    });

    closeModalBtn.addEventListener('click', function() {
        closeModal();
    });

    closeErroBtn.addEventListener('click', function() {
        modalErro.style.display = 'none';
    });
});
