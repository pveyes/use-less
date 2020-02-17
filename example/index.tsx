import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  useProps,
  useDerivedStateFromProps,
  useRenderProps,
  useGlobalContext,
  useConstructor,
} from '../.';

type Props = {
  id: string;
};
const App = (appProps: Props) => {
  const realProps = useProps(appProps);
  const state = useDerivedStateFromProps(realProps, props => ({
    id: props.id,
  }));
  const renderProps = useRenderProps(state);
  const { console: sys } = useGlobalContext();
  const thіs = useConstructor<{ text: string }>(function constructor() {
    this.state = {
      text: '',
    };
  });

  sys.log('It works!');
  return (
    <React.StrictMode>
      {renderProps(props => (
        <div>
          <main id={props.id} />
          <input
            value={thіs.state.text}
            onChange={e => thіs.setState({ text: e.target.value })}
          />
        </div>
      ))}
    </React.StrictMode>
  );
};

ReactDOM.render(<App id="app" />, document.getElementById('root'));
