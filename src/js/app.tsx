import Control from './modules/ControlUI';
import Viewer from './modules/ViewerUI';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Peer from 'skyway-js';
import anime from'animejs';
import "../css/style.scss";

/*--------------------------------
  App to Manage whole system
--------------------------------*/
interface AppProps {
    
}

interface AppState {
    value: string;
    nodes: string[];
    viewing: string;
    resolutions: {[name: string]: string};
    peers: {[name: string]: Peer};
    calls: {[name: string]: MediaConnection};
    streams: {[name: string]: HTMLVideoElement};
    dataconnections: {[name: string]: DataConnection};
}

class App extends React.Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);
        this.state = {
            value: '',
            nodes: [],
            viewing: '',
            resolutions: {},
            peers: {},
            calls: {},
            streams: {},
            dataconnections: {},
        };
        this.handlePeerConnection = this.handlePeerConnection.bind(this);
        this.handlePeerDelete = this.handlePeerDelete.bind(this);
        this.handlePeerSwitch = this.handlePeerSwitch.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this);
        this.handleMuteChange = this.handleMuteChange.bind(this);
    }

    handlePeerConnection(name: string): void {
        let peer: Peer = new Peer({
            key: 'bb5c20fc-fdf4-4db1-b084-d5286215bbb1',
            debug: 3
        });
    
        // Successfully connected Signaling Server
        peer.on('open',  () => {
            const newCall = peer.call(name, null, {
                videoReceiveEnabled: true,
                audioReceiveEnabled: true
            });
    
            newCall.on('stream', (stream) => {
                const video = (document.querySelector('#video-' + name) as HTMLVideoElement);
                video.srcObject = stream;
                video.muted = true;
                video.play();

                // allocate stream
                let streams: {[name: string]: HTMLVideoElement} = Object.create(this.state.streams);
                streams[name] = video;
                this.setState({streams: streams});

                // allocate resolution
                setInterval(() => {
                    let resolutions: {[name: string]: string} = Object.create(this.state.resolutions);
                    resolutions[name] = video.videoWidth + ' x ' +  video.videoHeight;
                    this.setState({resolutions: resolutions});
                }, 500);

                // set first node
                if(nodes.length === 1) this.handlePeerSwitch(name);
            });


            // allocate this peer
            let calls = Object.create(this.state.calls);
            let peers = Object.create(this.state.peers);
            let nodes = this.state.nodes.slice();
            let dConnect: DataConnection = peer.connect(name);
            const dataconnections = Object.create(this.state.dataconnections);
            calls[name] = newCall;
            peers[name] = peer;
            dataconnections[name] = dConnect;
            nodes.push(name);
            this.setState({calls: calls, peers: peers, nodes: nodes, dataconnections: dataconnections});
        });

        // Failed to connect signaling server
        peer.on('error', (err) => {
            console.log(err.message);
            alert('peer ' + name + ' was not found');
            this.handlePeerDelete(name);
        });

        this.setState({value: ''});
    }

    handlePeerDelete(name: string): void {
        // animation
        anime({
            targets: '#' + name,
            easing: 'easeInOutSine', 
            opacity: {value: 0, duration: 200},
            padding: {value: 0, duration: 200, delay: 200},
            height: {value: 0, duration: 200, delay: 200}
        });

        // when delete animation finished, remove node states
        setTimeout(() => {
            let calls: {[name: string]: MediaConnection} = Object.create(this.state.calls);
            let peers: {[name: string]: Peer} = Object.create(this.state.peers);
            let nodes: string[] = this.state.nodes.filter(item => item !== name);
            let streams: {[name: string]: HTMLVideoElement} = Object.create(this.state.streams);
            let dataconnections: {[name: string]: DataConnection} = Object.create(this.state.dataconnections);
            calls[name].close();
            peers[name].disconnect();
            dataconnections[name].close();
            delete calls.name;
            delete peers.name;
            delete streams.name;
            delete dataconnections.name;
            this.setState({calls: calls, peers: peers, nodes: nodes, streams: streams, dataconnections: dataconnections});

            // if viewer deleted current viewing node, the viewer automatically switched to the next node.
            if(name === this.state.viewing && nodes.length > 0) {
                if(nodes.length > 0) this.handlePeerSwitch(this.state.nodes[0]);
            }
        }, 380);
    }

    // When Node Block clicked -> Jump!
    handlePeerSwitch(name: string): void {
        const prevViewing: string = this.state.viewing;
        const dataconnections: {[name: string]: DataConnection} = Object.create(this.state.dataconnections);
        dataconnections[prevViewing].send(JSON.stringify({"behere": false}));
        dataconnections[name].send(JSON.stringify({"behere":true}));
        this.setState({viewing: name});
    }

    handleValueChange(value: string): void {
        this.setState({value: value});
    }

    handleMuteChange(name: string) {
        const streams = Object.create(this.state.streams);
        streams[name].muted = !streams[name].muted;
        this.setState({streams: streams});
    }

    render(): JSX.Element {
        return (
            <div className="app">
                <Control 
                    viewing={this.state.viewing}
                    nodes={this.state.nodes}
                    value={this.state.value}
                    resolutions={this.state.resolutions}
                    onSearch={this.handlePeerConnection}
                    onNodeJump={this.handlePeerSwitch}
                    onNodeDelete={this.handlePeerDelete}
                    onValueChange={this.handleValueChange}
                    onMuteChange={this.handleMuteChange}
                />
                <Viewer
                    viewing={this.state.viewing}
                    viewerVideo={this.state.streams[this.state.viewing]}
                />
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

var localStream: MediaStream = null;
const getMedia = (): void => {
    const constraints: MediaStreamConstraints = {
        audio: false,
        video: {
            width: {ideal: 3008},
            height: {ideal: 1504}
        }
    };
    navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
            (document.querySelector('.app_viewer_video') as HTMLVideoElement).srcObject = stream;
            localStream = stream;
        }).catch((error) => {
            console.error('mediaDevices.getUserMedia() error:', error);
            return;
        });
}