var connection = require('../connection');
 
function Service() 
{
    /**
     * Get ALL users from table
     * @params res response 
     */
    this.getAll = function(res) 
    {
		console.log("get all services");
        connection.acquire(function(err, con) 
        {
            con.query('select * from service', function(err, result) 
            {
                con.release();
                res.send(result);
            });
        });
    };



    /**
     * Get a service's name
     */
    this.getName = function(id, res) 
    {
		console.log("get service name by an ID");
        connection.acquire(function(err, con) 
        {
            con.query('select libelle from service where id = ?', [id], function(err, result) {
                con.release();
                if (err) 
                {
                    console.log(err);
                    res.send({status: 1, message: 'Failed to find service name'});
                } 
                else 
                {
                    res.send(result);
                }
            });
        });
    };
	
	/**
     * Get a service's ID
     */
    this.getID = function(service, res) 
    {
		console.log("get ID for service name");
		console.log(service.libelle);
        connection.acquire(function(err, con) 
        {
            con.query('select id from service where libelle = ?', [service.libelle], function(err, result) {
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
						res.send({status: 0, message: 'Connexion OK', id: result[0].id});
					}						
			        else 
					{
						res.send({status: 1, message: 'Service Name does not exist into database'});
					}
                }              
            });
        });
    };

    

}

module.exports = new Service();