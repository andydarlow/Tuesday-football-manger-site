import _ from 'lodash'

/**
 *  Replace all elements in list that match replacePredicate. This
 *  does not mutate the list passed into the function
 *
 *  @param {Collection} list the list you want to replace elements in
 *  @param {Object}  replacement replaces elements in the list with this value
 *  @param {function} replacePredicate X=>... replaces the element when ever this returns true for a element
 */
const replaceAll = (list, replacement, replacePredicate) => {
  if (_.isEmpty(list)) return []
  let nextItemInList = replacePredicate(_.head(list)) ? replacement : _.head(list)
  return _.concat(nextItemInList, replaceAll(_.tail(list), replacement, replacePredicate))
}

const operationOrDefault = (listOp, list, defaultValue) => listOp(list) ? listOp(list) : defaultValue

const firstOrDefault = _.partial(operationOrDefault, _.first)

export {replaceAll, firstOrDefault}
