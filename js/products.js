let currentProductsArray = [ ];  
let originalProductsArray=[];  // Para mantener la lista original sin cambios  
const ORDER_ASC_BY_PRICE="PriceAsc"; 
const ORDER_DESC_BY_PRICE =  "PriceDesc";   
const ORDER_BY_PROD_COUNT= "Relevance"; 
let currentSortCriteria   = undefined; 
let minPrice= undefined;  
let maxPrice =  undefined ;


function sortProducts(criteria, array) {
   let result=[]; 
   if(criteria === ORDER_ASC_BY_PRICE) 
   {  
        result = array.sort(function(a,b){ 
             return a.cost - b.cost; 
        }); 
   } else if(criteria=== ORDER_DESC_BY_PRICE) {
       result = array.sort(function(a, b){ 
         return b.cost - a.cost ; 
       }); 
   }  else if(criteria===ORDER_BY_PROD_COUNT) {
        result= array.sort(function(a,b) {
              return b.soldCount - a.soldCount; 
        }); 
   } 

   return result ; 
} 


function showProductsList( ) { 
     let htmlContentToAppend="";  

   for ( let i=0; i< currentProductsArray.length ; i++ ){ 
        let product = currentProductsArray[i];  

       if(((minPrice==undefined) || (minPrice!=undefined && parseInt(product.cost) >= minPrice)) && 
           ((maxPrice == undefined) || (maxPrice!= undefined && parseInt(product.cost)<=maxPrice))) 
       {
            htmlContentToAppend+=`
                <div class="col mb-4"> 
                 <div class="card h-100 shadow-sm border-0 rounded-3 custom-card cursor-active" onclick="setProductID(${product.id})"> 
                        <img src="${product.image}" class="card-img-top img-fluid" alt="${product.name}"> 
                        <div class="card-body p-3"> 
                            <h5 class="card-title">${product.name}</h5> 
                            <p class="card-text text-muted">${product.description}</p> 
                            <div class="d-flex justify-content-between align-items-center"> 
                                <strong>${product.cost} ${product.currency}</strong> 
                                <small class="text-muted">${product.soldCount} vendidos</small> 
                            </div> 
                        </div> 
                    </div> 
                </div> 
            `;  
       } 
   } 


    document.getElementById("products-container").innerHTML = htmlContentToAppend;
}

function sortAndShowProducts(sortCriteria, productsArray){
    currentSortCriteria = sortCriteria;

    if(productsArray != undefined){
        currentProductsArray = productsArray;
    }

    currentProductsArray = sortProducts(currentSortCriteria, currentProductsArray);

    //Muestro los productos ordenados
    showProductsList();
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


            originalProductsArray = resultObj.data.products;
            currentProductsArray = originalProductsArray;
            showProductsList();
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

    document.getElementById("sortAsc").addEventListener("click" , function() {
      sortAndShowProducts(ORDER_ASC_BY_PRICE);  
    });

   document.getElementById("sortDesc").addEventListener("click",function(){
        sortAndShowProducts( ORDER_DESC_BY_PRICE );
   });

    document.getElementById("sortByCount").addEventListener("click" ,  function( ){
       sortAndShowProducts(ORDER_BY_PROD_COUNT);   
    });

     document.getElementById("clearRangeFilter").addEventListener("click", function() {
         document.getElementById("rangeFilterPriceMin").value="";
       document.getElementById("rangeFilterPriceMax").value = "";  

        minPrice= undefined; 
         maxPrice=undefined;  

       showProductsList( ); 
     });

   document.getElementById("rangeFilterPriceBtn").addEventListener("click", function(){ 
        //Obtengo el mínimo y máximo de los intervalos para filtrar  
      minPrice =document.getElementById("rangeFilterPriceMin").value ; 
        maxPrice=  document.getElementById("rangeFilterPriceMax").value;  

       if ((minPrice != undefined) && (minPrice!="") && (parseInt(minPrice)) >=0 ) {
           minPrice= parseInt(minPrice) ;
       } else {
          minPrice= undefined ;
       }

        if ((maxPrice!= undefined) && (maxPrice!="") && (parseInt(maxPrice))>=0 ){
          maxPrice =parseInt(maxPrice);  
        }  else {
            maxPrice=undefined;  
        }

        showProductsList();  
   }); 
}); 
