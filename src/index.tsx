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
