import React, { Component } from 'react';
import { Reflection } from './Reflection';

export { GroupReflectionPage };

interface GroupReflectionPageProps {
    activityId?: string;
}

interface GroupReflectionPageState {
    reflectionsTexts: string[]
}



class GroupReflectionPage extends Component<GroupReflectionPageProps, GroupReflectionPageState> {

    constructor(props: GroupReflectionPageProps) {
        super(props);
        this.state = {reflectionsTexts: []};
    }

    componentDidMount() {
        // initiate API calls here. Probably load in all of the reflections for this activityID and groupID
        // feel free to call setState() here. But best to set state in constructor!

        // update state to represent all relevant reflections
        const newReflections: string[] = [];
        this._fetchReflections().forEach(
            (reflection: string) => {
                newReflections.push(reflection);
            });
        this.setState({reflectionsTexts: newReflections});
    }

    componentDidUpdate(prevProps: GroupReflectionPageProps) {
        // can call setState(), but should wrap in condition to check for state or pop changes from previous state.
        // otherwise, can result in infinite loop
    }

    componentWillUnmount() {
        // where you put cleanup stuff. You can't modify component state in this lifecycle!
    }

    private _fetchReflections(): string[] {
        // TODO
        const reflections: string[] = ["This was a very good activity!", "I though this was super helpful :)"];
        return reflections;
    }

    private _createReflection(reflection: string) {
        return <Reflection reflectionText={reflection}></Reflection>;
    }

    render() {
        //const reflections: string[] = ["This was a very good activity!", "I though this was super helpful :)"];
        
        const reflections = [];
        for (const reflectionText of this.state.reflectionsTexts) {
            reflections.push(this._createReflection(reflectionText));
        }


        return  (
            <div>
                <h1>Reflections!</h1>
                {reflections}
            </div>
        )
    }

}
