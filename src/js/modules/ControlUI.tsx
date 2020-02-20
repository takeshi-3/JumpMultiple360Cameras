import * as React from 'react';
import anime from 'animejs';
import Peer from 'skyway-js';
import Input from './SearchUI';
import Node from './NodeBlockUI';

/*--------------------------------
  Control Panel 
  on the Left of viewer
--------------------------------*/
// Parameters for Hide & Show the control panel
const controlAnimeStates = {
    show: {opacity: 1, left: 0, rotate: 180},
    hide: {opacity: 0, left: '-20vw', rotate: 0}
};

interface ControlProps {
    viewing: string;
    nodes: string[];
    value: string;
    resolutions: {[name: string]: string};
    onSearch: (name: string) => void;
    onNodeJump: (name: string) => void;
    onNodeDelete: (name: string) => void;
    onValueChange: (name: string) => void;
    onMuteChange: (name: string) => void;
}

interface ControlState {
    appear: boolean;
}

// Component
export default class Control extends React.Component<ControlProps, ControlState> {
    constructor(props: ControlProps) {
        super(props);
        this.state = {
            appear: true,       // show/hide state of control panel
        };
        this.handlePanelToggle = this.handlePanelToggle.bind(this);
    }

    // When Toggle Button(->) of Control Panel is pushed
    handlePanelToggle(): void {
        const appear: boolean = this.state.appear;
        const animeState: {[key: string]: any} = controlAnimeStates[(appear)?'hide':'show'];
        // slide animation
        const controlAnime: anime.AnimeTimelineInstance = anime.timeline();
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

    render(): JSX.Element {
        const nodeItems: JSX.Element[] = this.props.nodes.map((name) => 
            <Node 
                key={name}
                name={name}
                resolution={this.props.resolutions[name]}
                onDelete={this.props.onNodeDelete}
                onClick={this.props.onNodeJump}
                viewing={(name === this.props.viewing)? true : false}
                onMuteChange={this.props.onMuteChange}
            />
        );
        return (
            <div className="app_cont">
                <img src="../img/arrow.svg" className="app_cont_search" onClick={this.handlePanelToggle} />
                <div className="app_cont_wrap">
                    <Input 
                        value={this.props.value}
                        onValueChange={this.props.onValueChange}
                        onSearch={this.props.onSearch}
                    />
                    {nodeItems}
                </div>
            </div>
        );
    }
}
