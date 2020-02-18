import React from 'react';
import ReactDOM from 'react-dom';
import "../css/style.scss";
import anime from 'animejs';

/*-------------------------------
  Search Form 
--------------------------------*/
class Input extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleChange(e) {
        this.props.onValueChange(e.target.value);
    }

    handleClick() {
        this.props.onSearch();
        event.preventDefault();
    }

    render() {
        return (
            <form className="app_cont_input" onSubmit={(e) => {e.preventDefault();}}>
                <input type="text" placeholder="Input node ID" value={this.props.value} onChange={this.handleChange} />
                <input type="submit" value="" onClick={this.handleClick} />
            </form>
        );
    }
}

/*--------------------------------
  Node Block on Control Panel
--------------------------------*/
class Node extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sound: false,   // sound on/Off
            mic: false      // mic on/Off
        };
        this.soundToggle = this.soundToggle.bind(this);
        this.micToggle = this.micToggle.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    soundToggle() {
        var soundState = this.state.sound;
        this.setState({sound: !soundState});
    }

    micToggle() {
        var micState = this.state.mic;
        this.setState({mic: !micState});
    }

    handleDelete() {
        this.props.onDelete(this.props.name);
    }

    handleClick() {
        this.props.onClick(this.props.name);
    }

    render() {
        return (
            <div className={"app_cont_node " + (this.props.viewing?'app_cont_node-view':'')} name={this.props.name}>
                <div className="app_cont_node_cam" onClick={this.handleClick}></div>
                <div className="app_cont_node_info">
                    <p>Name: {this.props.name}</p>
                    <p>Res: 0000 x 0000</p>
                </div>
                <div className="app_cont_node_btn">
                    <div className="app_cont_node_audio">
                        <img className="app_cont_node_sound" src={"../img/sound_" + (this.state.sound ? "on":"off") + ".svg"} onClick={this.soundToggle} />
                        <img className="app_cont_node_mic" src={"../img/mic_" + (this.state.mic ? 'on' : 'off') + ".svg"} onClick={this.micToggle} />
                    </div>
                    <img className="app_cont_node_del" src={"../img/delete.svg"} onClick={this.handleDelete} />
                </div>
            </div>
        );
    }
}

/*--------------------------------
  Control Panel 
  on the Left of viewer
--------------------------------*/
// Parameters for Hide & Show the control panel
const controlAnimeStates = {
    show: {opacity: 1, left: 0, rotate: 180},
    hide: {opacity: 0, left: '-20vw', rotate: 0}
};

// Component
class Control extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',          // id in search bar
            nodes: ['init'],    // manage nodes connected
            appear: true,       // show/hide state of control panel
            viewNode: 'init'    // the node name now viewing
        };
        this.handleSearch = this.handleSearch.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this);
        this.handleToggle = this.handleToggle.bind(this);
        this.handleDeleteNode = this.handleDeleteNode.bind(this);
        this.handleSwitchNode = this.handleSwitchNode.bind(this);
    }

    // When strings inputted in Input bar
    handleValueChange(value) {
        this.setState({value: value});
    }

    // When Search ID submitted
    handleSearch() {
        var nodeArray = this.state.nodes.slice();
        var nodeName = this.state.value;
        nodeArray.push(nodeName);
        this.setState({
            value: '',
            nodes: nodeArray
        });
    }

    // When Toggle Button(->) of Control Panel is pushed
    handleToggle() {
        const appear = this.state.appear;
        const animeState = controlAnimeStates[(appear)?'hide':'show'];
        // slide animation
        const controlAnime = anime.timeline();
        controlAnime
            .add({
                targets: '.app_cont',
                left: animeState.left,
                duration: 200,
                easing: 'easeInOutCubic'
            })
            .add({
                targets: '.app_cont_search',
                rotate: animeState.rotate,
                duration: 200,
                easing: 'linear',
            }, 0);
        // change the state of appearance
        this.setState({appear: !appear});
    }

    // When Delete Button(x) in Node block is pushed
    handleDeleteNode(name) {
        // create new array in which the deleted node excluded.
        const newNodes = this.state.nodes.filter(item => item !== name);

        // animation
        const deleteNodeAnime = anime.timeline({
            targets: '.app_cont_node[name="' + name + '"]',
            easing: 'easeInOutSine', 
            duration: 200
        });
        deleteNodeAnime.add({opacity: 0}).add({padding: 0,height: 0});

        // when delete animation finished, set new node array
        setTimeout(() => {
            this.setState({nodes: newNodes});
            // if viewer deleted current viewing node, the viewer automatically switched to the next node.
            if(name === this.state.viewNode) {
                this.setState({viewNode: newNodes[0]});
            }
        }, 380);
    }

    // When Node Block clicked -> Jump!
    handleSwitchNode(name) {
        this.setState({viewNode: name});
    }

    render() {
        const value = this.state.value;
        const nodeItems = this.state.nodes.map((name) => 
            <Node 
                key={name}
                name={name}
                onDelete={this.handleDeleteNode}
                onClick={this.handleSwitchNode}
                viewing={(name === this.state.viewNode)? true : false}
            />
        );
        return (
            <div className="app_cont">
                <img src="../img/arrow.svg" className="app_cont_search" onClick={this.handleToggle} />
                <div className="app_cont_wrap">
                    <Input 
                        value={value}
                        onValueChange={this.handleValueChange}
                        onSearch={this.handleSearch}
                    />
                    {nodeItems}
                </div>
            </div>
        );
    }
}

/*--------------------------------
  Viewer Area
--------------------------------*/
class Viewer extends React.Component {
    render() {
        return (
            <div className="app_viewer">
            </div>
        );
    }
}

/*--------------------------------
  App to Manage whole system
--------------------------------*/
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

/*--------------------------------
  Render
--------------------------------*/
ReactDOM.render(
    <App />,
    document.getElementById('root')
);