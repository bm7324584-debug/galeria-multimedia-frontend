const API_URL =
"https://galeria-multimedia-backend-g60l.onrender.com";

const form = document.getElementById("formMultimedia");
const galeria = document.getElementById("galeria");

let modoEdicion = false;
let idEditar = null;

// =========================
// CARGAR GALERÍA
// =========================
async function cargarMultimedia() {

    try {

        galeria.innerHTML = `
        <div class="col-span-full text-center text-white text-xl">
            Cargando...
        </div>
        `;

        const res = await fetch(
            `${API_URL}/multimedia?t=${Date.now()}`
        );

        const datos = await res.json();

        galeria.innerHTML = "";

        if (datos.length === 0) {

            galeria.innerHTML = `
            <div class="col-span-full bg-white p-6 rounded-xl text-center">
                No hay elementos registrados
            </div>
            `;

            return;
        }

        datos.forEach(item => {

            const tarjeta = document.createElement("div");

            tarjeta.className =
            "bg-white rounded-2xl shadow-xl overflow-hidden";

            tarjeta.innerHTML = `

                ${
                    item.imagenUrl
                    ? `
                    <img src="${API_URL}${item.imagenUrl}"
                    class="w-full h-64 object-cover">
                    `
                    : ''
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
                        ? `
                        <audio controls class="w-full mb-4">
                            <source src="${API_URL}${item.audioUrl}">
                        </audio>
                        `
                        : ''
                    }

                    <div class="flex gap-2">

                        <button class="editarBtn flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded">
                            Editar
                        </button>

                        <button class="eliminarBtn flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded">
                            Eliminar
                        </button>

                    </div>

                </div>
            `;

            tarjeta.querySelector(".editarBtn")
            .addEventListener("click", () => {

                editarElemento(
                    item._id,
                    item.titulo,
                    item.descripcion || ''
                );

            });

            tarjeta.querySelector(".eliminarBtn")
            .addEventListener("click", () => {

                eliminarElemento(item._id);

            });

            galeria.appendChild(tarjeta);

        });

    } catch (error) {

        console.error(error);

        galeria.innerHTML = `
        <div class="col-span-full bg-red-100 text-red-600 p-5 rounded">
            Error al cargar elementos
        </div>
        `;
    }
}

// =========================
// CREAR / EDITAR
// =========================
form.addEventListener("submit", async (e) => {

    e.preventDefault();

    try {

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

        if (imagen) formData.append("imagen", imagen);
        if (audio) formData.append("audio", audio);

        let url = `${API_URL}/multimedia`;
        let method = "POST";

        if (modoEdicion) {
            url = `${API_URL}/multimedia/${idEditar}`;
            method = "PUT";
        }

        const res = await fetch(url, {
            method: method,
            body: formData
        });

        if (!res.ok) {

            alert("Error al guardar");
            return;
        }

        alert(modoEdicion ? "Elemento actualizado" : "Elemento guardado");

        modoEdicion = false;
        idEditar = null;

        form.reset();

        document.querySelector('button[type="submit"]')
        .textContent = "Guardar Elemento";

        await cargarMultimedia();

    } catch (error) {

        console.error(error);
        alert("Error de conexión");
    }
});

// =========================
// EDITAR
// =========================
function editarElemento(id, titulo, descripcion) {

    modoEdicion = true;
    idEditar = id;

    document.getElementById("titulo").value = titulo;
    document.getElementById("descripcion").value = descripcion;

    document.querySelector('button[type="submit"]')
    .textContent = "Actualizar Elemento";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// =========================
// ELIMINAR
// =========================
async function eliminarElemento(id) {

    const confirmar =
    confirm("¿Deseas eliminar este elemento?");

    if (!confirmar) return;

    try {

        const res = await fetch(
            `${API_URL}/multimedia/${id}`,
            { method: "DELETE" }
        );

        if (!res.ok) {

            alert("Error al eliminar");
            return;
        }

        alert("Elemento eliminado");

        await cargarMultimedia();

    } catch (error) {

        console.error(error);
    }
}

// INIT
cargarMultimedia();