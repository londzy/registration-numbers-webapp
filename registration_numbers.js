module.exports = function(pool) {

    var regMap = {};

    if (pool) {
      for (var i = 0; i < pool.length; i++) {
        var regNumber = pool[i];
        regMap[regNumber] = 0
      }
    }


    async function addRegistrationNumbers(regNumber) {

     

      var regList = ['CA', 'CY ', 'CJ', 'CL ', 'CAW ',]

      let townTag = regNumber.substring(0, 3).trim();

      if (regNumber != '') {

        for (var i = 0; i < regList.length; i++) {
          if (regNumber.startsWith(regList[i])) {

            let result = await pool.query('SELECT * FROM reg_numbers WHERE reg = $1', [regNumber])

            if (result.rowCount === 0) {

              let townID = await pool.query('SELECT id FROM towns WHERE town = $1', [townTag]);

              result = await pool.query('INSERT INTO reg_numbers (reg, town_tag) VALUES ($1, $2)', [regNumber, townID.rows[0].id]);

              return true;
            }
          }
        }
        return false;
      }
    }

    async function filterRegBy(townValue){

      let townFilter = await pool.query('select reg,town_tag from reg_numbers')

      if(townValue != 'All'){
        let tagFound = await pool.query('select id from towns where town = $1', [townValue])

        let filterdTown =  townFilter.rows.filter(found => found.town_tag == tagFound.rows[0].id)
        return filterdTown
      }
      return townFilter.rows
    }



      async function registrationMap() {
        var result = await pool.query('select reg from reg_numbers')
        return result.rows
      }

      async function deleteRegNumbers() {
        var result = await pool.query('delete from reg_numbers')
         return result.rows
      }

      async function createDropDown(tag){
        let storedTowns = await pool.query('select town_name, town from towns');
      

        for(i = 0; i < storedTowns.rowCount; i++){
          let current = storedTowns.rows[i]
          if(current.town == tag){
            current.selected = true;
          }
        }
        return storedTowns.rows;
      }


      return {
        mapReg: registrationMap,
        addRegistration: addRegistrationNumbers,
        filterReg: filterRegBy,
        dropDown: createDropDown,
        deleteReg: deleteRegNumbers,
      }
    }
