import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  useProps,
  useDerivedStateFromProps,
  useRenderProps,
  useGlobalContext,
  useConstructor,
  useHOC,
} from '../.';

type Props = {
  id: string;
};

type DarkModeProps = {
  colorScheme: 'dark' | 'light';
};

function withDarkMode(Component: React.ComponentType<DarkModeProps>) {
  return class DarkMode extends React.Component<any, DarkModeProps> {
    private media: MediaQueryList;

    state = {
      colorScheme: 'light' as const,
    };

    componentDidMount() {
      this.media = window.matchMedia('(prefers-color-scheme: dark)');
      this.setState({ colorScheme: this.media.matches ? 'dark' : 'light' });
      this.media.addEventListener('change', this.handleMediaChange);
    }

    componentWillUnmount() {
      this.media.removeEventListener('change', this.handleMediaChange);
    }

    handleMediaChange = (ev: MediaQueryListEvent) => {
      this.setState({ colorScheme: ev.matches ? 'dark' : 'light' });
    };

    render() {
      return <Component {...this.props} colorScheme={this.state.colorScheme} />;
    }
  };
}

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
  const renderHOC = useHOC(withDarkMode);

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
          {renderHOC(props => (
            <span>{`You're using ${props.colorScheme} color scheme`}</span>
          ))}
        </div>
      ))}
    </React.StrictMode>
  );
};

ReactDOM.render(<App id="app" />, document.getElementById('root'));
