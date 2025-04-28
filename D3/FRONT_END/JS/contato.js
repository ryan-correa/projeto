document.addEventListener('DOMContentLoaded', function() {
    // [Seleção dos elementos do DOM - mantido igual]
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

    // [Funções de modal - mantidas iguais]
    function openModal() { modalContatos.style.display = 'block'; }
    function closeModal() { modalContatos.style.display = 'none'; }
    function openInfoModal(nome, telefone, email) {
        document.getElementById('info-nome').textContent = nome;
        document.getElementById('info-telefone').textContent = telefone;
        document.getElementById('info-email').textContent = email;
        document.getElementById('modal-info').style.display = 'block';
        addToFrequentes(nome, telefone, email);
    }
    function closeInfoModal() { document.getElementById('modal-info').style.display = 'none'; }
    function openErroModal(mensagem) {
        mensagemErro.textContent = mensagem;
        modalErro.style.display = 'block';
        setTimeout(() => modalErro.style.display = 'none', 2000);
    }
    function openEditarModal(contato) {
        if (!contato) return console.error("Erro: Contato não definido!");
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

    function atualizarContato(contatoElement, nome, telefone, email) {
        // Atualiza os dados do contato no dataset
        contatoElement.dataset.nome = nome;
        contatoElement.dataset.telefone = telefone;
        contatoElement.dataset.email = email;
    
        // Atualiza os textos visíveis
        const nomeElemento = contatoElement.querySelector('.nome-text');
        const telefoneElemento = contatoElement.querySelector('.telefone-text');
        const emailElemento = contatoElement.querySelector('.email-text');
    
        if (nomeElemento) nomeElemento.textContent = nome;
        if (telefoneElemento) telefoneElemento.textContent = telefone;
        if (emailElemento) emailElemento.textContent = email;
    
        // Atualiza o comportamento do clique para abrir com os dados atualizados
        contatoElement.onclick = () => {
            openInfoModal(nome, telefone, email);
        };
    }
    function atualizarContatosFrequentes(nomeAntigo, telefoneAntigo, emailAntigo, novoNome, novoTelefone, novoEmail) {
        const contatosFrequentes = listaContatosFrequentes.querySelectorAll('.contato-nome');
        contatosFrequentes.forEach(contato => {
            if (contato.dataset.nome === nomeAntigo || contato.dataset.telefone === telefoneAntigo || contato.dataset.email === emailAntigo) {
                atualizarContato(contato, novoNome, novoTelefone, novoEmail);
            }
        });
    }
    function isContatoExistente(nome, telefone, email, contatoIgnorar = null) {
        const contatos = listaContatos.querySelectorAll('.contato-nome');
        for (const contato of contatos) {
            if (contato === contatoIgnorar) continue;
            if (contato.dataset.nome === nome || contato.dataset.telefone === telefone || contato.dataset.email === email) return true;
        }
        const contatosFrequentes = listaContatosFrequentes.querySelectorAll('.contato-nome');
        for (const contato of contatosFrequentes) {
            if (contato === contatoIgnorar) continue;
            if (contato.dataset.nome === nome || contato.dataset.telefone === telefone || contato.dataset.email === email) return true;
        }
        return false;
    }
    function addToFrequentes(nome, telefone, email) {
        if (isContatoFrequente(nome, telefone, email)) return;
        const contatoFrequenteDiv = document.createElement('div');
        contatoFrequenteDiv.classList.add('contato-nome', 'estilizado');
        contatoFrequenteDiv.innerHTML = `<span class="nome-text">${nome}</span>`;
        contatoFrequenteDiv.dataset.nome = nome;
        contatoFrequenteDiv.dataset.telefone = telefone;
        contatoFrequenteDiv.dataset.email = email;
        contatoFrequenteDiv.onclick = () => openInfoModal(nome, telefone, email);
        listaContatosFrequentes.appendChild(contatoFrequenteDiv);
    }
    function isContatoFrequente(nome, telefone, email) {
        const contatosFrequentes = listaContatosFrequentes.getElementsByClassName('contato-nome');
        for (let contato of contatosFrequentes) {
            if (contato.dataset.nome === nome || contato.dataset.telefone === telefone || contato.dataset.email === email) return true;
        }
        return false;
    }

    function removerContato(nome, telefone, email) {
        Swal.fire({
            title: 'Confirmar remoção',
            text: `Você realmente deseja remover ${nome}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, remover!',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`/api/contatos/${nome}`, { method: 'DELETE' })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Remover contato do front-end
                        Array.from(listaContatos.getElementsByClassName('contato-nome')).forEach(contato => {
                            if (contato.dataset.nome === nome) contato.remove();
                        });
                        Swal.fire('Removido!', 'O contato foi removido.', 'success');
                    } else {
                        openErroModal(data.message || 'Erro ao remover contato.');
                    }
                })
                .catch(error => openErroModal('Erro ao conectar ao servidor.'));
            }
        });
    }

    // [Restante do código - mantido igual]
    function adicionarEventosDeEdicao() {
        document.querySelectorAll('.btn-editar-contato').forEach(botao => {
            botao.addEventListener('click', function(event) {
                event.stopPropagation();
                const contatoDiv = event.target.closest('.contato-nome');
                contatoDiv ? openEditarModal(contatoDiv) : console.error("Elemento do contato não encontrado!");
            });
        });
    }
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

    formularioContato.addEventListener('submit', function(event) {
        event.preventDefault();
        const nome = document.getElementById('nome').value;
        const telefone = document.getElementById('telefone').value;
        const email = document.getElementById('email').value;
    
        if (isContatoExistente(nome, telefone, email)) {
            openErroModal('Contato já existe com esse nome, telefone ou email.');
            return;
        }
    
        // Envia os dados para o servidor (back-end)
        fetch('/api/contatos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, telefone, email })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Sucesso na adição do contato, agora adiciona o contato no front-end
                const contatoDiv = document.createElement('div');
                contatoDiv.classList.add('contato-nome', 'estilizado');
                contatoDiv.innerHTML = `<span class="nome-text">${nome}</span>`;
                contatoDiv.dataset.nome = nome;
                contatoDiv.dataset.telefone = telefone;
                contatoDiv.dataset.email = email;
    
                listaContatos.appendChild(contatoDiv);
                formularioContato.reset();
                closeModal();
            } else {
                openErroModal(data.message || 'Erro ao adicionar contato.');
            }
        })
        .catch(error => openErroModal('Erro ao conectar ao servidor.'));

   // Div para agrupar os ícones
const iconesDiv = document.createElement('div');
iconesDiv.classList.add('icones-contato');

// Botão de favoritar
const btnFavoritar = document.createElement('button');
btnFavoritar.classList.add('btn-favoritar');
btnFavoritar.textContent = '⭐';
btnFavoritar.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleFavorito(contatoDiv, btnFavoritar);
});
iconesDiv.appendChild(btnFavoritar);

// Botão de remover (com SweetAlert2)
const btnRemover = document.createElement('button');
btnRemover.classList.add('btn-remover-contato');
btnRemover.textContent = '🗑️';
btnRemover.addEventListener('click', (e) => {
    e.stopPropagation();
    removerContato(nome, telefone, email);
});
iconesDiv.appendChild(btnRemover);

// Botão de editar
const btnEditar = document.createElement('button');
btnEditar.classList.add('btn-editar-contato');
btnEditar.textContent = '✏️';
btnEditar.addEventListener('click', (e) => {
    e.stopPropagation();
    openEditarModal(contatoDiv);
});
iconesDiv.appendChild(btnEditar);

// Adiciona o grupo de ícones à div do contato
contatoDiv.appendChild(iconesDiv);

        contatoDiv.onclick = () => openInfoModal(nome, telefone, email);
        listaContatos.appendChild(contatoDiv);
        formularioContato.reset();
        closeModal();
    });

    formularioEditar.addEventListener('submit', function(event) {
        event.preventDefault();
        if (!contatoAtual) return console.error("Nenhum contato selecionado para edição!");
    
        const novoNome = document.getElementById('editar-nome').value;
        const novoTelefone = document.getElementById('editar-telefone').value;
        const novoEmail = document.getElementById('editar-email').value;
    
        fetch(`/api/contatos/${contatoAtual.dataset.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome: novoNome, telefone: novoTelefone, email: novoEmail })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                atualizarContato(contatoAtual, novoNome, novoTelefone, novoEmail);
                closeEditarModal();
            } else {
                openErroModal(data.message || 'Erro ao editar contato.');
            }
        })
        .catch(error => openErroModal('Erro ao conectar ao servidor.'));
    });

    // [Outros listeners - mantidos iguais]
    closeModalBtn.addEventListener('click', closeModal);
    closeErroBtn.addEventListener('click', () => modalErro.style.display = 'none');
    closeEditarBtn.addEventListener('click', closeEditarModal);
    document.getElementById('btn-contatos').addEventListener('click', () => {
        contatosArea.style.display = 'block';
        contatosFrequentesArea.style.display = 'none';
    });
    document.getElementById('btn-contatos-frequentes').addEventListener('click', () => {
        contatosArea.style.display = 'none';
        contatosFrequentesArea.style.display = 'block';
    });
    btnAdicionarContato.addEventListener('click', openModal);
    window.onclick = function(event) {
        if (event.target == modalContatos) closeModal();
        if (event.target == document.getElementById('modal-info')) closeInfoModal();
        if (event.target == modalErro) modalErro.style.display = 'none';
        if (event.target == modalEditar) closeEditarModal();
    }

    // Inicialização
    adicionarEventosDeEdicao();
});