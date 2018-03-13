var connection = require('../connection');
 
function User() 
{
    /**
     * Get ALL users from table
     * @params res response 
     */
    this.getAll = function(res) 
    {
		console.log("Asking information for all users");
        connection.acquire(function(err, con) 
        {
            con.query('select * from user', function(err, result) 
            {
                con.release();
                res.send(result);
            });
        });
    };



    /**
     * Get a specific user
     */
    this.get = function(id, res) 
    {
		console.log("Asking information for user id"+id);
        connection.acquire(function(err, con) 
        {
            con.query('select * from user where id = ?', [id], function(err, result) {
                con.release();
                if (err) 
                {
                    console.log(err);
                    res.send({status: 1, message: 'Failed to find'});
                } 
                else 
                {
                    res.send(result);
                }
            });
        });
    };

  /**
     * Update a specific user
     * @params user user in json format
     */
    this.update = function(userID, user, res) 
    {
		console.log("Updating user");
        connection.acquire(function(err, con) 
        {
            con.query('update user set ? where id = ?', [user,userID], function(err, result) 
            {
                con.release();
                if (err) 
                {
                    console.log(err);
                    res.send({status: 1, message: 'USER update failed'});
                } 
                else 
                {
                    res.send({status: 0, message: 'USER updated successfully'});
                }
            });
        });
		console.log("user updated");
    };
	
	 this.create = function(user, res) 
    {
		console.log(user.username);
		console.log(user.motDePasse);
        connection.acquire(function(err, con) 
        {
            con.query('insert into user set ?', user, function(err, result) 
            {
                con.release();
                if (err) 
                {
                    console.log(err);
                    res.send({status: 1, message: 'USER creation failed'});
                } else 
                {
                    getLastId(res);
                }
            });
        });
		console.log("New user created");
    };
	

    /**
     * get the last id 
     * TODO : move it in logical file
     * @params res response
     */
    function getLastId(res) 
    {
        console.log('get last id');
        connection.acquire(function(err, con) 
        {
            con.query('SELECT  MAX(id) from user',  function(err, result) {
                con.release();
                if (err) 
                {
                    console.log(err);
                    res.send({status: 1, message: 'USER creation failed'});
                }
                 else 
                 {
                    res.send({status: 0, message: 'USER created successfully', id:result[0].id});
                }
            });
        });
    }


    /**
     * Delete a specific user
     * @params id user's id
     * @params res response
     */
    this.deleteID = function(id, res) 
    {
		console.log("Deleting user id"+id);
        connection.acquire(function(err, con) 
        {
            con.query('delete from user where id = ?', [id], function(err, result) 
            {
                con.release();
                if (err) 
                {   
                    console.log(err);
                    res.send({status: 1, message: 'Failed to delete'});
                } 
                else 
                {
                    res.send({status: 0, message: 'Deleted successfully'});
                }
            });
        });
		console.log("user deleted");
    };
	
	
	this.delete= function(res) 
    {		
        connection.acquire(function(err, con) 
        {
			con.query('SELECT  MAX(id) as lastID from user',  function(err, result) {
                if (err) 
                {
                    console.log(err);
                    res.send({status: 1, message: 'Unable ton find the last id for this user into database'});
                }
                 else 
                 {
					 console.log("Deleting the last user id"+result[0].lastID);
					  con.query('delete from user where id = ?', result[0].lastID, function(err, result) 
						{
							con.release();
							if (err) 
							{   
								console.log(err);
								res.send({status: 1, message: 'Failed to delete'});
							} 
							else 
							{
								res.send({status: 0, message: 'Deleted successfully'});
							}
						});
                }
            });
           
        }); 
		console.log("user deleted");
    }; 

    /**
     * Check a login validity
     * @params user user in json format
     * @params res response*/
     
    this.checkLogin = function(user, res) 
    {
        connection.acquire(function(err, con) 
        {
			console.log("Checking login");
		    console.log(user.username);
			console.log(user.password);
            con.query('select id from user where username = ? AND password = ?', [user.username, user.password], function(err, result) 
            {
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
						res.send({status: 1, message: 'login failed'});
					}
                }
            });
        });
    }; 
}

module.exports = new User();