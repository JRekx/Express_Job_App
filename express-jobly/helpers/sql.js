/**
 * Converts data to update and jsToSql mappings into a partial update query.
 *
 * Generates the SET clauses for updating columns based on the keys in
 * dataToUpdate and uses jsToSql to map the JavaScript column names to
 * database column names.
 *
 * Throws a BadRequestError if no data provided to update.
 */
const { BadRequestError } = require("../expressError");

// THIS NEEDS SOME GREAT DOCUMENTATION.

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
