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

    const product = { title, description, price, thumbnail, code, stock, status, category }

    socket.emit("addProduct", product);
    // console.log("Evento addProduct emitido desde el cliente (formulario)", product )
    document.getElementById("form_add").reset();
}

function deleteProduct(productId) {
    socket.emit("deleteProduct", { _id: productId});
    // console.log("función deleteProduct emitida desde el servidor: ", productId)
}

socket.on('productsList', data => {
    // console.log('Recibido productList del servidor: ', data)

    const productList = document.getElementById("productList");
    // console.log('Este es el contenido de la const: ', productList)

    if (productList && Array.isArray(data)) {
        productList.innerHTML = '';

        const h1 = document.createElement("h1");
        h1.textContent = "Listado de productos";
        productList.appendChild(h1);

        const h2 = document.createElement("h2");
        h2.textContent = "El titulo ha sido creado, contenido actualizado"
        productList.appendChild(h2)

        data.forEach((product) => {
            const productContainer = document.createElement("div");
            productContainer.innerHTML = `
            <li>      
            Nombre: <b>${product.title}</b>
            <p>Descripción: <b>${product.description}</b></p>
            <p>Precio: <b>${product.price}</b></p>
            <p>Código: <b>${product.code}</b></p>
            <p>Id: <b>${product._id}</b></p>
            <button type="button" class="delete_button" onclick="deleteProduct('${product._id}')">Eliminar</button>
            </li>
    `;
            productList.appendChild(productContainer);
        });
    } else {
        console.log(`Error: La estructura de datos de ${data} no es válida.`, productList);
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
    allowOutsideClick: false//para cliquear afuera del modal y que este no se cierre
}).then(result => {
    email = result.value
    console.log("email:", email)
})

//lógica del chat
const chatbox = document.querySelector('#chatbox')
chatbox.addEventListener('keyup', (evt) => {
    if(evt.key === 'Enter'){
        if(chatbox.value.trim().length > 0){
            socket.emit('message', { email, message: chatbox.value })
            chatbox.value = ''
        }
    }
})

socket.on('messageLogs', data => {
    let messageLogs = document.querySelector('#messageLogs')
    let mensajes = ''
    data.forEach(mensaje => {
        mensajes += `<li>${mensaje.email} dice: ${mensaje.message}</li>`
    })
    messageLogs.innerHTML = mensajes
    console.log(mensajes)
})
