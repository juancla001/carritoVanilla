const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer1').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
let carrito = {}



document.addEventListener('DOMContentLoaded', () =>{
    fetchData()
    if(localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito()
    }
})
cards.addEventListener('click', e =>{           //captura el evento al cual le hago click y lo muestra en consola
    addCarrito(e)
})
items.addEventListener('click', e =>{
    btnAccion(e)
})

const fetchData = async () =>{
    try{
        const res = await fetch('api.json')
        const data = await res.json()
        //console.log(data)
        pintarCards(data)
    } catch (error){
        console.log(error)
    }
}


const pintarCards = data =>{
    data.forEach(producto => {
        templateCard.querySelector('h5').textContent = producto.title
        templateCard.querySelector('p').textContent = producto.precio
        templateCard.querySelector('img').setAttribute("src", producto.thumbnailUrl)
        templateCard.querySelector('.btn-dark').dataset.id = producto.id     //vincular cada boton con su respectivo id, ver en consola
        const clone = templateCard.cloneNode(true) 
        fragment.appendChild(clone)
    } )
    cards.appendChild(fragment)   //con esto evitamos el reflow
}

const addCarrito = e => {
    //console.log(e.target) 
    //console.log(e.target.classList.contains('btn-dark'))  //captura el evento al cual le hago click y lo muestra en consola
    if(e.target.classList.contains('btn-dark')){  //veo la informacion de todo el div
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation() //sirve para detener cualquier otro evento que se pueda generar en nuestros cards
}

const setCarrito = objeto =>{   //me muestra la info del div 
    //console.log(objeto)
    const producto ={
        id: objeto.querySelector('.btn-dark').dataset.id,
        title: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad: 1
    }
    if(carrito.hasOwnProperty(producto.id)){
        producto.cantidad = carrito[producto.id].cantidad + 1 //en esta operacion hago que el elemento aumente mas uno
    }
    carrito[producto.id] = {...producto}   //spray operat, solo adquiero informacion y hago una copia de producto
    pintarCarrito()
}
const pintarCarrito = () =>{
    //console.log(carrito)
    items.innerHTML = ''
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio
        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)

    pintarFooter()

    localStorage.setItem('carrito', JSON.stringify(carrito))    //guardando nuestra coleccion de objeto como string plano y luego a una coleccion de objetos

}
const pintarFooter = () =>{
    footer.innerHTML = ""
    if(Object.keys(carrito).length === 0){
        footer.innerHTML = '<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>'
        return
    }
    const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad, 0)  //este acumulador acc, me permite sumar las cantidades
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad*precio ,0)

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btnVaciar = document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click', () =>{
        carrito = {}
        pintarCarrito()
    })

    
}
const btnAccion = e =>{
    //console.log(e.target)
    //accion de aumentar en el carrito
    if(e.target.classList.contains('btn-info')){
        //carrito[e.target.dataset.id]
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = {...producto}
        pintarCarrito()
    }
    if(e.target.classList.contains('btn-danger')){
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if(producto.cantidad === 0){
            delete carrito[e.target.dataset.id]     //cuando el producto esta en 0 comprar lo elimina del carrito
        }
        pintarCarrito()
     }

    e.stopPropagation() //para detener 
}
