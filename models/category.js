var connection = require('../connection');
 
function category() 
{
    /**
     * Get ALL category from table
     * @params res response 
     */
    this.getAll = function(id,res) 
    {		
		console.log('Get category list');       
        connection.acquire(function(err, con) 
        {		
			con.query('call getAllCategory()',function(err, result) 
            {
                con.release();
				res.send(result[0]);
            });
        });
    };


     /**
     * Update a specific category, only idLED Field
     * @params SP in json format
     */
     
    this.update = function(categoryId, category, res) 
    {
        console.log('Updating category :'+categoryId);
        console.log('New ID LED :'+ category.led);

        connection.acquire(function(err, con) 
        {
            con.query('update category set idLED = ? where idcategory = ?', [ category.led, categoryId], function(err, result) 
            {
                con.release();
                if (err) 
                {
                    console.log(err);
                    res.send({status: 1, message: 'Category update failed'});
                } 
                else 
                {
                    console.log('Category updated successfully :'+categoryId);
                    res.send({status: 0, message: 'Category updated successfully'});                      
                }
            });
        });
    }; 
	
}

module.exports = new category();