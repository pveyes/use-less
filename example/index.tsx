import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  useProps,
  useDerivedStateFromProps,
  useRenderProps,
  useGlobalContext,
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

  sys.log('It works!');
  return (
    <React.StrictMode>
      {renderProps(props => (
        <div>
          <main id={props.id} />
        </div>
      ))}
    </React.StrictMode>
  );
};

ReactDOM.render(<App id="app" />, document.getElementById('root'));
