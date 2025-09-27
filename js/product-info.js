// product-info.js
// Genera las estrellas de calificación basadas en el puntaje PAUTA 2
function generateStars(score) {
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= score) {
            starsHTML += '<span class="fa fa-star checked"></span>';
        } else {
            starsHTML += '<span class="fa fa-star"></span>';
        }
    }
    return starsHTML;
}

// Muestro los comentarios del producto en el DOM PAUTA 2
function showComments(comments) {
    const commentsContainer = document.getElementById('commentsContainer');
    let htmlContent = '';

    if (!comments || comments.length === 0) {
        htmlContent = '<p class="text-muted">No hay comentarios para este producto.</p>';
    } else {
        comments.forEach(comment => {
            htmlContent += `
                <div class="card mb-3">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h6 class="card-title mb-0">${comment.user}</h6>
                            <small class="text-muted">${comment.dateTime}</small>
                        </div>
                        <div class="mb-2">
                            ${generateStars(comment.score)}
                        </div>
                        <p class="card-text">${comment.description}</p>
                    </div>
                </div>
            `;
        });
    }

    commentsContainer.innerHTML = htmlContent;
}

// Carga los comentarios del producto desde la API PAUTA 2
function loadProductComments(productID) {
    const commentsUrl = PRODUCT_INFO_COMMENTS_URL + productID + EXT_TYPE;
    
    getJSONData(commentsUrl).then(function(result) {
        if (result.status === 'ok') {
            showComments(result.data);
        } else {
            console.error('Error al cargar comentarios:', result.data);
            document.getElementById('commentsContainer').innerHTML = 
                '<p class="text-danger">Error al cargar los comentarios.</p>';
        }
    });
}

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

            // Cargar comentarios después de cargar el producto PAUTA 2
            loadProductComments(productID);

        } else {
            document.getElementById("productTitle").textContent = "Error al cargar el producto";
        }
    });
});
