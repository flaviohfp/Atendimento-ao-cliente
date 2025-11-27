// verificar se esta logado
var usuarioLogado = sessionStorage.getItem('usuario');
if (!usuarioLogado) {
  window.location.href = 'login.html';
}

// dados de atendentes (apenas para gestor)
var atendentes = [
  { id: 1, nome: 'Maria Santos', total: 15 },
  { id: 2, nome: 'Carlos Mendes', total: 12 },
  { id: 3, nome: 'Ana Lima', total: 8 }
];

// dados das mensagens
var todasMsgs = {
  1: [ // Maria Santos
    {
      plat: 'whatsapp',
      cliente: 'João Silva',
      msg: 'Olá! Gostaria de saber mais sobre os produtos.',
      resp: 'Olá João! Claro, temos diversos produtos disponíveis.',
      data: '2024-11-26 09:30',
      atendente: 'Maria Santos',
      status: 'resolved'
    },
    {
      plat: 'whatsapp',
      cliente: 'Pedro Almeida',
      msg: 'Preciso de ajuda com meu pedido #1234.',
      resp: 'Oi Pedro! Vou verificar agora.',
      data: '2024-11-26 11:00',
      atendente: 'Maria Santos',
      status: 'pending'
    }
  ],
  2: [ // Carlos Mendes
    {
      plat: 'instagram',
      cliente: '@ana_costa',
      msg: 'Qual o prazo de entrega para São Paulo?',
      resp: 'Olá Ana! O prazo é de 5 a 7 dias úteis.',
      data: '2024-11-26 10:15',
      atendente: 'Carlos Mendes',
      status: 'resolved'
    },
    {
      plat: 'facebook',
      cliente: 'Roberto Souza',
      msg: 'Não recebi confirmação do pedido.',
      resp: 'Vou verificar para você.',
      data: '2024-11-25 18:20',
      atendente: 'Carlos Mendes',
      status: 'pending'
    }
  ],
  3: [ // Ana Lima
    {
      plat: 'whatsapp',
      cliente: 'Fernanda Costa',
      msg: 'Bom dia! Queria fazer um pedido.',
      resp: 'Bom dia! Claro, como posso ajudar?',
      data: '2024-11-26 08:15',
      atendente: 'Ana Lima',
      status: 'resolved'
    }
  ]
};

var msgsAtual = [];
var atendenteAtualId = 1;

// configurar interface baseado no tipo de usuario
function configurarInterface() {
  var cabecalho = document.querySelector('.chat-header');
  
  if (usuarioLogado === 'gestor') {
    // gestor pode ver historico de todos
    var menuAtendentes = '<div class="mb-3"><label class="form-label">Atendente:</label><select class="form-select" id="selectAtendente">';
    for (var i = 0; i < atendentes.length; i++) {
      menuAtendentes += '<option value="' + atendentes[i].id + '">' + atendentes[i].nome + ' (' + atendentes[i].total + ' conversas)</option>';
    }
    menuAtendentes += '</select></div>';
    
    var divStats = cabecalho.querySelector('.row.g-3.mb-3');
    divStats.insertAdjacentHTML('beforebegin', menuAtendentes);
    
    // evento de trocar atendente
    document.getElementById('selectAtendente').onchange = function() {
      atendenteAtualId = parseInt(this.value);
      carregarMensagens();
    };
    
    // adicionar botao de editar
    var containerMsgs = document.getElementById('messagesList');
    containerMsgs.addEventListener('click', function(e) {
      if (e.target.classList.contains('btn-editar')) {
        var index = e.target.getAttribute('data-index');
        editarMensagem(index);
      }
    });
  } else {
    // atendente so ve proprio historico
    atendenteAtualId = 1; // sempre Maria Santos para simplificar
  }
}

// carregar mensagens
function carregarMensagens() {
  msgsAtual = todasMsgs[atendenteAtualId] || [];
  atualizarStats();
  mostrar();
}

