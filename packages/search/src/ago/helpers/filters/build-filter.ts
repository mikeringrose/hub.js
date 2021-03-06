import { getProp, addDays } from "@esri/hub-common";

export function buildFilter(queryFilters: any, key: string) {
  const terms = getProp(queryFilters, `${key}.terms`) || [];
  const joinType = getProp(queryFilters, `${key}.fn`);
  // all params to AGO queries MUST be lower case, so we're going to force
  // lowerCase here because we use `orgId` for Hub index, and need it as `orgid`
  // for AGO. This will allow us to use whatever casing for Hub and still
  // adhere to AGO requirements
  let filter;
  if (joinType === "between") {
    const startDate = terms[0];
    let endDate = terms[1];
    if (startDate === endDate) {
      // add 1 day
      endDate = addDays(startDate, 1);
    }
    const timestamps = [startDate, endDate].map((term: string) =>
      new Date(term).getTime()
    );
    filter = `${key.toLowerCase()}: [${timestamps.join(agoJoin(joinType))}]`;
  } else {
    filter = terms
      .map((term: string) => `${key.toLowerCase()}:"${term}"`)
      .join(agoJoin(joinType));
  }
  if (joinType === "not") {
    // "not" filter means everything but not those given terms
    filter = `NOT ${filter}`;
  }
  return `(${filter})`;
}

// This function returns the AGO-translation for the query types
// 'any' -> ' OR '
// 'all' => ' AND '
// 'not' => ' NOT '
// ... more filters to come, like the ones below
// 'gt' => ...
// 'lt' => ...
// 'gte' => ...
// 'lte' => ...
// 'range' => ...
function agoJoin(joinType: string) {
  const key = joinType || "any";
  const joinMap: { [key: string]: string } = {
    any: " OR ",
    all: " AND ",
    not: " NOT ",
    between: " TO "
  };
  return joinMap[key];
}
