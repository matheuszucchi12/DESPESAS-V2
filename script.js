let despesas = JSON.parse(localStorage.getItem("despesas")) || [];
let chart;

/* LISTA DE DESCRIÇÕES POR CATEGORIA */
const opcoesPorCategoria = {
    "🏠 Moradia": [
        "Aluguel / Financiamento", "Condomínio", "IPTU", "Energia elétrica", "Água",
        "Gás de cozinha / Gás encanado", "Internet", "Telefone fixo", "Seguro residencial"
    ],
    "🛒 Alimentação": [
        "Supermercado","Feira / Hortifruti","Açougue","Padaria","Produtos de limpeza",
        "Restaurante","Lanches / Fast food","Delivery"
    ],
    "🚗 Transporte": [
        "Combustível","Estacionamento","Pedágio","Transporte público",
        "Aplicativos (Uber/99)","Manutenção do carro","Seguro do carro","IPVA","Licenciamento"
    ],
    "❤️ Saúde": [
        "Plano de saúde","Farmácia","Consultas médicas","Exames","Academia",
        "Terapia / Psicólogo","Odontologia"
    ],
    "🎓 Educação": [
        "Mensalidade escolar","Cursos online","Material escolar","Livros","Assinaturas educacionais"
    ],
    "💼 Trabalho / Profissão": [
        "Ferramentas","Assinaturas profissionais","Equipamentos","Material de escritório"
    ],
    "📺 Assinaturas e serviços": [
        "Streaming","Música","Armazenamento na nuvem","Softwares"
    ],
    "👗 Vestuário e cuidados pessoais": [
        "Roupas","Calçados","Acessórios","Higiene pessoal","Cabeleireiro","Estética"
    ],
    "🐶 Pets": [
        "Ração","Pet shop","Veterinário","Remédios","Brinquedos / acessórios"
    ],
    "🎉 Lazer e vida social": [
        "Passeios","Viagens","Cinema","Bares / eventos","Hobbies"
    ],
    "💳 Finanças pessoais": [
        "Investimentos","Reserva de emergência","Doações","Empréstimos","Cartão de crédito"
    ],
    "🧩 Outros gastos": [
        "Presentes","Documentações","Imprevistos","Multas","Assinaturas pequenas"
    ]
};

/* CARREGAR DESCRIÇÕES AO TROCAR A CATEGORIA */
document.getElementById("categoria").addEventListener("change", function () {
    const categoria = this.value;
    const descricaoSelect = document.getElementById("descricao");

    descricaoSelect.innerHTML = `<option value="">Selecione a descrição</option>`;

    if (opcoesPorCategoria[categoria]) {
        opcoesPorCategoria[categoria].forEach(desc => {
            const option = document.createElement("option");
            option.value = desc;
            option.textContent = desc;
            descricaoSelect.appendChild(option);
        });
    }
});

/* ADICIONAR DESPESA */
function adicionarDespesa() {
    const categoria = document.getElementById("categoria").value;
    const descricao = document.getElementById("descricao").value;
    const valor = parseFloat(document.getElementById("valor").value);
    const data = document.getElementById("data").value;

    if (!categoria || !descricao || !valor || !data) {
        alert("Preencha todos os campos!");
        return;
    }

    despesas.push({ categoria, descricao, valor, data });
    localStorage.setItem("despesas", JSON.stringify(despesas));

    atualizarTela();
}

/* ATUALIZAÇÃO COMPLETA DA TELA */
function atualizarTela() {
    atualizarTabela();
    atualizarResumo();
    atualizarGrafico();
}

/* TABELA */
function atualizarTabela() {
    const tbody = document.getElementById("listaDespesas");
    tbody.innerHTML = "";

    despesas.forEach((d, i) => {
        tbody.innerHTML += `
            <tr>
                <td>${d.descricao}</td>
                <td>R$ ${d.valor.toFixed(2)}</td>
                <td>${d.data}</td>
                <td>${d.categoria}</td>
                <td><button class="excluir" onclick="excluir(${i})">Excluir</button></td>
            </tr>
        `;
    });
}

function excluir(i) {
    despesas.splice(i, 1);
    localStorage.setItem("despesas", JSON.stringify(despesas));
    atualizarTela();
}

/* RESUMO */
function atualizarResumo() {
    const total = despesas.reduce((acc, d) => acc + d.valor, 0);
    const maior = despesas.length ? Math.max(...despesas.map(d => d.valor)) : 0;

    document.getElementById("totalGasto").textContent = `R$ ${total.toFixed(2)}`;
    document.getElementById("maiorDespesa").textContent = `R$ ${maior.toFixed(2)}`;
    document.getElementById("qtdDespesas").textContent = despesas.length;
}

/* GRÁFICO */
function atualizarGrafico() {
    const ctx = document.getElementById("graficoDespesas");

    const gastosPorCategoria = {};
    despesas.forEach(d => {
        gastosPorCategoria[d.categoria] =
            (gastosPorCategoria[d.categoria] || 0) + d.valor;
    });

    const labels = Object.keys(gastosPorCategoria);
    const valores = Object.values(gastosPorCategoria);

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: "pie",
        data: {
            labels,
            datasets: [{
                data: valores,
                borderWidth: 1
            }]
        }
    });
}

/* FILTROS */
function aplicarFiltros() {
    const categoria = document.getElementById("filtroCategoria").value;
    const mes = document.getElementById("filtroMes").value;

    let filtradas = despesas;

    if (categoria)
        filtradas = filtradas.filter(d => d.categoria === categoria);

    if (mes)
        filtradas = filtradas.filter(d => d.data.startsWith(mes));

    despesas = filtradas;
    atualizarTela();
}

/* CARREGAR INICIAL */
atualizarTela();