// atualizar estatisticas
function atualizarStats() {
  var whats = 0;
  var insta = 0;
  var resol = 0;
  var pend = 0;
  
  for (var i = 0; i < msgsAtual.length; i++) {
    if (msgsAtual[i].plat === 'whatsapp') whats++;
    if (msgsAtual[i].plat === 'instagram') insta++;
    if (msgsAtual[i].status === 'resolved') resol++;
    if (msgsAtual[i].status === 'pending') pend++;
  }
  
  document.getElementById('whatsappCount').textContent = whats;
  document.getElementById('instagramCount').textContent = insta;
  document.getElementById('resolvedCount').textContent = resol;
  document.getElementById('pendingCount').textContent = pend;
  
  document.getElementById('whatsappBadge').textContent = whats;
  document.getElementById('instagramBadge').textContent = insta;
  document.getElementById('facebookBadge').textContent = msgsAtual.length - whats - insta;
}

// mostrar mensagens
function mostrar() {
  var container = document.getElementById('messagesList');
  
  if (msgsAtual.length === 0) {
    container.innerHTML = '<div class="no-messages"><i class="bi bi-inbox"></i><h5>Nenhuma mensagem encontrada</h5></div>';
    return;
  }
  
  var html = '';
  
  for (var i = 0; i < msgsAtual.length; i++) {
    var m = msgsAtual[i];
    var icone = 'bi-whatsapp';
    if (m.plat === 'instagram') icone = 'bi-instagram';
    if (m.plat === 'facebook') icone = 'bi-facebook';
    
    var statusTexto = m.status === 'resolved' ? 'Resolvido' : 'Pendente';
    var statusClass = m.status === 'resolved' ? 'status-resolved' : 'status-pending';
    
    html += '<div class="message-card ' + m.plat + '">';
    html += '<div class="d-flex justify-content-between mb-3">';
    html += '<div class="d-flex align-items-center gap-3">';
    html += '<span class="platform-badge ' + m.plat + '"><i class="bi ' + icone + '"></i> ' + m.plat.charAt(0).toUpperCase() + m.plat.slice(1) + '</span>';
    html += '<h5 class="customer-name mb-0">' + m.cliente + '</h5>';
    html += '</div>';
    html += '<span class="badge ' + statusClass + '">' + statusTexto + '</span>';
    html += '</div>';
    html += '<div class="message-content">';
    html += '<div class="message-text"><strong>Mensagem:</strong><p>' + m.msg + '</p></div>';
    html += '<div class="message-text"><strong>Resposta:</strong><p>' + m.resp + '</p></div>';
    html += '</div>';
    html += '<div class="message-footer">';
    html += '<span class="footer-item"><i class="bi bi-person-circle"></i> ' + m.atendente + '</span>';
    html += '<span class="footer-item"><i class="bi bi-clock"></i> ' + m.data + '</span>';
    
    // botao de editar apenas para gestor
    if (usuarioLogado === 'gestor') {
      html += '<button class="btn btn-sm btn-outline-primary btn-editar" data-index="' + i + '"><i class="bi bi-pencil"></i> Editar</button>';
    }
    
    html += '</div>';
    html += '</div>';
  }
  
  container.innerHTML = html;
}

// editar mensagem (apenas gestor)
function editarMensagem(index) {
  var m = msgsAtual[index];
  var novaResp = prompt('Editar resposta:', m.resp);
  
  if (novaResp && novaResp.trim()) {
    msgsAtual[index].resp = novaResp.trim();
    mostrar();
    alert('Resposta atualizada com sucesso!');
  }
}

// buscar
document.getElementById('searchInput').oninput = function() {
  var termo = this.value.toLowerCase();
  var cards = document.querySelectorAll('.message-card');
  
  for (var i = 0; i < cards.length; i++) {
    var texto = cards[i].textContent.toLowerCase();
    if (texto.includes(termo)) {
      cards[i].style.display = 'block';
    } else {
      cards[i].style.display = 'none';
    }
  }
};

// iniciar
configurarInterface();
carregarMensagens();