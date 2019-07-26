import { createSelector } from "reselect";
import { zipObject, flatten } from "lodash";
export default function makeNetworkInfoSelector(
  ...reducerMap /*: Array<{| query: string | Array<string>, reducer: string |}> */
) {
  const queryNames = flatten(reducerMap.map(({ query }) => query));
  return createSelector(
    // Create an array of selector functions with elements for each query name specified
    flatten(
      reducerMap.map(({ reducer, query }) =>
        []
          .concat(query)
          .map(
            name => ({
              [reducer]: {
                networkInfo: { [name]: networkInfo }
              }
            }) => networkInfo
          )
      )
    ),
    // We know that all the networkInfo objects will be in the same order
    // that they were specified in
    (...networkInfos) => zipObject(queryNames, networkInfos)
  );
}
