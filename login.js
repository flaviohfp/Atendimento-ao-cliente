// pegar elementos
var form = document.getElementById('loginForm');
var campoEmail = document.getElementById('email');
var campoSenha = document.getElementById('senha');
var btnToggle = document.getElementById('toggleSenha');
var alertas = document.getElementById('alertContainer');

// mostrar/esconder senha
btnToggle.onclick = function() {
  if (campoSenha.type === 'password') {
    campoSenha.type = 'text';
    btnToggle.className = 'bi bi-eye-slash password-toggle';
  } else {
    campoSenha.type = 'password';
    btnToggle.className = 'bi bi-eye password-toggle';
  }
};

// mostrar alerta
function mostrarAlerta(msg, tipo) {
  var cor = tipo === 'erro' ? 'danger' : 'success';
  alertas.innerHTML = '<div class="alert alert-' + cor + ' alert-dismissible fade show" role="alert">' + msg + '<button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>';
}

// fazer login
form.onsubmit = function(e) {
  e.preventDefault();
  
  var email = campoEmail.value.trim();
  var senha = campoSenha.value;
  
  // validar campos vazios
  if (!email || !senha) {
    mostrarAlerta('Preencha todos os campos', 'erro');
    return;
  }
  
  // verificar tipo de usuario
  if (email === 'usuario@atendente.com' && senha === '123') {
    sessionStorage.setItem('usuario', 'atendente');
    mostrarAlerta('Login realizado!', 'sucesso');
    setTimeout(function() {
      window.location.href = 'historico.html';
    }, 1000);
  } else if (email === 'usuario@gestor.com' && senha === '123') {
    sessionStorage.setItem('usuario', 'gestor');
    mostrarAlerta('Login realizado!', 'sucesso');
    setTimeout(function() {
      window.location.href = 'index.html';
    }, 1000);
  } else {
    mostrarAlerta('E-mail ou senha incorretos', 'erro');
  }
};