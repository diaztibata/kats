const randomimg = "https://api.thecatapi.com/v1/images/search?limit=9";
const favoritoimg = "https://api.thecatapi.com/v1/favourites/";
const uploadkat = 'https://api.thecatapi.com/v1/images/upload';
const apikey = "95869f75-bb6c-4beb-8867-0fe285942ddf";

async function traerDatos(url_api) {
    try {
        const response = await fetch(url_api, {
                headers: {
                    'X-API-KEY': apikey,
                }
            }
        )
        const getAssetsJson = await response.json();
        return await getAssetsJson;
    } catch(e){
        console.log("Error!");
        console.log(e);
    }
}

async function randomImages (){
    let llamadoRandom = await traerDatos(randomimg, 'GET');

    var randomKats = document.getElementById("random-kats");

    //console.log(llamadoRandom)
    randomKats.innerHTML = "";

    llamadoRandom.map((unKat) => {
        randomKats.innerHTML += `
            <div class="contenedor-un-gato">
                <img class="" src="${unKat.url}">
                <button onclick="subirFavorito('${unKat.id}')">Favorito</button>
            </div>
        `;
    });
}

randomImages()


async function subirFavorito(id) {
    const response = await fetch(favoritoimg, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apikey,
            },
            body: JSON.stringify({ 
                "image_id": id
            }),
        }
    )
    const favourites = await response.json();
    mostrarFavorito();
}

async function eliminarFavorito(id) {
    let eliminarKat = favoritoimg + id;
    const response = await fetch(eliminarKat, {
            method: 'DELETE',
            headers: {
                'x-api-key': apikey,
            }
        }
    )
    const favourites = await response.json();
    mostrarFavorito();
}

async function mostrarFavorito() {
    let mostrarmisFavoritos = await traerDatos(favoritoimg, 'GET');
    
    var favoritosKats = document.getElementById("favoritos-kats");

    //console.log(mostrarmisFavoritos);
    favoritosKats.innerHTML = "";

    mostrarmisFavoritos.map((unKat) => {
        favoritosKats.innerHTML += `
            <div class="contenedor-un-gato">
                <img class="" src="${unKat.image.url}">
                <button onclick="eliminarFavorito('${unKat.id}')">Eliminar</button>
            </div>
        `;
    });
}

mostrarFavorito()

async function subirKat(){
    const form = document.getElementById('upload-form')
    const formData = new FormData(form);

    console.log(formData.get('file'))

    const res = await fetch(uploadkat, {
    method: 'POST',
    headers: {
        'X-API-KEY': apikey,
    },
    body: formData,
    })
    const data = await res.json();

    if (res.status !== 201) {
        spanError.innerHTML = "Hubo un error: " + res.status + data.message;
        console.log({data})
      } else {
        console.log('Foto de michi subida :)')
        console.log({data})
        console.log(data.url)
        subirFavorito(data.id)
      }
}