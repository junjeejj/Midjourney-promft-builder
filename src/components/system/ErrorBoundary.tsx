import React from "react";



type Props = { children: React.ReactNode };

type State = { hasError: boolean; error?: any };



export default class ErrorBoundary extends React.Component<Props, State> {

  constructor(props: Props) {

    super(props);

    this.state = { hasError: false, error: undefined };

  }

  static getDerivedStateFromError(error: any) {

    return { hasError: true, error };

  }

  componentDidCatch(error: any, info: any) {

    console.error("[ErrorBoundary]", error, info);

  }

  render() {

    if (this.state.hasError) {

      return (

        <div style={{ padding: 16 }}>

          <h2>앗, 오류가 발생했어요.</h2>

          <pre style={{ whiteSpace: "pre-wrap" }}>

            {String(this.state.error)}

          </pre>

        </div>

      );

    }

    return this.props.children;

  }

}
