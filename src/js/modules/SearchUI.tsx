import * as React from 'react';

/*-------------------------------
  Search Form 
--------------------------------*/
interface InputProps {
    value: string;
    onValueChange: (value: string) => void;
    onSearch: (name: string) => void;
}

interface InputState {

}

export default class Input extends React.Component<InputProps, InputState> {
    constructor(props: InputProps) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
        this.props.onValueChange(e.target.value);
    }

    handleClick(): void {
        this.props.onSearch(this.props.value);
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