
/* =========================================================
   SITE DOUGLAS SANTOS ADVOCACIA
   JavaScript principal
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTOS PRINCIPAIS
    ===================================================== */

    const header = document.querySelector(".header");
    const nav = document.querySelector(".nav");

    // CORREÇÃO: seu HTML usa checkbox + label, não .menu-mobile.
    const menuToggle = document.querySelector("#menu-toggle");
    const menuButton = document.querySelector(".menu-button");

    /* =====================================================
       MENU MOBILE
    ===================================================== */

    function fecharMenu() {
        if (!menuToggle) return;

        // CORREÇÃO: desmarca o checkbox usado pelo seu HTML.
        menuToggle.checked = false;

        // Mantém as classes sincronizadas, caso o CSS também as use.
        if (nav) nav.classList.remove("menu-aberto");
        if (menuButton) menuButton.classList.remove("menu-aberto");

        if (menuButton) {
            menuButton.setAttribute("aria-expanded", "false");
            menuButton.setAttribute("aria-label", "Abrir menu");
        }
    }

    function atualizarMenu() {
        if (!menuToggle) return;

        const aberto = menuToggle.checked;

        if (nav) {
            nav.classList.toggle("menu-aberto", aberto);
        }

        if (menuButton) {
            menuButton.classList.toggle("menu-aberto", aberto);
            menuButton.setAttribute("aria-expanded", String(aberto));
            menuButton.setAttribute(
                "aria-label",
                aberto ? "Fechar menu" : "Abrir menu"
            );
        }
    }

    if (menuToggle) {
        // O checkbox controla o estado do menu.
        menuToggle.addEventListener("change", atualizarMenu);
        atualizarMenu();

        // Fecha o menu ao selecionar um link.
        if (nav) {
            nav.querySelectorAll("a").forEach((link) => {
                link.addEventListener("click", fecharMenu);
            });
        }

        // Fecha o menu ao clicar fora dele.
        document.addEventListener("click", (event) => {
            const clicouNoMenu =
                nav && nav.contains(event.target);

            const clicouNoBotao =
                (menuToggle && menuToggle.contains(event.target)) ||
                (menuButton && menuButton.contains(event.target));

            if (!clicouNoMenu && !clicouNoBotao) {
                fecharMenu();
            }
        });

        // Fecha o menu com Escape.
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                fecharMenu();
            }
        });

        // Fecha o menu ao mudar para uma tela maior.
        window.addEventListener("resize", () => {
            if (window.innerWidth > 768) {
                fecharMenu();
            }
        });
    }

    /* =====================================================
       CABEÇALHO AO ROLAR A PÁGINA
    ===================================================== */

    function atualizarHeader() {
        if (!header) return;

        header.classList.toggle(
            "header-scrolled",
            window.scrollY > 50
        );
    }

    window.addEventListener("scroll", atualizarHeader, {
        passive: true
    });

    atualizarHeader();

    /* =====================================================
       ROLAGEM SUAVE
       CORREÇÃO: um único controlador para os links internos.
    ===================================================== */

    const movimentoReduzido = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    let animacaoRolagem = null;

    function rolarAteSecao(secao) {
        if (!secao) return;

        if (animacaoRolagem !== null) {
            cancelAnimationFrame(animacaoRolagem);
            animacaoRolagem = null;
        }

        const alturaHeader = header
            ? header.getBoundingClientRect().height
            : 0;

        const inicio = window.scrollY;

        const posicaoSecao =
            secao.getBoundingClientRect().top + window.scrollY;

        const destino = Math.max(
            0,
            posicaoSecao - alturaHeader
        );

        const distancia = destino - inicio;

        // Respeita a preferência do visitante por menos movimento.
        if (movimentoReduzido || Math.abs(distancia) < 2) {
            window.scrollTo(0, destino);
            return;
        }

        const duracao = Math.min(
            1200,
            Math.max(450, Math.abs(distancia) * 0.45)
        );

        let tempoInicial = null;

        function animarRolagem(tempoAtual) {
            if (tempoInicial === null) {
                tempoInicial = tempoAtual;
            }

            const progresso = Math.min(
                (tempoAtual - tempoInicial) / duracao,
                1
            );

            const suavizacao =
                progresso < 0.5
                    ? 4 * progresso * progresso * progresso
                    : 1 - Math.pow(-2 * progresso + 2, 3) / 2;

            window.scrollTo(
                0,
                inicio + distancia * suavizacao
            );

            if (progresso < 1) {
                animacaoRolagem =
                    requestAnimationFrame(animarRolagem);
            } else {
                window.scrollTo(0, destino);
                animacaoRolagem = null;
            }
        }

        animacaoRolagem = requestAnimationFrame(animarRolagem);
    }

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const destino = link.getAttribute("href");

            if (!destino || destino === "#") {
                event.preventDefault();
                return;
            }

            let secao;

            try {
                secao = document.querySelector(destino);
            } catch (erro) {
                console.warn("Destino do link inválido:", destino);
                return;
            }

            if (!secao) return;

            // Evita o salto instantâneo padrão do navegador.
            event.preventDefault();

            // Atualiza o endereço sem provocar outra navegação.
            if (window.location.hash !== destino) {
                history.pushState(null, "", destino);
            }

            rolarAteSecao(secao);
        });
    });


    /* =====================================================
       DESTAQUE DO LINK DA SEÇÃO ATUAL
    ===================================================== */

    const secoes = document.querySelectorAll("main section[id]");

    const linksMenu = document.querySelectorAll(
        ".nav a[href^='#']"
    );

    function atualizarLinkAtivo() {
        let secaoAtual = "";
        const posicaoScroll = window.scrollY + 160;

        secoes.forEach((secao) => {
            const inicio =
                secao.getBoundingClientRect().top + window.scrollY;

            const fim = inicio + secao.offsetHeight;

            if (
                posicaoScroll >= inicio &&
                posicaoScroll < fim
            ) {
                secaoAtual = secao.id;
            }
        });

        linksMenu.forEach((link) => {
            link.classList.toggle(
                "link-ativo",
                link.getAttribute("href") === `#${secaoAtual}` &&
                secaoAtual !== ""
            );
        });
    }

    window.addEventListener("scroll", atualizarLinkAtivo, {
        passive: true
    });

    atualizarLinkAtivo();

    /* =====================================================
       ANIMAÇÕES DE ENTRADA
    ===================================================== */

    const elementosAnimados = document.querySelectorAll(
        ".home-banner .content, " +
        ".home-banner .buttons, " +
        ".sobre-content, " +
        ".sobre-image, " +
        ".servicos-content, " +
        ".servicos-card, " +
        ".diferenciais-content, " +
        ".diferencial-card, " +
        ".contato-content, " +
        ".contato-form, " +
        ".footer"
    );

    if (
        elementosAnimados.length > 0 &&
        "IntersectionObserver" in window &&
        !movimentoReduzido
    ) {
        const observador = new IntersectionObserver(
            (elementos, observer) => {
                elementos.forEach((item) => {
                    if (item.isIntersecting) {
                        item.target.classList.add("elemento-visivel");
                        observer.unobserve(item.target);
                    }
                });
            },
            { threshold: 0.12 }
        );

        elementosAnimados.forEach((elemento) => {
            elemento.classList.add("elemento-animado");
            observador.observe(elemento);
        });
    } else {
        elementosAnimados.forEach((elemento) => {
            elemento.classList.add("elemento-visivel");
        });
    }


    // Formato: código do país + DDD + número, somente dígitos.
    const numeroWhatsApp = "5511912824454";

    // abre o WhatsApp em uma nova aba e trata bloqueios.
function abrirWhatsApp(mensagem) {
    const texto = encodeURIComponent(mensagem);

    const url =
        `https://wa.me/${numeroWhatsApp}?text=${texto}`;

    const novaAba = window.open(url, "_blank");

    if (novaAba) {
        // Impede que a nova página controle a página do escritório.
        novaAba.opener = null;
    } else {
        // Alternativa caso o navegador bloqueie a nova aba.
        window.location.href = url;
    }
}

    function tratarCliqueWhatsApp(event) {
        const botao = event.currentTarget;

        const mensagem =
            botao.dataset.mensagem ||
            "Olá! Gostaria de entrar em contato com o escritório.";

        // Links externos do WhatsApp também são tratados por este bloco.
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

            // Abre o WhatsApp com os dados preenchidos no formulário.
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
       ANO AUTOMÁTICO NO RODAPÉ
    ===================================================== */

    const anoAtual = document.querySelector("#ano-atual");

    if (anoAtual) {
        anoAtual.textContent = new Date().getFullYear();
    }

});