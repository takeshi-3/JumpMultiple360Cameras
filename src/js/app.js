import module1 from './modules/module1';
import React from 'react';
import ReactDOM from 'react-dom';
import "../css/style.scss";

class Input extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        alert('A name was submitted: ' + this.state.value);
        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    ID:
                    <input type="text" value={this.state.value} onChange={this.handleChange} />
                </label>
                <input type="submit" value="Submit" />
            </form>
        );
    }
}

class Node extends React.Component {
    render() {
        return (
            <div className="app_cont_node"></div>
        );
    }
}

class Control extends React.Component {
    renderNode(id) {
        return (
            <Node />
        );
    }

    render() {
        return (
            <div className="app_cont">
                <Input />
                <Node />
            </div>
        );
    }
}

class Viewer extends React.Component {
    render() {
        return (
            <div className="app_viewer">

            </div>
        );
    }
}

class App extends React.Component {
    render() {
        return (
            <div className="app">
                <Control />
                <Viewer />
            </div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);