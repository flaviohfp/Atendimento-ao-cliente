// pegar elementos
var btnEnviar = document.getElementById('sendButton');
var inputMsg = document.getElementById('messageInput');
var areaMsg = document.querySelector('.chat-messages');
var plataformas = document.querySelectorAll('.platform-link');
var gruposConversa = document.querySelectorAll('.conversation-group');
var itensConversa = document.querySelectorAll('.conversation-item');
var cabecalhoChat = document.querySelector('.chat-header');
var campoBusca = document.querySelector('input[type="search"]');

// verificar se esta logado
var usuarioLogado = sessionStorage.getItem('usuario');
if (!usuarioLogado) {
  window.location.href = 'login.html';
}

// trocar de plataforma
for (var i = 0; i < plataformas.length; i++) {
  plataformas[i].onclick = function(e) {
    e.preventDefault();
    var plat = this.getAttribute('data-platform');
    
    // remove active de todos
    for (var j = 0; j < plataformas.length; j++) {
      plataformas[j].classList.remove('active');
    }
    this.classList.add('active');
    
    // esconde todos os grupos
    for (var j = 0; j < gruposConversa.length; j++) {
      gruposConversa[j].classList.add('d-none');
    }
    
    // mostra o grupo selecionado
    var grupoSelecionado = document.querySelector('.conversation-group[data-platform="' + plat + '"]');
    if (grupoSelecionado) {
      grupoSelecionado.classList.remove('d-none');
      var primeiraConversa = grupoSelecionado.querySelector('.conversation-item');
      if (primeiraConversa) {
        primeiraConversa.click();
      }
    }
  };
}

// clicar numa conversa
for (var i = 0; i < itensConversa.length; i++) {
  itensConversa[i].onclick = function() {
    // remove active de todos
    for (var j = 0; j < itensConversa.length; j++) {
      itensConversa[j].classList.remove('active');
    }
    this.classList.add('active');
    
    // remove badge
    var badge = this.querySelector('.badge');
    if (badge) badge.remove();
    
    // carrega o chat
    var id = this.getAttribute('data-chat-id');
    mostrarChat(id);
  };
}

// dados dos chats
var chats = {
  1: {
    nome: 'João Silva',
    plataforma: 'WhatsApp',
    status: 'Online',
    foto: 'https://ui-avatars.com/api/?name=João+Silva&background=25D366&color=fff',
    msgs: [
      { tipo: 'received', txt: 'Olá! Boa tarde!', hora: '10:25' },
      { tipo: 'received', txt: 'Gostaria de saber mais sobre os produtos disponíveis.', hora: '10:26' },
      { tipo: 'received', txt: 'Vocês fazem entrega?', hora: '10:26' },
      { tipo: 'sent', txt: 'Olá João! Claro, temos vários produtos disponíveis.', hora: '10:28' },
      { tipo: 'sent', txt: 'Sim, fazemos entrega em toda a cidade! 🚚', hora: '10:28' },
      { tipo: 'received', txt: 'Perfeito! Qual o prazo de entrega?', hora: '10:30' },
      { tipo: 'sent', txt: 'O prazo é de 2 a 3 dias úteis para a sua região 📦', hora: '10:31' },
      { tipo: 'received', txt: 'Ótimo! Vou fazer o pedido então 😊', hora: '10:32' }
    ]
  },
  5: {
    nome: 'Carlos Mendes',
    plataforma: 'WhatsApp',
    status: 'Digitando...',
    foto: 'https://ui-avatars.com/api/?name=Carlos+Mendes&background=25D366&color=fff',
    msgs: [
      { tipo: 'received', txt: 'Tem disponível em outras cores?', hora: 'Seg 14:20' },
      { tipo: 'sent', txt: 'Sim! Temos nas cores azul, vermelho e preto', hora: 'Seg 14:25' }
    ]
  },
  6: {
    nome: 'Julia Costa',
    plataforma: 'Instagram',
    status: 'Online',
    foto: 'https://ui-avatars.com/api/?name=Julia+Costa&background=E4405F&color=fff',
    msgs: [
      { tipo: 'received', txt: 'Adorei o produto! 😍', hora: '11:20' },
      { tipo: 'sent', txt: 'Que bom que gostou! Quer fazer o pedido?', hora: '11:25' }
    ]
  },
  7: {
    nome: 'Rafael Alves',
    plataforma: 'Instagram',
    status: 'Ativo há 5min',
    foto: 'https://ui-avatars.com/api/?name=Rafael+Alves&background=E4405F&color=fff',
    msgs: [
      { tipo: 'received', txt: 'Vi seu post, como faço pedido?', hora: '10:45' },
      { tipo: 'sent', txt: 'Olá! Você pode fazer pelo direct ou WhatsApp', hora: '10:50' }
    ]
  },
  8: {
    nome: 'Lucia Ferreira',
    plataforma: 'Facebook',
    status: 'Online',
    foto: 'https://ui-avatars.com/api/?name=Lucia+Ferreira&background=1877F2&color=fff',
    msgs: [
      { tipo: 'received', txt: 'Preciso de mais informações', hora: '12:00' },
      { tipo: 'sent', txt: 'Claro! O que gostaria de saber?', hora: '12:05' }
    ]
  },
  9: {
    nome: 'Bruno Souza',
    plataforma: 'Telegram',
    status: 'Online',
    foto: 'https://ui-avatars.com/api/?name=Bruno+Souza&background=0088cc&color=fff',
    msgs: [
      { tipo: 'received', txt: 'Olá, tudo bem?', hora: '13:15' },
      { tipo: 'sent', txt: 'Tudo ótimo! E você?', hora: '13:20' }
    ]
  }
};

