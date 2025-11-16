document.addEventListener("DOMContentLoaded", () => {
    const cartContent = document.getElementById("cartContent");
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    // Limpiamos el contenido
    cartContent.innerHTML = "";

    if (carrito.length === 0) {
        cartContent.innerHTML = `
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
                    <th>Opciones</th>
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
                <td>
                    <button class="btn btn-sm btn-outline-danger delete-btn" data-index="${index}">
                         Eliminar
                    </button>
                 </td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;

    cartContent.innerHTML = html;

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
        let subtotalProductos = 0;

        carrito.forEach((item, index) => {
            const subtotalElement = document.getElementById(`subtotal-${index}`);
            if (!subtotalElement) return; 

            const subtotalActual = parseFloat(subtotalElement.textContent);
            let subtotalConvertido = subtotalActual;

            // UYU → USD
            if (monedaSeleccionada === "USD" && item.moneda === "UYU") {
                subtotalConvertido = subtotalActual / USD_TO_UYU;
            }

            // USD → UYU
            if (monedaSeleccionada === "UYU" && item.moneda === "USD") {
                subtotalConvertido = subtotalActual * USD_TO_UYU;
            }

            subtotalProductos += subtotalConvertido;
        });

        const envioRadio = document.querySelector('input[name="tipoEnvio"]:checked');
        const porcentajeValor = envioRadio ? parseFloat(envioRadio.value) : 0;
        const porcentajeDecimal = porcentajeValor / 100;

        const costoEnvio = subtotalProductos * porcentajeDecimal;
        const totalCompra = subtotalProductos + costoEnvio;

        const simbolo = monedaSeleccionada === "USD" ? "US$" : "$U";

        document.getElementById("subtotalCosto").textContent = `${simbolo} ${subtotalProductos.toFixed(2)}`;
        document.getElementById("costoEnvio").textContent = `${simbolo} ${costoEnvio.toFixed(2)}`;
        document.getElementById("porcentajeEnvio").textContent = `(${porcentajeValor}%)`;
        document.getElementById("totalGeneral").textContent = `Total: ${simbolo} ${totalCompra.toFixed(2)}`;
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

    const radiosEnvio = document.querySelectorAll('input[name="tipoEnvio"]');
    radiosEnvio.forEach(radio => {
        radio.addEventListener('change', calcularTotal);
    });

    // Calcular al cargar
    calcularTotal();

    // DESAFIATE - Eliminar producto del carrito
    document.addEventListener("click", (e) => {
        if (e.target && e.target.classList.contains("delete-btn")) {
            const index = parseInt(e.target.dataset.index);
            const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
            
            if (confirm(`¿Seguro que deseas eliminar "${carrito[index].nombre}" del carrito?`)) {
                carrito.splice(index, 1);
                localStorage.setItem("carrito", JSON.stringify(carrito));
                
                // Recargamos la página para actualizar tabla, totales y badge
                location.reload();
            }
        }
    });
    
    // PAUTA 4: Validaciones y botón "Finalizar compra" 
    document.getElementById("finalizarCompra").addEventListener("click", () => {
    // Validamos los campos de dirección de envío
    const depto = document.getElementById("departamento").value.trim();
    const localidad = document.getElementById("localidad").value.trim();
    const calle = document.getElementById("calle").value.trim();
    const numero = document.getElementById("numero").value.trim();
    

    if (!depto || !localidad || !calle || !numero) {
        alert("Por favor, completa todos los campos obligatorios de la dirección de envío.");
        return;
    }

    // Validamos el tipo de envío
    const tipoEnvio = document.querySelector('input[name="tipoEnvio"]:checked');
    if (!tipoEnvio) {
        alert("Por favor, selecciona un tipo de envío.");
        return;
    }

    // Validamos que todos los productos tengan cantidad > 0
    const carritoActual = JSON.parse(localStorage.getItem("carrito")) || [];
    const todasCantidadesValidas = carritoActual.every(item => item.cantidad > 0);
    if (!todasCantidadesValidas) {
        alert("La cantidad de cada producto debe ser mayor a 0.");
        return;
    }

    // Validamos la forma de pago
    const formaPago = document.querySelector('input[name="formaPago"]:checked');
    if (!formaPago) {
        alert("Por favor, selecciona una forma de pago.");
        return;
    }

    alert("¡Compra finalizada con éxito! Gracias por tu compra.");
    
    });
    
});
