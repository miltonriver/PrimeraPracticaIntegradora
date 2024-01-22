const socket = io();//configuración para poder usar socket del lado del cliente
console.log('Cliente conectado al servidor de socket')

socket.emit('message1', 'Me estoy comunicando desde un websocket!!')

function addProduct() {

    let title = document.getElementById("title").value;
    let description = document.getElementById("description").value;
    let price = document.getElementById("price").value;
    let thumbnail = document.getElementById("thumbnail").value;
    let code = document.getElementById("code").value;
    let stock = document.getElementById("stock").value;
    let status = document.getElementById("status").value;
    let category = document.getElementById("category").value;

    socket.emit("addProduct", { title, description, price, thumbnail, code, stock, status, category });
}

function deleteProduct(productId) {
    socket.emit("deleteProduct", { id: productId });
}

socket.on('productsList', data => {
    // console.log('Recibido productList del servidor por el método deleteProduct: ', data)

    const productList = document.getElementById("productList");
    // console.log('Este es el contenido de la const: ', productList)

    if (productList && Array.isArray(data)) {
        productList.innerHTML = '';

        const h1 = document.createElement("h1");
        h1.textContent = "Listado de productos";
        productList.appendChild(h1);

        data.forEach((product) => {
            const productContainer = document.createElement("div");
            productContainer.innerHTML = `
            <li>      
            Nombre: <b>${product.title}</b>
            <p>Precio: <b>${product.price}</b></p>
            <p>Código: <b>${product.code}</b></p>
            <p>Id: <b>${product.id}</b></p>
            <button type="button" class="delete_button" onclick="deleteProduct(${product.id})">Eliminar</button>
            </li>
    `;
            productList.appendChild(productContainer);
        });
    } else {
        console.log("Error: La estructura de datos de 'data' no es válida.", productList);
    }
})

//Modal para ingresar el mail 
Swal.fire({
    title: "Autentificación requerida para poder ingresar",
    input: "email",
    text: "Ingresa tu dirección de email",
    inputValidator: value => {
        return !value && "Necesitas ingresar tu dirección de email para continuar"
    },
    allowOutsideClick: false
}).then(result => {
    user = result.value
    console.log(user)
})

//lógica del chat
const chatbox = document.querySelector('#chatbox')
chatbox.addEventListener('keyup', (evt) => {
    if(evt.key === 'Enter'){
        if(chatbox.value.trim().length > 0){
            socket.emit('message', { user, message: chatbox.value })
            chatbox.value = ''
        }
    }
})

socket.on('messageLogs', data => {
    let messageLogs = document.querySelector('#messageLogs')
    let mensajes = ''
    data.forEach(mensaje => {
        mensajes += `<li>${mensaje.user} dice: ${mensaje.message}</li>`
    })
    messageLogs.innerHTML = mensajes
})