// mostrar chat
function mostrarChat(id) {
  var chat = chats[id];
  if (!chat) return;
  
  var icone = 'whatsapp';
  var cor = 'success';
  
  if (chat.plataforma === 'Instagram') {
    icone = 'instagram';
    cor = 'danger';
  } else if (chat.plataforma === 'Facebook') {
    icone = 'facebook';
    cor = 'primary';
  } else if (chat.plataforma === 'Telegram') {
    icone = 'telegram';
    cor = 'info';
  }
  
  var corStatus = chat.status.includes('Online') || chat.status.includes('Digitando') ? 'success' : 'secondary';
  
  cabecalhoChat.innerHTML = '<div class="d-flex align-items-center justify-content-between"><div class="d-flex align-items-center"><img src="' + chat.foto + '" class="rounded-circle me-3" width="50" height="50"><div><h5 class="mb-0">' + chat.nome + '</h5><small class="text-muted"><i class="bi bi-' + icone + ' text-' + cor + '"></i> ' + chat.plataforma + ' • <span class="text-' + corStatus + '">' + chat.status + '</span></small></div></div><div><button class="btn btn-sm btn-outline-secondary me-2" title="Chamada de voz"><i class="bi bi-telephone"></i></button><button class="btn btn-sm btn-outline-secondary me-2" title="Chamada de vídeo"><i class="bi bi-camera-video"></i></button><button class="btn btn-sm btn-outline-secondary" title="Mais opções"><i class="bi bi-three-dots-vertical"></i></button></div></div>';
  
  areaMsg.innerHTML = '<div class="message-date text-center mb-3"><span class="badge bg-light text-dark">Hoje</span></div>';
  
  for (var i = 0; i < chat.msgs.length; i++) {
    adicionarMsg(chat.msgs[i].txt, chat.msgs[i].tipo, chat.msgs[i].hora, chat.foto);
  }
  
  areaMsg.scrollTop = areaMsg.scrollHeight;
}

// adicionar mensagem
function adicionarMsg(texto, tipo, hora, foto) {
  var div = document.createElement('div');
  div.className = 'message ' + tipo;
  
  if (tipo === 'received') {
    div.innerHTML = '<img src="' + foto + '" class="rounded-circle me-2" width="35" height="35"><div class="message-bubble"><p class="mb-1">' + texto + '</p><small class="text-muted">' + hora + '</small></div>';
  } else {
    div.innerHTML = '<div class="message-bubble"><p class="mb-1">' + texto + '</p><small class="text-muted">' + hora + ' <i class="bi bi-check-all text-primary"></i></small></div>';
  }
  
  areaMsg.appendChild(div);
  areaMsg.scrollTop = areaMsg.scrollHeight;
}

// enviar mensagem
btnEnviar.onclick = function() {
  var texto = inputMsg.value.trim();
  if (texto) {
    var agora = new Date();
    var h = agora.getHours();
    var m = agora.getMinutes();
    if (h < 10) h = '0' + h;
    if (m < 10) m = '0' + m;
    var hora = h + ':' + m;
    
    adicionarMsg(texto, 'sent', hora);
    inputMsg.value = '';
  }
};

// enviar com enter
inputMsg.onkeypress = function(e) {
  if (e.key === 'Enter') {
    btnEnviar.click();
  }
};

// buscar conversa
campoBusca.oninput = function() {
  var termo = this.value.toLowerCase();
  
  for (var i = 0; i < itensConversa.length; i++) {
    var nome = itensConversa[i].querySelector('h6').textContent.toLowerCase();
    var msg = itensConversa[i].querySelector('p').textContent.toLowerCase();
    
    if (nome.includes(termo) || msg.includes(termo)) {
      itensConversa[i].style.display = 'flex';
    } else {
      itensConversa[i].style.display = 'none';
    }
  }
};

// iniciar
mostrarChat('1');