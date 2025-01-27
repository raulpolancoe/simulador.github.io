// Función para calcular la tabla de amortización
function calcularAmortizacion(prestamo, tasaAnual, numCuotas) {
    const tasaMensual = Math.pow(1 + tasaAnual / 100, 1 / 12) - 1;
    const cuotaFija = ((prestamo * tasaMensual * Math.pow(1 + tasaMensual, numCuotas)) / 
                      (Math.pow(1 + tasaMensual, numCuotas) - 1));
    let saldoPendiente = prestamo;
    let tablaAmortizacion = [];
    let fianzas = Math.ceil(prestamo * 0.08403 / numCuotas);
    let ivafiansas = (prestamo * 0.1/numCuotas) - fianzas;

    for (let i = 0; i <= numCuotas; i++) {
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
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Función para generar la tabla HTML
function generarTablasHTML(tabla1, tabla2) {
    return `
        <!-- Segunda Tabla: Totales -->
        <table>
            <tbody>
                <tr>
                    <th>Monto de Crédito</th>
                    <td>${formatoMoneda(tabla2.valorTotalPrestamo).replace(/\s/g, '')}</td>
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
                    <th>Cuota con VSF</th>
                    <td>${formatoMoneda(tabla2.valorcuota + (tabla2.valorTotalPrestamo * 0.1) / tabla2.plazo).replace(/\s/g, '')}</td>
                </tr>
                <tr>
                    <th>Cuota regular sin VSF</th>
                    <td>${formatoMoneda(tabla2.valorcuota).replace(/\s/g, '')}</td>
                </tr>
                <tr>
                    <th>Valor de Fianza IVA Incluido</th>
                    <td>${formatoMoneda(tabla2.valorTotalPrestamo * 0.1).replace(/\s/g, '')}</td>
                </tr>
                <tr>
                    <th>Valor total de intereses</th>
                    <td>${formatoMoneda(tabla2.valorTotalIntereses).replace(/\s/g, '')}</td>
                </tr>
                <tr>
                    <th>Valor total del crédito</th>
                    <td>${formatoMoneda(tabla2.valorTotalCredito + tabla2.valorTotalPrestamo * 0.1).replace(/\s/g, '')}</td>
                </tr>
            </tbody>
        </table>
        <!-- Primera Tabla: Amortización -->
        <table>
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
                        <td>${formatoMoneda(fila.saldoFinal).replace(/\s/g, '')}</td>
                        <td>${formatoMoneda(fila.abonoCapital).replace(/\s/g, '')}</td>
                        <td>${formatoMoneda(fila.interes).replace(/\s/g, '')}</td>
                        <td>${formatoMoneda(fila.fianza).replace(/\s/g, '')}</td>
                        <td>${formatoMoneda(fila.ivasf).replace(/\s/g, '')}</td>
                        <td>${fila.cuotaValor === 0 ? '-' : formatoMoneda(fila.cuotaValor).replace(/\s/g, '')}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Evento para actualizar las cuotas según el monto
// Formatear el valor del préstamo como moneda mientras se escribe
document.getElementById('prestamo').addEventListener('input', function () {
    // Obtener el valor numérico puro eliminando cualquier símbolo o punto
    const valorNumerico = parseFloat(this.value.replace(/[^\d]/g, '')) || 0;

    // Actualizar visualmente el valor en formato de moneda
    this.value = formatoMoneda(valorNumerico);

    // Almacenar el valor numérico puro en un atributo de datos para cálculos posteriores
    this.dataset.valorNumerico = valorNumerico;

    // Actualizar las opciones del desplegable de cuotas
    const cuotasSelect = document.getElementById('cuotas');
    cuotasSelect.innerHTML = '<option value="" disabled selected>Seleccione el número de cuotas</option>';

    let opcionesCuotas = [];
    if (valorNumerico >= 40000 && valorNumerico <= 100000) {
        opcionesCuotas = [1, 2, 3];
    } else if (valorNumerico >= 100001 && valorNumerico <= 250000) {
        opcionesCuotas = [1, 2, 3, 4];
    } else if (valorNumerico >= 250001 && valorNumerico <= 700000) {
        opcionesCuotas = [1, 2, 3, 4, 5, 6];
    }

    opcionesCuotas.forEach(cuota => {
        const option = document.createElement('option');
        option.value = cuota;
        option.textContent = cuota;
        cuotasSelect.appendChild(option);
    });

    cuotasSelect.disabled = opcionesCuotas.length === 0;
});

// Manejar el evento de envío del formulario
document.getElementById('formulario').addEventListener('submit', function (event) {
    event.preventDefault();

    // Leer el valor numérico puro del atributo de datos
    const prestamo = parseFloat(document.getElementById('prestamo').dataset.valorNumerico) || 0;
    const cuotas = parseInt(document.getElementById('cuotas').value);
    const tasaAnual = 26.8242; // Tasa fija del 26.8242% anual

    if (prestamo < 40000 || prestamo > 700000) {
        alert('El monto del préstamo debe estar entre $40,000 y $700,000.');
        return;
    }

    if (!cuotas) {
        alert('Por favor, selecciona un número válido de cuotas.');
        return;
    }

    const resultado = calcularAmortizacion(prestamo, tasaAnual, cuotas);

    // Calculando los valores para la segunda tabla (totales)
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

    // Mostrar el resultado en la página
    document.getElementById('resultado').innerHTML = `
        <h2>Resultados del Crédito</h2>
        <p><strong>Cuota Fija:</strong> ${formatoMoneda(parseFloat(resultado.cuotaFija))}</p>
        ${generarTablasHTML(resultado.tablaAmortizacion, tabla2)}
    `;
});
