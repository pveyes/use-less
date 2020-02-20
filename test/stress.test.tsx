import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { render, fireEvent } from '@testing-library/react';
import {
  useProps,
  useDerivedStateFromProps,
  useRenderProps,
  useGlobalContext,
  useConstructor,
  useHOC,
} from '../src';

describe('useProps', () => {
  it('renders without crashing', () => {
    const Component = (props: { defaultValue: string }) => {
      const realProps = useProps(props);

      return <input {...realProps} />;
    };

    const div = document.createElement('div');
    ReactDOM.render(<Component defaultValue="X" />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('allow for lazy initializer', () => {
    const Component = (props: { defaultValue: string }) => {
      const realProps = useProps(() => props);

      return <input {...realProps} />;
    };

    const div = document.createElement('div');
    ReactDOM.render(<Component defaultValue="X" />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});

describe('uDSFP', () => {
  it('renders without crashing', () => {
    const Component = (props: { value: string }) => {
      const state = useDerivedStateFromProps(props, props => {
        return {
          value: props.value,
        };
      });

      return <input defaultValue={state.value} />;
    };

    const div = document.createElement('div');
    ReactDOM.render(<Component value="X" />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});

describe('useRenderProps', () => {
  it('renders without crashing', () => {
    const Component = (props: { value: string }) => {
      const renderProps = useRenderProps(props);

      return renderProps(props => {
        return <input defaultValue={props.value} />;
      });
    };

    const div = document.createElement('div');
    ReactDOM.render(<Component value="X" />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});

describe('useGlobalContext', () => {
  it('renders without crashing', () => {
    const Component = () => {
      const global = useGlobalContext();
      global.console.log('It works!');
      return null;
    };

    const div = document.createElement('div');
    ReactDOM.render(<Component />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});

describe('useConstructor', () => {
  it('simulate class constructor for setting initial state', async () => {
    const Component = () => {
      type State = {
        text: string;
      };

      const thіs = useConstructor<State>(function constructor() {
        this.state = {
          text: '',
        };
      });

      return (
        <>
          <label htmlFor="text">text</label>
          <input
            id="text"
            value={thіs.state.text}
            onChange={e => {
              thіs.setState({ text: e.target.value });
            }}
          />
        </>
      );
    };

    const { getByLabelText } = render(<Component />);
    const input = getByLabelText('text') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'It works!' } });
    expect(input.value).toEqual('It works!');
  });
});

describe('useHOC', () => {
  it('wraps inner component with a HoC', () => {
    type Props = {};
    type HOCProps = {
      colorScheme: 'dark' | 'white';
    };

    function withDarkMode(Component: React.ComponentType<Props & HOCProps>) {
      return function ComponentWithDarkMode(props: Props) {
        return <Component {...props} colorScheme="dark" />;
      };
    }

    function Component() {
      const renderHOC = useHOC(withDarkMode);
      return renderHOC(props => <span>{props.colorScheme}</span>);
    }

    const { container } = render(<Component />);
    const span = container.getElementsByTagName('span')[0];
    expect(span.textContent).toEqual('dark');
  });
});
