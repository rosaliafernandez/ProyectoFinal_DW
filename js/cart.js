document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector("main .container");
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    // Limpiamos el contenido
    container.innerHTML = "";

    if (carrito.length === 0) {
        container.innerHTML = `
            <div class="alert alert-warning text-center mt-5" role="alert">
                No hay productos en el carrito.
            </div>
        `;
        return;
    }

    let html = `
        <h2 class="text-center my-4">Carrito</h2>
        <p class="text-center mb-4">Aquí verás todos los productos que has añadido al carrito</p>

        <table class="table table-bordered align-middle text-center" style="border-top: 2px solid #dee2e6;">
            <thead class="bg-dark text-white">
                <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Moneda</th>
                    <th>Precio</th>
                    <th>Subtotal</th>
                </tr>
            </thead>
            <tbody>
    `;

    carrito.forEach((item, index) => {
        let subtotal = item.costo * item.cantidad;

        html += `
            <tr>
                <td class="d-flex align-items-center">
                    <img src="${item.imagen}" alt="${item.nombre}" width="80" class="me-3 rounded">
                    <span>${item.nombre}</span>
                </td>
                
                <td>
                    <input type="number" 
                           class="form-control cart-quantity-input" 
                           style="width: 80px; margin: auto;" 
                           value="${item.cantidad}" 
                           min="1" 
                           data-costo="${item.costo}"
                           data-target-id="subtotal-${index}">
                </td>
                
                <td>${item.moneda}</td>
                <td>${item.costo}</td>
                
                <td id="subtotal-${index}">${subtotal}</td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>

        <div class="bg-dark text-white p-3 d-flex justify-content-between align-items-center">
            <span id="totalGeneral">Total: -</span>
            <select id="selectMoneda" class="form-select form-select-sm w-auto">
                <option value="UYU">UYU</option>
                <option value="USD">USD</option>
            </select>
        </div>
    `;

    container.innerHTML = html;

    // Función para actualizar el subtotal
    function actualizarSubtotal(inputElement) {
        const cantidad = inputElement.value;
        const costo = inputElement.dataset.costo;
        const targetId = inputElement.dataset.targetId;
        
        const subtotalElement = document.getElementById(targetId);

        if (cantidad > 0) {
            const nuevoSubtotal = (cantidad * costo);
            subtotalElement.textContent = nuevoSubtotal;
        } else {
            inputElement.value = 1;
            subtotalElement.textContent = costo;
        }
    }

    // *** TASA DE CONVERSIÓN ***
    const USD_TO_UYU = 40;

    // Función de total + conversión
    function calcularTotal() {
        const monedaSeleccionada = document.getElementById("selectMoneda").value;
        let total = 0;

        carrito.forEach((item, index) => {
            const subtotalActual = parseFloat(document.getElementById(`subtotal-${index}`).textContent);
            let subtotalConvertido = subtotalActual;

            // UYU → USD
            if (monedaSeleccionada === "USD" && item.moneda === "UYU") {
                subtotalConvertido = subtotalActual / USD_TO_UYU;
            }

            // USD → UYU
            if (monedaSeleccionada === "UYU" && item.moneda === "USD") {
                subtotalConvertido = subtotalActual * USD_TO_UYU;
            }

            total += subtotalConvertido;
        });

        document.getElementById("totalGeneral").textContent = `Total: ${total.toFixed(2)} ${monedaSeleccionada}`;
    }

    // Listeners cantidad
    const inputsCantidad = document.querySelectorAll('.cart-quantity-input');
    inputsCantidad.forEach(input => {
        input.addEventListener('input', () => {
            actualizarSubtotal(input);
            calcularTotal();
        });
    });

    // Cambio moneda
    document.getElementById("selectMoneda").addEventListener("change", calcularTotal);

    // Calcular al cargar
    calcularTotal();
});