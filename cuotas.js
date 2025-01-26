// Función para calcular la tabla de amortización
function calcularAmortizacion(prestamo, tasaAnual, numCuotas) {
    const tasaMensual = Math.pow(1 + tasaAnual / 100, 1 / 12) - 1;
    const cuotaFija = ((prestamo * tasaMensual * Math.pow(1 + tasaMensual, numCuotas)) / 
                      (Math.pow(1 + tasaMensual, numCuotas) - 1));
    let saldoPendiente = prestamo;
    let tablaAmortizacion = [];

    for (let i = 0; i <= numCuotas; i++) {
        if (i === 0) {
            tablaAmortizacion.push({
                cuota: i,
                saldoInicial: saldoPendiente,
                interes: 0,
                abonoCapital: 0,
                saldoFinal: saldoPendiente,
                cuotaValor: 0
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
                cuotaValor: cuotaFija
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
                    <td>${formatoMoneda(tabla2.valorTotalPrestamo)}</td>
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
                    <th>Cuota con VFS</th>
                    <td>${formatoMoneda(tabla2.valorcuota + (tabla2.valorTotalPrestamo * 0.1) / tabla2.plazo)}</td>
                </tr>
                <tr>
                    <th>Cuota regular sin VFS</th>
                    <td>${formatoMoneda(tabla2.valorcuota)}</td>
                </tr>
                <tr>
                    <th>Valor de Fianza IVA Incluido</th>
                    <td>${formatoMoneda(tabla2.valorTotalPrestamo * 0.1)}</td>
                </tr>
                <tr>
                    <th>Valor total de intereses</th>
                    <td>${formatoMoneda(tabla2.valorTotalIntereses)}</td>
                </tr>
                <tr>
                    <th>Valor total del crédito</th>
                    <td>${formatoMoneda(tabla2.valorTotalCredito + tabla2.valorTotalPrestamo * 0.1)}</td>
                </tr>
            </tbody>
        </table>
        <!-- Primera Tabla: Amortización -->
        <table>
            <thead>
                <tr>
                    <th>Número de Cuota</th>
                    <th>Saldo Inicial</th>
                    <th>Intereses</th>
                    <th>Abono a Capital</th>
                    <th>Saldo Final</th>
                    <th>Valor de la Cuota</th>
                </tr>
            </thead>
            <tbody>
                ${tabla1.map(fila => `
                    <tr>
                        <td>${fila.cuota}</td>
                        <td>${formatoMoneda(fila.saldoInicial)}</td>
                        <td>${formatoMoneda(fila.interes)}</td>
                        <td>${formatoMoneda(fila.abonoCapital)}</td>
                        <td>${formatoMoneda(fila.saldoFinal)}</td>
                        <td>${fila.cuotaValor === 0 ? '-' : formatoMoneda(fila.cuotaValor)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Evento para actualizar las cuotas según el monto
document.getElementById('prestamo').addEventListener('input', function () {
    const prestamo = parseFloat(this.value.replace(/[.-]+/g, ''));
    const cuotasSelect = document.getElementById('cuotas');

    // Limpiar las opciones actuales del desplegable
    cuotasSelect.innerHTML = '<option value="" disabled selected>Seleccione el número de cuotas</option>';

    // Determinar las opciones de cuotas según el monto del préstamo
    let opcionesCuotas = [];
    if (prestamo >= 40000 && prestamo <= 100000) {
        opcionesCuotas = [1, 2, 3];
    } else if (prestamo >= 100001 && prestamo <= 250000) {
        opcionesCuotas = [1, 2, 3, 4];
    } else if (prestamo >= 250001 && prestamo <= 700000) {
        opcionesCuotas = [1, 2, 3, 4, 5, 6];
    }

    // Añadir las opciones válidas al desplegable
    opcionesCuotas.forEach(cuota => {
        const option = document.createElement('option');
        option.value = cuota;
        option.textContent = cuota;
        cuotasSelect.appendChild(option);
    });

    // Deshabilitar el select si el monto no está en el rango permitido
    cuotasSelect.disabled = opcionesCuotas.length === 0;
});

// Manejar el evento de envío del formulario
document.getElementById('formulario').addEventListener('submit', function (event) {
    event.preventDefault();

    const prestamo = parseFloat(document.getElementById('prestamo').value.replace(/[.-]+/g, ''));
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
