export const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  clip: 'rect(0 0 0 0)',
};

export function emptyRows(page, rowsPerPage, arrayLength) {
  return page ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}

function descendingComparator(a, b, orderBy) {
  const nestedOrderBy = orderBy.split('.');

  let aValue = a;
  let bValue = b;

  for (let i = 0; i < nestedOrderBy.length; i += 1) {
    const key = nestedOrderBy[i];
    aValue = aValue[key];
    bValue = bValue[key];
  }

  if (aValue === null) {
    return 1;
  }
  if (bValue === null) {
    return -1;
  }
  if (bValue < aValue) {
    return -1;
  }
  if (bValue > aValue) {
    return 1;
  }
  return 0;
}

export function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export function applyFilter({ inputData, comparator, filterName }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(quotation => {
      const searchTerm = filterName.toLowerCase();
      return (
        quotation.customer.name.toLowerCase().includes(searchTerm) ||
        quotation.status.toLowerCase().includes(searchTerm)
      );
    });
  }

  return inputData;
}
