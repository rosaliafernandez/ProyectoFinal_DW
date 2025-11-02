document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector("main .container");
    const productoCarrito = JSON.parse(localStorage.getItem("productoCarrito"));

    // Limpiamos el contenido
    container.innerHTML = "";

    if (!productoCarrito) {
        container.innerHTML = `
            <div class="alert alert-warning text-center mt-5" role="alert">
                No hay productos en el carrito.
            </div>
        `;
        return;
    }

    // Renderizar producto tal como está guardado (sin interacción)
    container.innerHTML = `
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
                <tr>
                    <td class="d-flex align-items-center">
                        <img src="${productoCarrito.imagen}" alt="${productoCarrito.nombre}" width="80" class="me-3 rounded">
                        <span>${productoCarrito.nombre}</span>
                    </td>
                    <td>${productoCarrito.cantidad}</td>
                    <td>${productoCarrito.moneda}</td>
                    <td>${productoCarrito.costo}</td>
                    <td>$${productoCarrito.subtotal}</td>
                </tr>
            </tbody>
        </table>

        <!-- Footer con total -->
        <div class="bg-dark text-white p-3 d-flex justify-content-between align-items-center">
            <span>Total: $${productoCarrito.subtotal} ${productoCarrito.moneda}</span>
            <select class="form-select form-select-sm w-auto" disabled>
                <option value="UYU">${productoCarrito.moneda}</option>
            </select>
        </div>
    `;
});
