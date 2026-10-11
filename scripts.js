
/* =========================================================
   SITE DOUGLAS SANTOS ADVOCACIA
   JavaScript — Contato
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       WHATSAPP
    ===================================================== */

    // Código do país + DDD + número, somente dígitos.
    const numeroWhatsApp = "5511912824454";

    function abrirWhatsApp(mensagem) {
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
        ".contact-form, " +
        ".contato-form form, " +
        "form.contato-form"
    );

    if (formulario) {
        formulario.addEventListener("submit", (event) => {
            event.preventDefault();

            const nome = formulario.querySelector(
                '[name="nome"], #nome'
            );

            const email = formulario.querySelector(
                '[name="email"], #email'
            );

            const telefone = formulario.querySelector(
                '[name="telefone"], #telefone'
            );

            const assunto = formulario.querySelector(
                '[name="assunto"], #assunto'
            );

            const mensagem = formulario.querySelector(
                '[name="mensagem"], #mensagem'
            );

            formulario.querySelectorAll(".campo-erro").forEach(
                (campo) => campo.classList.remove("campo-erro")
            );

            let valido = true;

            if (nome && !nome.value.trim()) {
                nome.classList.add("campo-erro");
                valido = false;
            }

            if (email) {
                const emailValido =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
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

            if (email) {
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

});
