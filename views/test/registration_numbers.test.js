const Reg = require('../registration_numbers.js');
//const registration = Reg()
let assert = require("assert");

//postgres
var postgres = require('pg')
const Pool = postgres.Pool

let useSSL = false;
if(process.env.DATABASE_URL){
  useSSL = true;
}

const connectionString = process.env.DATABASE_URL || 'postgresql://coder:1234@localhost:5432/reg_num'

const pool = new Pool({
  connectionString,
  ssl:useSSL
})


describe('Add registration numbers', function() {

  beforeEach(async function() {
    await pool.query("delete from reg_numbers");
  });

  it('Should return true if registration number from CA', async function() {
    var registration = Reg(pool);

    assert.equal(await registration.addRegistration('CA 1234'), true)
  });

  it('Should return true if registration number from CY',async function() {
    var registration = Reg(pool);

    assert.equal(await registration.addRegistration('CY 1234'), true)
  });

  it('Should return true if registration number from CL',async function() {
    var registration = Reg(pool);

    assert.equal(await registration.addRegistration('CL 1234'), true)
  });

  it('Should return true if registration number from CAW',async function() {
    var registration = Reg(pool);

    assert.equal(await registration.addRegistration('CAW 1234'), true)
  });

  it('Should return false if registration number from anywhere else',async function() {
    var registration = await  Reg(pool);

     assert.equal(await registration.addRegistration('CZ 1234'), false)
  });

  it('Should return a map with two added registrations from CJ, CY',async function() {
    var registration = await  Reg(pool);

    await registration.addRegistration('CZ 4556')
    await registration.addRegistration('CJ 1234')
    await registration.addRegistration('CY 5432')

     assert.deepEqual(await registration.mapReg(), [{reg: "CJ 1234"}, {reg: 'CY 5432'}])
  });

  it('Should return an empty list/map',async function() {
    var registration = await  Reg(pool);

    await registration.addRegistration('CJ 1234')
    await registration.addRegistration('CY 5432')

    await registration.deleteReg()
  //  await registration.deleteTowns()
     assert.deepEqual(await registration.mapReg(), [])
  });


});

describe('Filter registration numbers', function() {
  beforeEach(async function() {
    await pool.query("delete from reg_numbers");
  });

  it('Should return registrations from Cape Town only ', async function() {
    var registration = Reg(pool);

    await registration.addRegistration('CA 1234')
    await registration.addRegistration('CA 4321')
    await registration.addRegistration('CAW 4321')
    await registration.addRegistration('CD 4321')




    //var storedReg = registration.mapReg()


    assert.deepEqual(await registration.filterReg('CA'), [{reg:'CA 1234', town_tag:1}, {reg:'CA 4321',town_tag:1}])

  });


  it('Should return registrations from Bellville only ',async function() {
    var registration = Reg(pool);

    await registration.addRegistration('CA 1234')
    await registration.addRegistration('CY 1234')
    await registration.addRegistration('CL 1234')
    await registration.addRegistration('CD 4321')


    //var storedReg = registration.mapReg()

    assert.deepEqual(await registration.filterReg('CY'), [{reg:'CY 1234', town_tag:2}])

  });

  it('Should return registrations from George only ',async function() {
    var registration = Reg(pool);

    await registration.addRegistration('CA 1234')
    await registration.addRegistration('CY 1234')
    await registration.addRegistration('CAW 1234')
    await registration.addRegistration('CD 4321')

    //var storedReg = registration.mapReg()

    assert.deepEqual(await registration.filterReg('CAW'), [{reg:'CAW 1234', town_tag:5}])

  });

  it('Should return registrations from Stellenbosch only ',async function() {
    var registration = Reg(pool);

    await registration.addRegistration('CA 1234')
    await registration.addRegistration('CY 1234')
    await registration.addRegistration('CL 1234')
    await registration.addRegistration('CD 4321')

    //var storedReg = registration.mapReg()

    assert.deepEqual(await registration.filterReg('CL'), [{reg:'CL 1234', town_tag:3}])

  });

  it('Should return all registrations',async function() {
    var registration = Reg(pool);

    await registration.addRegistration('CA 1234')
    await registration.addRegistration('CY 1234')
    await registration.addRegistration('CL 1234')
    await registration.addRegistration('CD 4321')

    //var storedReg = registration.mapReg()

    assert.deepEqual(await registration.filterReg('All'), [{reg:'CA 1234', town_tag:1}, {reg:'CY 1234', town_tag:2},{reg: 'CL 1234',town_tag:3}])

  });


});

describe('CreateDropDown function', async function(){

  beforeEach(async function() {
    await pool.query("delete from reg_numbers");
  });

  it('Should return all towns', async function(){

    var registration = Reg(pool);

    await registration.addRegistration('CA 1234');
    assert.deepEqual(await registration.dropDown('CA'), [
  { town_name: 'Cape Town', town: 'CA', selected: true },
  { town_name: 'Bellville', town: 'CY' },
  { town_name: 'Stellenbosch', town: 'CL' },
  { town_name: 'Paarl', town: 'CJ' },
  { town_name: 'George', town: 'CAW' } ])
  })

  it('Should return all towns', async function(){

    var registration = Reg(pool);

    await registration.addRegistration('CA 1234');
    console.log(await registration.dropDown())
    assert.deepEqual(await registration.dropDown(), [
  { town_name: 'Cape Town', town: 'CA'},
  { town_name: 'Bellville', town: 'CY' },
  { town_name: 'Stellenbosch', town: 'CL' },
  { town_name: 'Paarl', town: 'CJ' },
  { town_name: 'George', town: 'CAW' } ])
  })

  after(async function() {
    await pool.end();
  });

})

// describe('Map registration numbers', function() {
//   it('Should Map registration numbers from CA', function() {
//     var registration = Reg();
//
//     registration.addRegistration('CA 1234')
//     registration.addRegistration('CD 4321')
//
//
//     assert.deepEqual(registration.mapReg(), [
//       'CA 1234']
//     )
//   });
//   it('Should return registrations from CA and registrations from CY', function() {
//
//     var registration = Reg();
//     registration.addRegistration('CA 1234')
//     registration.addRegistration('CY 1234')
//     registration.addRegistration('CD 4321')
//
//
//     assert.deepEqual(registration.mapReg(), [
//       'CA 1234',
//       'CY 1234'
//     ])
//   });
//
//   it('Should return registrations from CA, CY and CL', function() {
//
//     var registration = Reg();
//     registration.addRegistration('CA 1234')
//     registration.addRegistration('CY 1234')
//     registration.addRegistration('CL 1234')
//     registration.addRegistration('CD 4321')
//
//     assert.deepEqual(registration.mapReg(), [
//       'CA 1234',
//       'CY 1234',
//       'CL 1234'
//     ])
//   });
// });
