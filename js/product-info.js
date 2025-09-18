// product-info.js

document.addEventListener("DOMContentLoaded", function () {
    showSpinner();

    // Obtener el productID desde localStorage
    let productID = localStorage.getItem("productID");

    if (!productID) {
        document.getElementById("productTitle").textContent = "Producto no encontrado";
        hideSpinner();
        return;
    }

    // Construir la URL para obtener los detalles del producto
    let url = PRODUCT_INFO_URL + productID + ".json";

    getJSONData(url).then(function (resultObj) {
        hideSpinner();

        if (resultObj.status === "ok") {
            let product = resultObj.data;

            // Mostrar datos del producto
            document.getElementById("productTitle").textContent = product.name;
            document.getElementById("productPrice").textContent = `${product.cost} ${product.currency}`;
            document.getElementById("productCategory").textContent = product.category;
            document.getElementById("productSoldCount").textContent = product.soldCount;
            document.getElementById("productDescription").textContent = product.description;

            // Generar imágenes del carrusel
            let carouselInner = document.getElementById("carouselImages");
            carouselInner.innerHTML = ""; // Limpiar

            product.images.forEach((imgSrc, index) => {
                let item = document.createElement("div");
                item.className = index === 0 ? "carousel-item active" : "carousel-item";
                item.innerHTML = `<img src="${imgSrc}" class="d-block w-100 img-fluid rounded" alt="Imagen del producto">`;
                carouselInner.appendChild(item);
            });
        } else {
            document.getElementById("productTitle").textContent = "Error al cargar el producto";
        }
    });
});
