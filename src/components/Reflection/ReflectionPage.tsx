import { Component } from 'react';

interface ReflectionPageProps {}

interface ReflectionPageState {
  roomId: string;
}

export class ReflectionPage extends Component<
  ReflectionPageProps,
  ReflectionPageState
> {
  constructor(props: ReflectionPageProps) {
    super(props);
    this.state = { roomId: '1mIMXIziHIrPrx4M5Soo' };
  }
}
