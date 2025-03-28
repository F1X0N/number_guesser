function gerarCandidatos() {
    const candidatos = [];
    for (let i = 0; i < 10000; i++) {
      let numStr = i.toString().padStart(4, '0');
      candidatos.push(numStr);
    }
    return candidatos;
  }

  function contarAcertos(num1, num2) {
    let acertos = 0;
    for (let i = 0; i < 4; i++) {
      if (num1[i] === num2[i]) acertos++;
    }
    return acertos;
  }

  let candidatos = gerarCandidatos();
  const palpites = [];

  const guessForm = document.getElementById('guessForm');
  const guessInput = document.getElementById('guessInput');
  const feedbackInput = document.getElementById('feedbackInput');
  const historyTableBody = document.querySelector('#historyTable tbody');
  const suggestionText = document.getElementById('suggestionText');
  const candidateCountText = document.getElementById('candidateCount');
  const resetBtn = document.getElementById('resetBtn');
  const choosedNumberForm = document.querySelector('.choosedNumberForm');
  const generatedNumberInput = document.getElementById('generatedNumber');

  function atualizarHistorico() {
    historyTableBody.innerHTML = '';
    palpites.forEach(item => {
      const row = document.createElement('tr');
      const palpiteCell = document.createElement('td');
      const acertosCell = document.createElement('td');
      palpiteCell.textContent = item.palpite;
      acertosCell.textContent = item.acertos;
      row.appendChild(palpiteCell);
      row.appendChild(acertosCell);
      historyTableBody.appendChild(row);
    });
  }

  function atualizarSugestao() {
    candidateCountText.textContent = `Candidatos restantes: ${candidatos.length}`;
    if (candidatos.length > 0) {
      suggestionText.textContent = `Sugestão: ${candidatos[0]}`;
      guessInput.value = candidatos[0]
    } else {
      suggestionText.textContent = "Nenhum candidato restante. Verifique seus palpites.";
    }
  }

  function filtrarCandidatos() {
    candidatos = gerarCandidatos().filter(candidate => {
      return palpites.every(item => contarAcertos(candidate, item.palpite) === item.acertos);
    });
  }

  function gerarNumeroAleatorio() {
    const numero = Math.floor(Math.random() * 9000) + 1000;
    generatedNumberInput.value = numero;
  }

  guessForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const palpite = guessInput.value.trim();
    const acertos = parseInt(feedbackInput.value);

    if (!/^\d{4}$/.test(palpite) || isNaN(acertos) || acertos < 0 || acertos > 4) {
      alert("Insira um palpite válido (4 dígitos) e um número de acertos entre 0 e 4.");
      return;
    }

    palpites.push({ palpite, acertos });

    filtrarCandidatos();

    atualizarHistorico();
    atualizarSugestao();

    feedbackInput.value = '';
    guessInput.focus();
  });

  choosedNumberForm.addEventListener('submit', function(event) {
    event.preventDefault();
    gerarNumeroAleatorio();
  });

  resetBtn.addEventListener('click', function() {
    if (confirm("Deseja iniciar uma nova partida? Todos os palpites serão apagados.")) {
      palpites.length = 0;
      candidatos = gerarCandidatos();
      atualizarHistorico();
      atualizarSugestao();
    }
  });

  atualizarHistorico();
  atualizarSugestao();