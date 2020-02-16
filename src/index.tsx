import * as React from 'react';

function enforceRuleOfHooks(debugValue?: string) {
  // Trigger useState to make sure rule of hooks is being followed when calling
  // these custom hooks.
  debugValue && React.useDebugValue(debugValue);
  return React.useState();
}

export function useProps<P>(initialProps: P | (() => P)) {
  enforceRuleOfHooks('useProps');

  if (initialProps instanceof Function) {
    return initialProps();
  }

  return initialProps;
}

export function useDerivedStateFromProps<P, S>(
  props: P,
  mapPropsToState: (props: P) => S
): S {
  enforceRuleOfHooks('useProps');

  return mapPropsToState(props);
}

export function useRenderProps<P>(
  props: P
): (callback: (props: P) => JSX.Element) => JSX.Element {
  React.useDebugValue('useRenderProps');

  return React.useCallback((callback: (props: P) => JSX.Element) => {
    return callback(props);
  }, Object.values(props));
}

const GlobalContextProvider = React.createContext(globalThis);
export function useGlobalContext(): typeof globalThis {
  React.useDebugValue('useGlobalContext');

  return React.useContext(GlobalContextProvider);
}

type ReactClassInstance<S> = {
  state: S;
  setState: (newState: Partial<S>) => void;
};

export function useConstructor<S = any>(
  constructorFn: (this: ReactClassInstance<S>) => void
): ReactClassInstance<S> {
  React.useDebugValue('useConstructor');

  const [state, setState] = React.useState({} as S);
  const [isConstructed, setConstructed] = React.useState(false);
  const classInstance = new Proxy(
    {},
    {
      set: (_obj: any, prop: string, value: any) => {
        if (prop === 'state') {
          setState(value as S);
        }
        return true;
      },
    }
  );

  if (!isConstructed) {
    constructorFn.call(classInstance);
    setConstructed(true);
  }

  return {
    state,
    setState: newState => setState(state => Object.assign({}, state, newState)),
  };
}
