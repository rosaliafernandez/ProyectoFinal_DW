function showProductsList(productsArray) {
    let htmlContentToAppend = "";

    for (let i = 0; i < productsArray.length; i++) {
        let product = productsArray[i];

        let priceToShow = `${product.cost} ${product.currency}`;
        let soldCountText = `${product.soldCount} vendidos`;

        htmlContentToAppend += `
            <div class="col-md-4 mb-4">
                <div class="card h-100 shadow-sm border-0 rounded-3 custom-card cursor-active" onclick="setProductID(${product.id})">
                    <img src="${product.image}" class="card-img-top img-fluid" alt="${product.name}">
                    <div class="card-body p-3">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text text-muted">${product.description}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <strong>${priceToShow}</strong>
                            <small class="text-muted">${soldCountText}</small>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    document.getElementById("products-container").innerHTML = htmlContentToAppend;
}

function setProductID(id) {
    localStorage.setItem("productID", id);
    window.location = "product-info.html";
}

// Desafiate
let originalProductsArray = [];

// Filtra filtra productos según texto de búsqueda, por nombre y descripción del producto en tiempo real - Desafiate
function filterProducts(searchText) {
    let cleanedSearchText = searchText.trim();

    if (cleanedSearchText === "") {
        showProductsList(originalProductsArray);
        return;
    }

    let filteredProducts = originalProductsArray.filter(product => {
        let nameMatch = product.name.toLowerCase().includes(cleanedSearchText.toLowerCase());
        let descriptionMatch = product.description.toLowerCase().includes(cleanedSearchText.toLowerCase());
        return nameMatch || descriptionMatch;
    });

    showProductsList(filteredProducts);
}

document.addEventListener("DOMContentLoaded", function () {
    showSpinner();

    // Obtiene el ID de la categoría desde el localStorage en lugar del valor fijo 101 - pauta 1
    let catID = localStorage.getItem("catID");

    let url = PRODUCTS_URL + catID + ".json";

    getJSONData(url).then(function (resultObj) {
        hideSpinner();

        if (resultObj.status === "ok") {
            let productsArray = resultObj.data.products;

            // Muestra el nombre de la categoría en el encabezado
            let categoryName = resultObj.data.catName;
            document.getElementById("category-title").innerText = categoryName;

            // Guarda el array original pora el bucador - Desafiate
            originalProductsArray = productsArray;

            showProductsList(productsArray);

            // Permite filtrado en tiempo real mientras el usuario escribe - Desafiate
            document.getElementById("searchInput").addEventListener("input", (e) => {
                filterProducts(e.target.value);
            });

        } else {
            console.error("Error:", resultObj.data);
            document.getElementById("products-container").innerHTML = `
                <div class="col-12">
                    <div class="alert alert-danger text-center">
                        No se pudieron cargar los productos.
                    </div>
                </div>
            `;
        }
    });
});
