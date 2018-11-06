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

const connectionString = process.env.DATABASE_URL || 'postgresql://coder:pg123@localhost:5432/reg_num';

const pool = new Pool({
  connectionString,
  ssl:useSSL
})


describe('Adding registration numbers', function() {

  beforeEach(async function() {
    await pool.query("delete from reg_numbers");
  });


  it('Should return true if registration number from CY',async function() {
    var registration = Reg(pool);

    assert.equal(await registration.addRegistration('CY 1234'), true)
  });


  it('Should return true if registration number from CA', async function() {
    var registration = Reg(pool);

    assert.equal(await registration.addRegistration('CA 1234'), true)
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

  

  it('Should return empty list',async function() {
    var registration = await  Reg(pool);

    await registration.addRegistration('CJ 1234')
    await registration.addRegistration('CY 5432')
    await registration.deleteReg()
     assert.deepEqual(await registration.mapReg(), [])
  });


});

describe('Filtering registration numbers', function() {
  beforeEach(async function() {
    await pool.query("delete from reg_numbers");
  });

  it('Should return registration numbers from cape Town', async function() {
    var registration = Reg(pool);

    await registration.addRegistration('CA 1234')
    await registration.addRegistration('CA 4321')
    await registration.addRegistration('CAW 4321')
    await registration.addRegistration('CD 4321')

    assert.deepEqual(await registration.filterReg('CA 1234'), [{reg:'CA 1234', town_tag:1}, {reg:'CA 4321',town_tag:1}])

  });

  it('Should return two registration numbers CYJ 123 and CY 432',async function() {
    var registration = await  Reg(pool);

    await registration.addRegistration('CZ 456')
    await registration.addRegistration('CJ 123')
    await registration.addRegistration('CY 432')

     assert.deepEqual(await registration.mapReg(), [{reg: "CJ 123"}, {reg: 'CY 432'}])
  });


  it('Should return registration numbers from George ',async function() {
    var registration = Reg(pool);

    await registration.addRegistration('CA 934')
    await registration.addRegistration('CY 124')
    await registration.addRegistration('CAW 657')
    await registration.addRegistration('CD 321')

    assert.deepEqual(await registration.filterReg('CAW'), [{reg:'CAW 657', town_tag:5}])

  });


  it('Should return registration numbers from Stellenbosch',async function() {
    var registration = Reg(pool);

    await registration.addRegistration('CA 1234')
    await registration.addRegistration('CY 1234')
    await registration.addRegistration('CL 1234')
    await registration.addRegistration('CD 4321')

    assert.deepEqual(await registration.filterReg('CL'), [{reg:'CL 1234', town_tag:3}])

  });



  it('Should return registration numbers from Bellvile ',async function() {
    var registration = Reg(pool);

    await registration.addRegistration('CA 1234')
    await registration.addRegistration('CY 1234')
    await registration.addRegistration('CL 1234')
    await registration.addRegistration('CD 4321')

    assert.deepEqual(await registration.filterReg('CY'), [{reg:'CY 1234', town_tag:2}])

  });


  it('Should return all registration numbers',async function() {
    var registration = Reg(pool);

    await registration.addRegistration('CA 1234')
    await registration.addRegistration('CY 1234')
    await registration.addRegistration('CL 1234')
    await registration.addRegistration('CD 4321')

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


