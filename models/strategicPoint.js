var connection = require('../connection');
 
function StrategicPoint() 
{
    /**
     * Get ALL Strategic Points from table
     * @params res response 
	 * @deprecated for application JAVA, only functionnal for mobile application
     */
    this.getAll = function(res) 
    {
		var temp;
		console.log('Get all SP info');	
        connection.acquire(function(err, con) 
        {		
			con.query('call getAllInfoSPsEquipment()',function(err, result) 
            {
                con.release();
				temp = result[0];
				
				connection.acquire(function(err, con) 
				{		
					con.query('call getAllInfoSPsNetwork()',function(err, result) 
					{
						con.release();
						temp.concat(result[0]);

						connection.acquire(function(err, con) 
						{		
							con.query('call getAllInfoSPsDataStorage()',function(err, result) 
							{
								con.release();
							
								res.send(temp.concat(result[0]));
							});
						});
					
					});
				});
            });
        });
    };

 	/**
     * Get ALL Strategic Points for only one category
     * @params res response 
     */
    this.getSPsforACategory= function(id,res) 
    {
		var temp;
		console.log('Get SPs for only one category');	
		console.log('ID :'+id);	
        connection.acquire(function(err, con) 
        {		
			con.query('call getAllInfoSPsEquipment("'+id+'")',function(err, result) 
            {
                con.release();
				temp = result[0];
				
				connection.acquire(function(err, con) 
				{		
					con.query('call getAllInfoSPsNetwork("'+id+'")',function(err, result) 
					{
						con.release();
						temp.concat(result[0]);

						connection.acquire(function(err, con) 
						{		
							con.query('call getAllInfoSPsDataStorage("'+id+'")',function(err, result) 
							{
								con.release();
							
								res.send(temp.concat(result[0]));
								console.log('ID :'+id);	
							});
						});
					
					});
				});
            });
        });
    };


    /**
     * Get OID for a specific strategic point
     */
    this.get = function(id, res) 
    {
		console.log('Get OID for SP :'+id);	
        connection.acquire(function(err, con) 
        {
           
			 con.query('call getMoreInfoForSP("'+id+'")',function(err, result) 		 
            {
                con.release();
                if (err) 
                {
                    console.log(err);
                    res.send({status: 1, message: 'Unknown STRATEGIC POINT'});
                } else 
                {					
                    res.send(result[0]);				
                }
            });
        });
    };
	
	/**
     * Get MORE ELEMENT FOR STRATEGIC POINT --- deprecated
     */
	this.findMoreElement = function(id,res)
	{
		console.log('Get more element for SP with ID'+id);		
		connection.acquire(function(err, con) 
        {
			con.query('select type from equipment where id = ?', [id], function(err, result) 
			{	
				console.log('Get info into equipment table');		
                con.release();
                if (err) 
                {
                    console.log(err);
                    res.send({status: 2, message: 'Request error'});
                } 
                else 
                {					
					console.log('taille:'+result.length);
					if(result.length >0) 
					{
						console.log("Type :"+result[0].type);
						res.send({id: id, type: result[0].type, IPaddress2: 'null'});
					}						
			        else 
					{
						connection.acquire(function(err, con) 
						{							
							con.query('select IPaddress2 from network where id = ?', [id], function(err, result) 
							{
								console.log('Get info into network table');	
								con.release();
								if (err) 
								{
									console.log(err);
									res.send({status: 2, message: 'Request error'});
								} 
								else 
								{
									if(result.length > 0) 
									{
										console.log("ipaddress2 :"+result[0].IPaddress2);
										
										res.send({id: id, type: 'null', IPaddress2: result[0].IPaddress2});
									}	
									else
									{
										res.send({status: 1, message: 'Unable to find more element for this ID'});
									}
								}
							});	
						});	
					}
                }
            });
        });	
	}

    /**
     * Create a strategic point
	 * 1) create Strategic point into strategicpoint table
	 * 2) get last id saved
	 * 3) add strategic point into table equipment or network for more info
     * @params user user in json format
     * @params res response
     */

	
	this.create = function(SP, res) 
    {
		console.log("Creating a new SP");
		console.log("name :"+SP.name);
		console.log("description :"+SP.description);
		console.log("location :"+SP.location);
		console.log("Adresse IP :"+SP.IPaddress);
		console.log("Id service :"+SP.id_Service);
		console.log("Id Led :" +SP.id_LED);
		console.log("Type :"+SP.type);
		console.log("Adresse IP2 :"+SP.IPaddress2);
		
        connection.acquire(function(err, con) 
        {			
            con.query('call addStrategicPoint("'+SP.name+'","'+SP.description+'","'+SP.location+'","'+SP.icon+'","'+SP.IPaddress+'","'+SP.id_Service+'","'+SP.id_LED+'")',function(err, result) 		 
            {
                con.release();
                if (err) 
                {
                    console.log(err);
                    res.send({status: 1, message: 'STRATEGIC POINT creation failed'});
                } else 
                {					
                    getLastId(res,SP);					
                }
            });
        });
    };

    /**
     * get the last id 
     * TODO : move it in logical file
     * @params res response
     */
    function getLastId(res,SP) 
    {
        console.log('get last id');
        connection.acquire(function(err, con) 
        {
            con.query('SELECT  LAST_INSERT_ID() as id',  function(err, result) {
                con.release();
                if (err) 
                {
                    console.log(err);
                    res.send({status: 1, message: 'STRATEGIC POINT creation failed'});
                }
                else 
                {							
					insertMoreInfo(result[0].id,SP,res);								
                }
            });
        });
    }
	
	 /**
     * insert element into the associate table into database (Equipment, Network or Datastorage)
     * 
     * @params res response
     */
    function insertMoreInfo(lastID,SP,res) 
    {
        console.log('insert info into database for element');
		console.log("type :"+SP.type);
		console.log("Adresse IP2 :"+SP.IPaddress2);
        connection.acquire(function(err, con) 
        {
			// for Equipment
			if(SP.type != null)
			{
				console.log('Before insert into equipment');
				con.query('select id from equipmentlist where type=?', SP.type, function(err, result)  
				{
					con.release();
					if (err) 
					{
						console.log(err);
						res.send({status: 1, message: 'STRATEGIC POINT creation failed'});
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
									res.send({status: 1, message: 'STRATEGIC POINT creation failed'});
								}
								else 
								{			
									console.log("Equipment created successfully id:"+lastID);
									res.send({status: 0, message: 'STRATEGIC POINT created successfully', id:lastID});					
								}
							});
						});								
					}
				});
				
			}	
			
			// for network
			if(SP.IPaddress2 != null)
			{
				console.log('Before insert into network');		
			
				var data  = {id: lastID, IPaddress2: SP.IPaddress2};
				console.log(data);
				con.query('insert into network set ?', data, function(err, result)  
				{
					con.release();
					if (err) 
					{
						console.log(err);
						res.send({status: 1, message: 'STRATEGIC POINT creation failed'});
					}
					else 
					{					
						console.log("Network created successfully id:"+lastID);
						res.send({status: 0, message: 'STRATEGIC POINT created successfully', id:lastID});					
					}
				});
				
			}
          
        });
    }

    /**
     * Update a specific SP
     * @params SP in json format
	 */
     
    this.update = function(SPid, SP, res) 
    {
		console.log('Updating StrategicPoint :'+SPid);
        connection.acquire(function(err, con) 
        {
            con.query('update strategicpoint set ? where id = ?', [SP, SPid], function(err, result) 
            {
                con.release();
                if (err) 
                {
                    console.log(err);
                    res.send({status: 1, message: 'StrategicPoint update failed'});
                } 
                else 
                {
					console.log('StrategicPoint updated successfully :'+SPid);
					res.send({status: 0, message: 'StrategicPoint updated successfully'});	
					
                }
            });
        });
    }; 

	 /**
     * Create BUG into BugHistory table
     * @params SP in json format
	 */
     
    this.createBUG = function(SPid, SP, res) 
    {
		console.log('Create bug for SP :'+SPid);
		console.log("Date :"+SP.beginningDateBUG);
		console.log("ID du SP :"+SP.idSP);
		console.log("ID du bug :"+SP.idBug);
		console.log("Active :"+SP.active);

		connection.acquire(function(err, con) 
		{
			con.query('select id from bughistory where beginningDateBUG=? and idSP=?', [SP.beginningDateBUG,SP.idSP], function(err, result) 
			{
				con.release();
				if (err) 
				{
					console.log(err);
					res.send({status: 1, message: 'Bad request'});
				} 
				else 
				{
				//	console.log("Nombre de rows affected --> :"+result.length);
					if (result.length == 0) 
					{
						connection.acquire(function(err, con) 
						{
							var data  = {beginningDateBUG: SP.beginningDateBUG, idSP: SP.idSP, idBug: SP.idBug, active: SP.active};
							console.log(data);
					
							con.query('insert into bughistory set ?', data, function(err, result) 
							{
								con.release();
								if (err) 
								{
									console.log(err);
									res.send({status: 1, message: 'Bug created failed'});
								} 
								else 
								{
									
									res.send({status: 0, message: 'Bug created successfully'});
								}         
							});
						
						}); 
					}
					else
					{
							res.send({status: 0, message: 'Bug for this strategic point has already created'});
					}    
				} 
            });
        });
    }; 

    /**
     * Delete a specific SP
     * @params id StrategicPoint's id
     * @params res response
     */
    this.delete = function(id, res) 
    {
        connection.acquire(function(err, con) 
        {
			console.log('deleting strategic point ')
            con.query('delete from strategicpoint where id = ?', [id], function(err, result) 
            {
                con.release();
                if (err) 
                {   
                    console.log(err);
                    res.send({status: 1, message: 'Failed to delete'});
                } 
                else 
                {
						connection.acquire(function(err, con) 
						{
							console.log('deleting SP into equipment table ')
							con.query('delete from equipment where id = ?', [id], function(err, result) 
							{
								con.release();
								if (result.affectedRows == 0) 
								{   
									connection.acquire(function(err, con) 
									{
										console.log('deleting SP into network table ')
										con.query('delete from network where id = ?', [id], function(err, result) 
										{
											con.release();
											if (result.affectedRows == 0) 
											{   
												connection.acquire(function(err, con) 
												{
													console.log('deleting SP into DataStorage table ')
													con.query('delete from datastorage where id = ?', [id], function(err, result) 
													{
														con.release();
														if (err) 
														{   
															console.log(err);
															res.send({status: 1, message: 'Failed to delete - unable to find this StartegicPoint into sub table'});
														} 
														else
														{
															console.log("StrategicPoint-DataStorage deleted successfully- id "+id);
															res.send({status: 0, message: 'StrategicPoint-DataStorage deleted successfully'});
														}
													});
												});
											}
											else
											{
												console.log("StrategicPoint-Network deleted successfully - id "+id);
												res.send({status: 0, message: 'StrategicPoint-Network deleted successfully'});
											}											
										});
									});
								}
								else
								{
									console.log("StrategicPoint-Equipment deleted successfully - id "+id);
									res.send({status: 0, message: 'StrategicPoint-Equipment deleted successfully'});
								}											
							});
						});

                }
            });
        });
    };


}

module.exports = new StrategicPoint();