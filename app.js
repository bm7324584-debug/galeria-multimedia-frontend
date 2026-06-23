const API_URL =
"https://galeria-multimedia-backend-g60l.onrender.com";

const form =
document.getElementById("formMultimedia");

const galeria =
document.getElementById("galeria");

let modoEdicion = false;
let idEditar = null;

async function cargarMultimedia() {

    try {

        const res =
        await fetch(`${API_URL}/multimedia`);

        const datos =
        await res.json();

        galeria.innerHTML = "";

        datos.forEach(item => {

            galeria.innerHTML += `
            <div class="bg-white rounded-2xl shadow-xl overflow-hidden">

                ${
                    item.imagenUrl
                    ?
                    `
                    <img
                    src="${API_URL}${item.imagenUrl}"
                    class="w-full h-64 object-cover">
                    `
                    :
                    ''
                }

                <div class="p-5">

                    <h3 class="text-xl font-bold mb-2">
                        ${item.titulo}
                    </h3>

                    <p class="text-gray-600 mb-4">
                        ${item.descripcion || ''}
                    </p>

                    ${
                        item.audioUrl
                        ?
                        `
                        <audio controls class="w-full mb-4">
                            <source
                            src="${API_URL}${item.audioUrl}">
                        </audio>
                        `
                        :
                        ''
                    }

                    <div class="flex gap-2">

                        <button
                        onclick="editarElemento(
                        '${item._id}',
                        '${item.titulo}',
                        \`${item.descripcion || ''}\`
                        )"
                        class="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded">

                        Editar

                        </button>

                        <button
                        onclick="eliminarElemento('${item._id}')"
                        class="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded">

                        Eliminar

                        </button>

                    </div>

                </div>

            </div>
            `;
        });

    } catch(error) {

        console.error(error);
    }
}

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    try {

        if(modoEdicion){

            const res = await fetch(
                `${API_URL}/multimedia/${idEditar}`,
                {
                    method:'PUT',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify({
                        titulo:
                        document.getElementById("titulo").value,

                        descripcion:
                        document.getElementById("descripcion").value
                    })
                }
            );

            if(res.ok){

                alert("Elemento actualizado");

                modoEdicion = false;
                idEditar = null;

                form.reset();

                cargarMultimedia();
            }

            return;
        }

        const formData = new FormData();

        formData.append(
            "titulo",
            document.getElementById("titulo").value
        );

        formData.append(
            "descripcion",
            document.getElementById("descripcion").value
        );

        const imagen =
        document.getElementById("imagen").files[0];

        const audio =
        document.getElementById("audio").files[0];

        if(imagen){
            formData.append("imagen", imagen);
        }

        if(audio){
            formData.append("audio", audio);
        }

        const res = await fetch(
            `${API_URL}/multimedia`,
            {
                method:'POST',
                body:formData
            }
        );

        if(res.ok){

            alert("Elemento guardado");

            form.reset();

            cargarMultimedia();
        }

    } catch(error){

        console.error(error);
    }

});

function editarElemento(
    id,
    titulo,
    descripcion
){

    modoEdicion = true;

    idEditar = id;

    document.getElementById("titulo").value =
    titulo;

    document.getElementById("descripcion").value =
    descripcion;

    window.scrollTo({
        top:0,
        behavior:'smooth'
    });
}

async function eliminarElemento(id){

    const confirmar =
    confirm("¿Deseas eliminar este elemento?");

    if(!confirmar) return;

    try {

        const res = await fetch(
            `${API_URL}/multimedia/${id}`,
            {
                method:'DELETE'
            }
        );

        if(res.ok){

            alert("Elemento eliminado");

            cargarMultimedia();
        }

    } catch(error){

        console.error(error);
    }
}

cargarMultimedia();