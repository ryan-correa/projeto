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
    const closeEditarBtn = document.querySelector('.close-editar');
    const formularioEditar = document.getElementById('formulario-editar');
    let contatoAtual = null;

    // Funções para o modal de adicionar contato
    function openModal() {
        modalContatos.style.display = 'block';
    }

    function closeModal() {
        modalContatos.style.display = 'none';
    }

    // Funções para o modal de informações
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

    // Funções para o modal de erro
    function openErroModal(mensagem) {
        mensagemErro.textContent = mensagem;
        modalErro.style.display = 'block';
        setTimeout(function() {
            modalErro.style.display = 'none';
        }, 2000);
    }

    // Funções para o modal de edição
    function openEditarModal(contato) {
        if (!contato) {
            console.error("Erro: Contato não definido!");
            return;
        }
        contatoAtual = contato;
        document.getElementById('editar-nome').value = contato.dataset.nome || '';
        document.getElementById('editar-telefone').value = contato.dataset.telefone || '';
        document.getElementById('editar-email').value = contato.dataset.email || '';
        modalEditar.style.display = 'block';
    }

    function closeEditarModal() {
        modalEditar.style.display = 'none';
        contatoAtual = null;
    }

    // Função auxiliar para atualizar um contato específico
    function atualizarContato(contatoElement, nome, telefone, email) {
        // Atualizar dataset
        contatoElement.dataset.nome = nome;
        contatoElement.dataset.telefone = telefone;
        contatoElement.dataset.email = email;

        // Atualizar exibição
        const nomeElemento = contatoElement.querySelector('.nome-text');
        if (nomeElemento) {
            nomeElemento.textContent = nome;
        }
    }

    // Função para atualizar contatos frequentes
    function atualizarContatosFrequentes(nomeAntigo, telefoneAntigo, emailAntigo, novoNome, novoTelefone, novoEmail) {
        const contatosFrequentes = listaContatosFrequentes.querySelectorAll('.contato-nome');
        
        contatosFrequentes.forEach(contato => {
            if (contato.dataset.nome === nomeAntigo || 
                contato.dataset.telefone === telefoneAntigo || 
                contato.dataset.email === emailAntigo) {
                
                atualizarContato(contato, novoNome, novoTelefone, novoEmail);
            }
        });
    }

    // Funções auxiliares
    function isContatoExistente(nome, telefone, email, contatoIgnorar = null) {
        const contatos = listaContatos.querySelectorAll('.contato-nome');
        for (const contato of contatos) {
            if (contato === contatoIgnorar) continue;
            
            if (contato.dataset.nome === nome || 
                contato.dataset.telefone === telefone || 
                contato.dataset.email === email) {
                return true;
            }
        }

        const contatosFrequentes = listaContatosFrequentes.querySelectorAll('.contato-nome');
        for (const contato of contatosFrequentes) {
            if (contato === contatoIgnorar) continue;
            
            if (contato.dataset.nome === nome || 
                contato.dataset.telefone === telefone || 
                contato.dataset.email === email) {
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

    // FUNÇÃO ATUALIZADA COM CONFIRMAÇÃO
    function removerContato(nome, telefone, email) {
        const confirmacao = confirm(`Tem certeza que deseja remover "${nome}"?`);
        
        if (confirmacao) {
            const contatos = listaContatos.getElementsByClassName('contato-nome');
            for (let i = 0; i < contatos.length; i++) {
                if (contatos[i].dataset.nome === nome && contatos[i].dataset.telefone === telefone && contatos[i].dataset.email === email) {
                    contatos[i].style.transition = 'opacity 0.3s ease';
                    contatos[i].style.opacity = '0';
                    setTimeout(() => contatos[i].remove(), 300);
                }
            }

            const contatosFrequentes = listaContatosFrequentes.getElementsByClassName('contato-nome');
            for (let i = 0; i < contatosFrequentes.length; i++) {
                if (contatosFrequentes[i].dataset.nome === nome && contatosFrequentes[i].dataset.telefone === telefone && contatosFrequentes[i].dataset.email === email) {
                    contatosFrequentes[i].style.transition = 'opacity 0.3s ease';
                    contatosFrequentes[i].style.opacity = '0';
                    setTimeout(() => contatosFrequentes[i].remove(), 300);
                }
            }
        }
    }

    function adicionarEventosDeEdicao() {
        const botoesEditar = document.querySelectorAll('.btn-editar-contato');
        
        botoesEditar.forEach(botao => {
            botao.addEventListener('click', function(event) {
                event.stopPropagation();
                const contatoDiv = event.target.closest('.contato-nome');
                if (contatoDiv) {
                    openEditarModal(contatoDiv);
                } else {
                    console.error("Erro: não foi possível encontrar o elemento do contato!");
                }
            });
        });
    }

    // Função para alternar o estado de favorito
    function toggleFavorito(contatoDiv, btnFavoritar) {
        if (contatoDiv.classList.contains('favorito')) {
            contatoDiv.classList.remove('favorito');
            btnFavoritar.textContent = '⭐';
            listaContatos.appendChild(contatoDiv);
        } else {
            contatoDiv.classList.add('favorito');
            btnFavoritar.textContent = '🌟';
            listaContatos.insertBefore(contatoDiv, listaContatos.firstChild);
        }
    }

    // Event Listeners
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
        contatoDiv.classList.add('estilizado');
        contatoDiv.style.opacity = 0;
        setTimeout(() => {
            contatoDiv.style.transition = 'opacity 0.5s ease';
            contatoDiv.style.opacity = 1;
        }, 10);

        contatoDiv.innerHTML = `<span class="nome-text">${nome}</span>`;
        contatoDiv.dataset.nome = nome;
        contatoDiv.dataset.telefone = telefone;
        contatoDiv.dataset.email = email;

        // Botão de favoritar
        const btnFavoritar = document.createElement('button');
        btnFavoritar.classList.add('btn-favoritar');
        btnFavoritar.textContent = '⭐';
        contatoDiv.appendChild(btnFavoritar);

        btnFavoritar.addEventListener('click', function(event) {
            event.stopPropagation();
            toggleFavorito(contatoDiv, btnFavoritar);
        });

        const btnRemoverContato = document.createElement('button');
        btnRemoverContato.classList.add('btn-remover-contato');
        btnRemoverContato.textContent = '🗑️';
        contatoDiv.appendChild(btnRemoverContato);
        
        const btnEditarContato = document.createElement('button');
        btnEditarContato.classList.add('btn-editar-contato');
        btnEditarContato.textContent = '✏️';
        btnEditarContato.addEventListener('click', function(event) {
            event.stopPropagation();
            openEditarModal(contatoDiv);
        });
        contatoDiv.appendChild(btnEditarContato);

        contatoDiv.onclick = function() {
            openInfoModal(nome, telefone, email);
        };
        listaContatos.appendChild(contatoDiv);

        formularioContato.reset();
        closeModal();

        // EVENT LISTENER ATUALIZADO PARA REMOÇÃO
        btnRemoverContato.addEventListener('click', function(event) {
            event.stopPropagation();
            removerContato(nome, telefone, email);
        });
    });

    formularioEditar.addEventListener('submit', function(event) {
        event.preventDefault();

        if (!contatoAtual) {
            console.error("Erro: Nenhum contato selecionado para edição!");
            return;
        }

        // Obter novos valores
        const novoNome = document.getElementById('editar-nome').value;
        const novoTelefone = document.getElementById('editar-telefone').value;
        const novoEmail = document.getElementById('editar-email').value;

        // Verificar se já existe outro contato com os mesmos dados
        if (isContatoExistente(novoNome, novoTelefone, novoEmail, contatoAtual)) {
            openErroModal('Já existe um contato com esses dados atualizados.');
            return;
        }

        // Obter dados antigos para atualização
        const nomeAntigo = contatoAtual.dataset.nome;
        const telefoneAntigo = contatoAtual.dataset.telefone;
        const emailAntigo = contatoAtual.dataset.email;

        // Atualizar o contato principal
        atualizarContato(contatoAtual, novoNome, novoTelefone, novoEmail);

        // Atualizar contatos frequentes correspondentes
        atualizarContatosFrequentes(nomeAntigo, telefoneAntigo, emailAntigo, novoNome, novoTelefone, novoEmail);

        closeEditarModal();
    });

    // Event Listeners para fechar modais
    closeModalBtn.addEventListener('click', closeModal);
    closeErroBtn.addEventListener('click', function() {
        modalErro.style.display = 'none';
    });
    closeEditarBtn.addEventListener('click', closeEditarModal);

    // Event Listeners para navegação
    document.getElementById('btn-contatos').addEventListener('click', function() {
        contatosArea.style.display = 'block';
        contatosFrequentesArea.style.display = 'none';
    });

    document.getElementById('btn-contatos-frequentes').addEventListener('click', function() {
        contatosArea.style.display = 'none';
        contatosFrequentesArea.style.display = 'block';
    });

    btnAdicionarContato.addEventListener('click', openModal);

    // Fechar modais ao clicar fora
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

    // Inicialização
    adicionarEventosDeEdicao();
});