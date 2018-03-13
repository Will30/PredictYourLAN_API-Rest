var connection = require('../connection');
 
function Bug() 
{
    /**
     * Get ALL bugs "possible" from database
     * @params res response 
     */
    this.getAll = function(res) 
    {		
		console.log('Get all bug info');	
        connection.acquire(function(err, con) 
        {		
			con.query('call getAllBug()',function(err, result) 
            {
                con.release();
				res.send(result[0]);
            });
        });
    };

    /**
     * Get ALL bugs "active" from database
     * @params res response 
     */
    this.getActiveBug = function(res) 
    {       
        console.log('Get all bug active');    
        connection.acquire(function(err, con) 
        {       
            con.query('call getActiveBugListForCategory()',function(err, result) 
            {
                con.release();
                res.send(result[0]);
            });
        });
    };

     /**
     * Get bug for specific SP
     * @params res response 
     * @params detail for this "post" request, we need SP's ID and date of day'
     * 
     */
    this.getBugForThisSP = function(detail, res) 
    {		
		console.log('Get active bug for SP ID: '+detail.id);	        

        connection.acquire(function(err, con) 
        {		
			con.query('call getBugForThisSP("'+detail.id+'")',function(err, result) 
            {
                con.release();
                if (err) 
                {
                    console.log(err);
                    res.send({status: 1, message: 'bad request'});
                } else 
                {					
                    res.send(result[0]);				
                }
                
				
            });
        });
    };

    /**
     * Update a specific bug -- to enable/disable a bug with active field
     * @params Bug in json format
     */
     
    this.update = function(Bug, res) 
    {
        console.log('Updating Bug ...');
        console.log('ID du SP :'+Bug.idSP);
        console.log('Date :'+Bug.date);
        console.log('Active :'+Bug.active);


        connection.acquire(function(err, con) 
        {
              con.query('update bughistory set active=?,endDateBUG=? where idSP=?', [Bug.active,Bug.date,Bug.idSP], function(err, result) 
            {
                con.release();
                if (err) 
                {
                    console.log(err);
                    res.send({status: 1, message: 'Bug update failed'});
                } 
                else 
                {
                    console.log('Bug updated successfully');
                    res.send({status: 0, message: 'Bug updated successfully'});  
                    
                }
            });
        });
    }; 
	
    /**
     * Get bug for specific SP AT GIVEN PERIOD
     * @params res response 
     * @params detail for this "post" request, we need SP's ID and two date'
     */
    this.getBugForSPAtGivenPeriod = function(detail, res) 
    {		
        
		console.log('Get bug for SP at given period -->  ID: '+detail.id);	        
        console.log('Date1: '+detail.date1);
        console.log('Date2: '+detail.date2);

        connection.acquire(function(err, con) 
        {		
			con.query('call getBugForThisSPAtGivenPeriod("'+detail.date1+'","'+detail.date2+'","'+detail.id+'")',function(err, result) 
            {
                con.release();
                if (err) 
                {
                    console.log(err);
                    res.send({status: 1, message: 'bad request'});
                } else 
                {				

                    console.log("List of bugs sent");
                    res.send(result[0]);				
                }
                
				
            });
        });
    };


}

module.exports = new Bug();