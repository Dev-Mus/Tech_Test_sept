/**
 * Return a new list out of two input lists `priceList` and `shippingsList` that are matched with the idential value of a common key defined by `matchingKey`. The results in the list should be the same materials as defined in `filterList`. An empty `filterList` is lika a wildcard.
 * @param {Array}  priceList     List of material and prices per vendor
 * @param {Array}  shippingsList List of shippings per vendor
 * @param {string} matchingKey   Name of the prop to match the two input lists
 * @param {Array} filterList     Materials to include in result list. If empty all materials should be included
 **/
function getOffers(priceList, shippingsList, matchingKey, filterList) {
  // TODO
}

mocha.setup('bdd');

const inputPrices = [{
  vendorId: 'coolPrint3d',
  material: [{
    name: 'pla',
    price: 100
  }, {
    name: 'abs',
    price: 150
  }]
}, {
  vendorId: 'betterPrint3d',
  material: [{
    name: 'pla',
    price: 120
  }, {
    name: 'nylon',
    price: 250
  }]
}]

const inputShippings = [{
  vendorId: 'coolPrint3d',
  price: 5,
  time: 2
}, {
  vendorId: 'coolPrint3d',
  price: 10,
  time: 1
}, {
  vendorId: 'betterPrint3d',
  price: 6,
  time: 3
}]

const inputKey = 'vendorId'

const filterList = ['pla', 'abs']

describe('getOffers()', function() {
	it('should work for two complete lists', function() {
    expect(
    	getOffers(inputPrices, inputShippings, inputKey, filterList)
    ).to.eql([{
      vendorId: 'coolPrint3d',
      material: 'pla',
      price: 100,
      shippings: [{
        price: 5,
        time: 2
      }, {
        price: 10,
        time: 1
      }]
    }, {
      vendorId: 'coolPrint3d',
      material: 'abs',
      price: 150,
      shippings: [{
        price: 5,
        time: 2
      }, {
        price: 10,
        time: 1
      }]
    }, {
      vendorId: 'betterPrint3d',
      material: 'pla',
      price: 120,
      shippings: [{
        price: 6,
        time: 3
      }]
    }]);
  });
  
  it('should handle empty price list', function() {
    expect(
      getOffers([], inputShippings, inputKey, filterList)
    ).to.eql([])
  })
  
  it('should handle empty shipping list', function() {
  	expect(
    	getOffers(inputPrices, [], inputKey, filterList)
    ).to.eql([{
      vendorId: 'coolPrint3d',
      material: 'pla',
      price: 100,
      shippings: []
    }, {
      vendorId: 'coolPrint3d',
      material: 'abs',
      price: 150,
      shippings: []
    }, {
      vendorId: 'betterPrint3d',
      material: 'pla',
      price: 120,
      shippings: []
    }])
  })
  
  it('should handle empty matching key', function() {
  	expect(
    	getOffers(inputPrices, inputShippings, undefined, filterList)
    ).to.eql([])
  })
  
  it('should handle empty filter list', function() {
  	expect(
    	getOffers(inputPrices, inputShippings, inputKey, [])
    ).to.eql([{
      vendorId: 'coolPrint3d',
      material: 'pla',
      price: 100,
      shippings: [{
        price: 5,
        time: 2
      }, {
        price: 10,
        time: 1
      }]
    }, {
      vendorId: 'coolPrint3d',
      material: 'abs',
      price: 150,
      shippings: [{
        price: 5,
        time: 2
      }, {
        price: 10,
        time: 1
      }]
    }, {
      vendorId: 'betterPrint3d',
      material: 'pla',
      price: 120,
      shippings: [{
        price: 6,
        time: 3
      }]
    }, {
      vendorId: 'betterPrint3d',
      material: 'nylon',
      price: 250,
      shippings: [{
        price: 6,
        time: 3
      }]
    }])
  })
});

mocha.run();
