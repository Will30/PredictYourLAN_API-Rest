var connection = require('../connection');
 
function dataStorage() 
{
    /**
     * Get ALL dataStorage from table
     * @params res response 
     */
    this.getAll = function(id,res) 
    {		
		console.log('Get all data storage for category: '+id);        
        connection.acquire(function(err, con) 
        {		
			con.query('call getAllInfoSPsDataStorage("'+id+'")',function(err, result) 
            {
                con.release();
				res.send(result[0]);
            });
        });
    };
	
    /**
     * insert element into the associate table into table dataStorage 
     * 
     * @params res response
     */
    this.updateLastFile = function(ID,dataStorage,res) 
    {
        console.log('Updating last file (table datastorage) for ID :'+ID);
        
        console.log("Date of lastFile :"+dataStorage.lastFile);
        connection.acquire(function(err, con) 
        {       
            con.query('update datastorage set lastfile = ? where id = ?', [dataStorage.lastFile, ID], function(err, result) 
            {
                con.release();
                if (err) 
                {
                    console.log(err);
                    res.send({status: 1, message: 'dataStorage update failed'});
                }
                else 
                {                   
                    console.log("dataStorage updated successfully id:"+ID);
                    res.send({status: 0, message: 'dataStorage updated successfully', id:ID});                  
                }
            });
        });
    };


	
	/**
     * Create a dataStorage
	 * 1) create dataStorage into strategicpoint table
	 * 2) get last id saved
	 * 3) select model's id and add equipment into table equipmentList for more info (to get OID associated)
     * @params dataStorage in json format
     * @params res response
     */

	
	this.create = function(dataStorage, res) 
    {
		console.log("Creating a new dataStorage");
		console.log("Nom : "+dataStorage.name);
		console.log("Description : "+dataStorage.description);
		console.log("IP Adresse : "+dataStorage.IPaddress);
	    console.log("ID Category :"+dataStorage.idCategory); 
		console.log("ID Led : "+dataStorage.id_LED);
        console.log("UNC : "+dataStorage.UNC);
        console.log("Date : "+dataStorage.date);
		
        connection.acquire(function(err, con) 
        {			
            con.query('call addStrategicPoint("'+dataStorage.name+'","'+dataStorage.description+'","'+dataStorage.icon+'","'+dataStorage.IPaddress+'","'+dataStorage.id_LED+'","'+dataStorage.idCategory+'")',function(err, result) 		 
            {
                con.release();
                if (err) 
                {
                    console.log(err);
                    res.send({status: 1, message: 'dataStorage creation failed'});
                } else 
                {					
                    getLastId(res,dataStorage);					
                }
            });
        });
    };

   

    /**
     * get the last id 
     * @params res response
     */
    function getLastId(res,dataStorage) 
    {
        console.log('get last id');
        connection.acquire(function(err, con) 
        {
            con.query('SELECT  LAST_INSERT_ID() as id',  function(err, result) {
                con.release();
                if (err) 
                {
                    console.log(err);
                    res.send({status: 1, message: 'dataStorage creation failed'});
                }
                else 
                {							
					insertMoreInfo(result[0].id,dataStorage,res);								
                }
            });
        });
    }
	
	 /**
     * insert element into the associate table into table dataStorage 
     * 
     * @params res response
     */
    function insertMoreInfo(lastID,dataStorage,res) 
    {
        console.log('insert info into database for element');
		console.log("ID created for this dataStorage :"+ lastID);
		console.log("UNC du dataStorage"+dataStorage.UNC);
       connection.acquire(function(err, con) 
        {
			if(dataStorage.UNC != null)
			{
				console.log('Before insert into table dataStorage');		
			
				var data  = {id: lastID, UNC: dataStorage.UNC, lastfile: dataStorage.date};
				console.log(data);
				con.query('insert into dataStorage set ?', data, function(err, result)  
				{
					con.release();
					if (err) 
					{
						console.log(err);
						res.send({status: 1, message: 'dataStorage creation failed'});
					}
					else 
					{					
						console.log("dataStorage created successfully id:"+lastID);
						res.send({status: 0, message: 'dataStorage created successfully', id:lastID});					
					}
				});
				
			}
          
        });
    };

     

}

module.exports = new dataStorage();