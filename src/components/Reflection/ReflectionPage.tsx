import React, { Component } from 'react';

interface ReflectionPageProps {
}

interface ReflectionPageState {
    roomId: string,
    reflectionText: string
}

export class ReflectionPage extends Component<ReflectionPageProps, ReflectionPageState> {
    
    constructor(props: ReflectionPageProps) {
        super(props);
        
        this.state = {roomId: '1mIMXIziHIrPrx4M5Soo', reflectionText: ''};

        this.handleReflectionInputChange = this.handleReflectionInputChange.bind(this);
        this.handleReflectionInputSubmit = this.handleReflectionInputSubmit.bind(this);

    }

    handleReflectionInputChange(event: any) {
        //this.setState( (prevState: ReflectionPageState) => {
        //    return {roomId: prevState.roomId, reflectionText: event.target.value};
        //})
    }

    handleReflectionInputSubmit(event:any) {
        // submit to db
        // redirect to group page
    }

    render() {
        return (
            <div>
                <h3>We've reached the end of the practice!</h3>
                <h3>How do you feel after completing this exercise?</h3>
                <form onSubmit={this.handleReflectionInputSubmit}>
                    <label>
                        <input type="text" value={this.state.reflectionText} onChange={this.handleReflectionInputChange} />
                    </label>
                    <b></b>
                    <input type="submit" value="Share with group" />
                </form>
            </div>
        )
    }

}
