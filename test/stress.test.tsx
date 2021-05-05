import '@testing-library/jest-dom';
import * as React from 'react';
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
    const Component = (props: React.PropsWithChildren<{}>) => {
      const actualProps = useProps(props);

      return <div {...actualProps} />;
    };

    const { getByText } = render(
      <Component>
        <strong>It works!</strong>
      </Component>
    );
    expect(getByText('It works!')).toBeInTheDocument();
  });

  it('allow for lazy initializer', () => {
    const Component = (props: { text: string }) => {
      const realProps = useProps(() => props);

      return <h1>{realProps.text}</h1>;
    };

    const { getByText } = render(<Component text="Hello, world!" />);
    expect(getByText('Hello, world!')).toBeInTheDocument();
  });
});

describe('useDerivedStateFromProps', () => {
  it('derives state', () => {
    const Component = (props: { message: string }) => {
      const state = useDerivedStateFromProps(props, props => {
        return {
          text: props.message,
        };
      });

      return <div>Text: {state.text}</div>;
    };

    const { getByText } = render(<Component message="derived state" />);
    expect(getByText(/Text:/)).toHaveTextContent('derived state');
  });
});

describe('useRenderProps', () => {
  it('forward props', () => {
    const Component = (props: { value: string }) => {
      const renderProps = useRenderProps(props);

      return renderProps(props => {
        return (
          <form>
            <label htmlFor="renderProps">Render Props</label>
            <input id="renderProps" defaultValue={props.value} />
          </form>
        );
      });
    };

    const { getByLabelText } = render(<Component value="render value" />);
    const input = getByLabelText('Render Props') as HTMLInputElement;
    expect(input.value).toEqual('render value');
  });
});

describe('useGlobalContext', () => {
  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => void 0);
  });

  afterAll(() => {
    // @ts-ignore
    console.log.mockRestore();
  });

  it('renders without crashing', () => {
    const Component = () => {
      const {
        console: { log },
      } = useGlobalContext();
      React.useEffect(() => {
        log('It works!');
      }, []);
      return null;
    };

    render(<Component />);

    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith('It works!');
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
      colorScheme: 'dark' | 'light';
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
