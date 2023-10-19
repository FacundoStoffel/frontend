import React, { Component } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select'
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css'

export class InternalReservasEdit extends Component {

    constructor(props) {
        super(props)

        this.state = {
            fecha: new Date(),
            horarios: [],
            hora: null,
            id_usuario: null,
            cortes: [],
            id_corte: null,
            metodo_pago: [],
            id_pago: null,
            // cancelada: null
        }
    }

    configTosti = {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    }



    componentDidMount() {

        this.fetchHora();
        this.fetchCorte();
        this.fetchPago();
        const userId = obtenerIdUsuarioEnSesion();

        if (userId) {
            this.setState({ id_usuario: userId });
        }
    }


    fetchHora() {
        fetch('http://localhost:8080/hora')
            .then(res => {
                return res.json()
                    .then(body => {
                        return {
                            status: res.status,
                            ok: res.ok,
                            headers: res.headers,
                            body: body
                        };
                    })
            })
            .then(
                result => {
                    if (result.ok) {
                        this.setState({ horarios: result.body });
                    } else {
                        toast.error(result.body.message, this.configTosti);
                    }
                }
            )
            .catch(error => console.error('Error en la primera petición:', error));
    }


    fetchCorte() {
        fetch('http://localhost:8080/corte')
            .then(res => {
                return res.json()
                    .then(body => {
                        return {
                            status: res.status,
                            ok: res.ok,
                            headers: res.headers,
                            body: body
                        };
                    })
            })
            .then(
                result => {
                    if (result.ok) {
                        this.setState({ cortes: result.body });
                    } else {
                        toast.error(result.body.message, this.configTosti);
                    }
                }
            )
            .catch(error => console.error('Error en la primera petición:', error));
    }



    fetchPago() {
        fetch('http://localhost:8080/pago')
            .then(res => {
                return res.json()
                    .then(body => {
                        return {
                            status: res.status,
                            ok: res.ok,
                            headers: res.headers,
                            body: body
                        };
                    })
            })
            .then(
                result => {
                    if (result.ok) {
                        this.setState({ metodo_pago: result.body });
                    } else {
                        toast.error(result.body.message, this.configTosti);
                    }
                }
            )
            .catch(error => console.error('Error en la primera petición:', error));
    }



        handleSubmit = (event) => {
        event.preventDefault()

        let reserva = {
            fecha: this.state.fecha,
            hora: this.state.hora,
            id_usuario: 2,
            id_corte: this.state.id_corte,
            id_pago: this.state.id_pago,
            // cancelada: this.state.cancelada
        }

        let parametros = {
            method: 'POST',
            body: JSON.stringify(reserva),
            headers: {
                'Content-Type': 'application/json',
            }
        }
        fetch('http://localhost:8080/reservas/create', parametros)
        .then(res => {debugger
            return res.json()
                .then(body => {
                    return {
                        status: res.status,
                        ok: res.ok,
                        headers: res.headers,
                        body: body
                    };
                })
        }).then(
            result => {
                if (result.ok) {
                    toast.success(result.body.message, this.configTosti);
                    this.props.navigate("/reservas")
                } else {
                    toast.error(result.body.message, this.configTosti);
                }
            }
        ).catch(
            (error) => { console.log(error) }
        );
    }


    handleChangeFecha = (fechaSeleccionada) => {

        this.setState({ fecha: fechaSeleccionada });
    }

    handleChangeHora = (selectedOption) => {
        if (selectedOption !== null) {
            this.setState({ hora: selectedOption.value });
        } else {
            this.setState({ hora: null });
            console.log("No se ha seleccionado una hora.");
        }
    }


    handleChangeCorte = (selectedOption) => {
        if (selectedOption !== null) {
            this.setState({ id_corte: selectedOption.value });
        } else {
            this.setState({ id_corte: null });
            console.log("No se ha seleccionado un corte.");
        }
    }

    handleChangePago = (selectedOption) => {
        if (selectedOption !== null) {
            this.setState({ id_pago: selectedOption.value });
        } else {
            this.setState({ id_pago: null });
            console.log("No se ha seleccionado un metodo de pago.");
        }
    }





    render() {

        const horarios = this.state.horarios || [];
        const horarios_list = horarios.map(hora => ({
            value: hora.hora,
            label: hora.hora

        }));

        const cortes = this.state.cortes || [];
        const corte_list = cortes.map(corte => ({
            value: corte.id_corte,
            label: corte.corte_tipo

        }));

        const metodo_pago = this.state.metodo_pago || [];
        const pago_list = metodo_pago.map(pago => ({
            value: pago.id_pago,
            label: pago.metodo

        }));


        const espacio = <>&nbsp;</>;
        

        return (
            <>
                <h1>Nueva Reserva</h1>
                <form onSubmit={this.handleSubmit}>
                    <div className="col-sm-4 col-md-3">
                        <label htmlFor="fecha">Fecha: {espacio}</label>
                        <DatePicker
                            id='fecha'
                            showIcon

                            selected={this.state.fecha}
                            onChange={this.handleChangeFecha}
                            dateFormat='dd/MM/yyyy'
                            minDate={new Date()}
                        />
                    </div>
                    <label htmlFor="hora"> Hora</label>
                    <Select
                        id='hora'
                        options={horarios_list}
                        isClearable={true}
                        isSearchable={true}
                        isDisabled={false}
                        closeMenuOnSelect={true}

                        onChange={this.handleChangeHora}>

                    </Select>

                    <div className="mb-3 ">
                        <label htmlFor="corte"> Corte</label>
                        <Select
                            id='corte'
                            options={corte_list}
                            isClearable={true}
                            isSearchable={true}
                            isDisabled={false}
                            closeMenuOnSelect={true}

                            onChange={this.handleChangeCorte}>

                        </Select>

                    </div>
                    <div className="mb-3 ">
                        <label htmlFor="pago"> Metodo de pago</label>
                        <Select
                            id='pago'
                            options={pago_list}
                            isClearable={true}
                            isSearchable={true}
                            isDisabled={false}
                            closeMenuOnSelect={true}

                            onChange={this.handleChangePago}>

                        </Select>

                    </div>

                    <button type="submit" className="btn btn-primary">Guardar</button>
                </form>

            </>
        )
    }
}

function obtenerIdUsuarioEnSesion() {
    // En este ejemplo, asumimos que tienes un token JWT almacenado en el almacenamiento local (localStorage) después de iniciar sesión.
    const token = localStorage.getItem('token');

    if (token) {
        // Decodificar el token y extraer el ID del usuario
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.id_usuario;
    } else {
        // Si no hay token, el usuario no está autenticado
        return null;
    }
}


export default ReservasEdit


export function ReservasEdit() {
    const navigate = useNavigate();
    const p = useParams();
    return (
        <>
            <InternalReservasEdit navigate={navigate} params={p} />
        </>
    );
}