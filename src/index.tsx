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
  mapStateToProps: (props: P) => S
): S {
  enforceRuleOfHooks('useProps');
  return mapStateToProps(props);
}

export function useRenderProps<P>(
  props: P
): (callback: (props: P) => JSX.Element) => JSX.Element {
  React.useDebugValue('useRenderProps');

  return React.useCallback((callback: (props: P) => JSX.Element) => {
    return callback(props);
  }, Object.values(props));
}

export function useGlobalContext(): typeof globalThis {
  enforceRuleOfHooks('useGlobalContext');
  return globalThis;
}
