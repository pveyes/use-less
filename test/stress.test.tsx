import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  useProps,
  useDerivedStateFromProps,
  useRenderProps,
  useGlobalContext,
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
