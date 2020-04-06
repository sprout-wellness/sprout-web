import React, { Component } from 'react';
import { firebase } from '../../FirebaseSetup';
import { RoomReflectionPage } from './RoomReflectionPage'
import { Redirect } from 'react-router';

interface ReflectionSubmissionPageProps {
    userId: string;
    roomId: string;
    activityId: string;
}

interface ReflectionSubmissionPageState {
    reflectionText: string;
    submitted: boolean;
}

export class ReflectionSubmissionPage extends Component<ReflectionSubmissionPageProps, ReflectionSubmissionPageState> {
    
    constructor(props: ReflectionSubmissionPageProps) {
        super(props);
        this.state = {reflectionText: '', submitted: false};

        this.handleReflectionInputChange = this.handleReflectionInputChange.bind(this);
        this.handleReflectionInputSubmit = this.handleReflectionInputSubmit.bind(this);

    }

    handleReflectionInputChange(event: any) {
        const cachedEvent = event;
        const target = cachedEvent.target;
        this.setState( (prevState: ReflectionSubmissionPageState) => {
            return {reflectionText: target.value};
        })
    }

    handleReflectionInputSubmit(event:any) {
        // submit to db
        // redirect to group page
        event.preventDefault();
        console.log("handleReflectionInputSubmit: reflection:", this.state.reflectionText);
        firebase.firestore()
            .collection('reflections')
            .add({ 
                userId: this.props.userId,
                roomId: this.props.roomId,
                activityId: this.props.activityId,
                text: this.state.reflectionText
            })
            .then(function(docRef) {
                console.log("Document written with ID: ", docRef.id);
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
            })
        
            this.setState((prevState:ReflectionSubmissionPageState) => {
                return {reflectionText: prevState.reflectionText, submitted: true}
            });
    }

    render() {

        if (this.state.submitted) {
            return <RoomReflectionPage roomId={this.props.roomId}></RoomReflectionPage>;
        }

        return (
            <div>
                <h3>We've reached the end of the practice!</h3>
                <h3>How do you feel after completing this exercise?</h3>
                <form onSubmit={this.handleReflectionInputSubmit}>
                    <label>
                        <input type='text' value={this.state.reflectionText} onChange={this.handleReflectionInputChange} />
                    </label>
                        <button type='submit'>Submit</button>
                </form>
            </div>
        )
    }

}
