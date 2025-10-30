   const config = {
    Screens : {

        Testify : {
            path : 'Testify/:id',
            parse : {
                id : id => String(id)
            }
        }


    }
   }

   const linking = {
      prefixes : ["fahdu://"],
      config
   }

   export default config