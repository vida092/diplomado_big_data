// Datos iniciales de prueba para el DataFrame
const datosOriginales = [
    { id: 1, nombre: "Ana", edad: 28, salario: 45000 },
    { id: 2, nombre: "Carlos", edad: 22, salario: 30000 },
    { id: 3, nombre: "Beatriz", edad: 35, salario: 60000 },
    { id: 4, nombre: "David", edad: 41, salario: 75000 },
    { id: 5, nombre: "Elena", edad: 24, salario: 32000 }
];

// Inicializar la tabla de origenn al cargar
window.onload = function() {
    renderTabla(datosOriginales, "tabla-origen");
    renderTabla(datosOriginales, "tabla-resultado");
};

// Funciopn para cambiar de pestaña en la interfaz
function cambiarTab(tab) {
    const secTransf = document.getElementById("sec-transf");
    const secJoin = document.getElementById("sec-join");
    const btnTransf = document.getElementById("btn-transf");
    const btnJoin = document.getElementById("btn-join");

    if (tab === 'transf') {
        secTransf.classList.remove("hidden");
        secJoin.classList.add("hidden");
        btnTransf.className = "px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white transition";
        btnJoin.className = "px-4 py-2 text-sm font-medium rounded-md text-slate-400 hover:text-white transition";
    } else {
        secTransf.classList.add("hidden");
        secJoin.classList.remove("hidden");
        btnJoin.className = "px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white transition";
        btnTransf.className = "px-4 py-2 text-sm font-medium rounded-md text-slate-400 hover:text-white transition";
    }
}

// Renderizador visual de tablas HTML
function renderTabla(datos, elementoId) {
    const contenedor = document.getElementById(elementoId);
    if (!datos || datos.length === 0) {
        contenedor.innerHTML = `<div class="p-4 text-center text-xs text-slate-500">Sin datos</div>`;
        return;
    }

    const columnas = Object.keys(datos[0]);
    
    let html = `<table class="w-full text-left text-xs border-collapse"><thead><tr class="border-b border-slate-800 bg-slate-900/50">`;
    columnas.forEach(col => {
        html += `<th class="p-2.5 font-semibold text-slate-400 uppercase tracking-wider">${col}</th>`;
    });
    html += `</tr></thead><tbody class="divide-y divide-slate-800/60">`;

    datos.forEach(fila => {
        html += `<tr>`;
        columnas.forEach(col => {
            html += `<td class="p-2.5 text-slate-300 font-mono">${fila[col]}</td>`;
        });
        html += `</tr>`;
    });
    html += `</tbody></table>`;
    
    contenedor.innerHTML = html;
}

// Simulación de transformaciones de spark
function ejecutarOp(tipo) {
    let resultado = [...datosOriginales];

    switch(tipo) {
        case 'select':
            // Proyección de columnas
            resultado = resultado.map(item => ({ id: item.id, nombre: item.nombre }));
            break;
        case 'filter':
            // Filtrado condicional
            resultado = resultado.filter(item => item.edad > 25);
            break;
        case 'drop':
            // Eliminación de columna
            resultado = resultado.map(item => {
                const { salario, ...resto } = item;
                return resto;
            });
            break;
        case 'orderby':
            // Ordenamiento descendente por edad
            resultado.sort((a, b) => b.edad - a.edad);
            break;
        case 'reset':
        default:
            break;
    }

    renderTabla(resultado, "tabla-resultado");
}

// Simulación visual de Joins
async function ejecutarJoin(tipo) {
    const log = document.getElementById("log-join");
    const n1 = document.getElementById("nodo-1");
    const n2 = document.getElementById("nodo-2");
    const n3 = document.getElementById("nodo-3");

    // Resetear estilos de nodos
    [n1, n2, n3].forEach(n => {
        n.className = "p-4 bg-slate-900 border border-slate-800 rounded-lg text-center transition";
    });

    if (tipo === 'standard') {
        log.innerText = "Fase 1: Shuffle Inciado. Redistribuyendo ambas tablas por clave de red...";
        [n1, n2, n3].forEach(n => n.classList.add("border-rose-500", "bg-rose-950/10"));
        
        await new Promise(r => setTimeout(r, 1500));
        log.innerText = "Fase 2: Alto tráfico de red (Shuffle). Las filas se cruzan de nodo a nodo.";
        
        await new Promise(r => setTimeout(r, 1500));
        log.innerText = "Completado: Standard Join (Sort-Merge Join) finalizado con coste alto de red.";
        [n1, n2, n3].forEach(n => {
            n.classList.remove("border-rose-500", "bg-rose-950/10");
            n.classList.add("border-rose-800");
        });

    } else {
        log.innerText = "Fase 1: Broadcast en curso... La tabla pequeña se copia a memoria Driver.";
        await new Promise(r => setTimeout(r, 1000));
        
        log.innerText = "Fase 2: Transmitiendo copia completa de tabla pequeña a TODOS los nodos...";
        [n1, n2, n3].forEach(n => n.classList.add("border-emerald-500", "bg-emerald-950/10"));
        
        await new Promise(r => setTimeout(r, 1500));
        log.innerText = "Completado: Broadcast Join exitoso. Sin fase de Shuffle, unión local ultrarrápida.";
        [n1, n2, n3].forEach(n => {
            n.classList.remove("border-emerald-500", "bg-emerald-950/10");
            n.classList.add("border-emerald-800");
        });
    }
}
