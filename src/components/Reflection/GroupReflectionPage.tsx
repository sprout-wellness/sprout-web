import React, { Component } from 'react';
import { Reflection } from './Reflection';
import { firebase } from '../../FirebaseSetup';
import 'firebase/firestore';

export { GroupReflectionPage };

interface GroupReflectionPageProps {

}

interface GroupReflectionPageState {
    roomId: string,
    reflections: ReflectionEntry[]
}

type ReflectionEntry = {
    text: string,
    userId: string
}

class GroupReflectionPage extends Component<GroupReflectionPageProps, GroupReflectionPageState> {

    constructor(props: GroupReflectionPageProps) {
        super(props);
        this.state = {roomId: "1mIMXIziHIrPrx4M5Soo", reflections: []};
    }

    componentDidMount() {
        // initiate API calls here. Probably load in all of the reflections for this activityID and groupID
        // feel free to call setState() here. But best to set state in constructor!

        // update state to represent all relevant reflections
        this._fetchReflectionsAndUpdateState();
    }

    componentDidUpdate(prevProps: GroupReflectionPageProps) {
        // can call setState(), but should wrap in condition to check for state or pop changes from previous state.
        // otherwise, can result in infinite loop
    }

    componentWillUnmount() {
        // where you put cleanup stuff. You can't modify component state in this lifecycle!
    }

    private _fetchReflectionsAndUpdateState() {
        firebase
            .firestore()
            .collection('reflections')
            .where('roomId', '==', this.state.roomId)
            .get()
            .then((snapshot) => {
                snapshot.forEach((doc: firebase.firestore.DocumentData) => {
                    this.setState((prevState: GroupReflectionPageState) => {
                        return {roomId: prevState.roomId, reflections: [...prevState.reflections, doc.data()]}
                    })
                });
            });
    }

    private _createReflection(reflection: string) {
        return <Reflection reflectionText={reflection}></Reflection>;
    }

    render() {
        const reflections = [];
        for (const reflection of this.state.reflections) {
            reflections.push(this._createReflection(reflection.text));
        }
        return  (
            <div>
                <h1>Group Reflections</h1>
                {reflections}
            </div>
        )
    }

}
