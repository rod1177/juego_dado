let dinero = 50;
let num_Seleccionado = null;
const caras = document.getElementById("caras_Dado");
const tirar = document.getElementById("tirar_Dado");
const mensaje = document.getElementById("mensaje");
const billete = document.getElementById("money");
const botones_numero = document.querySelectorAll(".boton_Num");
const inputApuesta = document.getElementById("apuesta");

function mostrarAlerta(mensajeTexto, callback = null) {
    const alerta = document.getElementById("alerta");
    const alertaMensaje = document.getElementById("alerta_mensaje");
    const alertaBtn = document.getElementById("alerta_btn");
    alertaMensaje.textContent = mensajeTexto;
    alerta.classList.remove("alerta_oculta");
    alerta.classList.add("alerta_visible");
    alertaBtn.onclick = () => {
        alerta.classList.remove("alerta_visible");
        alerta.classList.add("alerta_oculta");
        if (callback) callback();
    };
}

inputApuesta.addEventListener("keydown", (e) => {
    if (["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete"].includes(e.key)) return;
    if (!/^[0-9]$/.test(e.key)) e.preventDefault();
});

inputApuesta.addEventListener("paste", (e) => {
    const texto = e.clipboardData.getData("text");
    if (!/^\d+$/.test(texto)) e.preventDefault();
});

botones_numero.forEach(btn => {
    btn.addEventListener("click", () => {
        botones_numero.forEach(a => a.classList.remove("active"));
        btn.classList.add("active");
        num_Seleccionado = parseInt(btn.dataset.num);
    });
});

function girar(result) {
    const random_X = 720 + Math.floor(Math.random() * 720);
    const random_Y = 720 + Math.floor(Math.random() * 720);

    caras.style.transition = "transform 1.5s ease-out";
    caras.style.transform = `rotateX(${random_X}deg) rotateY(${random_Y}deg)`;

    setTimeout(() => {
        let rotX = 0;
        let rotY = 0;

        switch (result) {
            case 1: rotX = 0; rotY = 0; break;
            case 2: rotX = 0; rotY = -90; break;
            case 3: rotX = 0; rotY = 180; break;
            case 4: rotX = 0; rotY = 90; break;
            case 5: rotX = -90; rotY = 0; break;
            case 6: rotX = 90; rotY = 0; break;
        }

        const offsetX = Math.floor(Math.random() * 10) - 5;
        const offsetY = Math.floor(Math.random() * 10) - 5;

        caras.style.transition = "transform 0.5s ease-in-out";
        caras.style.transform = `rotateX(${rotX + offsetX}deg) rotateY(${rotY + offsetY}deg)`;
    }, 800);

    return 1400;
}

tirar.addEventListener("click", () => {
    const apuesta = parseInt(inputApuesta.value);
    mensaje.textContent = "";
    mensaje.className = "mensaje";

    if (!num_Seleccionado) {
        mostrarAlerta("Selecciona un número del dado");
        return;
    }
    if (isNaN(apuesta) || apuesta <= 0) {
        mostrarAlerta("Ingresa una cantidad válida");
        return;
    }
    if (apuesta > dinero) {
        mostrarAlerta("Fondos insuficientes");
        return;
    }

    const resultado = Math.floor(Math.random() * 6) + 1;
    const tiempoGiro = girar(resultado);

    setTimeout(() => {
        if (resultado === num_Seleccionado) {
            const ganancia = apuesta * 2;
            dinero += ganancia;
            mensaje.textContent = `🎉 ¡Ganaste $${ganancia}!`;
            mensaje.className = "mensaje ganar";
        } else {
            dinero -= apuesta;
            mensaje.textContent = `😢 Perdiste $${apuesta}. Suerte la próxima vez.`;
            mensaje.className = "mensaje perder";
        }

        billete.textContent = dinero;

        if (dinero <= 0) {
            mostrarAlerta("Has perdido todo tu dinero. Fin del juego.", () => location.reload());
        } else if (dinero >= 200) {
            mostrarAlerta("¡Has llegado al límite! ¡Eres el ganador!", () => location.reload());
        }
    }, tiempoGiro);
});
