# use-less

React hooks that help you do what you already did, with more indirection

**Warning: this package is ready for production use because of 1.x.x version**

## Install

```sh
npm install @pveyes/use-less
```

## APIs

All the functionalities are available inside named import. Because it's written in typescript, you can be sure these hooks are free of bugs.

### `useProps`

React already provide `useState` hooks, but what if you want to use `props` instead? `use-less` provides `useProps` hooks to get your actual props:

```jsx
import { useProps } from '@pveyes/use-less';

function Component(props) {
  const actualProps = useProps(props);
  // you can finally use the actual component props
  return <div {...actualProps} />;
}
```

### `useDerivedStateFromProps`

Moving to React hooks means you lose one of the most powerful React API: `getDerivedStateFromProps` or `gDSFP` for short. Don't be afraid, we bring it back in `use-less` using `useDerivedStateFromProps` or `uDSFP` for short.

```jsx
import { useDerivedStateFromProps } from '@pveyes/use-less';

// if you're familiar with redux, you'll be familiar with this as well
function mapPropsToState(props) {
  return {
    value: props.value,
    onChange: () => void 0,
  };
}

function Component(props) {
  const state = useDerivedStateFromProps(props, mapPropsToState);
  return <input value={state.value} onChange={state.onChange} />;
}
```

### `useRenderProps`

With hooks, you see less and less render props pattern being used. `use-less` provides `useRenderProps` to help you cling to your old pattern:

```jsx
import { useRenderProps } from '@pveyes/use-less';

function Component(props) {
  const renderProps = useRenderProps(props);
  return renderProps(props => <section {...props} />);
}
```

### `useGlobalContext`

The main issue with React Context is you can only get value that the Provider gives you, or its default value. What if you want to access global value? With the rise of SSR, you need to be sure you call correct global `console` in both server and browser. With `useGlobalContext` you can access all global variable that exists in both environment.

It works in SSR and browser without any configuration!

```jsx
import { useGlobalContext } from '@pveyes/use-less';

function Component(props) {
  const { console } = useGlobalContext();
  console.log('It works!');
  return null;
}
```

## FAQ

- **Does it work with concurrent mode**

  Yes, all this hooks should work in concurrent mode. Our example uses `React.StrictMode` to make sure it works with future version of React.

- **Can I really use this in production?**

  Yes, version 1.x.x means it's already stable and ready to use in production

- **Why is it `@pveyes/use-less` and not `use-less`?**

  Because there's already `useless` npm package, and npm doesn't allow package using similar name with existing package. If you want to donate the package name, I'll be happy.

- **Is this a joke?**

  What do you think?

## License

MIT
