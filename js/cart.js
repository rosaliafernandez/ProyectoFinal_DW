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

    carrito.forEach(item => {
        html += `
            <tr>
                <td class="d-flex align-items-center">
                    <img src="${item.imagen}" alt="${item.nombre}" width="80" class="me-3 rounded">
                    <span>${item.nombre}</span>
                </td>
                <td>${item.cantidad}</td>
                <td>${item.moneda}</td>
                <td>${item.costo}</td>
                <td>-</td> <!-- Sin cálculos -->
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>

        <!-- Footer con total -->
        <div class="bg-dark text-white p-3 d-flex justify-content-between align-items-center">
            <span>Total: -</span>
            <select id="selectMoneda" class="form-select form-select-sm w-auto">
                <option value="UYU">UYU</option>
                <option value="USD">USD</option>
            </select>
        </div>
    `;

    container.innerHTML = html;
});