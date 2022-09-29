function unprocessableEntity(err: string): Object {
  return {
    type: 'error_unprocessable_entity',
    message: err,
  };
}

function notFound(err?: string, errPlural?: string, anotherErr?: string): object {
  return {
    type: 'error_not_found',
    message: anotherErr ?? `This ${err} was not founded, it doesn't be in ${errPlural} datas`,
  };
}

function conflict(err: string, errConflict: string): object {
  return {
    type: 'error_conflict',
    message: `This ${err} already ${errConflict}`,
  };
}

function unhautorized(err: string): object {
  return {
    type: 'error_unhautorized',
    message: `Unhautorized! ${err}`,
  };
}

function badRequest(err: string): object {
  return {
    type: 'error_bad_request',
    message: err,
  };
}

const errors = {
  unprocessableEntity,
  notFound,
  conflict,
  unhautorized,
  badRequest,
};

export default errors;
