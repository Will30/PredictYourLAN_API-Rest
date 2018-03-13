var connection = require('../connection');
 
function Network() 
{
    /**
     * Get ALL networks from table
     * @params res response 
     */
    this.getAll = function(id,res)  
    {
		
		console.log('Get all networks for category :'+id);   
        connection.acquire(function(err, con) 
        {		
			con.query('call getAllInfoSPsNetwork("'+id+'")',function(err, result) 
            {
                con.release();
				res.send(result[0]);
            });
        });
    };
	
	
	
	/**
     * Create a strategic point
	 * 1) create network into strategicpoint table
	 * 2) get last id saved
	 * 3) add network into network table for more info
     * @params network network in json format
     * @params res response
     */

	
	this.create = function(network, res) 
    {
		console.log("Creating a new network");
		console.log("Nom :"+network.name);
		console.log("Description :"+network.description);	
		console.log("Adresse IP:"+network.IPaddress);
	    console.log("ID Category :"+network.idCategory); 
		console.log("ID LED :"+network.id_LED);
		console.log("Adresse IP 2 :"+network.IPaddress2);
		
        connection.acquire(function(err, con) 
        {			
            con.query('call addStrategicPoint("'+network.name+'","'+network.description+'","'+network.icon+'","'+network.IPaddress+'","'+network.id_LED+'","'+network.idCategory+'")',function(err, result) 		 
            {
                con.release();
                if (err) 
                {
                    console.log(err);
                    res.send({status: 1, message: 'Network creation failed'});
                } else 
                {					
                    getLastId(res,network);					
                }
            });
        });
    };

    /**
     * get the last id 
     * @params res response
     */
    function getLastId(res,network) 
    {
        console.log('get last id');
        connection.acquire(function(err, con) 
        {
            con.query('SELECT  LAST_INSERT_ID() as id',  function(err, result) {
                con.release();
                if (err) 
                {
                    console.log(err);
                    res.send({status: 1, message: 'Network creation failed'});
                }
                else 
                {							
					insertMoreInfo(result[0].id,network,res);								
                }
            });
        });
    }
	
	 /**
     * insert network into the associate table into network table
     * 
     * @params res response
     */
    function insertMoreInfo(lastID,network,res) 
    {
        console.log('insert info into database for element');
	
		console.log(network.IPaddress2);
        connection.acquire(function(err, con) 
        {
			if(network.IPaddress2 != null)
			{
				console.log('Before insert into table network');		
			
				var data  = {id: lastID, IPaddress2: network.IPaddress2};
				console.log(data);
				con.query('insert into network set ?', data, function(err, result)  
				{
					con.release();
					if (err) 
					{
						console.log(err);
						res.send({status: 1, message: 'Network creation failed'});
					}
					else 
					{					
						console.log("Network created successfully id:"+lastID);
						res.send({status: 0, message: 'Network created successfully', id:lastID});					
					}
				});
				
			}
          
        });
    }
}


module.exports = new Network();