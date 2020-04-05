import React, { Component } from 'react';

export { Reflection };

interface ReflectionProps {
    reflectionText: string;
    userId?: string;
    activityId?: string;
}

class Reflection extends Component<ReflectionProps, {}> {
    
    constructor(props: ReflectionProps) {
        super(props);
        this.state = {};
    }

    render() {
        return  (
            <div>
                <h3>Reflection</h3>
                <p>{this.props.reflectionText}</p>
             </div>
        )
    }

}
