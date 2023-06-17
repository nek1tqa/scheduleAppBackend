export const getSetString = paramsArr => `SET ${paramsArr.map(param => param[0] + " = '" + param[1] + "'").join(", ")}`;

