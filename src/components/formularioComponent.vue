<template>
    <div class="container">
        <h1>Sistema de Permisos para docentes</h1>
        <div class="row">
            <form id="myForm">
                <div>
                    <label for="codigo">Codigo:</label>
                    <input type="text" id="codigo" name="codigo" v-model="codigo" @input="validateInput" required>
                    <p class="error" v-if="errorMessage" style="color:red ">{{ errorMessage }}</p>
                </div>
                <div>
                    <label for="tipoPermiso">Tipo de Permiso:</label>
                    <select id="tipoPermiso" name="permiso" v-model="tipoPermiso" @click="setValuesVoid">
                        <option value="" selected></option>
                        <option value="varios">Varios dias</option>
                        <option value="uno">Un dia</option>
                        <option value="horas">Unas horas</option>
                    </select>
                </div>
                <div id="variosDias" v-if="tipoPermiso === 'varios'">
                    <h3>Seleccione los dias del Permiso</h3>
                    <div>
                        <label for="fechaInicio">Fecha Inicio:</label>
                        <input type="date" @change="obtenerDiaDeLaFecha" id="fechaInicio" name="fechaInicio"
                            v-model="permiso.fechaInicio">
                    </div>
                    <div>
                        <label for="fechaFin">Fecha Fin:</label>
                        <input type="date" @change="obtenerDiaDeLaFechaFin" id="fechaFin" name="fechaFin"
                            v-model="permiso.fechaFin">
                    </div>
                </div>
                <div id="unDia" v-if="tipoPermiso === 'uno'">
                    <h3>Seleccione el Dia del Permiso</h3>
                    <div>
                        <label for="fechaPermiso">Fecha de permiso:</label>
                        <input type="date" id="fechaPermiso" @change="obtenerDiaDeLaFechaPermiso" name="fechaPermiso"
                            v-model="permiso.fechaPermiso">
                    </div>
                </div>
                <div id="variasHoras" v-if="tipoPermiso === 'horas'">
                    <h3>Seleccione el dia y horario del Permiso</h3>
                    <div>
                        <label for="fechaPerHoras">Fecha de permiso:</label>
                        <input type="date" id="fechaPerHoras" @change="obtenerDiaDeLaFechaPermiso" name="fechaPerHoras"
                            v-model="permiso.fechaPermiso">
                    </div>
                    <div>
                        <label for="horarioInicio">Horario Inicio:</label>
                        <input type="time" id="horarioInicio" name="horarioInicio" v-model="permiso.horarioInicio">
                    </div>
                    <div>
                        <label for="horarioFin">Horario Fin:</label>
                        <input type="time" id="horarioFin" name="horarioFin" v-model="permiso.horarioFin">
                    </div>
                </div> <br>
                <div id="motivoPermiso">
                    <label for="horas">Motivo del Permiso: </label>
                    <select name="horas" id="horas" v-model="idMotivo">
                        <option value="1"> FRACCION l. Incapacidad médica (IMSS)</option>
                        <option value="2"> FRACCION ll. Permiso 4 días hábiles con goce de salario</option>
                        <option value="3"> FRACCION lll. Permiso 8 dias hábiles con goce de salario</option>
                        <option value="4"> FRACCION lV. Permiso por motivos personales</option>
                        <option value="5"> FRACCION V. Permiso ecónomico durante bel ciclo escolar</option>
                        <option value="6"> FRACCION Vl. Permiso o licencia para asistir a seminarios, foros, congresos
                        </option>
                        <option value="7"> Otro motivo</option>
                    </select>
                </div>

                <div v-if="idMotivo === '7'">
                    <label for="otroMotivo">Escribe el motivo del permiso: </label>
                    <textarea name="" id="" cols="0" rows="5" v-model="FraClausula"></textarea>
                </div>

                <div>
                    <input type="button" value="Enviar" @click="enviarFormulario">
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue'

import Swal from 'sweetalert2'
import userForm from '@/composable/userForm.js'
import validacionesFecha from '@/helpers/validacionesFecha';


