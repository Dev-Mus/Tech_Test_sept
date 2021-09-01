/**
 * Return a new list out of two input lists `priceList` and `shippingsList` that are matched with the idential value of a common key defined by `matchingKey`. The results in the list should be the same materials as defined in `filterList`. An empty `filterList` is lika a wildcard.
 * @param {Array}  priceList     List of material and prices per vendor
 * @param {Array}  shippingsList List of shippings per vendor
 * @param {string} matchingKey   Name of the prop to match the two input lists
 * @param {Array} filterList     Materials to include in result list. If empty all materials should be included
 **/

module.exports = function getOffers(
  priceList,
  shippingsList,
  matchingKey,
  filterList
) {
  //? get empty list
  if (
    matchingKey === undefined ||
    matchingKey === null ||
    (Array.isArray(priceList) && !priceList.length)
  )
    return [];

  //? check if exist matchingKey in object of price list
  if (!Object.keys(priceList[0]).includes(matchingKey)) return [];

  //? parse && remove double in shippingsList
  let newShippingsList = [];
  if (
    Array.isArray(shippingsList) &&
    shippingsList.length > 0 &&
    Object.keys(shippingsList[0]).includes(matchingKey)
  ) {
    shippingsList.forEach((shipping) => {
      let test = false;
      newShippingsList = newShippingsList.map((obj) => {
        //? if exist push to the shippings key
        if (!test && obj[matchingKey] === shipping[matchingKey]) {
          obj.shippings.push({
            price: shipping.price,
            time: shipping.time,
          });
          test = true;
        }
        return obj;
      });

      //? if not exist push to the new shippings list
      !test &&
        newShippingsList.push({
          [matchingKey]: shipping[matchingKey],
          shippings: [
            {
              price: shipping.price,
              time: shipping.time,
            },
          ],
        });
    });
  }

  // TODO: match two lists wuth filterlist  && create return list of function
  let array = [];
  priceList.forEach((element) => {
    let check = newShippingsList.find(
      (item) => item[matchingKey] === element[matchingKey]
    );

    //? use filter list
    element.material.forEach((material) => {
      if (
        (Array.isArray(filterList) && filterList.length === 0) ||
        filterList.includes(material.name)
      )
        array.push({
          [matchingKey]: element[matchingKey],
          material: material.name,
          price: material.price,
          shippings: check != undefined ? check.shippings : [],
        });
    });
  });

  // return of function
  return array;
};
