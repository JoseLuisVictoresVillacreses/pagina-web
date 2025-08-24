let carrito = [];

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('button[id^="bolso"]').forEach(boton => {
        boton.addEventListener('click', () => {
            const id = boton.id;
            const item = boton.closest('.bolso-item');
            const nombre = item.querySelector('h3').textContent;
            const precio = parseFloat(item.querySelector('.precio').textContent.replace('$', ''));

            agregarProducto({ id, nombre, precio });
            actualizarCarrito();
        });
    });

    crearCarritoUI();
});

function agregarProducto(producto) {
    const existente = carrito.find(p => p.id === producto.id);
    if (existente) {
        existente.cantidad += 1;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }
}

function eliminarProducto(id) {
    carrito = carrito.filter(p => p.id !== id);
    actualizarCarrito();
}

function actualizarCarrito() {
    const contenedor = document.getElementById('carrito-contenido');
    contenedor.innerHTML = '';

    let total = 0;

    carrito.forEach(producto => {
        const fila = document.createElement('div');
        fila.classList.add('item-carrito');
        fila.innerHTML = `
            <span>${producto.nombre} (x${producto.cantidad}) - $${(producto.precio * producto.cantidad).toFixed(2)}</span>
            <button onclick="eliminarProducto('${producto.id}')">X</button>
        `;
        contenedor.appendChild(fila);
        total += producto.precio * producto.cantidad;
    });

    document.getElementById('carrito-total').textContent = `Total: $${total.toFixed(2)}`;
}

function crearCarritoUI() {
    const carritoDiv = document.createElement('div');
    carritoDiv.id = 'carrito';
    carritoDiv.innerHTML = `
        <h3>🛒 Carrito</h3>
        <div id="carrito-contenido"></div>
        <p id="carrito-total">Total: $0.00</p>
        <input type="text" id="numero-cliente" placeholder="Tu número WhatsApp (ej. 521234567890)">
        <input type="email" id="correo-cliente" placeholder="Tu correo electrónico (opcional)">
        <button onclick="enviarPedido()">Finalizar Compra</button>
    `;
    document.body.appendChild(carritoDiv);
}


function pago(){


    
}

function enviarPedido() {
    if (carrito.length === 0) return alert("El carrito está vacío.");

    const numero = document.getElementById('numero-cliente').value.trim();
    const correo = document.getElementById('correo-cliente')?.value.trim();

    fetch('/enviar-pedido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            carrito,
            numeroCliente: numero || null,
            correoCliente: correo || null
        })
    })
    .then(res => res.json())
    .then(data => {
        alert(data.mensaje);
        carrito = [];
        actualizarCarrito();
    })
    .catch(err => {
        console.error(err);
        alert('Hubo un error al enviar el pedido.');
    });
}
