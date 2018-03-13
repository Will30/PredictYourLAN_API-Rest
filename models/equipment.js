var connection = require('../connection');
 
function Equipment() 
{
    /**
     * Get ALL equipments from table
     * @params res response 
     */
    this.getAll = function(id,res)  
    {		
		console.log('Get all equipments for category: '+id);	
        connection.acquire(function(err, con) 
        {		
			con.query('call getAllInfoSPsEquipment("'+id+'")',function(err, result) 
            {
                con.release();
				res.send(result[0]);
            });
        });
    };
	
	 /**
     * Get equipment's list from equipmentlist table : type and model
     * @params res response 
     */
    this.getListandModel = function(res) 
    {
	
		console.log('Get type and model from equipmentList');	
        connection.acquire(function(err, con) 
        {		
			con.query('SELECT * FROM equipmentlist',function(err, result) 
            {
                con.release();
				res.send(result);
				
				
            });
        });
    };
	
     


	/**
     * Create a Equipment
	 * 1) create Equipment into strategicpoint table
	 * 2) get last id saved
	 * 3) select model's id and add equipment into table equipmentList for more info (to get OID associated)
     * @params equipment in json format
     * @params res response
     */

	
	this.create = function(equipment, res) 
    {
		console.log("Creating a new equipment");
		console.log("Name :"+equipment.name);
		console.log("Description :"+equipment.description);
		console.log("IP Address:"+equipment.IPaddress);
		console.log("ID Led"+equipment.id_LED);
        console.log("ID Category :"+equipment.idCategory);   
		console.log("Type :"+equipment.type);
		console.log("Model :"+equipment.model);	
		
        connection.acquire(function(err, con) 
        {			
            con.query('call addStrategicPoint("'+equipment.name+'","'+equipment.description+'","'+equipment.icon+'","'+equipment.IPaddress+'","'+equipment.id_LED+'","'+equipment.idCategory+'")',function(err, result) 		 
            {
                con.release();
                if (err) 
                {
                    console.log(err);
                    res.send({status: 1, message: 'Equipment creation failed'});
                } else 
                {					
                    getLastId(res,equipment);					
                }
            });
        });
    };

   

    /**
     * get the last id 
     * @params res response
     */
    function getLastId(res,equipment) 
    {
        console.log('get last id');
        connection.acquire(function(err, con) 
        {
            con.query('SELECT  LAST_INSERT_ID() as id',  function(err, result) {
                con.release();
                if (err) 
                {
                    console.log(err);
                    res.send({status: 1, message: 'Equipment creation failed'});
                }
                else 
                {							
					insertMoreInfo(result[0].id,equipment,res);								
                }
            });
        });
    }
	
	 /**
     * insert element into the associate table into table equipment 
     * 
     * @params res response
     */
    function insertMoreInfo(lastID,equipment,res) 
    {
        console.log('insert info into database for element');
		console.log(equipment.type);
		console.log(equipment.model);
        connection.acquire(function(err, con) 
        {
			
			console.log('Before insert into equipment');
			con.query('select id from equipmentlist where type=?', equipment.type, function(err, result)  
			{
				con.release();
				if (err) 
				{
					console.log(err);
					res.send({status: 1, message: 'Unable to find type'});
				}
				else 
				{		
					connection.acquire(function(err, con) 
					{
						var data  = {id: lastID, id_EquipmentList: result[0].id};
						console.log(data);
						con.query('insert into Equipment set ?', data, function(err, result)  
						{
							con.release();
							if (err) 
							{
								console.log(err);
								res.send({status: 1, message: 'Equipment creation failed'});
							}
							else 
							{			
								console.log("Equipment created successfully id:"+lastID);
								res.send({status: 0, message: 'Equipment created successfully', id:lastID});					
							}
						});
					});								
				}
			});
        });
    }

     /**
     * Get OID for a specific equipment
     */
    this.getOID = function(id, res) 
    {
		console.log('Get OID for equipment :'+id);	
        connection.acquire(function(err, con) 
        {
           
			 con.query('call getOIDforEquipment("'+id+'")',function(err, result) 		 
            {
                con.release();
                if (err) 
                {
                    console.log(err);
                    res.send({status: 1, message: 'Unknown Equipment'});
                } else 
                {					
                    res.send(result[0]);				
                }
            });
        });
    }

}

module.exports = new Equipment();