import React, { Component } from 'react';


interface ReflectionProps {
    reflectionText: string;
    userId?: string;
    roomId?: string;
    activityId?: string;
}

export class Reflection extends Component<ReflectionProps, {}> {
    
    constructor(props: ReflectionProps) {
        super(props);
        this.state = {};
    }
    
    render() {
        return  (
            <div>
                <p>{this.props.reflectionText}</p>
             </div>
        )
    }
    
}
