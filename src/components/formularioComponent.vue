<template>
    <div class="container">
        <h1>Sistema de Permisos para docentes</h1>
        <div class="row">
            <!-- <form action="" id="docentes">
                <div class="col m12 card-panel">
                    <div class="col m4">
                        <label>Codigo: </label>
                        <input type="text" v-model="codigo">
                    </div>
                    <div class="col m4">
                        <label for="fecha">Fecha de Falta: </label>
                        <input type="date" v-model="permiso.fechaPermiso">
                    </div>





                    <div class="row">
                        <div class="col m3">
                            <label for="Tpermiso">Tipo de Permiso: </label><br>
                            <ul>
                                <li>
                                    <input type="radio" id="diaCompleto" value="diaCompleto" @click="setHorasFalse"
                                        name="tipoPermiso" v-model="tipoPermiso">
                                    <label for="tipoPermiso">Todo el dia</label>
                                </li>
                                <li>
                                    <input type="radio" id="medioDia" value="medioDia" name="tipoPermiso"
                                        @click="setMasDiasFalse" v-model="tipoPermiso">
                                    <label for="medioDia">Seleccionar Horas</label>
                                </li>
                            </ul>


                            <div v-if="tipoPermiso === 'diaCompleto'">
                                <div class="col m4">
                                    <label for="fecha">¿Necesitas más días de permiso?</label>
                                    <label for="fecha">Si</label>
                                    <input type="radio" id="masDias" value="true" name="masDias" v-model="masDias">
                                    <label for="fecha">No</label>
                                    <input type="radio" id="masDias" value="false" name="masDias" v-model="masDias">
                                </div>
                            </div>

                            <div v-if="masDias === 'true'">
                                <div class="row">
                                    <div class="col m3">
                                        <label for="fecha">Dia de finalización del permiso</label>
                                        <input type="date" v-model="permiso.masdiasPermiso">
                                    </div>
                                </div>
                            </div>

                            <div id="cantidadHoras" v-if="tipoPermiso === 'medioDia'">

                                <div class="row">
                                    <div class="col m3">
                                        <label for="horario">Horario de Inicio de Permiso</label>
                                        <input type="time" v-model="permiso.horarioInicio">
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col m3">
                                        <label for="horario">Horario de Fin de Permiso</label>
                                        <input type="time" v-model="permiso.horarioFin">
                                    </div>
                                </div>
                            </div>

                            <div id="motivoPermiso">
                                <label for="horas">Motivo del Permiso </label> <br>
                                <select name="horas" id="horas" v-model="idMotivo">
                                    <option value="1"> FRACCION l. Incapacidad medica (IMSS)</option>
                                    <option value="2"> FRACCION ll. Permiso 4 dias con goce de salario</option>
                                    <option value="3"> FRACCION lll. Permiso 8 dias habiles con goce de salario</option>
                                    <option value="4"> FRACCION lV. Permiso pormotivos personales</option>
                                    <option value="5"> FRACCION V. Permiso economico durante del ciclo escolar</option>
                                    <option value="6"> FRACCION Vl. Permiso o licencia para asisteir a seminarios,
                                        foros, congresos</option>
                                    <option value="7"> Otro motivo</option>
                                </select>
                            </div>


                            <div v-if="idMotivo === '7'">
                                <label for="otroMotivo">Escribe el motivo del permiso</label>
                                <textarea name="" id="" cols="0" rows="5" v-model="FraClausula"></textarea>
                            </div>


                        </div>
                    </div>

                </div>

                <div>
                    <button type="button" @click="enviarFormulario"> Enviar </button>
                </div>
            </form> -->

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
                        <input type="date" id="fechaInicio" name="fechaInicio" v-model="permiso.fechaInicio">
                    </div>
                    <div>
                        <label for="fechaFin">Fecha Fin:</label>
                        <input type="date" id="fechaFin" name="fechaFin" v-model="permiso.fechaFin">
                    </div>
                </div>
                <div id="unDia" v-if="tipoPermiso === 'uno'">
                    <h3>Seleccione el Dia del Permiso</h3>
                    <div>
                        <label for="fechaPermiso">Fecha de permiso:</label>
                        <input type="date" id="fechaPermiso" name="fechaPermiso" v-model="permiso.fechaPermiso">
                    </div>
                </div>
                <div id="variasHoras" v-if="tipoPermiso === 'horas'">
                    <h3>Seleccione el dia y horario del Permiso</h3>
                    <div>
                        <label for="fechaPerHoras">Fecha de permiso:</label>
                        <input type="date" id="fechaPerHoras" name="fechaPerHoras" v-model="permiso.fechaPermiso">
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
                        <option value="6"> FRACCION Vl. Permiso o licencia para asistir a seminarios, foros, congresos</option>
                        <option value="7"> Otro motivo</option>
                    </select>
                </div>

                <div v-if="idMotivo === '7'">
                    <label for="otroMotivo">Escribe el motivo del permiso: </label>
                    <textarea name="" id="" cols="0" rows="5"  v-model="FraClausula"></textarea>
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
            fechaInicio: '',
            fechaFin: '',
        })        

        const setValuesVoid = () => {
            permiso.value.fechaPermiso = ''
            permiso.value.horarioFin = ''
            permiso.value.horarioInicio = ''
            permiso.value.masdiasPermiso = ''
            permiso.value.fechaFin = ''
            permiso.value.fechaInicio = ''
        };

        const { generarPDF } = userForm()

        const enviarFormulario = async () => {

            try {
                if (idMotivo.value !== '7') {
                    FraClausula.value = ''
                }




                // Simulamos la peticion a los archivos CSV para consulta informacion del usuario
                const nombre = 'Ezequiel'
                const plaza = 'Estudiante'

                if (!nombre || !plaza || !codigo.value || !idMotivo.value || !permiso.value) {
                    return Swal.fire('Error', 'No pueden ir datos vacios', 'error')
                }


                // Hacemos envio de datos a la api para generarPDF           
                const { ok, body } = await generarPDF(nombre, plaza, codigo.value, idMotivo.value, FraClausula.value, permiso.value, tipoPermiso.value, masDias.value)

                if (!ok) {
                    return Swal.fire('Error', 'Revisa bien los datos proporcionados', 'error')
                }


                Swal.fire('Guardado', `Tu solicitud ha sido procedada con éxito ${body.nombreTemp}`, 'success')
            } catch (error) {
                return Swal.fire('Error', error.message, 'error')
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
            setValuesVoid
        }
    }

}
</script>

<style lang='scss' scoped></style>