        let allProducts = [];
        let currentPage = 1;
        const productsPerPage = 4;
        
        async function loadProducts() {
            try {
                const response = await fetch('xulajavo.json');
                allProducts = await response.json();
                renderProducts();
            } catch (error) {
                console.error("Error al cargar los productos:", error);
            }
        }
        
        function renderProducts() {
            const productList = document.getElementById('productList');
            const searchInput = document.getElementById('searchInput')?.value.toLowerCase() || "";
            const paginationDiv = document.getElementById('pagination');
        
            // Filtrado por búsqueda
            const filteredProducts = allProducts.filter(product =>
                product.name.toLowerCase().includes(searchInput)
            );
        
            const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
            currentPage = Math.min(currentPage, totalPages) || 1;
        
            const startIndex = (currentPage - 1) * productsPerPage;
            const paginatedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);
        
            // Mostrar productos
            productList.innerHTML = "";
            paginatedProducts.forEach((product, index) => {
                const productIndex = allProducts.indexOf(product); // Para poder borrarlo correctamente
                let productCard = `<div class="product-card">
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>$${product.price}</p>
                    <button>Comprar</button>
                    <button onclick="deleteProduct(${productIndex})" style="margin-top: 5px; background-color: red;">Borrar</button>
                </div>`;
                productList.innerHTML += productCard;
            });
        
            // Paginación
            paginationDiv.innerHTML = "";
            for (let i = 1; i <= totalPages; i++) {
                const btn = document.createElement("button");
                btn.textContent = i;
                if (i === currentPage) btn.classList.add("active");
                btn.addEventListener("click", () => {
                    currentPage = i;
                    renderProducts();
                });
                paginationDiv.appendChild(btn);
            }
        }
        
        function deleteProduct(index) {
            if (confirm("¿Estás seguro de que deseas borrar este producto?")) {
                allProducts.splice(index, 1); // Quitar del array
                renderProducts(); // Volver a mostrar
            }
        }
        
        document.addEventListener("DOMContentLoaded", () => {
            loadProducts();
        
            // Buscar productos
            const searchField = document.getElementById("searchInput");
            if (searchField) {
                searchField.addEventListener("input", () => {
                    currentPage = 1;
                    renderProducts();
                });
            }
        
            // Agregar producto desde el formulario
            const productForm = document.getElementById('productForm');
            productForm.addEventListener('submit', function (e) {
                e.preventDefault();
        
                const name = document.getElementById('name').value.trim();
                const price = parseFloat(document.getElementById('price').value);
                const image = document.getElementById('image').value.trim();
        
                if (!name || isNaN(price) || !image) {
                    alert("Por favor completa todos los campos correctamente.");
                    return;
                }
        
                const newProduct = { name, price, image };
                allProducts.push(newProduct);  // Añade al array en memoria
        
                productForm.reset();           // Limpiar formulario
                currentPage = 1;               // Volver a la primera página
                renderProducts();              // Actualizar vista
            });
        });