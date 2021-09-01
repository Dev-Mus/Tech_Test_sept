/**
 * Return a new list out of two input lists `priceList` and `shippingsList` that are matched with the idential value of a common key defined by `matchingKey`. The results in the list should be the same materials as defined in `filterList`. An empty `filterList` is lika a wildcard.
 * @param {Array}  priceList     List of material and prices per vendor
 * @param {Array}  shippingsList List of shippings per vendor
 * @param {string} matchingKey   Name of the prop to match the two input lists
 * @param {Array} filterList     Materials to include in result list. If empty all materials should be included
 **/
function getOffers(priceList, shippingsList, matchingKey, filterList) {
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
}

mocha.setup("bdd");

const inputPrices = [
  {
    vendorId: "coolPrint3d",
    material: [
      {
        name: "pla",
        price: 100,
      },
      {
        name: "abs",
        price: 150,
      },
    ],
  },
  {
    vendorId: "betterPrint3d",
    material: [
      {
        name: "pla",
        price: 120,
      },
      {
        name: "nylon",
        price: 250,
      },
    ],
  },
];

const inputShippings = [
  {
    vendorId: "coolPrint3d",
    price: 5,
    time: 2,
  },
  {
    vendorId: "coolPrint3d",
    price: 10,
    time: 1,
  },
  {
    vendorId: "betterPrint3d",
    price: 6,
    time: 3,
  },
];

const inputKey = "vendorId";

const filterList = ["pla", "abs"];

describe("getOffers()", function () {
  it("should work for two complete lists", function () {
    expect(getOffers(inputPrices, inputShippings, inputKey, filterList)).to.eql(
      [
        {
          vendorId: "coolPrint3d",
          material: "pla",
          price: 100,
          shippings: [
            {
              price: 5,
              time: 2,
            },
            {
              price: 10,
              time: 1,
            },
          ],
        },
        {
          vendorId: "coolPrint3d",
          material: "abs",
          price: 150,
          shippings: [
            {
              price: 5,
              time: 2,
            },
            {
              price: 10,
              time: 1,
            },
          ],
        },
        {
          vendorId: "betterPrint3d",
          material: "pla",
          price: 120,
          shippings: [
            {
              price: 6,
              time: 3,
            },
          ],
        },
      ]
    );
  });

  it("should handle empty price list", function () {
    expect(getOffers([], inputShippings, inputKey, filterList)).to.eql([]);
  });

  it("should handle empty shipping list", function () {
    expect(getOffers(inputPrices, [], inputKey, filterList)).to.eql([
      {
        vendorId: "coolPrint3d",
        material: "pla",
        price: 100,
        shippings: [],
      },
      {
        vendorId: "coolPrint3d",
        material: "abs",
        price: 150,
        shippings: [],
      },
      {
        vendorId: "betterPrint3d",
        material: "pla",
        price: 120,
        shippings: [],
      },
    ]);
  });

  it("should handle empty matching key", function () {
    expect(
      getOffers(inputPrices, inputShippings, undefined, filterList)
    ).to.eql([]);
  });

  it("should handle empty filter list", function () {
    expect(getOffers(inputPrices, inputShippings, inputKey, [])).to.eql([
      {
        vendorId: "coolPrint3d",
        material: "pla",
        price: 100,
        shippings: [
          {
            price: 5,
            time: 2,
          },
          {
            price: 10,
            time: 1,
          },
        ],
      },
      {
        vendorId: "coolPrint3d",
        material: "abs",
        price: 150,
        shippings: [
          {
            price: 5,
            time: 2,
          },
          {
            price: 10,
            time: 1,
          },
        ],
      },
      {
        vendorId: "betterPrint3d",
        material: "pla",
        price: 120,
        shippings: [
          {
            price: 6,
            time: 3,
          },
        ],
      },
      {
        vendorId: "betterPrint3d",
        material: "nylon",
        price: 250,
        shippings: [
          {
            price: 6,
            time: 3,
          },
        ],
      },
    ]);
  });
});

mocha.run();
