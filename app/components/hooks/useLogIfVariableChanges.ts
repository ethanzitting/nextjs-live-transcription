import { useEffect } from "react";

export const useLogIfVariableChanges = (
  variable: any,
  variableName: string,
) => {
  useEffect(() => {
    console.log(`${variableName} changed:`, variable);
  }, [variable, variableName]);
};
