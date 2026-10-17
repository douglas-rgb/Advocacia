
/* =========================================================
   SITE DE ADVOCACIA
   JavaScript — Contato e personalização
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const config =
    typeof configEscritorio !== "undefined"
      ? configEscritorio
      : {};

  /* =====================================================
     CABEÇALHO E RODAPÉ
  ===================================================== */

  const elementosTexto = {
    "nome-escritorio": config.nome || "Nome do Escritório",
    "titulo-profissional": config.tituloProfissional || "Advogado",
    "footer-nome-advogado": config.advogado || "Nome do Advogado",
    "footer-titulo-profissional": config.tituloProfissional || "Advogado",
    "footer-nome-escritorio": config.nome || "Nome do Escritório",
    "footer-ano": new Date().getFullYear()
  };

  Object.entries(elementosTexto).forEach(([id, texto]) => {
    const elemento = document.getElementById(id);

    if (elemento) {
      elemento.textContent = texto;
    }
  });

  // Atualiza o texto alternativo do logo do rodapé.
  const logoRodape = document.querySelector(".footer-logo img");

  if (logoRodape) {
    logoRodape.alt = "Logo de " + (config.nome || "escritório de advocacia");
  }

  /* =====================================================
     DADOS DE CONTATO
  ===================================================== */

  document.querySelectorAll('[data-config="telefone"]').forEach((el) => {
    const telefone = config.telefone || "";

    el.textContent = telefone;
    el.href = "tel:" + telefone.replace(/\D/g, "");
  });

  document.querySelectorAll('[data-config="email"]').forEach((el) => {
    const email = config.email || "";

    el.textContent = email;
    el.href = "mailto:" + email;
  });

  document.querySelectorAll('[data-config="horario"]').forEach((el) => {
    el.textContent = config.horario || "";
  });

  // Número exibido no rodapé.
  const textoWhatsAppRodape = document.getElementById("footer-whatsapp-text");

  if (textoWhatsAppRodape) {
    textoWhatsAppRodape.textContent = config.telefone || "";
  }

  /* =====================================================
     WHATSAPP
  ===================================================== */

  const numeroWhatsApp = (config.whatsapp || "").replace(/\D/g, "");

  function abrirWhatsApp(mensagem) {
    if (!numeroWhatsApp) {
      alert("Configure o número do WhatsApp no arquivo config.js.");
      return;
    }

    const texto = encodeURIComponent(mensagem);
    const url = `https://wa.me/${numeroWhatsApp}?text=${texto}`;

    const novaAba = window.open(url, "_blank");

    if (novaAba) {
      novaAba.opener = null;
    } else {
      window.location.href = url;
    }
  }

  function tratarCliqueWhatsApp(event) {
    const botao = event.currentTarget;

    const mensagem =
      botao.dataset.mensagem ||
      "Olá! Gostaria de entrar em contato com o escritório.";

    event.preventDefault();
    abrirWhatsApp(mensagem);
  }

  const botoesWhatsApp = document.querySelectorAll(
    ".whatsapp-link, " +
    ".btn-whatsapp, " +
    "[data-whatsapp], " +
    "a[href*='wa.me/'], " +
    "a[href*='api.whatsapp.com/']"
  );

  botoesWhatsApp.forEach((botao) => {
    botao.addEventListener("click", tratarCliqueWhatsApp);
  });

  /* =====================================================
     FORMULÁRIO DE CONTATO
  ===================================================== */

  const formulario = document.querySelector(
    "#contact-form, " +
    "#contato-form, " +
    ".contact-form, " +
    ".contato-form form, " +
    "form.contato-form"
  );

  if (formulario) {
    formulario.addEventListener("submit", (event) => {
      event.preventDefault();

      const nome = formulario.querySelector('[name="nome"], #nome');
      const email = formulario.querySelector('[name="email"], #email');
      const telefone = formulario.querySelector('[name="telefone"], #telefone');
      const assunto = formulario.querySelector('[name="assunto"], #assunto');
      const mensagem = formulario.querySelector('[name="mensagem"], #mensagem');

      // Limpa os erros anteriores.
      formulario.querySelectorAll(".campo-erro").forEach((campo) => {
        campo.classList.remove("campo-erro");
      });

      let valido = true;

      if (nome && !nome.value.trim()) {
        nome.classList.add("campo-erro");
        valido = false;
      }

      // O e-mail é validado somente se o visitante preencher o campo.
      if (email && email.value.trim()) {
        const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          email.value.trim()
        );

        if (!emailValido) {
          email.classList.add("campo-erro");
          valido = false;
        }
      }

      if (mensagem && !mensagem.value.trim()) {
        mensagem.classList.add("campo-erro");
        valido = false;
      }

      if (!valido) {
        alert(
          "Confira os campos destacados e preencha as informações corretamente."
        );
        return;
      }

      const dados = [];

      if (nome) {
        dados.push("Nome: " + nome.value.trim());
      }

      if (email && email.value.trim()) {
        dados.push("E-mail: " + email.value.trim());
      }

      if (telefone && telefone.value.trim()) {
        dados.push("Telefone: " + telefone.value.trim());
      }

      if (assunto && assunto.value.trim()) {
        dados.push("Assunto: " + assunto.value.trim());
      }

      if (mensagem) {
        dados.push("Mensagem: " + mensagem.value.trim());
      }

      const texto =
        "Olá! Gostaria de entrar em contato com o escritório.\n\n" +
        dados.join("\n");

      abrirWhatsApp(texto);
    });
  }

  /* =====================================================
     MÁSCARA DE TELEFONE
  ===================================================== */

  document
    .querySelectorAll('input[name="telefone"], #telefone')
    .forEach((campo) => {
      campo.addEventListener("input", () => {
        let numeros = campo.value.replace(/\D/g, "");
        numeros = numeros.substring(0, 11);

        if (numeros.length === 0) {
          campo.value = "";
        } else if (numeros.length <= 2) {
          campo.value = "(" + numeros;
        } else if (numeros.length <= 6) {
          campo.value =
            "(" + numeros.substring(0, 2) + ") " +
            numeros.substring(2);
        } else if (numeros.length <= 10) {
          campo.value =
            "(" + numeros.substring(0, 2) + ") " +
            numeros.substring(2, 6) + "-" +
            numeros.substring(6);
        } else {
          campo.value =
            "(" + numeros.substring(0, 2) + ") " +
            numeros.substring(2, 7) + "-" +
            numeros.substring(7);
        }
      });
    });

  /* =====================================================
     LOCALIZAÇÃO
  ===================================================== */

  const secaoLocalizacao = document.querySelector("#localizacao");

  if (secaoLocalizacao) {
    const endereco = config.endereco || {};
    const atendimento = config.atendimento || "presencial";

    if (
      config.mostrarLocalizacao === false ||
      atendimento === "online"
    ) {
      secaoLocalizacao.style.display = "none";
    } else {
      secaoLocalizacao.style.display = "";

      const paragrafos = secaoLocalizacao.querySelectorAll(
        ".localizacao-endereco p"
      );

      if (paragrafos.length >= 2) {
        paragrafos[0].textContent = [
          endereco.rua,
          endereco.bairro
        ].filter(Boolean).join(" — ");

        paragrafos[1].textContent = [
          endereco.cidade,
          endereco.estado
        ].filter(Boolean).join(" — ");
      }

      const botao = secaoLocalizacao.querySelector(".localizacao-botao");

      const enderecoCompleto = [
        endereco.rua,
        endereco.bairro,
        endereco.cidade,
        endereco.estado,
        endereco.cep
      ].filter(Boolean).join(", ");

      if (botao && enderecoCompleto) {
        botao.href =
          "https://www.google.com/maps/search/?api=1&query=" +
          encodeURIComponent(enderecoCompleto);

        botao.target = "_blank";
        botao.rel = "noopener noreferrer";
      }

      const aviso = secaoLocalizacao.querySelector(".localizacao-aviso");

      if (aviso) {
        aviso.textContent = "Endereço demonstrativo";
      }
    }
  }
});
