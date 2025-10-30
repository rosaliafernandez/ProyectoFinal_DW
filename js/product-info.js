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

// Guardar el producto en el carrito y redirigir a cart.html
function comprarProducto(producto) {
    
    // Creo el objeto con la información necesaria del producto
    const productoCarrito = {
        nombre: producto.name,
        costo: producto.cost,
        moneda: producto.currency,
        cantidad: 1, // Cantidad inicial
        imagen: producto.images[0], // Primera imagen del producto
        subtotal: producto.cost * 1 // Costo * cantidad
    };

    // Guardar en localStorage
    localStorage.setItem('productoCarrito', JSON.stringify(productoCarrito));

    // Redirigir al carrito
    window.location.href = 'cart.html';
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
            
            // === DESAFÍO: Añadir comentario simulado ===
const commentForm = document.getElementById("commentForm");

if (commentForm) {
    commentForm.addEventListener("submit", function(e) {
        e.preventDefault(); // Evita que el formulario recargue la página

        const commentText = document.getElementById("commentText").value.trim();
        const ratingInput = document.querySelector('input[name="rating"]:checked');
        const userName = localStorage.getItem("usuarioLogueado") || "Usuario anónimo";

        // Validaciones
        if (!commentText) {
            alert("Por favor, escribe un comentario.");
            return;
        }
        if (!ratingInput) {
            alert("Por favor, selecciona una calificación.");
            return;
        }

        // Crear nuevo comentario
        const newComment = {
            user: userName,
            description: commentText,
            score: parseInt(ratingInput.value),
            dateTime: new Date().toLocaleDateString("es-ES", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            })
        };

        // Generar HTML del nuevo comentario
        const stars = generateStars(newComment.score);

        const newCommentHTML = `
            <div class="card mb-3">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h6 class="card-title mb-0">${newComment.user}</h6>
                        <small class="text-muted">${newComment.dateTime}</small>
                    </div>
                    <div class="mb-2">
                        ${stars}
                    </div>
                    <p class="card-text">${newComment.description}</p>
                </div>
            </div>
        `;

        // Insertar al inicio del contenedor
        const commentsContainer = document.getElementById("commentsContainer");
        if (commentsContainer) {
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = newCommentHTML;
            commentsContainer.insertBefore(tempDiv.firstElementChild, commentsContainer.firstChild);
        }

        // Limpiar formulario
        document.getElementById("commentText").value = "";
        document.querySelectorAll('input[name="rating"]').forEach(input => input.checked = false);
    });
}
            
            mostrarRelacionados(product.relatedProducts);

            // Escuchar el clic en el botón Comprar
            const btnComprar = document.getElementById('btnComprar');
            if (btnComprar) {
                btnComprar.addEventListener('click', function() {
                    comprarProducto(product);
                });
            }

        } else {
            document.getElementById("productTitle").textContent = "Error al cargar el producto";
        }
    });
});

function mostrarRelacionados(array) {
    let container = document.getElementById("productosRelacionados");
    if (!container) return;

    container.innerHTML = "";

    array.forEach(producto => {
        let col = document.createElement("div");
        col.classList.add("col-6", "col-md-4", "col-lg-3", "mb-3");

        col.innerHTML = `
        <div class="card h-100 productos-relacionados" data-id="${producto.id}" style="cursor:pointer">
        <img src="${producto.image}" class="card-img-top" alt="${producto.name}">
        <div class="card-body text-center">
        <p class="card-text">${producto.name}</p>
        </div>
      </div>
    `;

    col.querySelector(".productos-relacionados").addEventListener("click", () => {
        localStorage.setItem("productID", producto.id);
        location.href = "product-info.html";
    });

    container.appendChild(col);
    });

}
