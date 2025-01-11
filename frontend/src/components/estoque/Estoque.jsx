import React, { Component } from 'react'
import axios from 'axios'
import Main from '../template/Main'


const headerProps = {
    icon: 'cubes',
    title: 'Gerenciamento de Estoque',
    subtitle: 'Cadastro de produtos: Incluir, Listar, Alterar e Excluir!'
}

const baseUrl = 'http://localhost:3001/estoque'
const initialState = {
    estoque: { name: '', quantity: '', price: '' },
    list: []
};

export default class Estoque extends Component {

    state = { ...initialState };

    componentWillMount() {
        axios(baseUrl).then(resp => {
            this.setState({ list: resp.data });
        });
    }

    clear() {
        this.setState({ estoque: { ...initialState.estoque } });
    }

    save() {
        const estoque = this.state.estoque;
        const method = estoque.id ? 'put' : 'post';
        const url = estoque.id ? `${baseUrl}/${estoque.id}` : baseUrl;
        axios[method](url, estoque)
            .then(resp => {
                const list = this.getUpdatedList(resp.data);
                this.setState({ estoque: { ...initialState.estoque }, list });
            });
    }

    getUpdatedList(estoque, add = true) {
        const list = this.state.list.filter(u => u.id !== estoque.id);
        if (add) list.unshift(estoque);
        return list;
    }

    updateField(event) {
        const estoque = { ...this.state.estoque };
        estoque[event.target.name] = event.target.value;
        this.setState({ estoque });
    }

    renderForm() {
        return (
            <div className="form">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Nome do Produto</label>
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={this.state.estoque.name}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o nome..."
                            />
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Quantidade</label>
                            <input
                                type="number"
                                className="form-control"
                                name="quantity"
                                value={this.state.estoque.quantity}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite a quantidade do produto..."
                            />
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Preço</label>
                            <input
                                type="number"
                                step="0.01"
                                className="form-control"
                                name="price"
                                value={this.state.estoque.price}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o preço do produto..."
                            />
                        </div>
                    </div>
                </div>

                <hr />
                <div className="row">
                    <div className="col-12 d-flex justify-content-end">
                        <button className="btn btn-primary"
                            onClick={e => this.save(e)}>
                            Salvar
                        </button>

                        <button className="btn btn-secondary ml-2"
                            onClick={e => this.clear(e)}>
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    load(user) {
        this.setState({ estoque: user })
    }

    remove(user) {
        axios.delete(`${baseUrl}/${user.id}`).then(resp => {
            const list = this.getUpdatedList(user, false)
            this.setState({ list })
        })
    }

    renderTable() {
        return (
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Quantidade</th>
                        <th>Preço</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderRows()}
                </tbody>
            </table>
        )
    }

    renderRows() {
        return this.state.list.map(estoque => {
            return (
                <tr key={estoque.id}>
                    <td>{estoque.id}</td>
                    <td>{estoque.name}</td>
                    <td>{estoque.quantity}</td>
                    <td>{estoque.price}</td>
                    <td>
                        <div style={{display: 'flex', justifyContent: 'start', alignItems: 'center', gap: '0.1rem', padding: '0px', margin: '0px' }}>
                            <button className="btn btn-warning"
                                onClick={() => this.load(estoque)}>
                                <i className="fa fa-pencil"></i>
                            </button>
                            <button className="btn btn-danger"
                                onClick={() => this.remove(estoque)}>
                                <i className="fa fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            )
        })
    }
    
    render() {
        return (
            <Main {...headerProps}>
                {this.renderForm()}
                {this.renderTable()}
            </Main>
        )
    }
}