export default {


    setup() {

        

        let errorMessage = ref('')
        let codigo = ref('')
        let idMotivo = ref('')
        let FraClausula = ref('')
        let tipoPermiso = ref('')
        let masDias = ref(false)
        const permiso = ref({
            fechaPermiso: '',
            horarioInicio: '',
            horarioFin: '',
            masdiasPermiso: '',
            diaDeLaSemanaInicio: '',
            diaDeLaSemanaFin: '',
            diaDeLaSemanaPermiso: '',
            fechaInicio: '',
            fechaFin: '',
            viejaFin: '',
        })
        const diasSemana = ref(['L', 'M', 'X', 'J', 'V', 'S', 'D']);
        let esDiferenteSemana = ref(false)


        const validarNumeros = () => {
            if (!/^\d+$/.test(codigo.value)) {
                alert('Por favor, ingrese solo números.');
            }
        }

        const getWeekNumber = (date) => {
            const startOfYear = new Date(date.getFullYear(), 0, 1);
            const pastDaysOfYear = (date - startOfYear) / 86400000;

            // 1st Jan is considered as week 1
            return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
        };

        const verificarSemana = () => {
            if (permiso.value.fechaInicio && permiso.value.fechaFin) {
                const inicio = new Date(permiso.value.fechaInicio);
                const fin = new Date(permiso.value.fechaFin);

                if (isSameWeek(inicio, fin)) {
                    esDiferenteSemana.value = false
                } else {
                    esDiferenteSemana.value = true
                }
            }
        };

        const isSameWeek = (date1, date2) => {
            const week1 = getWeekNumber(new Date(date1));
            const week2 = getWeekNumber(new Date(date2));

            const year1 = new Date(date1).getFullYear();
            const year2 = new Date(date2).getFullYear();

            return week1 === week2 && year1 === year2;
        };


        const validateInput = () => {
            const regex = /^\d*$/;
            if (!regex.test(codigo.value)) {
                errorMessage.value = 'Solo se permiten números.';
                codigo.value = codigo.value.replace(/\D/g, ''); // Eliminar cualquier carácter no numérico
            } else {
                errorMessage.value = '';
            }
        }

        

        const setValuesVoid = () => {
            permiso.value.fechaPermiso = ''
            permiso.value.horarioFin = ''
            permiso.value.horarioInicio = ''
            permiso.value.masdiasPermiso = ''
            permiso.value.fechaFin = ''
            permiso.value.fechaInicio = ''
            permiso.value.diaDeLaSemanaInicio = ''
            permiso.value.diaDeLaSemanaFin = ''
            permiso.value.diaDeLaSemanaPermiso = ''
        };

        const obtenerDiaDeLaFecha = () => {
            if (permiso.value.fechaInicio) {
                const fecha = new Date(permiso.value.fechaInicio);
                permiso.value.diaDeLaSemanaInicio = diasSemana.value[fecha.getDay()];
            }
        }

        const obtenerDiaDeLaFechaPermiso = () => {
            if (permiso.value.fechaPermiso) {
                const fecha = new Date(permiso.value.fechaPermiso);
                permiso.value.diaDeLaSemanaPermiso = diasSemana.value[fecha.getDay()];
            }
        }

        const obtenerDiaDeLaFechaFin = () => {
            if (permiso.value.fechaFin) {
                const fecha = new Date(permiso.value.fechaFin);
                permiso.value.diaDeLaSemanaFin = diasSemana.value[fecha.getDay()];
            }
        }

        const validarDiasem = (data, diaDeLaSemanaPermiso) => {
            let result = []
            for (const subArray of data) {
                for (const item of subArray) {
                    if (item.diasem === diaDeLaSemanaPermiso) {
                        result.push(item)
                    }
                }
            }

            return result
        };

        const getStartAndEndOfWeek = (date) => {
            date = new Date(date);
            let day = date.getDay(); // Obtener el día de la semana (0 - Domingo, 1 - Lunes, ..., 6 - Sábado)            
            let diffToMonday
            if (day == 0) {
                // Ajustar el cálculo de diffToMonday basado en la suposición de que 0 es domingo y 1 es lunes
                diffToMonday = (day === 0 ? 0 : (day === 6 ? -5 : 1 - day));

            } else {
                // Ajustar el cálculo de diffToMonday basado en la suposición de que 0 es domingo y 1 es lunes                
                diffToMonday = (day === 0 ? -6 : 0) - day;
                
            }

            const startOfWeek = new Date(date);
            startOfWeek.setDate(date.getDate() + diffToMonday);

            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 5);            

            return {
                startOfWeek: startOfWeek.toISOString().split('T')[0],
                endOfWeek: endOfWeek.toISOString().split('T')[0]
            };
        };


        const agregarDias = (diasDeLaSemanaPermiso) => {
            const diasSemanaArray = diasSemana.value;
            const inicio = diasSemana.value.indexOf(diasDeLaSemanaPermiso[0]);
            const fin = diasSemana.value.indexOf(diasDeLaSemanaPermiso[diasDeLaSemanaPermiso.length - 1]);


            let diasParaAgregar = [];

            if (inicio !== -1 && fin !== -1) {
                if (fin > inicio) {
                    diasParaAgregar = diasSemanaArray.slice(inicio + 1, fin);
                } else {
                    diasParaAgregar = diasSemanaArray.slice(inicio + 1).concat(diasSemanaArray.slice(0, fin));
                }
            }

            diasDeLaSemanaPermiso.push(...diasParaAgregar);

            return diasDeLaSemanaPermiso;
        };

        const validarVariosDiasem = (data, diasDeLaSemanaPermiso) => {
            let result = [];
            for (const subArray of data) {
                for (const item of subArray) {
                    if (diasDeLaSemanaPermiso.includes(item.diasem)) {
                        result.push(item);
                    }
                }
            }



            return result;
        };

        const extraerNombreMateria = (data, materiasSolicitadas) => {
            let result = []

            for (const subArray of data) {
                for (const item of subArray) {
                    for (const materia of materiasSolicitadas) {
                        if (item.crn_asignatura === materia.crn_asignatura) {
                            materia.nombre_asignatura = item.nombre_asignatura
                            result.push(materia)
                        }
                    }
                }
            }

            result = eliminarDuplicados(result)

            return result
        };

        const getHorarioMateria = (datosCompletosMateria) => {
            let result = []
            for (const materia of datosCompletosMateria) {
                const inicioMateria = materia.horaini_hhmm
                const finMateria = materia.horafin_hhmm
                const inicioUsuario = permiso.value.horarioInicio
                const finUsuario = permiso.value.horarioFin

                if ((inicioUsuario >= inicioMateria && inicioUsuario <= finMateria) ||
                    (finUsuario >= inicioMateria && finUsuario <= finMateria) ||
                    (inicioUsuario <= inicioMateria && finUsuario >= finMateria)) {
                    result.push(materia)
                }
            }

            return result
        };

        const eliminarDuplicados = (array) => {
            const seen = new Set();
            return array.filter(item => {
                const key = `${item.clave_asignatura}-${item.horaini_hhmm}-${item.horafin_hhmm}`;
                if (seen.has(key)) {
                    return false;
                } else {
                    seen.add(key);
                    return true;
                }
            });
        };

        const getAllWeeksBetweenDates = (startDate, endDate) => {
            const weeks = [];
            let currentStartDate = new Date(startDate);



            while (currentStartDate <= new Date(endDate)) {

                const week = getStartAndEndOfWeek(currentStartDate);

                weeks.push(week);

                // Avanzar al inicio de la próxima semana
                currentStartDate.setDate(currentStartDate.getDate() + 7);
            }

            return weeks;
        };




        const { generarPDF, obtenerDatosProfesores, obtenerDataASignacion, processAsignaturas, processCrnAsignaturas, obtenerFirmantes } = userForm()

        const { permisoVariasSemanas } = validacionesFecha()

        const enviarFormulario = async () => {

            try {
                if (idMotivo.value !== '7') {
                    FraClausula.value = ''
                }

                if (!codigo.value || !idMotivo.value || !permiso.value) {
                    return Swal.fire('Error', 'No pueden ir datos vacios', 'error')
                }

                Swal.fire({
                    icon: 'info',
                    title: 'Procesando la información',
                    allowOutsideClick: false,
                    showConfirmButton: false,

                });


                //Se obtienen los datos del docente

                const dataProfesor = await obtenerDatosProfesores(codigo.value)

                if (dataProfesor.ok === false) {
                    return Swal.fire('Error', 'No se pudieron obtener los datos del maestro', 'error')
                }

                const { prof_adsqcripcion, prof_ap1, prof_ap2, prof_email1, prof_nombre, prof_plaza } = dataProfesor.body[0]

                const nombre = prof_nombre + ' ' + prof_ap1 + ' ' + prof_ap2

                const plaza = prof_plaza

                const correo = prof_email1

                const adsqcripcion = prof_adsqcripcion





                // Se obtienen los datos de las asignaciones del docente
                const dataAsingancion = await obtenerDataASignacion(codigo.value)

                if (dataAsingancion.ok === false) {
                    return Swal.fire('Error', 'No se pudieron obtener los datos de las asignaturas', 'error')
                }



                // Se obtiene el horario de las asignaturas
                let asignaturasHorario = []
                await processAsignaturas(dataAsingancion).then(results => {
                    asignaturasHorario = results
                }).catch(error => {
                    return Swal.fire('Error', error, 'error')
                });



                // Se obtiene el nombre de las asignaturas
                let asignaturasNombre = []
                await processCrnAsignaturas(asignaturasHorario).then(results => {
                    asignaturasNombre = results
                }).catch(error => {
                    return Swal.fire('Error', error, 'error')
                });


                let diasSolicitados = []
                let datosCompletosMateria = []
                let permisoVariosDias = []

                switch (tipoPermiso.value) {
                    case 'uno':
                        diasSolicitados = validarDiasem(asignaturasHorario, permiso.value.diaDeLaSemanaPermiso);
                        datosCompletosMateria = extraerNombreMateria(asignaturasNombre, diasSolicitados)
                        break;

                    case 'horas':
                        diasSolicitados = validarDiasem(asignaturasHorario, permiso.value.diaDeLaSemanaPermiso);
                        datosCompletosMateria = extraerNombreMateria(asignaturasNombre, diasSolicitados)
                        datosCompletosMateria = getHorarioMateria(datosCompletosMateria)

                        break;

                    case 'varios':
                        permisoVariosDias.push(permiso.value.diaDeLaSemanaInicio)
                        permisoVariosDias.push(permiso.value.diaDeLaSemanaFin)
                        permisoVariosDias = agregarDias(permisoVariosDias)
                        permisoVariosDias = validarVariosDiasem(asignaturasHorario, permisoVariosDias)
                        datosCompletosMateria = extraerNombreMateria(asignaturasNombre, permisoVariosDias)
                        verificarSemana()

                        break;

                    default:
                        break;
                }

                if (datosCompletosMateria.length == 0) {
                    return Swal.fire({
                        icon: 'info',
                        title: 'Atención',
                        text: 'La incidencia no pudo ser generada debido a que no se tienen actividades en las fechas/horas seleccionadas. Favor de verificar.',

                    });
                }


                const firmantes = await obtenerFirmantes()

                let cantidadSemanas
                if (esDiferenteSemana.value == true) {
                    cantidadSemanas = getAllWeeksBetweenDates(permiso.value.fechaInicio, permiso.value.fechaFin)
                    console.log(cantidadSemanas);
                    return
                } else {
                    cantidadSemanas = []
                }







                // Hacemos envio de datos a la api para generarPDF  
                let resp
                if (cantidadSemanas.length > 0) {
                    permiso.value.viejaFin = permiso.value.fechaFin                    
                    for (let i = 0; i < cantidadSemanas.length; i++) {

                        let { nuevoPermiso,
                            nuevotipoPermiso } = await permisoVariasSemanas(i, permiso.value, cantidadSemanas, tipoPermiso.value)

                            console.log(nuevoPermiso);
                            console.log(nuevotipoPermiso);

                        resp = await generarPDF(
                            nombre,
                            plaza,
                            codigo.value,
                            idMotivo.value,
                            FraClausula.value,
                            nuevoPermiso,
                            nuevotipoPermiso,
                            correo,
                            adsqcripcion,
                            diasSolicitados,
                            datosCompletosMateria,
                            firmantes
                        );
                    }

                } else {
                    // Caso cuando no hay semanas en cantidadSemanas
                    resp = await generarPDF(
                        nombre,
                        plaza,
                        codigo.value,
                        idMotivo.value,
                        FraClausula.value,
                        permiso.value,
                        tipoPermiso.value,
                        correo,
                        adsqcripcion,
                        diasSolicitados,
                        datosCompletosMateria,
                        firmantes
                    );

                    // Manejar la respuesta si es necesario
                    if (resp.error) {
                        console.error(`Error al generar el PDF:`, resp.error);
                    }
                }


                const { data } = resp

                if (!data) {
                    return Swal.fire('Error', `Revisa bien los datos proporcionados ${resp}`, 'error')
                }
                if (data.ok == false) {
                    return Swal.fire('Error', `Revisa bien los datos proporcionados ${data.body}`, 'error')
                }

                // 
                Swal.fire({
                    title: 'Guardado',
                    text: 'El formato de incidencia está en tu correo: favor de imprimirlo, firmarlo y entregarlo al Departamento con los anexos necesarios en el plazo indicado en la normativa',
                    icon: 'success',
                    allowOutsideClick: true
                }).then((result) => {
                    if (result.isConfirmed || result.dismiss === Swal.DismissReason.backdrop) {
                        location.reload();
                    }
                });

            } catch (error) {
                return Swal.fire('Error', `Error inesperado ${error.message}`, 'error')
            }
        }






        return {
            //Variables
            codigo,
            idMotivo,
            FraClausula,
            tipoPermiso,
            masDias,
            permiso,
            errorMessage,




            //Funciones            
            enviarFormulario,
            setValuesVoid,
            obtenerDiaDeLaFecha,
            obtenerDiaDeLaFechaFin,
            obtenerDiaDeLaFechaPermiso,
            validateInput,
            validarNumeros
        }

    }
}
</script>

<style lang='scss' scoped></style>
