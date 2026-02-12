// Supermercados padrão
let supermercados = [
  "Mercadão do Zé da Esquina",
  "Super Baratex",
  "Quitanda Dona Gertrudes"
];

// Carregar supermercados do localStorage (se existir)
if (localStorage.getItem("supermercados")) {
  supermercados = JSON.parse(localStorage.getItem("supermercados"));
}

// Renderizar lista de supermercados
function renderizarSupermercados() {
  const lista = document.getElementById("lista-supermercados");
  lista.innerHTML = "";

  supermercados.forEach((nome, index) => {
    const div = document.createElement("div");
    div.className = "supermercado";

    const nomeEl = document.createElement("span");
    nomeEl.innerText = nome;
    nomeEl.style.flex = "1";
    nomeEl.style.cursor = "pointer";
    nomeEl.onclick = () => selecionarSupermercado(nome);

    // Botões de ação
    const botoes = document.createElement("div");
    botoes.className = "acoes";

    const btnEditar = document.createElement("button");
    btnEditar.innerText = "✏️";
    btnEditar.title = "Editar supermercado";
    btnEditar.onclick = (e) => {
      e.stopPropagation(); // impede de abrir a lista ao clicar no botão
      editarSupermercado(index);
    };

    const btnExcluir = document.createElement("button");
    btnExcluir.innerText = "🗑️";
    btnExcluir.title = "Excluir supermercado";
    btnExcluir.onclick = (e) => {
      e.stopPropagation();
      excluirSupermercado(index);
    };

    botoes.appendChild(btnEditar);
    botoes.appendChild(btnExcluir);

    div.appendChild(nomeEl);
    div.appendChild(botoes);

    lista.appendChild(div);
  });
}

// Adicionar novo supermercado
function adicionarSupermercado() {
  const input = document.getElementById("novoSupermercado");
  const nome = input.value.trim();

  if (nome !== "") {
    supermercados.push(nome);

    // Atualiza localStorage
    localStorage.setItem("supermercados", JSON.stringify(supermercados));

    renderizarSupermercados();
    input.value = "";
  }
}

// Selecionar supermercado
function selecionarSupermercado(nome) {
  localStorage.setItem("supermercadoSelecionado", nome);
  window.location.href = "lista.html";
}

// Editar supermercado
function editarSupermercado(index) {
  const novoNome = prompt("Edite o nome do supermercado:", supermercados[index]);
  if (novoNome && novoNome.trim() !== "") {
    // Atualiza o nome
    const listas = JSON.parse(localStorage.getItem("listasDeCompras")) || {};

    // Renomear a chave da lista no localStorage
    if (listas[supermercados[index]]) {
      listas[novoNome] = listas[supermercados[index]];
      delete listas[supermercados[index]];
      localStorage.setItem("listasDeCompras", JSON.stringify(listas));
    }

    supermercados[index] = novoNome.trim();
    localStorage.setItem("supermercados", JSON.stringify(supermercados));
    renderizarSupermercados();
  }
}

// Excluir supermercado
function excluirSupermercado(index) {
  if (confirm("Tem certeza que deseja apagar esse item?")) {
    const nome = supermercados[index];

    // Remove da lista principal
    supermercados.splice(index, 1);
    localStorage.setItem("supermercados", JSON.stringify(supermercados));

    // Também remove a lista de compras vinculada
    let listas = JSON.parse(localStorage.getItem("listasDeCompras")) || {};
    if (listas[nome]) {
      delete listas[nome];
      localStorage.setItem("listasDeCompras", JSON.stringify(listas));
    }

    renderizarSupermercados();
  }
}

// Inicializar lista
renderizarSupermercados();
