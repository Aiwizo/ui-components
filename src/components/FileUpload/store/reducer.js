import { actionSwitch } from "./actionSwitch";
import stateLogger from "@codewell/state-logger";

export const reducer =
  ({ loglevel }) =>
  (state, action) => {
    const nextState = actionSwitch(state, action);
    if (loglevel === "DEBUG") stateLogger(state, action, nextState);
    return nextState;
  };
