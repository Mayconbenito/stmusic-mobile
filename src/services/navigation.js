// import { NavigationActions } from 'react-navigation';

// let navigator;

// function setTopLevelNavigator(navigatorRef) {
//   navigator = navigatorRef;
// }

// function navigate(routeName, params) {
//   navigator.dispatch(
//     NavigationActions.navigate({
//       routeName,
//       params,
//     })
//   );
// }

// export default {
//   navigate,
//   setTopLevelNavigator,
// };

import * as React from 'react';

export const navigationRef = React.createRef();

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}
