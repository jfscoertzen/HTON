Web.Controllers.Controller1 = {
    Initialize: () => {
        $C.Controller1.GuestData = [];
        $.getJSON("guests.json", function( json ) {
            $C.Controller1.GuestData = json;
        });
    },
    AddUser: () => {
        Swal.fire({
            title: 'Error!',
            text: 'Do you want to continue',
            icon: 'error',
            confirmButtonText: 'Cool'
        })
    }
}
