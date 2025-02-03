// Función para calcular la tabla de amortización
function calcularAmortizacion(prestamo, tasaAnual, numCuotas) {
    const tasaMensual = Math.pow(1 + tasaAnual / 100, 1 / 12) - 1;
    const cuotaFija = ((prestamo * tasaMensual * Math.pow(1 + tasaMensual, numCuotas)) / 
                      (Math.pow(1 + tasaMensual, numCuotas) - 1));
    let saldoPendiente = prestamo;
    let tablaAmortizacion = [];
    let fianzas = Math.ceil(prestamo * 0.08403 / numCuotas);
    let ivafiansas = (prestamo * 0.1/numCuotas) - fianzas;

    for (let i = 1; i <= numCuotas; i++) {
        if (i === 0) {
            tablaAmortizacion.push({
                cuota: i,
                saldoInicial: saldoPendiente,
                interes: 0,
                abonoCapital: 0,
                saldoFinal: saldoPendiente,
                cuotaValor: 0,
                fianza: 0,
                ivasf: 0
            });
        } else {
            const interes = saldoPendiente * tasaMensual;
            const abonoCapital = cuotaFija - interes;
            saldoPendiente -= abonoCapital;

            tablaAmortizacion.push({
                cuota: i,
                saldoInicial: saldoPendiente + abonoCapital,
                interes: interes,
                abonoCapital: abonoCapital,
                saldoFinal: saldoPendiente < 0 ? 0 : saldoPendiente,
                cuotaValor: cuotaFija + fianzas + ivafiansas,
                fianza: fianzas,
                ivasf: ivafiansas
            });
        }
    }

    return {
        cuotaFija: cuotaFija.toFixed(2),
        tablaAmortizacion: tablaAmortizacion
    };
}

