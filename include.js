Web = {
    Controllers: {},
    
    Initialize: () => {
        // Initialize all the controllers
        for(let controller in Web.Controllers) {
            if (Web.Controllers[controller].Initialize) Web.Controllers[controller].Initialize();
        }
    }
}

$C = Web.Controllers;