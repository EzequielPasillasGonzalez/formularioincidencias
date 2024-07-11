<template>
    <div class="container">
        <h1>Sistema de Permisos para docentes</h1>
        <div class="row">
            <form id="myForm">
                <div>
                    <label for="codigo">Codigo:</label>
                    <input type="text" id="codigo" name="codigo" v-model="codigo" />
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

export default {
    setup() {

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
        })
        const diasSemana = ref(['L', 'M', 'X', 'J', 'V', 'S', 'D']);

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
            const seen = {};
            return array.filter(item => {
                if (seen[item.clave_asignatura]) {
                    return false;
                } else {
                    seen[item.clave_asignatura] = true;
                    return true;
                }
            });
        };


        const { generarPDF, obtenerDatosProfesores, obtenerDataASignacion, processAsignaturas, processCrnAsignaturas, obtenerFirmantes } = userForm()

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
                        break;

                    default:
                        break;
                }


                const firmantes = await obtenerFirmantes()




                // Hacemos envio de datos a la api para generarPDF           
                const resp = await generarPDF(
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
                )

                const { data } = resp

                if (!data) {
                    return Swal.fire('Error', `Revisa bien los datos proporcionados ${resp}`, 'error')
                }
                if (data.ok == false) {
                    return Swal.fire('Error', `Revisa bien los datos proporcionados ${data.body}`, 'error')
                }

                // 
                Swal.fire('Guardado', `Tu solicitud ha sido procesada con éxito ${data.body.nombreTemp}`, 'success')
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


            //Funciones            
            enviarFormulario,
            setValuesVoid,
            obtenerDiaDeLaFecha,
            obtenerDiaDeLaFechaFin,
            obtenerDiaDeLaFechaPermiso
        }
    }

}
</script>

<style lang='scss' scoped></style>