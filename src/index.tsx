import * as React from 'react';
import { useRef } from 'react';

function debugObjectValue(props: Record<string, any>): string {
  return Object.entries(props)
    .map(([k, v]) => {
      if (k === 'children') {
        return `${k}: ${debugComponentName(v)}`;
      }

      if (v !== null && typeof v === 'object') {
        return `${k}: ${debugObjectValue(v)}`;
      }

      return `${k}: ${v}`;
    })
    .join(', ');
}

export function useProps<P>(initialProps: P | (() => P)) {
  // leverage useState lazy initializer & enforce rule of hooks
  const [actualProps] = React.useState(initialProps);
  React.useDebugValue('actualProps: ' + debugObjectValue(actualProps));
  return actualProps;
}

export function useDerivedStateFromProps<P, S>(
  props: P,
  mapPropsToState: (props: P) => S
): S {
  // use useState to enforce rule of hooks
  const [state] = React.useState(mapPropsToState(props));
  React.useDebugValue('derivedState: ' + debugObjectValue(state));
  return state;
}

const GlobalContextProvider = React.createContext(globalThis);
type GlobalContext = typeof globalThis;
export function useGlobalContext(): GlobalContext {
  React.useDebugValue('useGlobalContext');

  return React.useContext(GlobalContextProvider);
}

interface ReactClassInstance<S> {
  state: S;
  setState: (newState: Partial<S>) => void;
}

export function useConstructor<S = any>(
  constructorFn: (this: ReactClassInstance<S>) => void
): ReactClassInstance<S> {
  const [state, setState] = React.useState({} as S);
  const isConstructed = React.useRef<boolean>();
  const classInstance = new Proxy(
    {},
    {
      set: (_obj: any, prop: string, value: S) => {
        if (prop === 'state') {
          setState(value);
        }
        return true;
      },
    }
  );

  if (!isConstructed.current) {
    constructorFn.call(classInstance);
    isConstructed.current = true;
  }

  React.useDebugValue('constructorState: ' + debugObjectValue(state));
  return {
    state,
    setState: newState => setState(state => Object.assign({}, state, newState)),
  };
}

function debugComponentName(Component: any) {
  return Component.displayName || Component.name;
}

export function useRenderProps<P>(
  props: P
): (callback: (props: P) => JSX.Element) => JSX.Element {
  React.useDebugValue('renderProps: ' + debugObjectValue(props));

  return React.useCallback((callback: (props: P) => JSX.Element) => {
    return callback(props);
  }, Object.values(props));
}

export function useHOC<T>(
  HOC: (Component: React.ComponentType<T>) => React.ComponentType
): (FunctionComponent: React.FunctionComponent<T>) => JSX.Element {
  React.useDebugValue('hoc: ' + debugComponentName(HOC));

  return React.useCallback(
    (FunctionComponent: React.FunctionComponent<T>) => {
      const Component = HOC(FunctionComponent);
      return <Component />;
    },
    [HOC]
  );
}

// A hook that returns a ref to the component and the instantiated JSX.Element.
// It accepts one parameter, a function that returns an instantiated JSX.Element and is passed the ref.

// Example
// const [view, ref] = useComponentRef<View>(((ref) =>
//		<View ref={ref} style={{ backgroundColor: 'black', zIndex: 10000, width: '100%', height: '100%' }} />
// ))
// return <>{view}</>;

type InstantiateFunction<T> = (ref: React.MutableRefObject<T>) => JSX.Element;

export function useComponentRef<RefType>(
	instantiate: InstantiateFunction<RefType>,
): [JSX.Element, React.MutableRefObject<RefType>] {
	// Create a ref of type RefType
	const ref = useRef<RefType>();
	// Then pass that ref to the instantiate function
	const component = instantiate(ref as any);
	// Return the ref and the instantiated component
	return [component, ref as React.MutableRefObject<RefType>];
}