// Función para formatear números como moneda
function formatoMoneda(valor) {
    return valor.toLocaleString('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    });
}

// Función para formatear números como porcentaje
function formatoPorcentaje(valor) {
    return valor.toLocaleString('es-CO', {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    });
}

// Funcion para obtener la fecha
function calcularFecha() {
    const hoy = new Date();
    const dia = hoy.getDate();
    const mes = hoy.getMonth();
    const año = hoy.getFullYear();
  
    let fechaResultado;
    const opciones = { day: "2-digit", month: "short", year: "numeric" };
  
    if (dia >= 1 && dia <= 10) {
      fechaResultado = new Date(año, mes + 1, 5);
    } else if (dia >= 10 && dia <= 20) {
      fechaResultado = new Date(año, mes + 1, 15);
    } else {
      fechaResultado = new Date(año, mes + 1, 25);
    }
  
    return fechaResultado.toLocaleDateString("es-ES", opciones);
  }

// Función para generar la tabla HTML
function generarTablasHTML(tabla1, tabla2) {
    return `
        <!-- Segunda Tabla: Totales -->
        <div>
        <table class="table1">
            <tbody>
                <tr>
                    <th>Fecha del primer pago</th>
                    <td>${fechaPagoGlobal}</td>
                </tr>
                <tr>
                    <th>Monto de Crédito</th>
                    <td>${formatoMoneda(Math.round(tabla2.valorTotalPrestamo)).replace(/\s/g, '')}</td>
                </tr>
                <tr>
                    <th>Tasa de interés M.V.</th>
                    <td>${formatoPorcentaje(tabla2.tasaMensual)}</td>
                </tr>
                <tr>
                    <th>Plazo</th>
                    <td>${tabla2.plazo}</td>
                </tr>
                <tr>
                    <th>Tarifa Fianza IVA Incluido</th>
                    <td>${formatoPorcentaje(tabla2.tarifafianza)}</td>
                </tr>
                <tr>
                    <th>Valor cuota</th>
                    <td>${formatoMoneda(Math.round((tabla2.valorcuota + (tabla2.valorTotalPrestamo * 0.1) / tabla2.plazo))).replace(/\s/g, '')}</td>
                </tr>
                <!--tr>
                    <th>Cuota regular sin VSF</th>
                    <td>${formatoMoneda(Math.round(tabla2.valorcuota)).replace(/\s/g, '')}</td>
                </tr-->
                <tr>
                    <th>Valor de Fianza IVA Incluido</th>
                    <td>${formatoMoneda(Math.round(tabla2.valorTotalPrestamo * 0.1)).replace(/\s/g, '')}</td>
                </tr>
                <tr>
                    <th>Valor total de intereses</th>
                    <td>${formatoMoneda(Math.round(tabla2.valorTotalIntereses)).replace(/\s/g, '')}</td>
                </tr>
                <tr>
                    <th>Valor total del crédito</th>
                    <td>${formatoMoneda(Math.round((tabla2.valorTotalCredito + tabla2.valorTotalPrestamo * 0.1))).replace(/\s/g, '')}</td>
                </tr>
            </tbody>
        </table>
        </div>
        <!-- Primera Tabla: Amortización -->
        <div>
        <table class="table2">
            <thead>
                <tr>
                    <th>Número de Cuota</th>
                    <th>Saldo a capital despues del pago</th>
                    <th>Abono a Capital</th>
                    <th>Intereses</th>
                    <th>Servicio Fianza</th>
                    <th>IVA SF</th>
                    <th>Valor de la Cuota</th>
                </tr>
            </thead>
            <tbody>
                ${tabla1.map(fila => ` 
                    <tr>
                        <td>${fila.cuota}</td>
                        <td>${formatoMoneda(Math.round(fila.saldoFinal)).replace(/\s/g, '')}</td>
                        <td>${formatoMoneda(Math.round(fila.abonoCapital)).replace(/\s/g, '')}</td>
                        <td>${formatoMoneda(Math.round(fila.interes)).replace(/\s/g, '')}</td>
                        <td>${formatoMoneda(Math.round(fila.fianza)).replace(/\s/g, '')}</td>
                        <td>${formatoMoneda(Math.round(fila.ivasf)).replace(/\s/g, '')}</td>
                        <td>${fila.cuotaValor === 0 ? '-' : formatoMoneda(Math.round(fila.cuotaValor)).replace(/\s/g, '')}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        </div>
    `;
}

// Función para actualizar los valores dinámicos en los campos de span
function actualizarCamposDinamicos(prestamo, plazoMaximo, tasaAnual) {
    if (!plazoMaximo) return; // Evitar errores si no hay cuotas seleccionadas

    const tasaMensual = Math.pow(1 + tasaAnual / 100, 1 / 12) - 1;
    const cuotaMaxima = ((prestamo * tasaMensual * Math.pow(1 + tasaMensual, plazoMaximo)) / 
                        (Math.pow(1 + tasaMensual, plazoMaximo) - 1)) + (prestamo * 0.1 / plazoMaximo); // Se suma el 10% de fianza

    // Actualizar los valores en los spans correspondientes
    document.getElementById('valorCompra').textContent = formatoMoneda(prestamo).replace(/\s/g, '');
    document.getElementById('plazo').textContent = plazoMaximo;
    document.getElementById('valorCuota').textContent = formatoMoneda(Math.round(cuotaMaxima)).replace(/\s/g, '');
    document.getElementById('tasaInteres').textContent = formatoPorcentaje(tasaMensual);   
}

// Cerrar la tabla si se modifica el valor del préstamo
document.getElementById('prestamo').addEventListener('input', function () {
    // Cerrar el modal si está abierto
    document.getElementById('resultado-modal').style.display = "none";
});

// Evento para manejar la entrada del monto y actualizar dinámicamente
// Función para manejar la entrada del monto y actualizar dinámicamente
// Función para manejar la entrada del monto y actualizar dinámicamente
document.getElementById('prestamo').addEventListener('input', function () {
    const valorNumerico = parseFloat(this.value.replace(/[^\d]/g, '')) || 0;
    this.value = formatoMoneda(valorNumerico).replace(/\s/g, '');
    this.dataset.valorNumerico = valorNumerico;

    const cuotasSelect = document.getElementById('cuotas');
    cuotasSelect.innerHTML = '<option value="" disabled selected>Seleccione el número de cuotas</option>';

    let opcionesCuotas = [];
    let plazoMaximo = 0;

    if (valorNumerico >= 40000 && valorNumerico <= 100000) {
        opcionesCuotas = [1, 2, 3];
    } else if (valorNumerico >= 100001 && valorNumerico <= 250000) {
        opcionesCuotas = [1, 2, 3, 4];
    } else if (valorNumerico >= 250001 && valorNumerico <= 700000) {
        opcionesCuotas = [1, 2, 3, 4, 5, 6];
    }

    // Agregar opciones al select de cuotas
    opcionesCuotas.forEach(cuota => {
        const option = document.createElement('option');
        option.value = cuota;
        option.textContent = cuota;
        cuotasSelect.appendChild(option);
        plazoMaximo = cuota; // Actualizar el plazo máximo permitido
    });

    cuotasSelect.disabled = opcionesCuotas.length === 0;

    // Asignar la cuota máxima si no se ha seleccionado ninguna
    if (opcionesCuotas.length > 0 && !cuotasSelect.value) {
        cuotasSelect.value = plazoMaximo; // Selecciona la cuota máxima
    }// Selecciona la cuota máxima
        // Actualiza los campos con la cuota máxima
    actualizarCamposDinamicos(valorNumerico, plazoMaximo, 26.8242); // Actualiza los campos con la cuota máxima
    

    // Aquí se valida si el monto del préstamo está en el rango adecuado
    if (valorNumerico < 40000 || valorNumerico > 700000) {
        document.getElementById('valorCompra').textContent = "Error: Monto fuera de rango";
        document.getElementById('plazo').textContent = "Error";
        document.getElementById('valorCuota').textContent = "Error";
        document.getElementById('tasaInteres').textContent = "Error";
    } else {
        // Si el préstamo está en el rango adecuado, se actualizan los valores dinámicos
        document.getElementById('valorCompra').textContent = formatoMoneda(valorNumerico).replace(/\s/g, '');
    }
});

// Evento para manejar la selección de cuotas y actualizar dinámicamente los valores
document.getElementById('cuotas').addEventListener('change', function () {
    const valorNumerico = parseFloat(document.getElementById('prestamo').dataset.valorNumerico) || 0;
    const cuotas = parseInt(this.value);
    
    // Validar si el valor de préstamo está en el rango adecuado
    if (valorNumerico < 40000 || valorNumerico > 700000) {
        document.getElementById('valorCompra').textContent = "Error: Monto fuera de rango";
        document.getElementById('plazo').textContent = "Error";
        document.getElementById('valorCuota').textContent = "Error";
        document.getElementById('tasaInteres').textContent = "Error";
    } else {
        // Actualizar el plazo
        document.getElementById('plazo').textContent = cuotas;

        // Calcular la cuota
        const tasaAnual = 26.8242; // Tasa fija del 26.8242% anual
        const tasaMensual = Math.pow(1 + tasaAnual / 100, 1 / 12) - 1;

        // Calcular la cuota incluyendo el 10% adicional de fianza
        const cuotaBase = (valorNumerico * tasaMensual * Math.pow(1 + tasaMensual, cuotas)) / (Math.pow(1 + tasaMensual, cuotas) - 1);
        const cuotaMaxima = cuotaBase + (valorNumerico * 0.1 / cuotas);
        
        // Actualizar el valor de la cuota
        document.getElementById('valorCuota').textContent = formatoMoneda(Math.round(cuotaMaxima)).replace(/\s/g, '');
        
        // Actualizar la tasa de interés mensual
        document.getElementById('tasaInteres').textContent = formatoPorcentaje(tasaMensual);
    }
});

// Evento para el botón "Calcular"
document.getElementById('calcularBtn').addEventListener('click', function () {
    const prestamo = parseFloat(document.getElementById('prestamo').dataset.valorNumerico) || 0;
    const cuotas = parseInt(document.getElementById('cuotas').value);
    const tasaAnual = 26.8242; // Tasa fija del 26.8242% anual
    fechaPagoGlobal = calcularFecha(); // Llamar a la función calcularFecha()

    if (prestamo < 40000 || prestamo > 700000) {
        alert('El monto del préstamo debe estar entre $40,000 y $700,000.');
        return;
    }

    if (!cuotas) {
        alert('Por favor, selecciona un número válido de cuotas.');
        return;
    }

    const resultado = calcularAmortizacion(prestamo, tasaAnual, cuotas);

    let valorTotalIntereses = 0;
    let valorTotalCredito = prestamo;
    let tasaMensual = Math.pow(1 + tasaAnual / 100, 1 / 12) - 1;

    resultado.tablaAmortizacion.forEach(fila => {
        valorTotalIntereses += fila.interes;
    });
    valorTotalCredito += valorTotalIntereses;

    const tabla2 = {
        valorTotalIntereses: valorTotalIntereses,
        valorTotalCredito: valorTotalCredito,
        valorTotalPrestamo: prestamo,
        plazo: cuotas,
        tarifafianza: 0.1,
        tasaMensual: tasaMensual,
        valorcuota: parseFloat(resultado.cuotaFija),
    };

    // Mostrar el resultado en el modal
    const modalContent = document.getElementById('tablaAmortizacion');
    modalContent.innerHTML = `
        ${generarTablasHTML(resultado.tablaAmortizacion, tabla2)}
    `;
// Mostrar el modal
document.getElementById('resultado-modal').style.display = "block";
});

// Cerrar el modal al hacer clic en el botón de cierre
document.getElementById('close-modal').addEventListener('click', function () {
    document.getElementById('resultado-modal').style.display = "none";
});

// Cerrar el modal al hacer clic fuera del modal
window.addEventListener('click', function (event) {
    if (event.target === document.getElementById('resultado-modal')) {
        document.getElementById('resultado-modal').style.display = "none";
    }
});
