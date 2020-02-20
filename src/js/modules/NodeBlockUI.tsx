import * as React from 'react';
import Peer from 'skyway-js';

/*--------------------------------
  Node Block on Control Panel
--------------------------------*/
interface NodeProps {
    name: string;
    viewing: boolean;
    resolution: string;
    onDelete: (name: string) => void;
    onClick: (name: string) => void;
    onMuteChange: (name: string) => void;
}

interface NodeState {
    sound: boolean;
    mic: boolean;
}

export default class Node extends React.Component<NodeProps, NodeState> {
    constructor(props: NodeProps) {
        super(props);
        this.state = {
            sound: false,   // sound on/Off
            mic: false,      // mic on/Off
        };
        this.soundToggle = this.soundToggle.bind(this);
        this.micToggle = this.micToggle.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    soundToggle(): void {
        var soundState = this.state.sound;
        this.setState({sound: !soundState});
        this.props.onMuteChange(this.props.name);
    }

    micToggle(): void {
        var micState = this.state.mic;
        this.setState({mic: !micState});
    }

    handleDelete(): void {
        this.props.onDelete(this.props.name);
    }

    handleClick(): void {
        this.props.onClick(this.props.name);
    }

    render(): JSX.Element {
        return (
            <div className={"app_cont_node " + (this.props.viewing?'app_cont_node-view':'')} id={this.props.name}>
                <div className="app_cont_node_cam" onClick={this.handleClick}>
                    <video className="app_cont_node_video" id={"video-" + this.props.name}></video>
                </div>
                <div className="app_cont_node_info">
                    <p>Name: {this.props.name}</p>
                    <p>Res: {this.props.resolution}</p>
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